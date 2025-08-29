// Mock data for FundMagic - Magic Project Crowdfunding
export const categories = [
  { id: 'illusion', name: 'Illusion & Stage Magic', icon: '🎩' },
  { id: 'closeup', name: 'Close-up Magic', icon: '🃏' },
  { id: 'mentalism', name: 'Mentalism', icon: '🧠' },
  { id: 'books', name: 'Magic Books', icon: '📖' },
  { id: 'cards', name: 'Playing Cards', icon: '🂠' },
  { id: 'events', name: 'Magic Events & Shows', icon: '🎪' }
];

export const featuredProjects = [
  {
    id: 1,
    title: "The Quantum Deck - Revolutionary Card Magic System",
    creator: "Magnus the Mystifier",
    category: "cards",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "A groundbreaking card deck that enables impossible card tricks through innovative design and mechanics.",
    fullDescription: "The Quantum Deck represents a quantum leap in card magic technology. Each card features micro-engineered surfaces that allow for revolutionary handling techniques never before possible. Developed by world-renowned magician Magnus the Mystifier in collaboration with MIT engineers.",
    story: "This revolutionary card magic system began as a dream three years ago when I witnessed a young street magician struggling with worn-out cards that constantly revealed their secrets. I knew there had to be a better way.\n\nAfter countless hours of research and collaboration with MIT engineering students, we've developed the Quantum Deck - a breakthrough in card magic technology. Each card in this deck features proprietary micro-engineered surfaces that enable handling techniques never before possible.\n\nThe secret lies in the quantum-level surface treatment that allows cards to interact in ways that defy conventional physics. Whether you're performing close-up magic or stage illusions, the Quantum Deck opens up entirely new realms of possibility.\n\nWith your support, we can bring this innovation to magicians worldwide and revolutionize the art of card magic forever.",
    fundingGoal: 75000,
    currentFunding: 52340,
    backers: 418,
    daysLeft: 15,
    location: "Las Vegas, NV",
    creatorBio: "Magnus the Mystifier is a professional magician with 20+ years of experience performing at the world's most prestigious venues.",
    rewards: [
      {
        id: 1,
        amount: 35,
        title: "Digital Magic Library",
        description: "Access to exclusive video tutorials and performance rights",
        estimated: "March 2025",
        backers: 89,
        available: true
      },
      {
        id: 2,
        amount: 129,
        title: "Quantum Deck + Instructions",
        description: "One Quantum Deck with complete instruction manual and video course",
        estimated: "June 2025",
        backers: 203,
        available: true
      },
      {
        id: 3,
        amount: 249,
        title: "Magician's Master Set",
        description: "Three Quantum Decks, professional case, and advanced techniques course",
        estimated: "June 2025",
        backers: 98,
        available: true
      },
      {
        id: 4,
        amount: 599,
        title: "Exclusive Workshop Access",
        description: "Private online workshop with Magnus + complete product line",
        estimated: "July 2025",
        backers: 28,
        available: true,
        limited: 50
      }
    ],
    updates: [
      {
        id: 1,
        date: "2025-01-15",
        title: "Prototype Testing with Celebrity Magicians!",
        content: "We've had amazing feedback from top performers including David Copperfield's team..."
      }
    ],
    faqs: [
      {
        question: "What makes the Quantum Deck different from regular cards?",
        answer: "The Quantum Deck features patented micro-surface technology that enables entirely new handling methods and impossible effects."
      }
    ]
  },
  {
    id: 2,
    title: "Mind Palace Academy - Online Mentalism Course",
    creator: "Dr. Sarah Mindbridge",
    category: "mentalism",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
    description: "The most comprehensive online mentalism training program ever created by a world-class mind reader.",
    fullDescription: "Mind Palace Academy offers the complete curriculum for aspiring mentalists, from beginner psychological principles to advanced mind reading techniques used by professionals.",
    fundingGoal: 45000,
    currentFunding: 31200,
    backers: 267,
    daysLeft: 22,
    location: "New York, NY",
    creatorBio: "Dr. Sarah Mindbridge holds a PhD in Psychology and has been performing mentalism for television and corporate events worldwide.",
    rewards: [
      {
        id: 1,
        amount: 89,
        title: "Foundation Course Access",
        description: "Complete beginner mentalism course with 50+ video lessons",
        estimated: "May 2025",
        backers: 134,
        available: true
      }
    ]
  },
  {
    id: 3,
    title: "The Floating Table - Levitation Masterpiece",
    creator: "Ethereal Illusions Inc",
    category: "illusion",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop",
    description: "A fully examined table that floats completely in mid-air with no visible support or wires.",
    fullDescription: "Years in development, this incredible illusion allows a full-sized table to float freely in space while spectators walk completely around it. Perfect for stage and parlor performances.",
    fundingGoal: 125000,
    currentFunding: 87600,
    backers: 156,
    daysLeft: 8,
    location: "London, UK",
    creatorBio: "Ethereal Illusions creates world-class stage illusions for professional performers and touring shows.",
    rewards: [
      {
        id: 1,
        amount: 199,
        title: "Blueprint & Plans",
        description: "Complete construction blueprints and performance guide",
        estimated: "August 2025",
        backers: 43,
        available: true
      }
    ]
  },
  {
    id: 4,
    title: "Magic Comedy Hour - Live Streaming Show",
    creator: "The Laughing Magicians",
    category: "events",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    description: "A weekly live-streamed comedy magic show featuring guest magicians from around the world.",
    fullDescription: "Join us every Friday for an hour of hilarious magic performances, interviews with top magicians, and audience participation from the comfort of your home.",
    fundingGoal: 25000,
    currentFunding: 18900,
    backers: 312,
    daysLeft: 11,
    location: "Chicago, IL",
    creatorBio: "A collective of professional comedy magicians bringing laughter and wonder to audiences worldwide.",
    rewards: [
      {
        id: 1,
        amount: 25,
        title: "Season Pass",
        description: "Access to all live shows plus recorded episodes",
        estimated: "April 2025",
        backers: 198,
        available: true
      }
    ]
  },
  {
    id: 5,
    title: "Kids Magic Academy - Teaching the Next Generation",
    creator: "Wonder Kids Productions",
    category: "books",
    image: "https://images.unsplash.com/photo-1566197449482-de017bc1358f?w=600&h=400&fit=crop",
    description: "A comprehensive magic education program designed to teach children the art of magic and performance.",
    fullDescription: "Our curriculum combines magic instruction with confidence building, public speaking, and creative thinking skills for children ages 6-16.",
    fundingGoal: 35000,
    currentFunding: 12400,
    backers: 89,
    daysLeft: 35,
    location: "Orlando, FL",
    creatorBio: "Wonder Kids Productions specializes in educational entertainment programs for children and schools.",
    rewards: [
      {
        id: 1,
        amount: 49,
        title: "Junior Magician Kit",
        description: "Starter magic kit with 20 tricks and instruction videos",
        estimated: "September 2025",
        backers: 52,
        available: true
      }
    ]
  }
];

export const recentlyFunded = [
  {
    id: 6,
    title: "The Impossible Escape Room Experience",
    creator: "Houdini's Heirs",
    category: "events",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    fundingGoal: 80000,
    currentFunding: 95600,
    backers: 423,
    status: "funded"
  },
  {
    id: 7,
    title: "Vintage Magic Poster Collection Book",
    creator: "Magic History Press",
    category: "education",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
    fundingGoal: 15000,
    currentFunding: 18750,
    backers: 287,
    status: "funded"
  }
];

export const trendingProjects = featuredProjects.slice(0, 3);

export const mockUser = {
  id: 1,
  name: "Alex Prestidigitator",
  email: "alex@magicworld.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  bio: "Professional magician and magic enthusiast supporting innovative projects in the magical arts.",
  location: "Los Angeles, CA",
  memberSince: "2023",
  backedProjects: 23,
  createdProjects: 3,
  totalPledged: 2850
};

export const projectStats = {
  totalProjects: 847,
  totalFunded: 1200000,
  activeCampaigns: 89,
  successRate: 73
};