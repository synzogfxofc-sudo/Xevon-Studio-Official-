
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase } from '../supabase';
import { useOrder } from '../contexts/OrderContext';

interface WelcomeModalProps {
  onNameSubmit: (name: string) => void;
}

const LOGO_URL = "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg";

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onNameSubmit }) => {
  const { visitorId } = useOrder();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [step, setStep] = useState<'input' | 'success'>('input');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setIsChecking(true);
      const storedName = localStorage.getItem('xevon_user_name');
      
      if (storedName) {
        onNameSubmit(storedName);
        setIsOpen(false);
        setIsChecking(false);
        
        // Use a safe fire-and-forget sync
        (async () => {
          try {
            await supabase.from('xevon_users')
              .upsert({ visitor_id: visitorId, name: storedName }, { onConflict: 'visitor_id' });
          } catch (e) {
            console.debug("Background sync deferred");
          }
        })();
        return;
      }

      try {
        const { data, error } = await supabase
          .from('xevon_users')
          .select('name')
          .eq('visitor_id', visitorId)
          .maybeSingle();

        if (data && !error) {
          localStorage.setItem('xevon_user_name', data.name);
          onNameSubmit(data.name);
          setIsOpen(false);
        } else {
          setIsOpen(true);
        }
      } catch (e) {
        setIsOpen(true);
      }
      setIsChecking(false);
    };

    checkUser();
  }, [onNameSubmit, visitorId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // OPTIMISTIC UI: Transition immediately for perceived speed
    localStorage.setItem('xevon_user_name', trimmedName);
    onNameSubmit(trimmedName);
    setStep('success');

    // Safe background sync
    (async () => {
      try {
        await supabase.from('xevon_users')
          .upsert({ visitor_id: visitorId, name: trimmedName }, { onConflict: 'visitor_id' });
      } catch (err) {
        console.debug("Sync deferred:", err);
      }
    })();

    // Close modal quickly but allow success animation to play
    setTimeout(() => setIsOpen(false), 1000);
  };

  if (isChecking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center px-6"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-[40px]" 
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            className="relative w-full max-w-[360px] bg-white/[0.03] border border-white/10 rounded-[48px] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Glossy top light */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {step === 'input' ? (
                  <motion.div
                    key="input-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    {/* Brand Header: Logo + Text Horizontal */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="flex items-center gap-3 mb-10"
                    >
                        <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                            <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-display font-black tracking-[0.2em] text-white uppercase leading-none">
                                Xevon Studio
                            </span>
                            <span className="text-[7px] font-bold text-white/20 uppercase tracking-[0.4em] mt-1">
                                Secure Access
                            </span>
                        </div>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                      <div className="text-center mb-6">
                        <p className="text-white/40 text-[9px] uppercase tracking-[0.3em] font-black">Authorized Personnel Only</p>
                      </div>

                      <div className="relative max-w-[260px] mx-auto">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 text-white placeholder-white/10 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.05] transition-all text-center text-sm font-display tracking-widest shadow-inner"
                          autoFocus
                        />
                      </div>
                      
                      <motion.button
                        type="submit"
                        disabled={!name.trim()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl bg-white text-black font-black text-[9px] uppercase tracking-[0.4em] transition-all disabled:opacity-5 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-2xl overflow-hidden group"
                      >
                         <span>Initialize Link</span>
                         <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success-view"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 flex flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 600, damping: 20 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] mb-6"
                    >
                        <ShieldCheck size={28} className="text-white" />
                    </motion.div>

                    <h2 className="text-[9px] font-display font-bold text-white/20 uppercase tracking-[0.5em] mb-3">Protocol Verified</h2>
                    
                    <div className="relative overflow-hidden inline-block px-4">
                        <motion.h3 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                          className="text-3xl font-display font-black text-white"
                        >
                          {name}
                        </motion.h3>
                        <motion.div 
                          initial={{ left: '-100%' }}
                          animate={{ left: '200%' }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent skew-x-12 z-10"
                        />
                    </div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mt-8 flex items-center gap-2 text-white/40 text-[8px] font-bold uppercase tracking-[0.3em]"
                    >
                        <Sparkles size={10} className="text-purple-400 animate-pulse" />
                        Synchronizing Environment...
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
