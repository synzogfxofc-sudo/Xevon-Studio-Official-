
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../contexts/NotificationContext';
import { MessageSquare, Bell } from 'lucide-react';

export const DynamicNotification: React.FC = () => {
  const { activeNotification, hideNotification } = useNotification();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (activeNotification) {
      if (audioRef.current) {
        audioRef.current.volume = 0.3;
        // Typed error handling to prevent build failure
        audioRef.current.play().catch((e: any) => console.log("Audio play blocked", e));
      }
    }
  }, [activeNotification]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[200] flex justify-center p-4 pointer-events-none">
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3" />
      
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ y: -40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -40, opacity: 0, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              mass: 0.8
            }}
            className="pointer-events-auto cursor-pointer"
            onClick={hideNotification}
          >
            {/* Outline container matching navbar corners */}
            <div className="relative p-[1.2px] rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
              {/* Spinning Outline Animation */}
              <div className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_20%,#A855F7_40%,#6366F1_60%,transparent_80%)] animate-[spin_3s_linear_infinite]" />
              
              <div className="relative bg-black/98 backdrop-blur-3xl rounded-[23px] px-6 py-2.5 flex items-center gap-5 min-w-[340px] max-w-[95vw] sm:min-w-[480px]">
                {/* Admin Icon - Squared with Rounded Corners */}
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
                    <img 
                      src={activeNotification.icon || "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"} 
                      alt="Xevon" 
                      className="w-full h-full rounded-lg object-cover" 
                    />
                  </div>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-purple-600 border-2 border-black rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Bell size={8} className="text-white fill-white" />
                  </motion.div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[8px] font-bold text-purple-400 uppercase tracking-[0.2em] mb-0.5">
                    {activeNotification.title}
                  </h4>
                  <p className="text-white text-xs font-medium leading-tight line-clamp-1">
                    {activeNotification.message}
                  </p>
                </div>

                {/* Badge */}
                <div className="bg-white/5 p-1.5 rounded-lg border border-white/10 text-purple-400/60">
                  <MessageSquare size={12} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
