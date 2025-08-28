# FundCraft - Kickstarter Clone API Contracts

## Overview
This document defines the API contracts and integration plan for converting the current frontend-only Kickstarter clone into a full-stack application.

## Current Mock Data Location
- **File**: `/app/frontend/src/data/mockData.js`
- **Data**: Projects, categories, users, rewards, updates, comments

## API Endpoints Required

### Authentication & Users
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `POST /api/auth/logout` - User logout
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Projects
- `GET /api/projects` - List projects with filters (category, search, sort)
- `GET /api/projects/:id` - Get single project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/back` - Back a project

### Categories
- `GET /api/categories` - List all categories

### Rewards
- `GET /api/projects/:id/rewards` - Get project rewards
- `POST /api/projects/:id/rewards` - Create reward tier
- `PUT /api/rewards/:id` - Update reward
- `DELETE /api/rewards/:id` - Delete reward

### Updates & Comments
- `GET /api/projects/:id/updates` - Get project updates
- `POST /api/projects/:id/updates` - Create update
- `GET /api/projects/:id/comments` - Get comments
- `POST /api/projects/:id/comments` - Add comment

### Backing & Payments
- `POST /api/backing` - Create backing with payment
- `GET /api/users/backed` - Get user's backed projects
- `GET /api/users/created` - Get user's created projects

## Database Models

### User
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  avatar: String,
  bio: String,
  location: String,
  memberSince: Date,
  backedProjects: [ObjectId],
  createdProjects: [ObjectId],
  totalPledged: Number
}
```

### Project
```
{
  _id: ObjectId,
  title: String,
  subtitle: String,
  description: String,
  fullDescription: String,
  category: String,
  image: String,
  video: String,
  creator: ObjectId,
  creatorName: String,
  creatorBio: String,
  fundingGoal: Number,
  currentFunding: Number,
  backers: Number,
  daysLeft: Number,
  location: String,
  status: String, // 'active', 'funded', 'failed'
  createdAt: Date,
  endDate: Date,
  rewards: [ObjectId]
}
```

### Reward
```
{
  _id: ObjectId,
  projectId: ObjectId,
  title: String,
  description: String,
  amount: Number,
  estimated: String,
  backers: Number,
  limited: Boolean,
  quantity: Number,
  available: Boolean
}
```

### Backing
```
{
  _id: ObjectId,
  userId: ObjectId,
  projectId: ObjectId,
  rewardId: ObjectId,
  amount: Number,
  backedAt: Date,
  paymentStatus: String
}
```

## Frontend Integration Changes

### Remove Mock Data Usage
1. Replace all imports from `mockData.js` with API calls
2. Update components to handle loading states
3. Add error handling for API failures

### API Integration Points
1. **Home.jsx**: Replace `featuredProjects` with `GET /api/projects?featured=true`
2. **Discover.jsx**: Replace filtering logic with API calls
3. **ProjectDetail.jsx**: Replace project lookup with `GET /api/projects/:id`
4. **CreateProject.jsx**: Replace mock submission with `POST /api/projects`
5. **Header.jsx**: Add authentication state management

### State Management
- Use React Context for user authentication state
- Implement loading and error states for all API calls
- Add optimistic updates for better UX

## Payment Integration
- Integrate Stripe for payment processing
- Handle payment webhooks for funding completion
- Implement escrow system for all-or-nothing funding

## File Upload
- Implement file upload for project images/videos
- Store files using cloud storage (AWS S3 or similar)
- Generate thumbnails and optimize images

## Security Considerations
- JWT token authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Password hashing with bcrypt

## Current Frontend State
✅ Complete UI with all major pages
✅ Responsive design with mobile support
✅ Interactive components and navigation
✅ Mock data displaying realistic project scenarios
✅ Multi-step project creation form
✅ Search and filtering functionality