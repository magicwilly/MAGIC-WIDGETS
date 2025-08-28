import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Plus, X, Upload, DollarSign, Calendar, Target, Sparkles } from 'lucide-react';
import { categories } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { projectsAPI } from '../services/api';

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    description: '',
    fundingGoal: '',
    duration: '',
    location: '',
    image: null,
    video: '',
    rewards: []
  });

  const steps = [
    { number: 1, title: 'Magic Project Basics', description: 'Tell us about your magical creation' },
    { number: 2, title: 'Funding & Timeline', description: 'Set your goals and timeline' },
    { number: 3, title: 'Rewards & Tiers', description: 'Create reward tiers for backers' },
    { number: 4, title: 'Media & Story', description: 'Add images and videos' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addReward = () => {
    const newReward = {
      id: Date.now(),
      title: '',
      description: '',
      amount: '',
      estimated: '',
      shipping: false,
      limited: false,
      quantity: ''
    };
    setFormData(prev => ({
      ...prev,
      rewards: [...prev.rewards, newReward]
    }));
  };

  const updateReward = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.map(reward =>
        reward.id === id ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const removeReward = (id) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.filter(reward => reward.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate final form data
      if (!formData.title || !formData.category || !formData.description || !formData.fundingGoal || !formData.duration) {
        toast({
          title: "Missing Required Fields",
          description: "Please complete all required fields before submitting.",
          variant: "destructive"
        });
        return;
      }

      // Prepare project data for API
      const projectData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        full_description: formData.description, // Using description for both for now
        category: formData.category,
        image: formData.image,
        video: formData.video,
        funding_goal: parseFloat(formData.fundingGoal),
        days_duration: parseInt(formData.duration),
        location: formData.location,
        rewards: formData.rewards.map(reward => ({
          title: reward.title,
          description: reward.description,
          amount: parseFloat(reward.amount),
          estimated_delivery: reward.estimated,
          is_limited: reward.limited || false,
          quantity_limit: reward.quantity ? parseInt(reward.quantity) : null
        })),
        faqs: [] // Empty for now, can be enhanced later
      };

      // Submit to API
      const response = await projectsAPI.createProject(projectData);
      
      if (response) {
        toast({
          title: "🎩✨ Magic Project Created Successfully!",
          description: `Your project "${response.title}" has been created and is now live!`,
        });
        
        // Navigate to the created project page
        setTimeout(() => navigate(`/project/${response.id}`), 2000);
      }
    } catch (error) {
      console.error('Project creation error:', error);
      toast({
        title: "Project Creation Failed",
        description: error.response?.data?.detail || "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => {
    // Basic validation before proceeding
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.description) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill in all required fields before proceeding.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!formData.fundingGoal || !formData.duration) {
        toast({
          title: "Missing Required Fields", 
          description: "Please set your funding goal and campaign duration.",
          variant: "destructive"
        });
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-[#BE5F93] mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Create Your Magic Project</h1>
          </div>
          <p className="text-gray-600">Share your magical innovation with the world</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center ${index !== 0 ? 'ml-4' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep >= step.number
                      ? 'bg-[#BE5F93] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium transition-colors ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 transition-colors ${
                    currentStep > step.number ? 'bg-[#BE5F93]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Project Basics */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-[#BE5F93]" />
                  Magic Project Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your magical project a captivating title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-2 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Briefly describe your magical creation"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="mt-2 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Magic Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose your magic category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where are you based? (City, Country)"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="mt-2 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your magical project in detail. What makes it special? Why will people love it?"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2 h-32 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Funding & Timeline */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-[#BE5F93]" />
                  Funding & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="fundingGoal">Funding Goal (USD) *</Label>
                  <Input
                    id="fundingGoal"
                    type="number"
                    placeholder="25000"
                    value={formData.fundingGoal}
                    onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                    className="mt-2 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a realistic goal that covers your project costs, production, and platform fees.
                  </p>
                </div>

                <div>
                  <Label htmlFor="duration">Campaign Duration *</Label>
                  <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="How long will your campaign run?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="45">45 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-[#BE5F93]/5 border border-[#BE5F93]/20 p-4 rounded-lg">
                  <h4 className="font-medium text-[#BE5F93] mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    All-or-Nothing Funding Model
                  </h4>
                  <p className="text-sm text-gray-700">
                    You'll only receive funds if you reach your full goal by the deadline. 
                    This builds trust with backers and ensures you have enough to complete your magical project.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Rewards */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-[#BE5F93]" />
                  Create Magical Reward Tiers
                </CardTitle>
                <p className="text-gray-600">Offer compelling rewards to encourage backing</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formData.rewards.map((reward, index) => (
                    <div key={reward.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-[#BE5F93]">Reward Tier #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReward(reward.id)}
                          className="hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Pledge Amount (USD)</Label>
                          <Input
                            type="number"
                            placeholder="25"
                            value={reward.amount}
                            onChange={(e) => updateReward(reward.id, 'amount', e.target.value)}
                            className="mt-1 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                          />
                        </div>
                        
                        <div>
                          <Label>Estimated Delivery</Label>
                          <Input
                            type="month"
                            value={reward.estimated}
                            onChange={(e) => updateReward(reward.id, 'estimated', e.target.value)}
                            className="mt-1 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label>Reward Title</Label>
                          <Input
                            placeholder="Magic Starter Kit"
                            value={reward.title}
                            onChange={(e) => updateReward(reward.id, 'title', e.target.value)}
                            className="mt-1 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe what magical rewards backers will receive"
                            value={reward.description}
                            onChange={(e) => updateReward(reward.id, 'description', e.target.value)}
                            className="mt-1 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addReward} 
                    className="w-full border-[#BE5F93]/20 hover:border-[#BE5F93]/40 hover:text-[#BE5F93]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reward Tier
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Media & Story */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2 text-[#BE5F93]" />
                  Media & Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Project Image</Label>
                  <div className="mt-2 border-2 border-dashed border-[#BE5F93]/30 rounded-lg p-8 text-center hover:border-[#BE5F93]/50 transition-colors">
                    <Upload className="h-8 w-8 mx-auto text-[#BE5F93] mb-2" />
                    <p className="text-gray-600 mb-2">Upload your main project image</p>
                    <Button type="button" variant="outline" size="sm" className="border-[#BE5F93]/20 hover:border-[#BE5F93]/40">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="video">Project Video (YouTube URL)</Label>
                  <Input
                    id="video"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.video}
                    onChange={(e) => handleInputChange('video', e.target.value)}
                    className="mt-2 focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>

                <div className="bg-[#BE5F93]/5 border border-[#BE5F93]/20 p-4 rounded-lg">
                  <h4 className="font-medium text-[#BE5F93] mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Tips for Magical Success
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Use high-quality images that showcase your magic project</li>
                    <li>• Create a compelling video that demonstrates your magic</li>
                    <li>• Write a detailed story about your magical innovation</li>
                    <li>• Offer attractive rewards at different price points</li>
                    <li>• Engage with the magic community during your campaign</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="border-[#BE5F93]/20 hover:border-[#BE5F93]/40"
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                className="bg-[#BE5F93] hover:bg-[#a04d7d]"
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={handleSubmit}
                className="bg-gradient-to-r from-[#BE5F93] to-[#d478a8] hover:from-[#a04d7d] hover:to-[#BE5F93]"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Launch Magic Project
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;