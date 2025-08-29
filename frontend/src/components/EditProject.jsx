import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { projectsAPI } from '../services/api';
import { 
  Edit3, 
  Save, 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  Video,
  FileText,
  Calendar
} from 'lucide-react';

const EditProject = ({ project, onUpdate, isCreator }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('story');
  const { toast } = useToast();
  
  // Story editing state
  const [story, setStory] = useState('');
  const [storyImages, setStoryImages] = useState([]);
  const [storyVideos, setStoryVideos] = useState([]);
  
  // Update creation state
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    content: '',
    images: [],
    videos: []
  });

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const updateImageInputRef = useRef(null);
  const updateVideoInputRef = useRef(null);

  // Initialize story when project changes
  useEffect(() => {
    console.log('🔍 EditProject: Project changed:', project);
    if (project && project.story) {
      console.log('🔍 EditProject: Setting story to:', project.story.substring(0, 100) + '...');
      setStory(project.story);
    } else {
      console.log('🔍 EditProject: No story found in project:', project);
    }
  }, [project]);

  // Handle story update
  const handleStoryUpdate = async () => {
    if (!story.trim()) {
      toast({
        title: "Error",
        description: "Story cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await projectsAPI.updateProjectStory(project.id, { story });
      
      toast({
        title: "Success!",
        description: "Project story updated successfully! ✨"
      });
      
      if (onUpdate) {
        onUpdate();
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating story:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update story",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new update
  const handleAddUpdate = async () => {
    if (!newUpdate.title.trim() || !newUpdate.content.trim()) {
      toast({
        title: "Error",
        description: "Update title and content are required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await projectsAPI.addProjectUpdate(project.id, newUpdate);
      
      toast({
        title: "Success!",
        description: "Project update added successfully! ✨"
      });
      
      // Reset form
      setNewUpdate({
        title: '',
        content: '',
        images: [],
        videos: []
      });
      
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to add update",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload (for story or updates)
  const handleFileUpload = async (file, type = 'image', context = 'story') => {
    console.log('🔍 EditProject: File upload triggered:', { file: file?.name, type, context });
    if (!file) {
      console.log('❌ EditProject: No file provided');
      return;
    }

    try {
      // For now, create a temporary URL
      // In production, you would upload to a service like AWS S3
      const fileUrl = URL.createObjectURL(file);
      console.log('🔍 EditProject: Created file URL:', fileUrl);
      
      if (context === 'story') {
        if (type === 'image') {
          console.log('🔍 EditProject: Adding image to story');
          setStoryImages(prev => {
            const newImages = [...prev, fileUrl];
            console.log('🔍 EditProject: Story images updated:', newImages);
            return newImages;
          });
        } else {
          console.log('🔍 EditProject: Adding video to story');
          setStoryVideos(prev => [...prev, fileUrl]);
        }
      } else {
        if (type === 'image') {
          console.log('🔍 EditProject: Adding image to update');
          setNewUpdate(prev => ({
            ...prev,
            images: [...prev.images, fileUrl]
          }));
        } else {
          console.log('🔍 EditProject: Adding video to update');
          setNewUpdate(prev => ({
            ...prev,
            videos: [...prev.videos, fileUrl]
          }));
        }
      }
      
      toast({
        title: "File Added",
        description: `${type === 'image' ? 'Image' : 'Video'} added successfully`,
      });
    } catch (error) {
      console.error('❌ EditProject: File upload error:', error);
      toast({
        title: "Upload Error",
        description: `Failed to add ${type}`,
        variant: "destructive"
      });
    }
  };

  // Remove media
  const removeMedia = (index, type, context = 'story') => {
    if (context === 'story') {
      if (type === 'image') {
        setStoryImages(prev => prev.filter((_, i) => i !== index));
      } else {
        setStoryVideos(prev => prev.filter((_, i) => i !== index));
      }
    } else {
      if (type === 'image') {
        setNewUpdate(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index)
        }));
      } else {
        setNewUpdate(prev => ({
          ...prev,
          videos: prev.videos.filter((_, i) => i !== index)
        }));
      }
    }
  };

  if (!isCreator) {
    return null; // Don't show edit button if not the creator
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-[#BE5F93]/20 hover:border-[#BE5F93]/40 hover:text-[#BE5F93]">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#BE5F93]">
            Edit {project.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="story" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Edit Story
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Add Update
            </TabsTrigger>
          </TabsList>

          {/* Story Editing Tab */}
          <TabsContent value="story" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-[#BE5F93]" />
                  Project Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="story">Story Content</Label>
                  <Textarea
                    id="story"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    placeholder="Tell the story of your magic project..."
                    className="min-h-[200px] mt-2"
                  />
                </div>

                {/* Media Upload for Story */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Story Images</Label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        multiple
                        onChange={(e) => Array.from(e.target.files).forEach(file => handleFileUpload(file, 'image', 'story'))}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-dashed border-[#BE5F93]/30 hover:border-[#BE5F93]/50"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Images
                      </Button>
                      
                      {storyImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`Story ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia(index, 'image', 'story')}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Story Videos</Label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="file"
                        ref={videoInputRef}
                        accept="video/*"
                        multiple
                        onChange={(e) => Array.from(e.target.files).forEach(file => handleFileUpload(file, 'video', 'story'))}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full border-dashed border-[#BE5F93]/30 hover:border-[#BE5F93]/50"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Add Videos
                      </Button>
                      
                      {storyVideos.map((video, index) => (
                        <div key={index} className="relative">
                          <video src={video} className="w-full h-20 object-cover rounded border" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia(index, 'video', 'story')}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStoryUpdate}
                  disabled={loading}
                  className="w-full bg-[#BE5F93] hover:bg-[#a04d7d] text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Update Story'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5 text-[#BE5F93]" />
                  Add Project Update
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="updateTitle">Update Title</Label>
                  <Input
                    id="updateTitle"
                    value={newUpdate.title}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Progress Update #1: Magic Tricks Perfected!"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="updateContent">Update Content</Label>
                  <Textarea
                    id="updateContent"
                    value={newUpdate.content}
                    onChange={(e) => setNewUpdate(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your progress, milestones, or news with your backers..."
                    className="min-h-[150px] mt-2"
                  />
                </div>

                {/* Media Upload for Updates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Update Images</Label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="file"
                        ref={updateImageInputRef}
                        accept="image/*"
                        multiple
                        onChange={(e) => Array.from(e.target.files).forEach(file => handleFileUpload(file, 'image', 'update'))}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateImageInputRef.current?.click()}
                        className="w-full border-dashed border-[#BE5F93]/30 hover:border-[#BE5F93]/50"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Add Images
                      </Button>
                      
                      {newUpdate.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={image} alt={`Update ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia(index, 'image', 'update')}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Update Videos</Label>
                    <div className="mt-2 space-y-2">
                      <input
                        type="file"
                        ref={updateVideoInputRef}
                        accept="video/*"
                        multiple
                        onChange={(e) => Array.from(e.target.files).forEach(file => handleFileUpload(file, 'video', 'update'))}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateVideoInputRef.current?.click()}
                        className="w-full border-dashed border-[#BE5F93]/30 hover:border-[#BE5F93]/50"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Add Videos
                      </Button>
                      
                      {newUpdate.videos.map((video, index) => (
                        <div key={index} className="relative">
                          <video src={video} className="w-full h-20 object-cover rounded border" />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeMedia(index, 'video', 'update')}
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleAddUpdate}
                  disabled={loading}
                  className="w-full bg-[#BE5F93] hover:bg-[#a04d7d] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {loading ? 'Adding...' : 'Add Update'}
                </Button>
              </CardContent>
            </Card>

            {/* Existing Updates */}
            {project.updates && project.updates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.updates.map((update, index) => (
                      <div key={update.id} className="border-l-4 border-[#BE5F93] pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Update #{project.updates.length - index}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {new Date(update.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold">{update.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">{update.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default EditProject;