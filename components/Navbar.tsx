
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Activity, Cpu, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { useNotification } from '../contexts/NotificationContext';
import { useContent } from '../contexts/ContentContext';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Services', id: 'services' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Team', id: 'team' },
  { label: 'Contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const { currentOrder, userOrders, toggleStatusModal } = useOrder();
  const { activeNotification } = useNotification();
  const { content } = useContent();
  const [time, setTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hoursRaw = time.getHours();
  const hours12 = hoursRaw % 12 || 12;
  const hours = hours12.toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM';
  
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const formattedDay = time.toLocaleDateString([], { weekday: 'short' });

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-4 sm:pt-6 px-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        className={`pointer-events-auto relative flex items-center justify-between gap-4 p-[1.5px] rounded-[24px] transition-all duration-700 w-full sm:w-auto md:min-w-[980px] lg:min-w-[1150px] max-w-[1400px] ${
          activeNotification ? 'opacity-0 scale-90 translate-y-[-30px]' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Beautiful Loop Animation Outline */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden">
          <div className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_40%,#a855f7_70%,#6366f1_85%,#ffffff_100%)] animate-[spin_3.5s_linear_infinite]" />
        </div>

        <div className={`relative flex items-center justify-between w-full h-14 sm:h-16 bg-[#030005]/95 backdrop-blur-[45px] rounded-[22.5px] px-4 sm:px-6 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]`}>
          
          {/* Logo Section */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer" 
            onClick={() => scrollToSection('hero')}
          >
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-white/20 shadow-lg flex-shrink-0 ring-1 ring-white/10"
            >
              <img 
                src={content.company.logo || "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"} 
                alt="Xevon" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
            </motion.div>
            
            <div className="flex flex-col">
              <div className="relative">
                {/* Glow layer for bloom effect */}
                <span className="absolute inset-0 font-display font-black text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-purple-500/30 blur-[4px]" aria-hidden="true">
                  {content.company.name}
                </span>
                
                {/* Main text with premium liquid metal animation (Double Glint) */}
                <span className="relative font-display font-black text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-transparent bg-clip-text bg-[linear-gradient(to_right,#ffffff_0%,#ffffff_35%,#d8b4fe_45%,#ffffff_50%,#d8b4fe_55%,#ffffff_65%,#ffffff_100%)] bg-[length:250%_auto] animate-shine">
                  {content.company.name}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-0.5">
                 <div className="relative flex items-center justify-center w-1.5 h-1.5">
                    <div className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-1 h-1 bg-emerald-400 rounded-full"></div>
                 </div>
                 <span className="text-[7px] font-bold text-white/30 tracking-[0.15em] uppercase">System Online</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block flex-1 max-w-[20rem]"></div>

          {/* Status Indicators (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 px-6 h-8 bg-white/[0.03] border border-white/5 rounded-full mx-4 shadow-inner shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2">
               <Cpu size={12} className="text-purple-400" />
               <span className="text-[8px] font-bold text-white/40 tracking-[0.1em] uppercase">Neural Net</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
               <Activity size={12} className="text-emerald-400 animate-pulse" />
               <span className="text-[8px] font-bold text-white/40 tracking-[0.1em] uppercase">Stable</span>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            
            {/* User Actions */}
            <div className="flex items-center gap-3">
              {(currentOrder || userOrders.length > 0) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleStatusModal}
                  className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-300 hover:text-white transition-all shadow-lg shadow-purple-900/10 group"
                  title="My Projects"
                >
                  <ShoppingBag size={16} />
                  {currentOrder && currentOrder.status !== 'completed' && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] border border-black transform translate-x-1/4 -translate-y-1/4"></span>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.button>
              )}

              {/* Premium Clock Widget */}
              <div className="relative group cursor-default">
                 {/* Glow Effect */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition duration-500"></div>
                 
                 <div className="relative flex items-center gap-3 px-3.5 py-1.5 sm:px-5 sm:py-2 bg-[#0A0510] border border-white/10 rounded-xl shadow-inner min-w-[130px] sm:min-w-[150px]">
                    {/* Rotating Ring Icon */}
                    <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                       <div className="absolute inset-0 border border-white/10 rounded-full"></div>
                       <div className="absolute inset-0 border-t border-purple-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                       <div className="absolute inset-1.5 border-b border-indigo-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
                       <Clock size={12} className="text-white/60 relative z-10" />
                    </div>

                    <div className="flex flex-col justify-center border-l border-white/10 pl-3 h-8">
                       <div className="flex items-baseline gap-0.5 leading-none">
                          <span className="text-sm font-display font-bold text-white tabular-nums tracking-wide">{hours}</span>
                          <span className="text-sm font-display font-bold text-purple-400 animate-pulse px-[1px]">:</span>
                          <span className="text-sm font-display font-bold text-white tabular-nums tracking-wide">{minutes}</span>
                          <span className="text-[9px] font-bold text-white/30 ml-1">{ampm}</span>
                       </div>
                       <div className="flex items-center gap-1.5 mt-1 leading-none">
                          <span className="text-[8px] font-bold text-indigo-300 uppercase tracking-wider">{formattedDay}</span>
                          <div className="w-0.5 h-0.5 rounded-full bg-white/20"></div>
                          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">{formattedDate}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Menu Trigger */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  className="flex group flex-col gap-[3px] p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all"
                >
                  <motion.div 
                    animate={isMenuOpen ? { rotate: 45, y: 4.5 } : { rotate: 0, y: 0 }}
                    className="w-4 h-[1.5px] bg-white/60 rounded-full group-hover:w-5 transition-all duration-300" 
                  />
                  <motion.div 
                    animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-5 h-[1.5px] bg-purple-500/80 rounded-full group-hover:w-3 transition-all duration-300" 
                  />
                  <motion.div 
                    animate={isMenuOpen ? { rotate: -45, y: -4.5 } : { rotate: 0, y: 0 }}
                    className="w-3 h-[1.5px] bg-white/60 rounded-full group-hover:w-5 transition-all duration-300" 
                  />
                </motion.button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden"
                        onClick={() => setIsMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-4 w-56 p-2 rounded-2xl bg-[#0f0720]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col gap-1 z-50 overflow-hidden"
                      >
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                         
                         {NAV_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="relative text-left px-5 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all group overflow-hidden"
                          >
                             <span className="relative z-10">{item.label}</span>
                             <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                         ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};
