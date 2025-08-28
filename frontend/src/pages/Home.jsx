import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProjectCard from '../components/ProjectCard';
import { ArrowRight, TrendingUp, Star, Users, DollarSign, Target, Sparkles } from 'lucide-react';
import { featuredProjects, categories, recentlyFunded, trendingProjects, projectStats } from '../data/mockData';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BE5F93]/10 to-[#BE5F93]/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-[#BE5F93]/10 text-[#BE5F93] hover:bg-[#BE5F93]/20 border-[#BE5F93]/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Join 10,000+ magical creators worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Fund the Future of
              <span className="text-[#BE5F93]"> Magic </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover amazing magical innovations, support talented magicians, and help bring extraordinary 
              illusions to life. Where magic meets funding.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-[#BE5F93] to-[#d478a8] hover:from-[#a04d7d] hover:to-[#BE5F93] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/create">
                  Start Your Magic Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 hover:bg-gray-50 border-[#BE5F93]/20 hover:border-[#BE5F93]/40"
              >
                <Link to="/discover">
                  Explore Magic Projects
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto">
              {[
                { icon: Target, label: 'Magic Projects', value: projectStats.totalProjects.toLocaleString() },
                { icon: DollarSign, label: 'Funded', value: `$${(projectStats.totalFunded / 1000).toFixed(0)}k` },
                { icon: Users, label: 'Active', value: projectStats.activeCampaigns },
                { icon: TrendingUp, label: 'Success Rate', value: `${projectStats.successRate}%` }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-[#BE5F93]" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured <span className="text-[#BE5F93]">Magic</span> Projects</h2>
              <p className="text-gray-600">Discover extraordinary magical innovations that need your support</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/discover" className="group text-[#BE5F93] hover:text-[#a04d7d]">
                View All
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Magic Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Magic Categories</h2>
            <p className="text-gray-600">Find projects that match your magical interests</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-[#BE5F93]/5">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#BE5F93] transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Recently Funded */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Trending */}
            <div>
              <div className="flex items-center mb-8">
                <TrendingUp className="h-6 w-6 text-[#BE5F93] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Magic</h2>
              </div>
              <div className="space-y-6">
                {trendingProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} size="compact" />
                ))}
              </div>
            </div>

            {/* Recently Funded */}
            <div>
              <div className="flex items-center mb-8">
                <Star className="h-6 w-6 text-[#BE5F93] mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Successfully Funded</h2>
              </div>
              <div className="space-y-6">
                {recentlyFunded.map((project) => (
                  <ProjectCard key={project.id} project={project} size="compact" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-[#BE5F93]/5 to-pink-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How FundMagic Works</h2>
            <p className="text-gray-600">Three simple steps to bring your magical ideas to life</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Your Magic',
                description: 'Share your magical project with compelling visuals and clear funding goals.',
                icon: '🎩'
              },
              {
                step: '02',
                title: 'Build Your Audience',
                description: 'Engage with fellow magicians, share updates, and build excitement around your project.',
                icon: '✨'
              },
              {
                step: '03',
                title: 'Make It Real',
                description: 'Reach your funding goal and turn your magical vision into reality.',
                icon: '🪄'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center border-0 shadow-sm bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-[#BE5F93] to-[#d478a8] text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#BE5F93] to-[#d478a8] text-white">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="text-4xl font-bold mb-4">Ready to Create <span className="text-[#BE5F93]">Magic</span>?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of magicians who have successfully funded their dreams through FundMagic by Sleight School.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            asChild
            className="bg-white text-[#BE5F93] hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link to="/create">
              Start Your Magical Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;