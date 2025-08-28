import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { Shield } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <Shield className="h-12 w-12 text-[#BE5F93] mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="text-[#BE5F93]">i</span>Fund<span className="text-[#BE5F93]">Magic</span> – Privacy Policy
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">
            Effective Date: January 2025
          </p>
          <p className="text-base text-gray-700 italic">
            At iFundMagic, we care about your privacy. We'll never sell your secrets—whether it's your email address or the method behind your double lift.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-8">
              
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">1.</span>
                  <h2 className="text-xl font-semibold text-gray-900">What We Collect</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• <strong>Account info:</strong> Name, email, profile details.</li>
                  <li>• <strong>Payment info:</strong> Processed securely by Stripe/PayPal (we don't store your card numbers).</li>
                  <li>• <strong>Usage data:</strong> IP address, device type, and site activity (so we know how people use iFundMagic).</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">2.</span>
                  <h2 className="text-xl font-semibold text-gray-900">How We Use Your Info</h2>
                </div>
                <ul className="text-gray-700 space-y-2 ml-8">
                  <li>• To run the platform and keep the magic alive.</li>
                  <li>• To process pledges and payments.</li>
                  <li>• To send project updates, reminders, and news.</li>
                  <li>• To fight fraud and keep the community safe.</li>
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">3.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Sharing Your Info</h2>
                </div>
                <div className="ml-8">
                  <p className="text-gray-700 mb-3">We may share data with:</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Payment processors (Stripe/PayPal) so your pledges work.</li>
                    <li>• Email providers so creators can update you.</li>
                    <li>• Law enforcement if legally required.</li>
                  </ul>
                  <p className="text-gray-700 font-semibold mt-4">We do not sell or rent your data.</p>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">4.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Your Rights</h2>
                </div>
                <div className="ml-8">
                  <p className="text-gray-700 mb-3">Depending on where you live (GDPR, CCPA, etc.):</p>
                  <ul className="text-gray-700 space-y-2">
                    <li>• You can request access to your data.</li>
                    <li>• You can ask us to correct or delete it.</li>
                    <li>• You can unsubscribe from emails any time.</li>
                  </ul>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">5.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Cookies</h2>
                </div>
                <p className="text-gray-700 ml-8">
                  We use cookies to improve site performance and user experience. You can block them in your browser if you prefer.
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">6.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Kids</h2>
                </div>
                <p className="text-gray-700 ml-8">
                  iFundMagic is not for children under 13.
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">7.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                </div>
                <p className="text-gray-700 ml-8">
                  We use reasonable safeguards to protect your information. Still, no system is completely escape-proof.
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center mb-4">
                  <span className="text-2xl font-bold text-[#BE5F93] mr-3">8.</span>
                  <h2 className="text-xl font-semibold text-gray-900">Changes</h2>
                </div>
                <p className="text-gray-700 ml-8">
                  We may update this policy. If we do, we'll post the new version on the site.
                </p>
              </div>

              <Separator className="my-8" />

              <div className="bg-[#BE5F93]/5 border border-[#BE5F93]/20 p-6 rounded-lg">
                <p className="text-gray-700 text-center italic">
                  ✨ <strong>In short:</strong> iFundMagic is a place where magicians help magicians. We protect your privacy, but creators—not the platform—are responsible for delivering rewards.
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Last updated: January 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;