
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Sparkles, Check, CheckCheck, Paperclip, Smile } from 'lucide-react';
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
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Scroll on new messages or open
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isAgentTyping]);

  // Load and subscribe to messages
  useEffect(() => {
    if (!visitorId) return;

    // 1. Initial Fetch
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
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchMessages();

    // 2. Realtime Subscription
    const channel = supabase
      .channel(`live_chat_${visitorId}`)
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
          
          // Stop typing indicator if new message arrives from admin
          if (!newMessage.is_user) {
            setIsAgentTyping(false);
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
          
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'xevon_chats',
          filter: `visitor_id=eq.${visitorId}`
        },
        (payload) => {
           const updatedMessage = payload.new as ChatMessage;
           setMessages(prev => prev.map(m => m.id === updatedMessage.id ? updatedMessage : m));
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
    const isFirstMessage = messages.length === 0;

    setInput("");
    setIsSending(true);

    try {
      // 1. Send user message
      // NOTE: Removed 'status' field from insert as it might not exist in DB schema
      const { data, error: sendError } = await supabase
        .from('xevon_chats')
        .insert([{
          visitor_id: visitorId,
          text: userText,
          is_user: true
        }])
        .select()
        .single();

      if (sendError) throw sendError;

      // Optimistically update UI if data returned, otherwise wait for subscription
      if (data) {
        setMessages(prev => {
          if (prev.some(m => m.id === data.id)) return prev;
          return [...prev, { ...data, status: 'sent' }]; // Optimistic status
        });
        scrollToBottom();
      }

      // Show Popup Notification confirming sent
      showNotification({
         title: "Message Sent",
         message: "Our team has been notified.",
         icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"
      });

      // 2. Trigger Auto-Reply if first message
      if (isFirstMessage) {
         setTimeout(() => {
            setIsAgentTyping(true);
            scrollToBottom();
            
            setTimeout(async () => {
               const { error: replyError } = await supabase
               .from('xevon_chats')
               .insert([{
                  visitor_id: visitorId,
                  text: "Please wait a moment, our representative will contact you shortly.",
                  is_user: false
               }]);
               
               if (!replyError) setIsAgentTyping(false);
            }, 3000); // 3s typing delay
         }, 1000); // 1s delay before typing starts
      }

      // 3. Trigger FCM Notification to Admin
      await sendAdminNotification(
        "New Live Chat", 
        `Visitor says: ${userText.substring(0, 50)}...`
      );

    } catch (err) {
      console.error("Message delivery failed:", err);
      setInput(userText); // Restore input on failure
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const StatusIcon = ({ status }: { status?: string }) => {
     if (status === 'seen') return <CheckCheck size={12} className="text-blue-400" />;
     if (status === 'delivered') return <CheckCheck size={12} className="text-white/50" />;
     // Default single check for sent (even if status is undefined)
     return <Check size={12} className="text-white/50" />;
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
              className="fixed inset-0 z-[290] bg-black/20 backdrop-blur-sm sm:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              key="chat-window"
              initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[600px] max-h-[calc(100vh-8rem)] bg-[#0f0720]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden z-[300]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-white/5 flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/20 via-transparent to-transparent pointer-events-none"></div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-lg shadow-purple-500/20">
                      <div className="w-full h-full rounded-full border-2 border-[#0f0720] overflow-hidden">
                        <img src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" alt="Support" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#0f0720] rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base flex items-center gap-1.5">
                      Xevon Support
                      <div className="px-1.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                         <Sparkles size={8} className="text-yellow-400 fill-yellow-400" />
                      </div>
                    </h3>
                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Typically replies instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10">
                   <button 
                     onClick={() => setIsOpen(false)}
                     className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                   >
                     <Minimize2 size={16} />
                   </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar bg-gradient-to-b from-transparent via-purple-900/5 to-black/40">
                {messages.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                        <MessageCircle size={32} className="text-purple-400" />
                      </div>
                      <h4 className="text-lg font-bold text-white mb-2">Welcome to Xevon</h4>
                      <p className="text-xs text-white/50 leading-relaxed max-w-[200px]">Ask us anything about our services, pricing, or portfolio.</p>
                   </div>
                )}
                
                {/* Date Divider (Simulated) */}
                {messages.length > 0 && (
                  <div className="flex justify-center">
                     <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full border border-white/5">Today</span>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id} 
                    className={`flex items-end gap-3 ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                  >
                    {!msg.is_user && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1px] shadow-lg mb-1">
                        <img 
                          src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" 
                          alt="Support" 
                          className="w-full h-full rounded-full object-cover border border-black" 
                        />
                      </div>
                    )}

                    <div className={`max-w-[80%] rounded-[20px] px-5 py-3.5 text-sm leading-relaxed shadow-md relative group ${
                      msg.is_user 
                        ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-sm shadow-purple-900/20 border-t border-l border-white/10' 
                        : 'bg-white/10 text-white/90 rounded-bl-sm border border-white/5 backdrop-blur-md'
                    }`}>
                      <p>{msg.text}</p>
                      <div className={`flex items-center gap-1.5 mt-1.5 ${msg.is_user ? 'justify-end' : 'justify-start'}`}>
                        <span className={`text-[9px] font-medium ${msg.is_user ? 'text-white/60' : 'text-white/40'}`}>
                           {formatTime(msg.created_at)}
                        </span>
                        {msg.is_user && <StatusIcon status={msg.status} />}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isAgentTyping && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex items-end gap-3 justify-start"
                   >
                     <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[1px] shadow-lg mb-1">
                        <img 
                          src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" 
                          alt="Support" 
                          className="w-full h-full rounded-full object-cover border border-black" 
                        />
                     </div>
                     <div className="bg-white/10 rounded-[20px] rounded-bl-sm px-4 py-3 border border-white/5 backdrop-blur-md flex items-center gap-1.5 h-10">
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                     </div>
                   </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/[0.02] backdrop-blur-2xl">
                <div className="relative flex items-center gap-2">
                   <button type="button" className="p-2.5 rounded-full text-white/30 hover:text-white/80 hover:bg-white/5 transition-colors">
                      <Paperclip size={18} />
                   </button>
                   <div className="flex-1 relative">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isSending}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-4 pr-10 py-3.5 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:bg-black/60 transition-all placeholder-white/20 shadow-inner disabled:opacity-50"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                         <Smile size={18} />
                      </button>
                   </div>
                  <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!input.trim() || isSending}
                    className="p-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all shadow-lg"
                  >
                    {isSending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
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
        className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center z-[300] border border-white/20 overflow-hidden group hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-full"></div>
        
        {/* Unread badge logic could go here */}
        
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
