import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useOrder } from '../contexts/OrderContext';

export const PurchaseModal: React.FC = () => {
  const { isOrderModalOpen, closeOrderModal, selectedPackage, placeOrder } = useOrder();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [formData, setFormData] = useState({ name: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp || !selectedPackage) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      placeOrder(selectedPackage.name, selectedPackage.price, formData.name, formData.whatsapp);
      setStep('success');
      setIsSubmitting(false);
    }, 1500);
  };

  const handleClose = () => {
    closeOrderModal();
    // Reset state after modal closes
    setTimeout(() => {
      setStep('details');
      setFormData({ name: '', whatsapp: '' });
    }, 500);
  };

  if (!isOrderModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={handleClose} />

        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          className="relative w-full max-w-md bg-[#0f0720] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)]"
        >
          {/* Decorative Glows */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px]" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <ShoppingBag className="text-purple-400" size={20} />
                {step === 'details' ? 'Secure Checkout' : 'Order Confirmed'}
              </h3>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-hidden relative h-[420px]">
              <AnimatePresence initial={false} mode="wait">
                {step === 'details' ? (
                  <motion.div
                    key="details"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-8 h-full flex flex-col"
                  >
                    <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-white/60 text-sm mb-1">Selected Package</p>
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xl font-bold text-white">{selectedPackage?.name}</h4>
                        <span className="text-purple-400 font-bold text-lg">{selectedPackage?.price}</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Enter your name"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/5 transition-all placeholder-white/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/50 uppercase tracking-wider">WhatsApp Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.whatsapp}
                          onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                          placeholder="+8801*********"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/5 transition-all placeholder-white/20"
                        />
                      </div>

                      <div className="mt-auto">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-[0_4px_20px_rgba(124,58,237,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                           <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 w-full h-full"></div>
                           {isSubmitting ? (
                             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                           ) : (
                             <>
                               Complete Order
                               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                             </>
                           )}
                        </motion.button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-8 h-full flex flex-col items-center justify-center text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] mb-8"
                    >
                      <Check size={48} className="text-white" strokeWidth={3} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">Order Successful!</h3>
                    <p className="text-white/60 mb-8 max-w-xs leading-relaxed">
                      Your order for <span className="text-purple-400 font-semibold">{selectedPackage?.name}</span> has been placed. 
                      You can check your status in the dashboard.
                    </p>

                    <button
                      onClick={handleClose}
                      className="w-full py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold transition-all"
                    >
                      Close & View Status
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};