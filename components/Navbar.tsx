import React, { useState, useEffect } from 'react';
import { ShoppingBag, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrder } from '../contexts/OrderContext';
import { useNotification } from '../contexts/NotificationContext';
import { useContent } from '../contexts/ContentContext';

interface NavbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, toggleTheme }) => {
  const { currentOrder, userOrders, toggleStatusModal } = useOrder();
  const { activeNotification } = useNotification();
  const { content } = useContent();
  const [time, setTime] = useState(new Date());

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hoursRaw = time.getHours();
  const hours12 = hoursRaw % 12 || 12;
  const hours = hours12.toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const ampm = hoursRaw >= 12 ? 'PM' : 'AM';
  
  const formattedDate = time.toLocaleDateString([], { month: 'short', day: 'numeric' });
  const formattedDay = time.toLocaleDateString([], { weekday: 'short' });

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none pt-6">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 22 }}
        className={`pointer-events-auto relative flex items-center justify-between gap-4 p-[1.5px] rounded-[24px] transition-all duration-700 min-w-[340px] sm:min-w-[940px] max-w-[95vw] ${
          activeNotification ? 'opacity-0 scale-90 translate-y-[-30px]' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Beautiful Loop Animation Outline */}
        <div className="absolute inset-0 rounded-[24px] overflow-hidden">
          <div className="absolute inset-[-200%] bg-[conic-gradient(from_90deg_at_50%_50%,#0000_0%,#0000_40%,#a855f7_70%,#6366f1_85%,#ffffff_100%)] animate-[spin_3.5s_linear_infinite]" />
        </div>

        <div className={`relative flex items-center justify-between w-full h-12 bg-black/95 backdrop-blur-[45px] rounded-[22.5px] px-6 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)]`}>
          
          <div className="flex items-center gap-2.5 shrink-0">
            <motion.div 
              whileHover={{ rotate: -5, scale: 1.05 }}
              className="relative w-7 h-7 rounded-lg overflow-hidden border border-white/20 shadow-lg flex-shrink-0 ring-1 ring-white/10"
            >
              <img 
                src={content.company.logo || "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"} 
                alt="Xevon" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
            </motion.div>
            
            <div className="flex flex-col">
              <span className="font-display font-bold text-[9px] tracking-[0.3em] uppercase text-transparent bg-clip-text bg-[linear-gradient(110deg,#ffffff,45%,#a855f7,55%,#ffffff)] bg-[length:200%_100%] animate-shine">
                {content.company.name}
              </span>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[6px] font-bold text-white/20 tracking-[0.15em] uppercase">Core Online</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block flex-1 max-w-[14rem] md:max-w-[18rem] lg:max-w-[22rem]"></div>

          <div className="hidden lg:flex items-center gap-5 px-5 h-7 bg-white/5 border border-white/5 rounded-full mx-2 shadow-inner shrink-0">
            <div className="flex items-center gap-1.5">
               <Cpu size={10} className="text-purple-400 opacity-60" />
               <span className="text-[7px] font-bold text-white/30 tracking-[0.1em] uppercase">Processing</span>
            </div>
            <div className="w-px h-1.5 bg-white/10"></div>
            <div className="flex items-center gap-1.5">
               <Activity size={10} className="text-emerald-400 animate-pulse opacity-60" />
               <span className="text-[7px] font-bold text-white/30 tracking-[0.1em] uppercase">Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            
            <div className="flex items-center gap-2">
              {(currentOrder || userOrders.length > 0) && (
                <motion.button
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleStatusModal}
                  className="relative p-2 rounded-lg bg-white/5 border border-white/5 text-purple-400/70 hover:text-white transition-all shadow-inner"
                  title="My Projects"
                >
                  <ShoppingBag size={12} />
                  {currentOrder && currentOrder.status !== 'completed' && (
                    <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
                  )}
                </motion.button>
              )}

              <div className="flex flex-col items-end justify-center px-4 py-1.5 bg-white/[0.03] border border-white/5 rounded-lg shadow-inner group/clock min-w-[75px]">
                 <div className="flex items-baseline gap-1 h-3.5 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.span 
                        key={hours + minutes}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        className="text-[11px] font-display font-bold text-white/90 tabular-nums tracking-tight"
                      >
                        {hours}:{minutes}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-[7px] font-bold text-purple-400/60 uppercase tracking-wider">{ampm}</span>
                 </div>
                 
                 <div className="flex items-center gap-1">
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">
                      {formattedDay}, {formattedDate}
                    </span>
                 </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                className="group flex flex-col gap-0.5 p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="w-3.5 h-[1.2px] bg-white/70 rounded-full group-hover:w-4 transition-all duration-300" />
                <div className="w-4 h-[1.2px] bg-purple-500/50 rounded-full group-hover:w-2.5 transition-all duration-300" />
                <div className="w-2.5 h-[1.2px] bg-white/70 rounded-full group-hover:w-4 transition-all duration-300" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    </div>
  );
};