import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  Users, 
  Play,
  ArrowLeft,
  CheckCircle,
  Clock,
  MessageCircle
} from 'lucide-react';
import { featuredProjects } from '../data/mockData';

const ProjectDetail = () => {
  const { id } = useParams();
  const [selectedReward, setSelectedReward] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  
  const project = featuredProjects.find(p => p.id === parseInt(id));
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const daysLeft = project.daysLeft || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Media */}
            <Card className="mb-6 overflow-hidden border-0 shadow-sm">
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <Button
                  size="lg"
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/70 hover:bg-black/80 text-white"
                >
                  <Play className="h-6 w-6 ml-1" />
                </Button>
              </div>
            </Card>

            {/* Project Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary">{project.category}</Badge>
                <span className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                {project.fullDescription}
              </p>

              {/* Creator Info */}
              <div className="flex items-center p-4 bg-white rounded-lg border">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} />
                  <AvatarFallback>{project.creator.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.creator}</h3>
                  <p className="text-gray-600 text-sm">{project.creatorBio}</p>
                </div>
                <Button variant="outline" size="sm">Follow</Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="story">Story</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold mb-4">About This Project</h3>
                      <p className="text-gray-700 mb-4">
                        {project.fullDescription}
                      </p>
                      <p className="text-gray-700 mb-4">
                        This innovative project combines cutting-edge technology with sustainable practices 
                        to create something truly unique. Our team has spent months perfecting the design 
                        and testing prototypes to ensure we deliver exactly what we promise.
                      </p>
                      <h4 className="text-lg font-semibold mb-3">What Makes This Special</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Innovative design that solves real problems</li>
                        <li>Sustainable materials and ethical production</li>
                        <li>Backed by experienced team with proven track record</li>
                        <li>Comprehensive testing and quality assurance</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="updates" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="border-l-4 border-emerald-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Prototype Testing Complete!</h4>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          We're excited to announce that our prototype testing phase has been completed successfully. 
                          All systems are working as expected and we're ready to move into production.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">50% Funding Milestone Reached!</h4>
                          <span className="text-sm text-gray-500">5 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          Thank you to all our amazing backers! We've reached 50% of our funding goal. 
                          This support means everything to our team.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="comments" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">John Doe</span>
                            <span className="text-xs text-gray-500">Backer</span>
                          </div>
                          <p className="text-sm text-gray-700">This looks amazing! Can't wait to receive mine.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="faq" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {project.faqs && project.faqs.map((faq, index) => (
                        <div key={index}>
                          <h4 className="font-semibold mb-2">{faq.question}</h4>
                          <p className="text-gray-700 mb-4">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${project.currentFunding.toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">
                    pledged of ${project.fundingGoal.toLocaleString()} goal
                  </div>
                </div>

                <Progress value={fundingPercentage} className="h-2 mb-6" />

                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{project.backers}</div>
                    <div className="text-sm text-gray-600">backers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{daysLeft}</div>
                    <div className="text-sm text-gray-600">days to go</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                  >
                    Back This Project
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-red-500' : ''}`} />
                      {isLiked ? 'Liked' : 'Like'}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center text-sm text-gray-600">
                  <p className="mb-2">All or nothing funding</p>
                  <p>This project will only be funded if it reaches its goal by the deadline.</p>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  Select Your Reward
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {project.rewards && project.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`p-4 border-l-4 cursor-pointer transition-all ${
                        selectedReward === reward.id
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedReward(reward.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-lg">${reward.amount}</span>
                        <span className="text-sm text-gray-500">{reward.backers} backers</span>
                      </div>
                      <h4 className="font-medium mb-2">{reward.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Est. {reward.estimated}
                        </span>
                        {reward.limited && (
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Limited ({reward.limited - reward.backers} left)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;