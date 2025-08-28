# 🎩✨ FundMagic Stripe Payment Integration Guide

## Overview
This guide shows how to integrate Stripe payments into FundMagic for processing magical project backings.

## 🔑 Step 1: Get Stripe API Keys

1. **Create Stripe Account**: Go to [stripe.com](https://stripe.com) and create an account
2. **Get API Keys**: 
   - **Publishable Key** (starts with `pk_`): Use in frontend
   - **Secret Key** (starts with `sk_`): Use in backend
3. **Test vs Live Keys**:
   - Test keys for development (start with `pk_test_` and `sk_test_`)
   - Live keys for production (start with `pk_live_` and `sk_live_`)

## 💻 Step 2: Install Stripe Dependencies

### Backend (Python)
```bash
cd /app/backend
pip install stripe
```

### Frontend (React)
```bash
cd /app/frontend
yarn add @stripe/stripe-js @stripe/react-stripe-js
```

## 🔧 Step 3: Environment Variables

Add to `/app/backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

Add to `/app/frontend/.env`:
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

## 🎯 Step 4: Backend Payment Integration

### Create Stripe Service (`/app/backend/services/stripe_service.py`)
```python
import stripe
import os
from typing import Dict, Any
from models.backing import Backing
from models.project import Project

# Configure Stripe
stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

class StripeService:
    @staticmethod
    async def create_payment_intent(amount: float, currency: str = "usd", metadata: Dict[str, Any] = None):
        """Create a payment intent for the backing amount"""
        try:
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Stripe uses cents
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={
                    'enabled': True,
                },
            )
            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id
            }
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    async def confirm_payment(payment_intent_id: str):
        """Confirm a payment intent"""
        try:
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            return intent.status == 'succeeded'
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")

    @staticmethod
    async def create_refund(payment_intent_id: str, amount: float = None):
        """Create a refund for a payment"""
        try:
            refund = stripe.Refund.create(
                payment_intent=payment_intent_id,
                amount=int(amount * 100) if amount else None,
            )
            return refund
        except stripe.error.StripeError as e:
            raise Exception(f"Stripe error: {str(e)}")
```

### Update Backing Route (`/app/backend/routes/backing.py`)
```python
# Add these imports at the top
from services.stripe_service import StripeService

# Add new endpoint for creating payment intent
@router.post("/create-payment-intent")
async def create_payment_intent(
    backing_data: BackingCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create Stripe payment intent for backing"""
    
    # Get project details
    project = await projects_collection.find_one({"id": backing_data.project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Create payment intent
    try:
        payment_data = await StripeService.create_payment_intent(
            amount=backing_data.amount,
            metadata={
                "project_id": backing_data.project_id,
                "user_id": current_user.id,
                "reward_id": backing_data.reward_id,
                "project_title": project["title"]
            }
        )
        
        return {
            "client_secret": payment_data["client_secret"],
            "payment_intent_id": payment_data["payment_intent_id"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Update the existing create_backing endpoint
@router.post("/", response_model=BackingResponse)
async def create_backing(
    backing_data: BackingCreate,
    payment_intent_id: str,  # Add this parameter
    current_user: UserResponse = Depends(get_current_user)
):
    """Create backing after successful payment"""
    
    # Verify payment was successful
    try:
        payment_confirmed = await StripeService.confirm_payment(payment_intent_id)
        if not payment_confirmed:
            raise HTTPException(status_code=400, detail="Payment not confirmed")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
    
    # Continue with existing backing creation logic...
    # (rest of the existing code remains the same)
```

## 🎨 Step 5: Frontend Payment Components

### Stripe Context Provider (`/app/frontend/src/contexts/StripeContext.js`)
```javascript
import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const StripeContext = createContext();

export const useStripe = () => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripe must be used within a StripeProvider');
  }
  return context;
};

export const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={{}}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};
```

### Payment Form Component (`/app/frontend/src/components/PaymentForm.jsx`)
```javascript
import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { backingAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const PaymentForm = ({ projectId, rewardId, amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create payment intent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await backingAPI.createPaymentIntent({
          project_id: projectId,
          reward_id: rewardId,
          amount: amount,
          payment_method: 'stripe'
        });
        setClientSecret(response.client_secret);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive"
        });
      }
    };

    createPaymentIntent();
  }, [projectId, rewardId, amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user.name,
            email: user.email,
          },
        }
      });

      if (error) {
        toast({
          title: "Payment Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (paymentIntent.status === 'succeeded') {
        // Create the backing record
        await backingAPI.createBacking({
          project_id: projectId,
          reward_id: rewardId,
          amount: amount,
          payment_method: 'stripe'
        }, paymentIntent.id);

        toast({
          title: "🎩 Payment Successful!",
          description: "Thank you for backing this magical project!"
        });
        
        onSuccess(paymentIntent);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong with your payment",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-[#BE5F93]">🪄 Complete Your Magical Backing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button 
              type="submit" 
              disabled={!stripe || processing || !clientSecret}
              className="flex-1 bg-[#BE5F93] hover:bg-[#a04d7d]"
            >
              {processing ? 'Processing...' : `Pay $${amount}`}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={processing}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
```

## 🔗 Step 6: Webhook Handler

### Webhook Endpoint (`/app/backend/routes/webhooks.py`)
```python
from fastapi import APIRouter, Request, HTTPException
import stripe
import os
from database import projects_collection, backings_collection, users_collection

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

@router.post("/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event['type'] == 'payment_intent.succeeded':
        payment_intent = event['data']['object']
        
        # Update backing status
        await handle_successful_payment(payment_intent)
        
    elif event['type'] == 'payment_intent.payment_failed':
        payment_intent = event['data']['object']
        
        # Handle failed payment
        await handle_failed_payment(payment_intent)

    return {"status": "success"}

async def handle_successful_payment(payment_intent):
    """Handle successful payment"""
    metadata = payment_intent.get('metadata', {})
    project_id = metadata.get('project_id')
    user_id = metadata.get('user_id')
    
    if project_id and user_id:
        # Update backing status
        await backings_collection.update_one(
            {"transaction_id": payment_intent['id']},
            {"$set": {"payment_status": "completed"}}
        )

async def handle_failed_payment(payment_intent):
    """Handle failed payment"""
    metadata = payment_intent.get('metadata', {})
    project_id = metadata.get('project_id')
    
    if project_id:
        # Update backing status
        await backings_collection.update_one(
            {"transaction_id": payment_intent['id']},
            {"$set": {"payment_status": "failed"}}
        )
```

## 🚀 Step 7: Update Your App

### Wrap App with Stripe Provider (`/app/frontend/src/App.js`)
```javascript
import { StripeProvider } from './contexts/StripeContext';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <div className="App min-h-screen flex flex-col">
          {/* Rest of your app */}
        </div>
      </StripeProvider>
    </AuthProvider>
  );
}
```

## 🔒 Step 8: Security Considerations

1. **Never expose secret keys** in frontend code
2. **Validate payments** on backend before creating backings
3. **Use webhooks** for reliable payment confirmation
4. **Implement proper error handling** for failed payments
5. **Test thoroughly** with Stripe test cards

## 📝 Step 9: Testing

### Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0027 6000 3184`

### Test Payment Flow
1. Create a project
2. Select a reward tier
3. Click "Back This Project"
4. Use test card details
5. Verify payment success
6. Check database for backing record

## 🎯 Next Steps

1. **Get your Stripe API keys**
2. **Install dependencies**
3. **Add environment variables**
4. **Implement the code above**
5. **Set up webhooks** in Stripe dashboard
6. **Test with test cards**
7. **Go live with real keys**

Your magical crowdfunding platform will then have secure payment processing! 🎩✨💳