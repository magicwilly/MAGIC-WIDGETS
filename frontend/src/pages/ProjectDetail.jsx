import React, { useState, useEffect } from 'react';
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
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { featuredProjects, categories } from '../data/mockData';
import { projectsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import EditProject from '../components/EditProject';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [selectedReward, setSelectedReward] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  
  const fetchProject = async () => {
    try {
      setLoading(true);
      console.log('🔍 ProjectDetail: Fetching project with ID:', id);
      
      const apiProject = await projectsAPI.getProject(id);
      console.log('🔍 ProjectDetail: API response:', apiProject);
      setProject(apiProject);
    } catch (error) {
      console.error('❌ ProjectDetail: Error fetching project from API:', error);
      
      const mockProject = featuredProjects.find(p => p.id === parseInt(id));
      if (mockProject) {
        console.log('🔍 ProjectDetail: Using mock data:', mockProject);
        setProject(mockProject);
      } else {
        console.error('❌ ProjectDetail: Project not found in API or mock data');
        setError('Project not found');
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);
  
  const handleProjectUpdate = () => {
    // Refresh project data after update
    fetchProject();
  };
  
  const handleVideoPlay = () => {
    if (project.video) {
      // If it's a YouTube URL, convert it to embed format
      let videoUrl = project.video;
      if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
        // Convert YouTube watch URL to embed URL
        const videoId = videoUrl.includes('youtu.be/') 
          ? videoUrl.split('youtu.be/')[1].split('?')[0]
          : videoUrl.split('v=')[1].split('&')[0];
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
        setShowVideo(true);
      } else {
        // For other video URLs, open in new tab
        window.open(videoUrl, '_blank');
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 mx-auto text-[#BE5F93] animate-spin mb-4" />
          <h1 className="text-xl font-semibold text-gray-900">Loading magical project...</h1>
        </div>
      </div>
    );
  }
  
  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-16 w-16 mx-auto text-[#BE5F93]/40 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Magic Project Not Found</h1>
          <Button asChild className="bg-[#BE5F93] hover:bg-[#a04d7d]">
            <Link to="/">Return to Magic</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Handle property name differences between API and mock data
  const currentFunding = project.current_funding || project.currentFunding || 0;
  const fundingGoal = project.funding_goal || project.fundingGoal || 1;
  const creator = project.creator_name || project.creator || 'Unknown Creator';
  const backers = project.backers_count || project.backers || 0;
  const daysLeft = project.days_left !== undefined ? project.days_left : project.daysLeft || 0;
  
  const fundingPercentage = (currentFunding / fundingGoal) * 100;
  const category = categories.find(c => c.id === project.category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" asChild className="hover:text-[#BE5F93]">
            <Link to="/" className="flex items-center text-gray-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Magic Projects
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
                {showVideo && project.video ? (
                  <div className="relative w-full h-64 md:h-96">
                    <iframe
                      src={project.video.includes('youtube.com/watch') || project.video.includes('youtu.be/') 
                        ? `https://www.youtube.com/embed/${
                            project.video.includes('youtu.be/') 
                              ? project.video.split('youtu.be/')[1].split('?')[0]
                              : project.video.split('v=')[1].split('&')[0]
                          }`
                        : project.video
                      }
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title="Project Video"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVideo(false)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                    >
                      Show Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 md:h-96 object-cover"
                    />
                    {project.video && (
                      <Button
                        size="lg"
                        onClick={handleVideoPlay}
                        className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#BE5F93]/90 hover:bg-[#BE5F93] text-white shadow-lg transition-all"
                      >
                        <Play className="h-6 w-6 ml-1" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </Card>

            {/* Project Info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-[#BE5F93]/10 text-[#BE5F93]">
                  {category?.icon} {category?.name}
                </Badge>
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
                <Avatar className="h-12 w-12 mr-4 border-2 border-[#BE5F93]/20">
                  <AvatarImage src={project.creator_avatar || project.creatorAvatar} />
                  <AvatarFallback className="bg-gradient-to-br from-[#BE5F93] to-[#a04d7d] text-white font-bold text-lg">
                    {creator.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{creator}</h3>
                  <p className="text-gray-600 text-sm">{project.creator_bio || project.creatorBio || "Magic creator"}</p>
                </div>
                <Button variant="outline" size="sm" className="border-[#BE5F93]/20 hover:border-[#BE5F93]/40 hover:text-[#BE5F93]">
                  Follow
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="story" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="story" className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white">Story</TabsTrigger>
                <TabsTrigger value="updates" className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white">Updates</TabsTrigger>
                <TabsTrigger value="comments" className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white">Comments</TabsTrigger>
                <TabsTrigger value="faq" className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="story" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-[#BE5F93]" />
                        About This Magic Project
                      </h3>
                      <p className="text-gray-700 mb-4">
                        {project.fullDescription}
                      </p>
                      <p className="text-gray-700 mb-4">
                        This innovative magical project combines cutting-edge technology with time-honored 
                        magical principles to create something truly extraordinary. Our team has spent months 
                        perfecting the design and testing prototypes to ensure we deliver exactly what we promise.
                      </p>
                      <h4 className="text-lg font-semibold mb-3 text-[#BE5F93]">What Makes This Magic Special</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Innovative magical design that creates impossible effects</li>
                        <li>High-quality materials and professional craftsmanship</li>
                        <li>Backed by experienced magicians with proven track record</li>
                        <li>Comprehensive instruction and performance guidance included</li>
                        <li>Suitable for both professional and amateur magicians</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="updates" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="border-l-4 border-[#BE5F93] pl-4 bg-[#BE5F93]/5 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[#BE5F93]">Prototype Testing Complete!</h4>
                          <span className="text-sm text-gray-500">2 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          We're excited to announce that our prototype testing phase has been completed successfully. 
                          All magical effects are working as expected and we're ready to move into production.
                        </p>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-700">50% Funding Milestone Reached!</h4>
                          <span className="text-sm text-gray-500">5 days ago</span>
                        </div>
                        <p className="text-gray-700">
                          Thank you to all our amazing backers! We've reached 50% of our funding goal. 
                          This magical support means everything to our team.
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
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#BE5F93]/10 text-[#BE5F93]">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">John the Great</span>
                            <Badge variant="outline" className="text-xs border-[#BE5F93]/20 text-[#BE5F93]">Backer</Badge>
                          </div>
                          <p className="text-sm text-gray-700">This looks absolutely amazing! Can't wait to add this to my magic collection. The innovation here is incredible!</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-[#BE5F93]/10 text-[#BE5F93]">SM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">Sarah Mystique</span>
                            <Badge variant="outline" className="text-xs border-[#BE5F93]/20 text-[#BE5F93]">Backer</Badge>
                          </div>
                          <p className="text-sm text-gray-700">Professional magician here - this is exactly what the magic community needs. Backing at the highest tier!</p>
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
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold mb-2 text-[#BE5F93]">{faq.question}</h4>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                      <div className="border-b pb-4">
                        <h4 className="font-semibold mb-2 text-[#BE5F93]">Is this suitable for beginner magicians?</h4>
                        <p className="text-gray-700">Yes! We include comprehensive instructions and video tutorials that make this accessible for magicians of all skill levels.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-[#BE5F93]">What if I'm not satisfied with my reward?</h4>
                        <p className="text-gray-700">We offer a 30-day satisfaction guarantee. If you're not completely amazed by your magical reward, we'll work with you to make it right.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Funding Card */}
            <Card className="sticky top-20 border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${currentFunding.toLocaleString()}
                  </div>
                  <div className="text-gray-600 text-sm">
                    pledged of ${fundingGoal.toLocaleString()} goal
                  </div>
                </div>

                <Progress 
                  value={fundingPercentage} 
                  className="h-2 mb-6" 
                  style={{
                    '--progress-background': '#BE5F93'
                  }}
                />

                <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{backers}</div>
                    <div className="text-sm text-gray-600">magical backers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{daysLeft}</div>
                    <div className="text-sm text-gray-600">days to go</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-[#BE5F93] to-[#d478a8] hover:from-[#a04d7d] hover:to-[#BE5F93] text-white shadow-lg"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Back This Magic Project
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 border-[#BE5F93]/20 hover:border-[#BE5F93]/40"
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current text-[#BE5F93]' : ''}`} />
                      {isLiked ? 'Loved' : 'Love'}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 border-[#BE5F93]/20 hover:border-[#BE5F93]/40">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="text-center text-sm text-gray-600">
                  <p className="mb-2 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 mr-2 text-[#BE5F93]" />
                    All or nothing funding
                  </p>
                  <p>This project will only be funded if it reaches its goal by the deadline.</p>
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-[#BE5F93]">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Select Your Magical Reward
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {project.rewards && project.rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className={`p-4 border-l-4 cursor-pointer transition-all hover:bg-gray-50 ${
                        selectedReward === reward.id
                          ? 'border-[#BE5F93] bg-[#BE5F93]/5'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedReward(reward.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-lg text-[#BE5F93]">${reward.amount}</span>
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
                          <span className="flex items-center text-[#BE5F93]">
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