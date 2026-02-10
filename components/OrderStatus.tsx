import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Clock, Package, ShoppingBag, History, User, ShieldCheck, Zap, ExternalLink } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';
import { useContent } from '../contexts/ContentContext';

export const OrderStatus: React.FC = () => {
  const { isStatusModalOpen, toggleStatusModal, userOrders, visitorId } = useOrder();
  const { content } = useContent();
  const [userName, setUserName] = useState<string>('Explorer');

  useEffect(() => {
    const stored = localStorage.getItem('xevon_user_name');
    if (stored) setUserName(stored);
  }, [isStatusModalOpen]);

  if (!isStatusModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-xl" 
          onClick={toggleStatusModal} 
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-2xl bg-[#0a0514]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(168,85,247,0.15)] flex flex-col max-h-[90vh]"
        >
          {/* Subtle Animated Background Elements */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-purple-600/10 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Profile Header */}
          <div className="relative p-8 pb-6 flex flex-col sm:flex-row items-center gap-6 border-b border-white/5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 p-0.5 shadow-2xl">
                <div className="w-full h-full bg-[#0a0514] rounded-[14px] flex items-center justify-center">
                  <User size={32} className="text-purple-400" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-[#0a0514] rounded-full shadow-lg" />
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                <h2 className="text-2xl font-display font-bold text-white">{userName}</h2>
                <div className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center gap-1.5">
                   <ShieldCheck size={10} className="text-purple-400" />
                   <span className="text-[9px] font-bold text-purple-300 uppercase tracking-widest">Verified</span>
                </div>
              </div>
              <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em] mb-4">Visitor Protocol: {visitorId.substring(0, 10)}</p>
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                    <ShoppingBag size={12} className="text-purple-400" />
                    <span className="text-xs font-bold text-white/70">{userOrders.length} Projects</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                    <Zap size={12} className="text-yellow-400" />
                    <span className="text-xs font-bold text-white/70">X-Premium</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={toggleStatusModal}
              className="absolute top-6 right-6 p-2.5 hover:bg-white/5 rounded-full text-white/30 hover:text-white transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-black/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <History className="text-purple-400" size={18} />
                <h3 className="font-display font-bold text-lg text-white">Project Evolution</h3>
              </div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Synchronized Live</span>
            </div>

            {userOrders.length > 0 ? (
              <div className="space-y-6 pb-4">
                {userOrders.map((order, index) => {
                  const assignedRep = order.assignedRepIndex !== undefined 
                    ? content.team.members[order.assignedRepIndex] 
                    : null;

                  return (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-purple-500/20 transition-all duration-500 shadow-xl">
                         <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                            
                            {/* Project Details */}
                            <div className="flex-1">
                               <div className="flex items-center gap-3 mb-4">
                                  <div className={`p-2 rounded-xl ${index === 0 ? 'bg-purple-600/20 text-purple-400' : 'bg-white/5 text-white/40'} border border-white/10`}>
                                    <Package size={18} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                       <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${
                                          order.status === 'pending' 
                                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' 
                                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                       }`}>
                                          {order.status}
                                       </span>
                                       <span className="text-white/20 text-[9px] font-bold uppercase tracking-tighter">{order.date}</span>
                                    </div>
                                  </div>
                               </div>
                               <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-1">{order.packageName}</h4>
                               <p className="text-purple-400 font-bold text-sm tracking-tight">{order.price}</p>
                            </div>

                            {/* Interaction Hub */}
                            <div className="w-full lg:w-72">
                               {order.status === 'pending' ? (
                                 <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                      <Clock size={16} className="text-yellow-500 animate-pulse" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                       <p className="text-xs font-bold text-white/90">Awaiting Specialist</p>
                                       <p className="text-[10px] text-white/30 truncate">Matching with the best team...</p>
                                    </div>
                                 </div>
                               ) : assignedRep ? (
                                 <div className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-purple-500/30 transition-all duration-300">
                                    <div className="flex items-center gap-3 mb-4">
                                       <div className="relative">
                                          <img src={assignedRep.image} className="w-10 h-10 rounded-xl object-cover border border-purple-500/50" alt="" />
                                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                                       </div>
                                       <div className="flex-1 overflow-hidden">
                                          <p className="text-white text-sm font-bold truncate">{assignedRep.name}</p>
                                          <p className="text-purple-400/80 text-[10px] uppercase font-bold tracking-widest truncate">{assignedRep.role}</p>
                                       </div>
                                    </div>
                                    <motion.a 
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      href={`https://wa.me/${assignedRep.whatsapp}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_15px_rgba(37,211,102,0.2)]"
                                    >
                                      <MessageCircle size={14} />
                                      Connect via WhatsApp
                                    </motion.a>
                                 </div>
                               ) : null}
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 opacity-20">
                  <ShoppingBag size={40} strokeWidth={1} />
                </div>
                <h4 className="text-xl font-bold text-white/40">No Project History Found</h4>
                <p className="text-sm text-white/20 max-w-xs mx-auto mt-2 leading-relaxed">
                  Your journey with Xevon Studio hasn't started yet. Choose a package to see your evolution here.
                </p>
                <button 
                  onClick={toggleStatusModal}
                  className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-bold flex items-center gap-2"
                >
                  Return to Dashboard
                  <ExternalLink size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div className="p-5 bg-black/40 border-t border-white/5 text-center flex items-center justify-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Xevon Neural Link: Optimized</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};