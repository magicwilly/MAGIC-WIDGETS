import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  User, 
  MapPin, 
  Calendar, 
  Heart, 
  Sparkles, 
  Edit3, 
  Save, 
  X,
  TrendingUp,
  DollarSign,
  Key
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import { useToast } from '../hooks/use-toast';
import ProjectCard from '../components/ProjectCard';
import PhotoUpload from '../components/PhotoUpload';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [backedProjects, setBackedProjects] = useState([]);
  const [createdProjects, setCreatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
        avatar: user.avatar || ''
      });
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [backed, created] = await Promise.all([
        userAPI.getBackedProjects(),
        userAPI.getCreatedProjects()
      ]);
      setBackedProjects(backed);
      setCreatedProjects(created);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = await userAPI.updateProfile(editForm);
      updateUser(updatedUser);
      setIsEditing(false);
      toast({
        title: "🎩 Profile Updated!",
        description: "Your magical profile has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      name: user.name || '',
      bio: user.bio || '',
      location: user.location || '',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96 text-center">
          <CardContent className="pt-6">
            <Key className="h-16 w-16 mx-auto text-[#BE5F93] mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your magical profile.</p>
            <Button asChild className="bg-[#BE5F93] hover:bg-[#a04d7d]">
              <Link to="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-[#BE5F93]/20">
                  <AvatarImage src={user.avatar || editForm.avatar} alt={user.name} />
                  <AvatarFallback className="bg-[#BE5F93]/10 text-[#BE5F93] text-2xl">
                    {user.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                        placeholder="Tell us about your magical journey..."
                        className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={editForm.location}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        placeholder="City, Country"
                        className="focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                      />
                    </div>
                    <PhotoUpload
                      currentAvatar={editForm.avatar || user.avatar}
                      onUploadSuccess={(avatarUrl) => setEditForm({...editForm, avatar: avatarUrl})}
                      userName={user.name}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-[#BE5F93] hover:bg-[#a04d7d]"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="hover:text-[#BE5F93]"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {user.bio && (
                      <p className="text-gray-600 mb-3">{user.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {user.email}
                      </span>
                      {user.location && (
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {user.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Member since {new Date(user.member_since).getFullYear()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <Separator className="my-6" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BE5F93]">{createdProjects.length}</div>
                <div className="text-sm text-gray-600">Created Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BE5F93]">{backedProjects.length}</div>
                <div className="text-sm text-gray-600">Backed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BE5F93]">${user.total_pledged?.toLocaleString() || '0'}</div>
                <div className="text-sm text-gray-600">Total Pledged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#BE5F93]">
                  {createdProjects.reduce((sum, project) => sum + (project.backers_count || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Total Backers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="backed" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="backed" 
              className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4 mr-2" />
              Backed Projects ({backedProjects.length})
            </TabsTrigger>
            <TabsTrigger 
              value="created"
              className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Created Projects ({createdProjects.length})
            </TabsTrigger>
            <TabsTrigger 
              value="activity"
              className="data-[state=active]:bg-[#BE5F93] data-[state=active]:text-white"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="backed" className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 animate-spin mx-auto text-[#BE5F93] mb-2" />
                <p className="text-gray-600">Loading magical projects...</p>
              </div>
            ) : backedProjects.length > 0 ? (
              <div className="space-y-4">
                {backedProjects.map((backing) => (
                  <Card key={backing.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {backing.project_image && (
                          <img
                            src={backing.project_image}
                            alt={backing.project_title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{backing.project_title}</h3>
                          {backing.reward_title && (
                            <p className="text-sm text-gray-600">Reward: {backing.reward_title}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            Backed on {new Date(backing.backed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-[#BE5F93]">${backing.amount}</div>
                        <Badge 
                          variant={backing.payment_status === 'completed' ? 'default' : 'secondary'}
                          className={backing.payment_status === 'completed' ? 'bg-emerald-500' : ''}
                        >
                          {backing.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Backed Projects Yet</h3>
                  <p className="text-gray-600 mb-4">Discover amazing magical projects and be the first to back them!</p>
                  <Button asChild className="bg-[#BE5F93] hover:bg-[#a04d7d]">
                    <Link to="/discover">Discover Projects</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="created" className="mt-6">
            {loading ? (
              <div className="text-center py-8">
                <Sparkles className="h-8 w-8 animate-spin mx-auto text-[#BE5F93] mb-2" />
                <p className="text-gray-600">Loading your magical creations...</p>
              </div>
            ) : createdProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {createdProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Sparkles className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Created Yet</h3>
                  <p className="text-gray-600 mb-4">Share your magical innovation with the world!</p>
                  <Button asChild className="bg-[#BE5F93] hover:bg-[#a04d7d]">
                    <Link to="/create">Start a Project</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card className="text-center py-8">
              <CardContent>
                <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Timeline</h3>
                <p className="text-gray-600">Your magical activity timeline will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;