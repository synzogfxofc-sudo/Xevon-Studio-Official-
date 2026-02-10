
import React from 'react';
import { Twitter, Instagram, Linkedin, Github, Facebook } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface FooterProps {
  onAdminClick?: () => void;
}

const iconMap = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook
};

export const Footer: React.FC<FooterProps> = () => {
  const { content } = useContent();
  const { company } = content;

  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl pt-20 pb-10 overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" 
                alt="Xevon Logo" 
                className="w-12 h-12 rounded-xl"
              />
              <span className="font-display font-bold text-2xl text-white">{company.name}</span>
            </div>
            <p className="text-white/50 max-w-sm mb-8">
              {company.description}
            </p>
            <div className="flex gap-4">
              {Object.entries(company.socials).map(([platform, url]) => {
                 if (!url) return null;
                 const Icon = iconMap[platform as keyof typeof iconMap];
                 if (!Icon) return null;
                 
                 return (
                  <a 
                    key={platform} 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                 );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Services</h4>
            <ul className="space-y-4">
              {['Web Development', 'UI/UX Design', 'Branding', 'Digital Marketing', 'Mobile Apps'].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-purple-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4">
              {['About Us', 'Careers', 'Blog', 'Contact', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-white/50 hover:text-purple-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-white/40 text-sm">© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Made by</span>
            <span className="text-white/60 font-medium">Avex Studio (Tahsin)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
