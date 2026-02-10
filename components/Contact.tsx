import React from 'react';
import { GlassCard } from './ui/GlassCard';
import { Mail, MapPin, Phone, Send, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

export const Contact: React.FC = () => {
  const { content } = useContent();
  const { company } = content;

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
       <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">Let's Create <br /> <span className="text-purple-500">Something Epic</span></h2>
            <p className="text-white/60 text-lg mb-12 max-w-md">
              Ready to elevate your brand? Drop us a line and let's discuss how we can bring your vision to life.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Email Us</h4>
                  <p className="text-white/50">{company.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Call Us</h4>
                  <p className="text-white/50">{company.phone}</p>
                </div>
              </div>

              {company.whatsapp && (
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green-400">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">WhatsApp</h4>
                    <p className="text-white/50">{company.whatsapp}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-pink-400">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Visit Us</h4>
                  <p className="text-white/50">{company.address}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">First Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/20"
                      placeholder="Enter Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Last Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/20"
                      placeholder="Enter Surname"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/20"
                    placeholder="yourmail@gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/20"
                    placeholder="+8801*********"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-white/20 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <motion.button 
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-[0_4px_20px_rgba(124,58,237,0.4)] hover:shadow-[0_6px_30px_rgba(124,58,237,0.6)] transition-all flex items-center justify-center gap-2"
                >
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 w-full h-full"></div>
                  <div className="relative z-20 flex items-center gap-2">
                    Send Message
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};