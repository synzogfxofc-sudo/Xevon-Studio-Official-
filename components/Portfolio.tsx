
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const categories = ["All", "Web Design", "App Development", "Branding", "Marketing"];

export const Portfolio: React.FC = () => {
  const { content } = useContent();
  const { portfolio } = content;
  const [filter, setFilter] = useState("All");

  const filteredItems = filter === "All" 
    ? portfolio.items 
    : portfolio.items.filter(item => item.category === filter);

  return (
    <section id="portfolio" className="py-24 relative overflow-hidden">
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">{portfolio.title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-10">{portfolio.subtitle}</p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border overflow-hidden group ${
                  filter === cat 
                    ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white hover:border-white/30'
                }`}
              >
                {filter === cat && (
                   <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
                )}
                <span className="relative z-20">{cat}</span>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-purple-900/20 group-hover:bg-purple-900/0 transition-colors z-10 pointer-events-none" />
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                  <div className="flex justify-between items-center mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                     <span className="text-purple-300 text-sm">{item.category}</span>
                     <div className="p-2 bg-white/10 rounded-full backdrop-blur-md hover:bg-white/20">
                       <ExternalLink size={16} />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
