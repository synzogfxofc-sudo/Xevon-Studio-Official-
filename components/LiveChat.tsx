import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabase';
import { useOrder } from '../contexts/OrderContext';
import { useNotification } from '../contexts/NotificationContext';
import { ChatMessage } from '../types';
import { sendAdminNotification } from '../utils/notificationService';

export const LiveChat: React.FC = () => {
  const { visitorId } = useOrder();
  const { showNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load and subscribe to messages
  useEffect(() => {
    if (!visitorId) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('xevon_chats')
          .select('*')
          .eq('visitor_id', visitorId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        if (data) {
          setMessages(data);
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchMessages();

    // Subscribe to changes for this visitor's chat
    const channel = supabase
      .channel(`chat_visitor_${visitorId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'xevon_chats',
          filter: `visitor_id=eq.${visitorId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          
          // Trigger notification if message is from admin
          if (!newMessage.is_user) {
            showNotification({
              title: "Xevon Support",
              message: newMessage.text,
              icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"
            });
          }

          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [visitorId, showNotification]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending || !visitorId) return;

    const userText = input.trim();
    setInput("");
    setIsSending(true);

    try {
      // 1. Send user message
      const { error: sendError } = await supabase
        .from('xevon_chats')
        .insert([{
          visitor_id: visitorId,
          text: userText,
          is_user: true
        }]);

      if (sendError) throw sendError;

      // 2. Trigger FCM Notification to Admin
      await sendAdminNotification(
        "New Live Chat", 
        `Visitor says: ${userText.substring(0, 50)}...`
      );

    } catch (err) {
      console.error("Message delivery failed:", err);
      setInput(userText);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed bottom-24 right-6 w-[calc(100vw-3rem)] sm:w-96 h-[500px] max-h-[calc(100vh-8rem)] bg-[#0f0720]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col overflow-hidden z-[60]"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/10 to-transparent pointer-events-none"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
                      <img src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" alt="Support" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0f0720] rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-1">
                      Xevon Support
                      <Sparkles size={10} className="text-yellow-400" />
                    </h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Online Now</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/70 transition-colors relative z-10"
                >
                  <Minimize2 size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
                {messages.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                      <MessageCircle size={48} strokeWidth={1} className="mb-4" />
                      <p className="text-sm">Welcome to Xevon Studio.<br/>How can we help you today?</p>
                   </div>
                )}
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex items-end gap-2.5 ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.is_user && (
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1px] shadow-lg mb-1">
                        <img 
                          src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" 
                          alt="Support" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      </div>
                    )}

                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm relative ${
                      msg.is_user 
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none shadow-lg shadow-purple-900/20 border border-white/10' 
                        : 'bg-[#1a1025] text-white/90 rounded-bl-none border border-purple-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
                    }`}>
                      {!msg.is_user && (
                        <span className="block text-[8px] font-bold text-purple-400 uppercase tracking-wider mb-1">Xevon Team</span>
                      )}
                      <p>{msg.text}</p>
                      <span className={`text-[9px] block mt-1.5 ${msg.is_user ? 'text-white/60 text-right' : 'text-white/30'}`}>
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                <div className="relative flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="w-full bg-black/40 border border-white/10 rounded-full pl-5 pr-12 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all placeholder-white/20 shadow-inner disabled:opacity-50"
                  />
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={!input.trim() || isSending}
                    className="absolute right-1.5 p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={16} className={input.trim() ? 'ml-0.5' : ''} />
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center z-[60] border border-white/20 overflow-hidden group hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-shadow duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="relative z-10"
            >
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="relative z-10"
            >
              <MessageCircle size={28} className="fill-white/20" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};