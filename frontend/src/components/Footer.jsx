import React from 'react';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Create Magic',
      links: [
        { name: 'Start a Project', href: '/create' },
        { name: 'Creator Handbook', href: '/creator-handbook' },
        { name: 'Magic Resources', href: '/resources' },
        { name: 'Funding Tips', href: '/tips' }
      ]
    },
    {
      title: 'Discover',
      links: [
        { name: 'All Magic Projects', href: '/discover' },
        { name: 'Trending Now', href: '/trending' },
        { name: 'Recently Funded', href: '/funded' },
        { name: 'Magic Categories', href: '/categories' }
      ]
    },
    {
      title: 'Sleight School',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'How It Works', href: '/how-it-works' },
        { name: 'Magic Success Stories', href: '/stories' },
        { name: 'Press & Media', href: '/press' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Sleight School', href: '/contact' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 hover:text-[#BE5F93] transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_microback/artifacts/foo53qjv_Fuscia%20ss%20logo%20shield.png" 
              alt="Sleight School Logo" 
              className="h-8 w-8"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">FundMagic</span>
              <span className="text-xs text-gray-600 -mt-1">by Sleight School</span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
            <span>© {currentYear} Sleight School. All rights reserved.</span>
            <div className="flex space-x-4">
              <Link to="/terms" className="hover:text-[#BE5F93] transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-[#BE5F93] transition-colors">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-[#BE5F93] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;