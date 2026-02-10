import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Review } from '../types';
import { supabase } from '../supabase';

interface RatingProps {
  userName?: string;
}

const LOGO_URL = "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg";

export const Rating: React.FC<RatingProps> = ({ userName }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load reviews from Supabase on mount
  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from('xevon_reviews')
        .select('*')
        .order('id', { ascending: false });

      if (data && !error) {
        setReviews(data);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    const newReview: Review = {
      id: Date.now().toString(),
      name: userName || 'Anonymous Visitor',
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };

    const { error } = await supabase
      .from('xevon_reviews')
      .insert([newReview]);

    if (!error) {
      setReviews(prev => [newReview, ...prev]);
      setRating(0);
      setComment('');
    } else {
      console.error("Error saving review:", error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section className="py-24 relative overflow-hidden" id="community-reviews">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="mb-8">
               <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Community Feedback</h2>
               <p className="text-white/60">
                 {userName 
                   ? (
                      <span className="flex items-center gap-2">
                        Welcome back, {userName} 
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/5 backdrop-blur-sm">
                           <img src={LOGO_URL} alt="Xevon" className="w-3 h-3 rounded-full" />
                           <span className="text-[10px] font-bold text-white/80">Xevon Studio</span>
                        </span>
                        ! Share your thoughts with us.
                      </span>
                   )
                   : "Join the conversation and rate your experience."}
               </p>
            </div>

            <GlassCard className="p-8 border-purple-500/20">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-3">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(star)}
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                        className="focus:outline-none transition-transform"
                      >
                        <Star
                          size={32}
                          className={`transition-colors duration-200 ${
                            star <= (hover || rating)
                              ? 'fill-purple-500 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                              : 'text-white/20'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-white/70 mb-3">Your Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked..."
                    rows={4}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:bg-white/5 transition-all resize-none placeholder-white/20"
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative group overflow-hidden py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <div className="relative z-20 flex items-center gap-2">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Submit Review
                        <Send size={18} />
                      </>
                    )}
                  </div>
                </motion.button>
              </form>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="text-purple-400" size={20} />
                Recent Reviews
              </h3>
              <span className="text-sm text-white/40">{reviews.length} reviews</span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mask-gradient-b">
              <AnimatePresence>
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md hover:bg-white/10 transition-colors group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-white font-bold text-lg">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center flex-wrap gap-2">
                                <h4 className="font-bold text-white group-hover:text-purple-300 transition-colors">{review.name}</h4>
                                <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-0.5 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                    <img src={LOGO_URL} alt="Xevon" className="w-3.5 h-3.5 rounded-md" />
                                    <span className="text-[10px] font-medium text-white/60 group-hover:text-purple-200 transition-colors">Xevon Studio</span>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < review.rating ? "fill-purple-500 text-purple-500" : "fill-white/10 text-white/10"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white/30">
                          <Clock size={12} />
                          {review.date}
                        </div>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed pl-[52px]">
                        {review.comment}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};