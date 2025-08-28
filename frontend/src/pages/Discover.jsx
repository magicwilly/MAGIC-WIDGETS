import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, Grid, List } from 'lucide-react';
import { featuredProjects, categories } from '../data/mockData';

const Discover = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('trending');
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'trending', label: 'Trending' },
    { value: 'newest', label: 'Newest' },
    { value: 'ending-soon', label: 'Ending Soon' },
    { value: 'most-funded', label: 'Most Funded' },
    { value: 'recently-launched', label: 'Recently Launched' }
  ];

  const filteredProjects = featuredProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.creator.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Projects</h1>
          <p className="text-gray-600">Explore amazing projects from creators around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects, creators, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center">
                Category: {categories.find(c => c.id === selectedCategory)?.name}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 hover:text-red-600"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </p>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Projects Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6 flex gap-6">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{project.category}</Badge>
                    <span className="text-sm text-gray-500">by {project.creator}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">
                        ${project.currentFunding.toLocaleString()}
                      </span> raised of ${project.fundingGoal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.backers} backers • {project.daysLeft} days left
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all projects
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredProjects.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;