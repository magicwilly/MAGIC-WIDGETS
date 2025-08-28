import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Search, Menu, X, User, Heart, Settings, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Removed navigation items to clean up header - these can be accessed elsewhere

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_microback/artifacts/foo53qjv_Fuscia%20ss%20logo%20shield.png" 
              alt="Sleight School Logo" 
              className="h-10 w-10"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">Fund<span className="text-[#BE5F93]">Magic</span></span>
              <span className="text-xs text-gray-600 -mt-1">by Sleight School</span>
            </div>
          </Link>

          {/* Desktop Navigation - Removed to clean up header */}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search magical projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full focus:ring-[#BE5F93] focus:border-[#BE5F93]"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="hidden md:flex bg-[#BE5F93] hover:bg-[#a04d7d] text-white"
                >
                  <Link to="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Start a Project
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                        <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{mockUser.name}</p>
                      <p className="text-xs text-gray-500">{mockUser.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/backed" className="w-full">
                        <Heart className="h-4 w-4 mr-2" />
                        Backed Projects
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => setIsLoggedIn(true)}>
                  Log In
                </Button>
                <Button size="sm" className="bg-[#BE5F93] hover:bg-[#a04d7d] text-white">
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white py-4">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search magical projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full focus:ring-[#BE5F93] focus:border-[#BE5F93]"
                  />
                </div>
              </form>
              
              {/* Mobile Navigation - Removed to clean up header */}

              {/* Mobile User Actions */}
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 px-2">
                  <Button variant="ghost" onClick={() => setIsLoggedIn(true)}>
                    Log In
                  </Button>
                  <Button className="bg-[#BE5F93] hover:bg-[#a04d7d] text-white">
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;