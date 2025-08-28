import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { MapPin, Calendar, Users } from 'lucide-react';

const ProjectCard = ({ project, size = 'default' }) => {
  // Handle both backend property names and frontend mock data property names
  const currentFunding = project.current_funding || project.currentFunding || 0;
  const fundingGoal = project.funding_goal || project.fundingGoal || 1;
  const creator = project.creator_name || project.creator || 'Unknown Creator';
  const backers = project.backers_count || project.backers || 0;
  const daysLeft = project.days_left !== undefined ? project.days_left : project.daysLeft;
  
  const fundingPercentage = (currentFunding / fundingGoal) * 100;
  const isCompact = size === 'compact';

  return (
    <Link to={`/project/${project.id}`}>
      <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              isCompact ? 'h-40' : 'h-48'
            }`}
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-700 backdrop-blur-sm">
              {project.category}
            </Badge>
          </div>
          {project.status === 'funded' && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-emerald-500 text-white">
                Funded!
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className={`p-4 ${isCompact ? 'space-y-2' : 'space-y-3'}`}>
          <h3 className={`font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors ${
            isCompact ? 'text-sm' : 'text-base'
          }`}>
            {project.title}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {project.description}
          </p>
          
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              by {creator}
            </span>
            {project.location && (
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {project.location.split(',')[0]}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-900">
                ${currentFunding.toLocaleString()}
              </span>
              <span className="text-gray-500">
                {fundingPercentage.toFixed(0)}%
              </span>
            </div>
            
            <Progress 
              value={fundingPercentage} 
              className="h-1.5"
            />
            
            <div className="flex justify-between text-xs text-gray-500">
              <span>{backers} backers</span>
              {daysLeft !== undefined && (
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {daysLeft} days left
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;