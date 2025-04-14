
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <p>👉 Created by Rani / Abed - Student from Ramat Gan College</p>
          </div>
          <div className="flex items-center space-x-1">
            <span>🔗</span>
            <a 
              href="https://www.rani.college.co.il/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-accent-foreground underline flex items-center"
            >
              Ramat Gan College
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
