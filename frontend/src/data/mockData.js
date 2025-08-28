// Mock data for Kickstarter clone
export const categories = [
  { id: 'art', name: 'Art', icon: '🎨' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'games', name: 'Games', icon: '🎮' },
  { id: 'design', name: 'Design', icon: '✏️' },
  { id: 'film', name: 'Film & Video', icon: '🎬' },
  { id: 'food', name: 'Food & Craft', icon: '🍳' },
  { id: 'publishing', name: 'Publishing', icon: '📚' }
];

export const featuredProjects = [
  {
    id: 1,
    title: "Revolutionary Smart Garden System",
    creator: "GreenTech Innovations",
    category: "technology",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "An AI-powered indoor garden that grows fresh herbs and vegetables year-round with minimal maintenance.",
    fullDescription: "Transform your kitchen into a sustainable food source with our revolutionary Smart Garden System. Using advanced AI algorithms and precision sensors, this compact device monitors soil moisture, pH levels, and nutrient content to ensure optimal growing conditions for over 20 different plants.",
    fundingGoal: 50000,
    currentFunding: 34750,
    backers: 287,
    daysLeft: 12,
    location: "San Francisco, CA",
    creatorBio: "GreenTech Innovations is a team of agricultural engineers and software developers passionate about sustainable living.",
    rewards: [
      {
        id: 1,
        amount: 25,
        title: "Early Bird Digital Thank You",
        description: "Digital thank you card and project updates",
        estimated: "March 2025",
        backers: 45,
        available: true
      },
      {
        id: 2,
        amount: 199,
        title: "Smart Garden Starter Kit",
        description: "One Smart Garden unit with 3 seed pods",
        estimated: "June 2025",
        backers: 128,
        available: true
      },
      {
        id: 3,
        amount: 299,
        title: "Complete Garden Package",
        description: "Smart Garden unit with 6 seed pods and nutrient kit",
        estimated: "June 2025",
        backers: 89,
        available: true
      },
      {
        id: 4,
        amount: 499,
        title: "Garden Master Bundle",
        description: "Two Smart Garden units with full seed collection",
        estimated: "July 2025",
        backers: 25,
        available: true,
        limited: 50
      }
    ],
    updates: [
      {
        id: 1,
        date: "2025-01-15",
        title: "Prototype Testing Complete!",
        content: "We've successfully completed our prototype testing phase..."
      }
    ],
    faqs: [
      {
        question: "How much space does the Smart Garden require?",
        answer: "The Smart Garden measures 12 x 8 x 16 inches and fits perfectly on most countertops."
      }
    ]
  },
  {
    id: 2,
    title: "Mindful Meditation App for Students",
    creator: "Peaceful Mind Studio",
    category: "technology",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    description: "A comprehensive meditation app designed specifically for students dealing with academic stress.",
    fullDescription: "MindfulStudent combines ancient mindfulness practices with modern psychology to create guided meditation sessions tailored for academic environments.",
    fundingGoal: 25000,
    currentFunding: 18500,
    backers: 156,
    daysLeft: 18,
    location: "Portland, OR",
    creatorBio: "A team of meditation teachers and app developers creating tools for mental wellness.",
    rewards: [
      {
        id: 1,
        amount: 15,
        title: "Early Access",
        description: "First access to the app when it launches",
        estimated: "May 2025",
        backers: 72,
        available: true
      }
    ]
  },
  {
    id: 3,
    title: "Artisan Coffee Roastery Expansion",
    creator: "Mountain Peak Coffee",
    category: "food",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop",
    description: "Help us expand our small-batch coffee roastery and bring premium beans directly to your door.",
    fullDescription: "We're a family-owned coffee roastery focused on ethically sourced beans and sustainable practices.",
    fundingGoal: 15000,
    currentFunding: 12300,
    backers: 203,
    daysLeft: 8,
    location: "Denver, CO",
    creatorBio: "Third-generation coffee farmers turned roasters, passionate about quality and sustainability.",
    rewards: [
      {
        id: 1,
        amount: 30,
        title: "Coffee Lover's Pack",
        description: "2 bags of our signature blend",
        estimated: "April 2025",
        backers: 98,
        available: true
      }
    ]
  },
  {
    id: 4,
    title: "Indie Documentary: The Last Bookstore",
    creator: "FilmMakers United",
    category: "film",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    description: "A heartfelt documentary about independent bookstores and their fight to survive in the digital age.",
    fullDescription: "Follow the stories of bookstore owners across America as they navigate changing times and hold onto their literary communities.",
    fundingGoal: 40000,
    currentFunding: 28900,
    backers: 189,
    daysLeft: 22,
    location: "New York, NY",
    creatorBio: "Independent filmmakers dedicated to telling stories that matter.",
    rewards: [
      {
        id: 1,
        amount: 50,
        title: "Digital Download",
        description: "HD digital copy of the completed film",
        estimated: "September 2025",
        backers: 67,
        available: true
      }
    ]
  },
  {
    id: 5,
    title: "Sustainable Fashion Line Launch",
    creator: "EcoThreads",
    category: "design",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
    description: "Ethical fashion made from recycled materials with fair trade practices.",
    fullDescription: "Creating beautiful, sustainable clothing that doesn't compromise on style or ethics.",
    fundingGoal: 30000,
    currentFunding: 8750,
    backers: 94,
    daysLeft: 28,
    location: "Austin, TX",
    creatorBio: "Fashion designers committed to environmental responsibility and social justice.",
    rewards: [
      {
        id: 1,
        amount: 75,
        title: "Eco T-Shirt",
        description: "One organic cotton t-shirt from our new line",
        estimated: "August 2025",
        backers: 43,
        available: true
      }
    ]
  }
];

export const recentlyFunded = [
  {
    id: 6,
    title: "Board Game: Space Explorers",
    creator: "Cosmic Games",
    category: "games",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=600&h=400&fit=crop",
    fundingGoal: 20000,
    currentFunding: 23450,
    backers: 234,
    status: "funded"
  },
  {
    id: 7,
    title: "Children's Book: Adventure Tales",
    creator: "StoryTime Press",
    category: "publishing",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    fundingGoal: 8000,
    currentFunding: 9200,
    backers: 156,
    status: "funded"
  }
];

export const trendingProjects = featuredProjects.slice(0, 3);

export const mockUser = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  bio: "Passionate about supporting innovative projects and creative minds.",
  location: "Seattle, WA",
  memberSince: "2023",
  backedProjects: 15,
  createdProjects: 2,
  totalPledged: 1250
};

export const projectStats = {
  totalProjects: 1247,
  totalFunded: 890000,
  activeCampaigns: 156,
  successRate: 68
};