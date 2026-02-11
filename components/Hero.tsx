
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Play } from 'lucide-react';
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
    <section id="hero" className="relative min-h-screen flex items-center pt-32 md:pt-40 pb-20 overflow-hidden transform-gpu">
      {/* Background Elements - Optimized for Mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/20 rounded-full blur-[60px] sm:blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-indigo-600/15 rounded-full blur-[60px] sm:blur-[120px] animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-glow-sm hover:bg-white/10 transition-colors cursor-default group">
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <span className="text-sm font-medium text-purple-200 tracking-wide">{hero.tagline}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm">
              {hero.titleLine1} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 inline-block animate-pulse-slow">{hero.titleLine2}</span>
            </h1>

            <p className="text-xl text-white/60 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {hero.description}
            </p>

            {/* --- Premium Buttons Section --- */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              
              {/* Primary Button: Liquid Purple Gloss */}
              <motion.button 
                onClick={() => scrollToSection('pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full sm:w-auto rounded-full"
              >
                {/* Outer Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                
                {/* Button Container */}
                <div className="relative w-full sm:w-auto px-8 py-4 bg-[#0F0720] rounded-full leading-none flex items-center justify-center gap-4 overflow-hidden ring-1 ring-white/10 shadow-2xl">
                    
                    {/* Background Gradient & Animation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4c1d95] via-[#581c87] to-[#2e1065] opacity-100 transition-all duration-500 group-hover:scale-110"></div>
                    
                    {/* Glossy Reflection (Top) */}
                    <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent opacity-50 rounded-t-full pointer-events-none"></div>

                    {/* Animated Shine Sweep */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 translate-x-[-100%] group-hover:animate-shine transition-all"></div>

                    {/* Content */}
                    <span className="relative z-10 font-display font-bold text-sm uppercase tracking-[0.15em] text-white group-hover:text-white transition-colors drop-shadow-md">
                        {hero.ctaPrimary}
                    </span>
                    
                    {/* Icon Circle */}
                    <div className="relative z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shadow-inner group-hover:bg-white group-hover:text-purple-900 transition-all duration-300">
                        <ArrowRight size={14} className="text-purple-200 group-hover:text-purple-900 transition-colors group-hover:-rotate-45 duration-300" />
                    </div>
                </div>
              </motion.button>
              
              {/* Secondary Button: Dark Crystal Outline */}
              <motion.button 
                onClick={() => scrollToSection('portfolio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-full sm:w-auto px-8 py-4 rounded-full overflow-hidden isolate"
              >
                 {/* Border Gradient */}
                 <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-white/20 via-purple-500/50 to-white/20 -z-10 group-hover:from-purple-400 group-hover:via-indigo-400 group-hover:to-purple-400 transition-all duration-500"></div>
                 
                 {/* Background */}
                 <div className="absolute inset-[1px] bg-black/40 rounded-full -z-10 backdrop-blur-xl group-hover:bg-purple-900/20 transition-colors duration-500"></div>

                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                 {/* Content */}
                 <div className="flex items-center justify-center gap-3">
                    <div className="relative flex items-center justify-center w-6 h-6">
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 duration-1000"></div>
                        <Play size={12} className="fill-white text-white relative z-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-display font-semibold text-sm uppercase tracking-[0.15em] text-white/80 group-hover:text-white transition-colors shadow-black/50 drop-shadow-sm">
                      {hero.ctaSecondary}
                    </span>
                 </div>
              </motion.button>
            </div>
            {/* --- End Buttons --- */}

          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative w-full"
          >
            <div className="relative z-10 transform perspective-1000">
              <div className="relative w-full aspect-square max-w-lg mx-auto bg-gradient-to-br from-white/[0.08] to-transparent rounded-[32px] border border-white/10 backdrop-blur-2xl p-6 shadow-2xl animate-float">
                {/* Simulated Glass UI Interface */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                </div>
                
                <div className="h-full flex flex-col gap-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="h-1.5 w-20 bg-white/10 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-black/30 rounded-2xl border border-white/5 p-5 flex flex-col justify-between hover:bg-black/40 transition-colors">
                       <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                         <Sparkles size={22} />
                       </div>
                       <div className="space-y-2.5">
                         <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                         <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                       </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/40 to-indigo-600/40 rounded-2xl border border-white/10 p-5 flex items-center justify-center text-white font-bold text-4xl relative overflow-hidden group">
                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                       <span className="relative z-10">+145%</span>
                    </div>
                    <div className="col-span-2 bg-white/5 rounded-2xl border border-white/5 p-6 relative overflow-hidden flex items-end">
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 to-transparent"></div>
                        <div className="flex items-end justify-between h-32 w-full gap-3 relative z-10">
                           {[35, 65, 45, 85, 55, 95].map((h, i) => (
                              <div key={i} className="w-full bg-gradient-to-t from-purple-500/60 to-purple-400/40 rounded-t-sm transition-all duration-1000 ease-out hover:from-purple-500 hover:to-purple-400" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-6 -right-6 lg:-right-12 w-24 h-24 bg-[#0A0510]/80 backdrop-blur-xl border border-white/10 rounded-2xl animate-float shadow-2xl flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <span className="text-4xl filter drop-shadow-lg">🚀</span>
              </div>
               <div className="absolute -bottom-8 -left-4 lg:-left-10 w-auto px-6 py-4 bg-[#0A0510]/80 backdrop-blur-xl border border-white/10 rounded-full animate-float shadow-2xl flex items-center gap-3" style={{ animationDelay: '2s' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                <span className="text-sm font-bold text-white tracking-wide">System Active</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
