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
import { Plus, X, Upload, DollarSign, Calendar, Target } from 'lucide-react';
import { categories } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

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
    { number: 1, title: 'Project Basics', description: 'Tell us about your project' },
    { number: 2, title: 'Funding & Timeline', description: 'Set your goals and timeline' },
    { number: 3, title: 'Rewards', description: 'Create reward tiers for backers' },
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock project creation
    toast({
      title: "Project Created Successfully!",
      description: "Your project has been submitted for review.",
    });
    setTimeout(() => navigate('/'), 2000);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center ${index !== 0 ? 'ml-4' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.number
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    currentStep > step.number ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Step 1: Project Basics */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Project Basics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Give your project a clear, memorable title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Input
                    id="subtitle"
                    placeholder="Briefly describe what you're creating"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
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
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail. What are you creating? Why is it important?"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="mt-2 h-32"
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
                  <DollarSign className="h-5 w-5 mr-2" />
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
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set a realistic goal that covers your project costs and fees.
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

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Funding Model: All-or-Nothing</h4>
                  <p className="text-sm text-blue-700">
                    You'll only receive funds if you reach your full goal by the deadline. 
                    This builds trust with backers and ensures you have enough to complete your project.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Rewards */}
          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Create Reward Tiers</CardTitle>
                <p className="text-gray-600">Offer compelling rewards to encourage backing</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {formData.rewards.map((reward, index) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Reward #{index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeReward(reward.id)}
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
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label>Estimated Delivery</Label>
                          <Input
                            type="month"
                            value={reward.estimated}
                            onChange={(e) => updateReward(reward.id, 'estimated', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label>Reward Title</Label>
                          <Input
                            placeholder="Early Bird Special"
                            value={reward.title}
                            onChange={(e) => updateReward(reward.id, 'title', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            placeholder="Describe what backers will receive"
                            value={reward.description}
                            onChange={(e) => updateReward(reward.id, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={addReward} className="w-full">
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
                  <Upload className="h-5 w-5 mr-2" />
                  Media & Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Project Image</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600 mb-2">Upload your main project image</p>
                    <Button type="button" variant="outline" size="sm">
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
                    className="mt-2"
                  />
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <h4 className="font-medium text-emerald-900 mb-2">Tips for Success</h4>
                  <ul className="text-sm text-emerald-700 space-y-1">
                    <li>• Use high-quality images that showcase your project</li>
                    <li>• Create a compelling video that tells your story</li>
                    <li>• Write a detailed project description</li>
                    <li>• Offer attractive rewards at different price points</li>
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
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            ) : (
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-blue-600">
                Launch Project
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;