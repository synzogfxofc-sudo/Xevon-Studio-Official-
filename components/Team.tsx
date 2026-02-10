
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Linkedin, Twitter, Instagram, Facebook, Github, X, ExternalLink, MessageCircle } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { TeamMember } from '../types';

const iconMap = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  github: Github
};

const colorMap = {
  linkedin: 'hover:bg-blue-600',
  twitter: 'hover:bg-sky-500',
  instagram: 'hover:bg-pink-600',
  facebook: 'hover:bg-blue-700',
  github: 'hover:bg-gray-600'
};

export const Team: React.FC = () => {
  const { content } = useContent();
  const { team } = content;
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{team.title}</h2>
          <p className="text-white/60">{team.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="text-center group p-0 overflow-hidden h-full flex flex-col">
                <div className="relative h-64 w-full overflow-hidden">
                   <img 
                     src={member.image} 
                     alt={member.name} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-3 flex-wrap px-4">
                     {member.socials && Object.entries(member.socials).map(([platform, url]) => {
                        if (!url) return null;
                        const Icon = iconMap[platform as keyof typeof iconMap];
                        const hoverColor = colorMap[platform as keyof typeof colorMap] || 'hover:bg-purple-600';
                        
                        return (
                          <motion.a 
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                            className={`p-2 bg-white/20 ${hoverColor} rounded-full backdrop-blur-md transition-colors text-white`}
                          >
                             <Icon size={18} />
                          </motion.a>
                        );
                     })}
                   </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-sm mb-4">{member.role}</p>
                  
                  <button 
                    onClick={() => setSelectedMember(member)}
                    className="mt-auto inline-flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-purple-400 transition-colors group/btn"
                  >
                    View Profile
                    <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Member Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <div className="fixed inset-0 z-[2100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
              onClick={() => setSelectedMember(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl z-10"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                  <img src={selectedMember.image} alt={selectedMember.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 p-8 sm:p-10">
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white transition-all"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="mb-8">
                    <h3 className="text-3xl font-display font-bold text-white mb-2">{selectedMember.name}</h3>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                      <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">{selectedMember.role}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">Professional Bio</h4>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {selectedMember.bio || `${selectedMember.name} is a key pillar of Xevon Studio, specializing in ${selectedMember.role.toLowerCase()} to deliver high-impact digital solutions. With years of experience in the industry, they blend technical mastery with creative vision.`}
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 flex flex-wrap items-center gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Neural Connect</h4>
                        <div className="flex gap-4">
                          {selectedMember.socials && Object.entries(selectedMember.socials).map(([platform, url]) => {
                            if (!url) return null;
                            const Icon = iconMap[platform as keyof typeof iconMap];
                            return (
                              <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                <Icon size={20} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                      
                      {selectedMember.whatsapp && (
                        <div className="ml-auto">
                          <a 
                            href={`https://wa.me/${selectedMember.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#25D366] text-white text-xs font-bold hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all"
                          >
                            <MessageCircle size={16} />
                            Contact Direct
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
