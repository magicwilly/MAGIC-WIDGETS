import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import ProjectCard from '../components/ProjectCard';
import { ArrowRight, TrendingUp, Star, Users, DollarSign, Target } from 'lucide-react';
import { featuredProjects, categories, recentlyFunded, trendingProjects, projectStats } from '../data/mockData';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
              Join 100,000+ creators worldwide
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bring Creative
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent"> Projects </span>
              to Life
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Fund innovative projects, support creative minds, and be part of bringing amazing ideas to reality. 
              Start your crowdfunding journey today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Link to="/create">
                  Start a Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="border-2 hover:bg-gray-50"
              >
                <Link to="/discover">
                  Explore Projects
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-2xl mx-auto">
              {[
                { icon: Target, label: 'Projects', value: projectStats.totalProjects.toLocaleString() },
                { icon: DollarSign, label: 'Funded', value: `$${(projectStats.totalFunded / 1000).toFixed(0)}k` },
                { icon: Users, label: 'Active', value: projectStats.activeCampaigns },
                { icon: TrendingUp, label: 'Success Rate', value: `${projectStats.successRate}%` }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Projects</h2>
              <p className="text-gray-600">Discover amazing projects that need your support</p>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/discover" className="group">
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

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Categories</h2>
            <p className="text-gray-600">Find projects that match your interests</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link key={category.id} to={`/category/${category.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border-0 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
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
                <TrendingUp className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
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
                <Star className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Recently Funded</h2>
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
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">How FundCraft Works</h2>
            <p className="text-gray-600">Simple steps to bring your ideas to life</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Share Your Project',
                description: 'Create your project page with compelling visuals and clear funding goals.'
              },
              {
                step: '02',
                title: 'Build Community',
                description: 'Engage with backers, share updates, and build excitement around your project.'
              },
              {
                step: '03',
                title: 'Bring It to Life',
                description: 'Reach your funding goal and turn your creative vision into reality.'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center border-0 shadow-sm bg-white">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {item.step}
                  </div>
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
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of creators who have successfully funded their dreams through our platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            asChild
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link to="/create">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;