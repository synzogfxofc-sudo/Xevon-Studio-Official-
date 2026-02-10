import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Crown, Rocket, Globe, Zap, Sparkles, Info } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { useContent } from '../contexts/ContentContext';
import { useOrder } from '../contexts/OrderContext';

const icons = [Rocket, Crown, Globe];
const gradients = [
  "from-blue-500/20 to-purple-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-emerald-500/20 to-cyan-500/20"
];
const borderGlows = [
  "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] group-hover:border-blue-500/50",
  "shadow-[0_0_50px_rgba(168,85,247,0.3)] border-purple-500/50 hover:shadow-[0_0_80px_rgba(168,85,247,0.6)] hover:border-purple-400",
  "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] group-hover:border-emerald-500/50"
];

export const Pricing: React.FC = () => {
  const { content } = useContent();
  const { pricing } = content;
  const { openOrderModal } = useOrder();

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Floating shapes */}
      <div className="absolute top-20 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] animate-pulse-slow" />
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
             <Zap size={16} className="text-yellow-400 fill-yellow-400" />
             <span className="text-sm font-medium text-white/80 uppercase tracking-widest">Premium Packages</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">{pricing.title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {pricing.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {pricing.packages.map((pkg, index) => {
            const Icon = icons[index % icons.length];
            const isHighlight = index === 1;
            
            return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${isHighlight ? 'md:-mt-8 z-10' : 'z-0 hover:z-20'}`}
            >
               {/* Ambient Glow for Visionary */}
               {isHighlight && (
                 <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-pink-600/20 blur-3xl -z-10 rounded-3xl transform scale-110 opacity-60 animate-pulse-slow"></div>
               )}

               <GlassCard 
                  hoverEffect={false}
                  className={`h-full flex flex-col relative transition-all duration-500 ease-out group ${
                  isHighlight 
                    ? 'bg-gradient-to-b from-purple-900/20 to-black/40 md:scale-105 hover:scale-[1.08] z-10' 
                    : 'hover:bg-white/5 hover:scale-[1.03] z-0 hover:z-20'
                  } ${borderGlows[index]}`}
               >
                  
                  {/* Card specific gradient glow */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

                  {isHighlight && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50"></div>
                        <div className="relative px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg border border-white/20 flex items-center gap-2 whitespace-nowrap">
                          <Sparkles size={10} className="text-yellow-200 animate-pulse" />
                          Most Popular
                          <Sparkles size={10} className="text-yellow-200 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 md:p-8 flex flex-col h-full relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 ${isHighlight ? 'shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-purple-500/10' : ''}`}>
                            <Icon className={`w-6 h-6 ${index === 0 ? 'text-blue-400' : index === 1 ? 'text-yellow-400' : 'text-emerald-400'}`} />
                        </div>
                        {isHighlight && <Crown className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] -rotate-12 group-hover:rotate-0 transition-transform duration-500" size={32} />}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${isHighlight ? 'text-white' : 'text-white/90'}`}>{pkg.name}</h3>
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className={`text-4xl md:text-5xl font-display font-bold tracking-tight ${isHighlight ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-100 to-purple-200' : 'text-white'}`}>{pkg.price}</span>
                      <span className="text-white/40 text-sm font-medium">/project</span>
                    </div>
                    
                    <div className={`w-full h-px bg-gradient-to-r ${isHighlight ? 'from-transparent via-purple-500/50 to-transparent' : 'from-transparent via-white/10 to-transparent'} mb-6`}></div>

                    <p className="text-white/60 text-sm mb-8 leading-relaxed">
                        {pkg.description}
                    </p>

                    <ul className="space-y-4 mb-8 flex-1">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70 group/item relative cursor-help">
                          <div className={`mt-0.5 p-0.5 rounded-full flex-shrink-0 transition-colors duration-300 ${
                            isHighlight 
                              ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                              : 'bg-white/10 text-white/50 group-hover/item:bg-purple-500/50 group-hover/item:text-white'
                          }`}>
                            <Check size={10} strokeWidth={3} />
                          </div>
                          <span className={`${isHighlight ? 'text-white/90' : 'group-hover/item:text-white transition-colors'} border-b border-dashed border-white/20 pb-0.5 hover:border-white/50 transition-colors`}>
                            {feature.name}
                          </span>
                          
                          {/* Glassmorphism Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-[#0f0720]/90 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] opacity-0 group-hover/item:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover/item:translate-y-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Info size={12} className="text-purple-400" />
                                <span className="text-white font-bold text-xs tracking-wide">{feature.name}</span>
                              </div>
                              <p className="text-white/70 text-xs leading-relaxed">{feature.description}</p>
                              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white/10"></div>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <button 
                      onClick={() => openOrderModal(pkg.name, pkg.price)}
                      className={`group/btn w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-500 relative overflow-hidden isolate ${
                      isHighlight 
                        ? 'bg-white text-purple-950 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:scale-[1.02]' 
                        : 'bg-white/5 border border-white/10 text-white hover:border-purple-500/50 hover:bg-white/10'
                    }`}>
                      {isHighlight ? (
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-purple-100 to-white z-[-1] opacity-100"></div>
                      ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 z-[-1] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-shine"></div>
                      )}
                      
                      <span className="relative z-10 tracking-wide">Purchase Now</span>
                      <ArrowRight size={18} className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
               </GlassCard>
            </motion.div>
          );
          })}
        </div>
      </div>
    </section>
  );
};