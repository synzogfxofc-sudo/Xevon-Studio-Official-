
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

export const Hero: React.FC = () => {
  const { content } = useContent();
  const { hero } = content;

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-glow-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-200">{hero.tagline}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-sm">
              {hero.titleLine1} <br/>
              <span className="text-purple-500 inline-block animate-pulse-slow">{hero.titleLine2}</span>
            </h1>

            <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto md:mx-0 leading-relaxed">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <motion.button 
                onClick={() => scrollToSection('pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-[0_0_20px_rgba(124,58,237,0.5)] border border-white/20 hover:shadow-[0_0_40px_rgba(124,58,237,0.7)] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 w-full h-full"></div>
                <div className="relative z-20 flex items-center gap-2">
                  {hero.ctaPrimary}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.button>
              
              <motion.button 
                onClick={() => scrollToSection('portfolio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/30 overflow-hidden"
              >
                 <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent z-10 w-full h-full"></div>
                 <span className="relative z-20">{hero.ctaSecondary}</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 transform md:translate-x-10 perspective-1000">
              <div className="relative w-full aspect-square max-w-lg mx-auto bg-gradient-to-br from-white/10 to-transparent rounded-3xl border border-white/20 backdrop-blur-2xl p-6 shadow-2xl animate-float">
                {/* Simulated Glass UI Interface */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                       <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center text-purple-300">
                         <Sparkles size={20} />
                       </div>
                       <div className="space-y-2">
                         <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                         <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                       </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/40 to-indigo-600/40 rounded-xl border border-white/10 p-4 flex items-center justify-center text-white font-bold text-2xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                       +145%
                    </div>
                    <div className="col-span-2 bg-white/5 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-900/50 to-transparent"></div>
                        <div className="flex items-end justify-between h-full gap-2 px-2 pb-2">
                           {[40, 70, 50, 90, 60, 80].map((h, i) => (
                              <div key={i} className="w-full bg-purple-500/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl animate-float shadow-lg flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <span className="text-4xl">🚀</span>
              </div>
               <div className="absolute -bottom-5 -left-5 w-auto px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full animate-float shadow-lg flex items-center gap-3" style={{ animationDelay: '2s' }}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-white">System Active</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
