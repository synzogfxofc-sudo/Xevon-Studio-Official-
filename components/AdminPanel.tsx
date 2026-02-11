
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Save, Lock, Layout, Users, 
  ShoppingBag, MessageSquare, Send, 
  Search, Settings, Globe, Shield, 
  CreditCard, LogOut, ChevronRight,
  Sparkles, Building, Briefcase, Check,
  Menu, ArrowLeft, Image as ImageIcon,
  Plus, Trash2, Link as LinkIcon,
  MoreVertical, AlertCircle, Upload,
  Bell, Clock, Zap, Activity,
  Phone, Video, Info
} from 'lucide-react';
import { useContent, AppContent } from '../contexts/ContentContext';
import { useOrder } from '../contexts/OrderContext';
import { supabase } from '../supabase';
import { ChatMessage, Order, TeamMember, ChatUser } from '../types';
import { subscribeAdminDevice, sendAdminNotification } from '../utils/notificationService';

// --- Shared UI Components ---

const SectionBlock: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0f0720]/60 backdrop-blur-xl shadow-2xl group transition-all duration-300 hover:border-white/20">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
    <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3 bg-black/20">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7] animate-pulse" />
      <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="p-6 relative z-10">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ElementType;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, icon: Icon, placeholder, type = "text" }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">{label}</label>
    <div className="relative">
      {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" />}
      <input 
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label}`}
        className={`w-full bg-[#120b1d]/80 border border-white/10 rounded-xl ${Icon ? 'pl-11' : 'pl-5'} pr-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-[#1a1025] focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300`}
      />
    </div>
  </div>
);

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange, rows = 4 }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">{label}</label>
    <textarea 
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full bg-[#120b1d]/80 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-[#1a1025] focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 resize-none custom-scrollbar"
    />
  </div>
);

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ label, value, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 group">
      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-purple-400">{label}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-20 h-20 rounded-xl bg-[#120b1d] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group/img relative cursor-pointer shadow-inner">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
          ) : (
            <ImageIcon className="text-white/20" size={24} />
          )}
          <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-[2px]">
            <Upload size={16} className="text-white" />
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        </div>
        <div className="flex-1 w-full space-y-2">
          <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Media URL or upload via icon" 
            className="w-full bg-[#120b1d]/80 border border-white/10 rounded-xl px-5 py-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-[#1a1025] focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
};

interface SocialsManagerProps {
  socials: { [key: string]: string | undefined };
  onChange: (platform: string, value: string) => void;
}

const SocialsManager: React.FC<SocialsManagerProps> = ({ socials, onChange }) => {
  const platforms = ['twitter', 'instagram', 'linkedin', 'github', 'facebook'];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map(platform => (
        <div key={platform} className="relative group">
           <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 capitalize text-[10px] font-bold tracking-widest w-16 pointer-events-none group-focus-within:text-purple-400 transition-colors">
             {platform}
           </div>
           <input 
             type="text" 
             value={socials?.[platform] || ''} 
             onChange={(e) => onChange(platform, e.target.value)}
             className="w-full bg-[#120b1d]/80 border border-white/10 rounded-xl pl-24 pr-5 py-3 text-xs text-white placeholder-white/10 focus:outline-none focus:border-purple-500/50 focus:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all"
             placeholder="https://"
           />
        </div>
      ))}
    </div>
  );
};

// --- Complex Views ---

interface OrdersViewProps {
  orders: Order[];
  team: TeamMember[];
  onAssign: (orderId: string, repIndex: number) => Promise<void>;
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders, team, onAssign }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Revenue', value: '৳' + orders.reduce((acc, curr) => acc + parseInt(curr.price?.replace(/[^0-9]/g, '') || '0'), 0).toLocaleString(), icon: CreditCard, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
            { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, icon: Check, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { label: 'Active', value: orders.filter(o => o.status === 'assigned').length, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          ].map((stat, i) => (
             <div key={i} className={`relative overflow-hidden p-5 rounded-[24px] border ${stat.border} bg-[#0f0720]/80 backdrop-blur-md flex flex-col justify-between h-28 group hover:scale-[1.02] transition-transform duration-300 shadow-lg`}>
                <div className={`absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-all duration-500`}>
                   <stat.icon size={56} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${stat.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`} />
                   <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <span className={`text-2xl font-display font-bold ${stat.color} tracking-tight`}>{stat.value}</span>
             </div>
          ))}
       </div>

       <div className="bg-[#0f0720]/80 border border-white/10 rounded-[28px] overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <div className="flex items-center gap-3">
               <Activity size={16} className="text-purple-400" />
               <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">Active Pipeline</h3>
             </div>
             <button className="text-[10px] text-purple-400 hover:text-white transition-colors uppercase font-black tracking-[0.2em] hover:underline">Export Matrix</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-white/70 min-w-[700px]">
                <thead className="bg-white/5 text-white/40 text-[9px] uppercase font-black tracking-[0.3em]">
                   <tr>
                      <th className="px-6 py-4">Node ID</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Project</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Assigned Agent</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.04] transition-colors group">
                         <td className="px-6 py-5 font-mono text-[10px] opacity-30 group-hover:opacity-60 transition-opacity">#{order.id.slice(-6)}</td>
                         <td className="px-6 py-5">
                            <div className="font-bold text-white text-xs">{order.customerName}</div>
                            <div className="text-[10px] opacity-40 mt-0.5 font-mono">{order.customerWhatsapp}</div>
                         </td>
                         <td className="px-6 py-5">
                            <div className="text-xs text-white/90 font-medium">{order.packageName}</div>
                            <div className="text-[10px] text-purple-400 font-bold mt-0.5">{order.price}</div>
                         </td>
                         <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                               order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                               order.status === 'assigned' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                               'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            }`}>
                               <div className={`w-1 h-1 rounded-full ${
                                 order.status === 'pending' ? 'bg-yellow-500' :
                                 order.status === 'assigned' ? 'bg-purple-500' :
                                 'bg-emerald-500'
                               }`} />
                               {order.status}
                            </span>
                         </td>
                         <td className="px-6 py-5">
                            <div className="relative inline-block w-full max-w-[160px] group/select">
                                <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover/select:opacity-100 transition-opacity pointer-events-none" />
                                <select 
                                   onChange={(e) => onAssign(order.id, parseInt(e.target.value))}
                                   className="relative z-10 w-full bg-transparent border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:border-purple-500/50 outline-none appearance-none cursor-pointer transition-colors font-bold uppercase tracking-wider"
                                   value={order.assignedRepIndex !== undefined ? order.assignedRepIndex : ""}
                                >
                                   <option value="" disabled className="bg-[#0f0720]">Unassigned</option>
                                   {team.map((member, idx) => (
                                      <option key={idx} value={idx} className="bg-[#0f0720]">{member.name}</option>
                                   ))}
                                </select>
                                <ChevronRight size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 rotate-90 pointer-events-none" />
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

interface SupportChatProps {
  users: ChatUser[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  messages: ChatMessage[];
  reply: string;
  setReply: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
  isReplying: boolean;
  chatRef: React.RefObject<HTMLDivElement>;
  onBack?: () => void;
}

const SupportChat: React.FC<SupportChatProps> = ({ users, selectedId, onSelect, messages, reply, setReply, onSend, isReplying, chatRef, onBack }) => {
  const selectedUser = users.find(u => u.visitor_id === selectedId);

  return (
  <div className="flex h-full animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-[24px] sm:rounded-[32px] border border-white/10 bg-[#0f0720]/80 shadow-2xl backdrop-blur-xl relative">
    {/* Left Side - User List */}
    <div className={`flex flex-col border-r border-white/5 bg-black/20 ${selectedId ? 'hidden lg:flex w-full lg:w-80 shrink-0' : 'w-full lg:w-96 shrink-0'}`}>
       {/* Header */}
       <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
             <button 
                onClick={onBack}
                className="lg:hidden p-2 -ml-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all"
             >
                <ArrowLeft size={16} />
             </button>
             <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Encrypted Channels</h3>
          </div>
          <div className="relative group">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors" />
             <input 
               type="text" 
               placeholder="Search frequency..." 
               className="w-full bg-[#1a1025] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:border-purple-500/30 focus:bg-[#1f1230] outline-none transition-all placeholder-white/20" 
             />
          </div>
       </div>
       
       {/* List */}
       <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {users.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-white/20 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MessageSquare size={24} className="opacity-50" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest">No Signals Detected</p>
             </div>
          ) : (
             users.map((user) => (
                <button 
                  key={user.visitor_id}
                  onClick={() => onSelect(user.visitor_id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border relative group overflow-hidden ${
                     selectedId === user.visitor_id 
                     ? 'bg-purple-500/10 border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                     : 'hover:bg-white/[0.03] border-transparent hover:border-white/5'
                  }`}
                >
                   {/* Active Indicator */}
                   {selectedId === user.visitor_id && <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-purple-500 rounded-r-full shadow-[0_0_10px_#a855f7]"></div>}

                   <div className="flex items-center gap-3 relative z-10 pl-1.5">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border border-white/10 shrink-0 ${
                          selectedId === user.visitor_id 
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg' 
                            : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'
                      }`}>
                          {user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-0.5">
                             <span className={`text-xs font-bold truncate ${selectedId === user.visitor_id ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                {user.name}
                             </span>
                             <span className="text-[9px] font-mono text-white/20">
                                {user.lastTime ? new Date(user.lastTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                             </span>
                          </div>
                          <p className={`text-[10px] truncate ${selectedId === user.visitor_id ? 'text-purple-200/60' : 'text-white/30 group-hover:text-white/50'}`}>
                             {user.lastMessage || 'No messages yet'}
                          </p>
                      </div>
                   </div>
                </button>
             ))
          )}
       </div>
    </div>

    {/* Right Side - Chat Window */}
    <div className={`flex-1 flex flex-col overflow-hidden relative bg-[#0A0510]/50 ${!selectedId ? 'hidden lg:flex' : 'flex'}`}>
         {/* Decorative Background */}
         <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[100px]" />
         </div>

         {!selectedId ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20 p-8 text-center relative z-10">
               <div className="w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex items-center justify-center mb-8 shadow-2xl animate-pulse-slow">
                  <MessageSquare size={48} className="text-white/20" />
               </div>
               <h3 className="text-2xl font-display font-bold text-white/40 mb-2">Secure Uplink Standby</h3>
               <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/20 max-w-xs">Select a neural channel to begin transmission.</p>
            </div>
         ) : (
            <>
               {/* Instagram-like Header */}
               <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-white/5 bg-[#0f0720]/90 backdrop-blur-xl flex items-center justify-between z-20 shrink-0">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button 
                      onClick={onBack}
                      className="lg:hidden p-2 -ml-2 rounded-full hover:bg-white/10 text-white transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px] shadow-lg shadow-purple-500/20">
                         <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-br from-[#1a1025] to-[#0f0720] flex items-center justify-center text-xs sm:text-sm font-bold text-white">
                              {selectedUser?.name?.substring(0, 2).toUpperCase() || "US"}
                           </div>
                         </div>
                      </div>
                      <div className="flex flex-col">
                         <h3 className="font-display font-bold text-white text-sm sm:text-base flex items-center gap-2">
                           {selectedUser?.name || "Visitor"}
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981] animate-pulse"></div>
                         </h3>
                         <span className="text-[10px] text-white/40 font-medium tracking-wide">Active now</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-5 text-white/40">
                     <button className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Phone size={18} /></button>
                     <button className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Video size={18} /></button>
                     <button className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><Info size={18} /></button>
                  </div>
               </div>

               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar relative z-10">
                  <div className="flex justify-center mb-4">
                     <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Today</span>
                  </div>

                  {messages.map((msg, i) => (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.98 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       key={msg.id || i} 
                       className={`flex ${!msg.is_user ? 'justify-end' : 'justify-start'}`}
                     >
                        <div className={`max-w-[85%] sm:max-w-[70%] px-6 py-4 rounded-[24px] text-sm shadow-xl relative backdrop-blur-md border ${
                          !msg.is_user 
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-br-none border-purple-400/20 shadow-purple-900/20' 
                            : 'bg-[#1a1025]/80 text-white/90 rounded-bl-none border-white/10 shadow-black/20'
                        }`}>
                           <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                           <div className={`flex items-center gap-1.5 mt-2 opacity-40 text-[9px] font-black uppercase tracking-widest ${!msg.is_user ? 'justify-end' : 'justify-start'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {!msg.is_user && <Check size={10} />}
                           </div>
                        </div>
                     </motion.div>
                  ))}
                  <div ref={chatRef} />
               </div>

               {/* Input Area */}
               <div className="p-4 sm:p-6 border-t border-white/5 bg-[#0f0720]/80 backdrop-blur-xl relative z-20 flex flex-col gap-3">
                  <form onSubmit={onSend} className="relative flex items-end gap-3 max-w-4xl mx-auto w-full">
                     <button type="button" className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors mb-1">
                        <Plus size={20} />
                     </button>
                     
                     <div className="relative flex-1 group">
                        <textarea 
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              onSend(e);
                            }
                          }}
                          placeholder="Type secure message..."
                          rows={1}
                          className="w-full bg-[#1a1025] border border-white/10 rounded-[24px] pl-5 pr-12 py-3.5 text-sm text-white focus:border-purple-500/50 focus:bg-[#1f1230] outline-none shadow-inner placeholder-white/20 transition-all resize-none custom-scrollbar min-h-[48px] max-h-[120px]"
                        />
                        <div className="absolute right-2 bottom-2">
                           {reply.trim() ? (
                               <button 
                                 type="submit"
                                 disabled={!reply.trim() || isReplying}
                                 className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-white hover:shadow-lg disabled:opacity-30 transition-all active:scale-95"
                               >
                                  <Send size={16} className="ml-0.5" />
                               </button>
                           ) : (
                               <div className="p-2 text-white/30">
                                  <ImageIcon size={20} />
                               </div>
                           )}
                        </div>
                     </div>
                  </form>
               </div>
            </>
         )}
    </div>
  </div>
  );
};

export const AdminPanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { content, updateContent, saveFullContent, isLoading } = useContent();
  const { orders, assignRepresentative } = useOrder();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [localContent, setLocalContent] = useState<AppContent | null>(null);
  
  // Chat state
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reply, setReply] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const [isReplying, setIsReplying] = useState(false);

  // Sync content on open
  useEffect(() => {
    if (content && isOpen) {
      setLocalContent(JSON.parse(JSON.stringify(content)));
    }
  }, [content, isOpen]);

  // Fetch Unique Chat Users
  useEffect(() => {
    if (activeTab === 'support' && isOpen) {
        const fetchUsers = async () => {
            const { data: allChats } = await supabase
              .from('xevon_chats')
              .select('visitor_id, text, created_at, is_user')
              .order('created_at', { ascending: false });

            const { data: userNames } = await supabase
              .from('xevon_users')
              .select('visitor_id, name');

            if (allChats) {
                const unique = new Map<string, ChatUser>();
                allChats.forEach(m => {
                    if (!unique.has(m.visitor_id)) {
                        const name = userNames?.find(u => u.visitor_id === m.visitor_id)?.name || `Visitor ${m.visitor_id.substring(0, 4)}`;
                        unique.set(m.visitor_id, {
                            visitor_id: m.visitor_id,
                            name: name,
                            lastMessage: m.text,
                            lastTime: m.created_at
                        });
                    }
                });
                setChatUsers(Array.from(unique.values()));
            }
        };

        fetchUsers();
        const interval = setInterval(fetchUsers, 10000);
        return () => clearInterval(interval);
    }
  }, [activeTab, isOpen]);

  // Fetch Messages for Selected Chat
  useEffect(() => {
    if (selectedChatId) {
        const fetchMessages = async () => {
            const { data } = await supabase
              .from('xevon_chats')
              .select('*')
              .eq('visitor_id', selectedChatId)
              .order('created_at', { ascending: true });
            
            if (data) {
                setMessages(data);
                setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
            }
        };
        
        fetchMessages();

        const channel = supabase
          .channel(`admin_chat_${selectedChatId}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xevon_chats', filter: `visitor_id=eq.${selectedChatId}` }, (payload) => {
              setMessages(prev => [...prev, payload.new as ChatMessage]);
              setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          })
          .subscribe();

        return () => { supabase.removeChannel(channel); };
    }
  }, [selectedChatId]);

  const handleSendReply = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reply.trim() || !selectedChatId) return;
      setIsReplying(true);
      
      const { error } = await supabase
        .from('xevon_chats')
        .insert([{
            visitor_id: selectedChatId,
            text: reply,
            is_user: false
        }]);

      if (!error) {
          setReply('');
      }
      setIsReplying(false);
  };

  const handleSaveContent = async () => {
      if (localContent) {
          await saveFullContent(localContent);
          alert("Content Updated Successfully!");
      }
  };

  // --- Content Helper Functions ---
  const updateLocal = (section: keyof AppContent, field: string, value: any) => {
    if (!localContent) return;
    setLocalContent(prev => {
        if (!prev) return null;
        return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
  };

  const updateArrayItem = (section: keyof AppContent, arrayName: string, index: number, field: string, value: any) => {
    if (!localContent) return;
    setLocalContent(prev => {
        if (!prev) return null;
        const sectionData = { ...prev[section] } as any;
        const list = [...(sectionData[arrayName] || [])];
        if (list[index]) {
            list[index] = { ...list[index], [field]: value };
        }
        return { ...prev, [section]: { ...sectionData, [arrayName]: list } };
    });
  };

  const addArrayItem = (section: keyof AppContent, arrayName: string, newItem: any) => {
    if (!localContent) return;
    setLocalContent(prev => {
        if (!prev) return null;
        const sectionData = { ...prev[section] } as any;
        const list = [...(sectionData[arrayName] || [])];
        return { ...prev, [section]: { ...sectionData, [arrayName]: [...list, newItem] } };
    });
  };

  const removeArrayItem = (section: keyof AppContent, arrayName: string, index: number) => {
    if (!localContent) return;
    setLocalContent(prev => {
        if (!prev) return null;
        const sectionData = { ...prev[section] } as any;
        const list = (sectionData[arrayName] || []).filter((_: any, i: number) => i !== index);
        return { ...prev, [section]: { ...sectionData, [arrayName]: list } };
    });
  };

  const updateSocials = (section: keyof AppContent, memberIndex: number | null, platform: string, value: string) => {
    if (!localContent) return;
    setLocalContent(prev => {
        if (!prev) return null;
        const sectionData = { ...prev[section] } as any;
        if (memberIndex !== null) {
            const members = [...(sectionData.members || [])];
            if (members[memberIndex]) {
                members[memberIndex] = {
                    ...members[memberIndex],
                    socials: { ...(members[memberIndex].socials || {}), [platform]: value }
                };
            }
            return { ...prev, [section]: { ...sectionData, members } };
        } else {
            return {
                ...prev,
                [section]: { ...sectionData, socials: { ...(sectionData.socials || {}), [platform]: value } }
            };
        }
    });
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: Layout },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'support', label: 'Live Support', icon: MessageSquare },
    { type: 'divider', label: 'Content Management' },
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio', icon: ImageIcon },
    { id: 'pricing', label: 'Pricing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { type: 'divider', label: 'System' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-7xl h-[90vh] bg-[#05020a] border border-white/10 rounded-[40px] shadow-2xl flex overflow-hidden"
        >
          {/* Sidebar */}
          <div className="w-20 lg:w-72 bg-[#0a0514] border-r border-white/5 flex flex-col shrink-0 relative z-20">
             <div className="p-6 lg:p-8 flex items-center gap-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
                   <Shield className="text-white fill-white/20" size={20} />
                </div>
                <div className="hidden lg:block">
                   <h2 className="text-lg font-display font-bold text-white tracking-wide">Admin Core</h2>
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Xevon System v2.0</p>
                </div>
             </div>
             
             <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {tabs.map((tab, i) => {
                   if (tab.type === 'divider') {
                       return <div key={i} className="hidden lg:block px-4 pt-4 pb-2 text-[10px] text-white/20 uppercase font-black tracking-[0.2em]">{tab.label}</div>
                   }
                   const Icon = tab.icon!;
                   return (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id!)}
                     className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                        activeTab === tab.id 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                     }`}
                   >
                      <Icon size={22} className={`transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                      <span className="hidden lg:block font-bold text-sm tracking-wide">{tab.label}</span>
                      {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white hidden lg:block" />}
                   </button>
                   );
                })}
             </div>

             <div className="p-4 lg:p-8 border-t border-white/5">
                <button onClick={onClose} className="w-full flex items-center justify-center lg:justify-start gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-sm">
                   <LogOut size={20} />
                   <span className="hidden lg:inline">Disconnect</span>
                </button>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 relative flex flex-col min-w-0 bg-gradient-to-br from-[#05020a] to-[#0f0720]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
              
              {/* Top Bar */}
              <div className="h-20 lg:h-24 px-8 border-b border-white/5 flex items-center justify-between shrink-0 relative z-10">
                 <div>
                    <h1 className="text-2xl font-display font-bold text-white capitalize">{tabs.find(t => t.id === activeTab)?.label}</h1>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">System Optimal</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    {['dashboard', 'orders', 'support', 'settings'].indexOf(activeTab) === -1 && (
                       <button onClick={handleSaveContent} className="px-6 py-2.5 bg-white text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-400 transition-colors flex items-center gap-2 shadow-lg shadow-white/10">
                          <Save size={16} /> Save Changes
                       </button>
                    )}
                 </div>
              </div>

              {/* Scrollable Workspace */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 relative z-10">
                 
                 {/* Dashboard View */}
                 {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in duration-500">
                       <div className="col-span-full mb-4">
                          <h3 className="text-xl font-bold text-white mb-2">Welcome back, Commander.</h3>
                          <p className="text-white/50">Here is what's happening in your digital ecosystem today.</p>
                       </div>
                       
                       <SectionBlock title="Total Traffic">
                          <div className="flex items-end justify-between">
                             <div>
                                <h4 className="text-4xl font-display font-bold text-white">128.5k</h4>
                                <p className="text-emerald-400 text-sm font-bold flex items-center gap-1 mt-1"><ArrowLeft size={12} className="rotate-90" /> +12% this week</p>
                             </div>
                             <Activity size={48} className="text-purple-500/20" />
                          </div>
                       </SectionBlock>

                       <SectionBlock title="Active Orders">
                           <div className="flex items-end justify-between">
                             <div>
                                <h4 className="text-4xl font-display font-bold text-white">{orders.filter(o => o.status !== 'completed').length}</h4>
                                <p className="text-yellow-400 text-sm font-bold mt-1">Pending Actions</p>
                             </div>
                             <ShoppingBag size={48} className="text-yellow-500/20" />
                          </div>
                       </SectionBlock>

                       <SectionBlock title="Support Queries">
                           <div className="flex items-end justify-between">
                             <div>
                                <h4 className="text-4xl font-display font-bold text-white">{chatUsers.length}</h4>
                                <p className="text-blue-400 text-sm font-bold mt-1">Active Channels</p>
                             </div>
                             <MessageSquare size={48} className="text-blue-500/20" />
                          </div>
                       </SectionBlock>
                    </div>
                 )}

                 {/* Company Info */}
                 {activeTab === 'company' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                       <SectionBlock title="Company Identity">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <InputField label="Company Name" value={localContent.company.name} onChange={(v) => updateLocal('company', 'name', v)} icon={Building} />
                             <ImageUploadField label="Logo URL" value={localContent.company.logo || ''} onChange={(v) => updateLocal('company', 'logo', v)} />
                             <div className="md:col-span-2">
                                <TextArea label="About Description" value={localContent.company.description} onChange={(v) => updateLocal('company', 'description', v)} rows={3} />
                             </div>
                             <InputField label="Email" value={localContent.company.email} onChange={(v) => updateLocal('company', 'email', v)} />
                             <InputField label="Phone" value={localContent.company.phone} onChange={(v) => updateLocal('company', 'phone', v)} />
                             <InputField label="WhatsApp" value={localContent.company.whatsapp} onChange={(v) => updateLocal('company', 'whatsapp', v)} />
                             <InputField label="Address" value={localContent.company.address} onChange={(v) => updateLocal('company', 'address', v)} />
                             <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1 mb-2 block">Social Links</label>
                                <SocialsManager socials={localContent.company.socials} onChange={(platform, value) => {
                                   updateSocials('company', null, platform, value);
                                }} />
                             </div>
                          </div>
                       </SectionBlock>
                    </div>
                 )}

                 {/* Hero Section */}
                 {activeTab === 'hero' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                       <SectionBlock title="Hero Section">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <InputField label="Tagline" value={localContent.hero.tagline} onChange={(v) => updateLocal('hero', 'tagline', v)} icon={Sparkles} />
                             <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                <InputField label="Title Line 1" value={localContent.hero.titleLine1} onChange={(v) => updateLocal('hero', 'titleLine1', v)} />
                                <InputField label="Title Line 2" value={localContent.hero.titleLine2} onChange={(v) => updateLocal('hero', 'titleLine2', v)} />
                             </div>
                             <div className="md:col-span-2">
                                <TextArea label="Description" value={localContent.hero.description} onChange={(v) => updateLocal('hero', 'description', v)} />
                             </div>
                             <InputField label="CTA Primary" value={localContent.hero.ctaPrimary} onChange={(v) => updateLocal('hero', 'ctaPrimary', v)} />
                             <InputField label="CTA Secondary" value={localContent.hero.ctaSecondary} onChange={(v) => updateLocal('hero', 'ctaSecondary', v)} />
                          </div>
                       </SectionBlock>
                    </div>
                 )}

                 {/* Services Section */}
                 {activeTab === 'services' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                            <div>
                               <h3 className="text-xl font-display font-bold text-white">Services</h3>
                               <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Operational Capacities</p>
                            </div>
                            <button onClick={() => addArrayItem('services', 'items', { title: 'New Service', description: 'Description here...' })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"><Plus size={16} /> Add Service</button>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            {(localContent.services.items || []).map((s, i) => (
                                <SectionBlock key={i} title={`Service #${i + 1}`}>
                                    <div className="flex justify-end mb-4"><button onClick={() => removeArrayItem('services', 'items', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                                    <div className="space-y-6">
                                        <InputField label="Service Title" value={s.title} onChange={v => updateArrayItem('services', 'items', i, 'title', v)} />
                                        <TextArea label="Description" value={s.description} onChange={v => updateArrayItem('services', 'items', i, 'description', v)} />
                                    </div>
                                </SectionBlock>
                            ))}
                        </div>
                    </div>
                 )}

                 {/* Portfolio Section */}
                 {activeTab === 'portfolio' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                            <div>
                               <h3 className="text-xl font-display font-bold text-white">Portfolio</h3>
                               <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Project Showcase</p>
                            </div>
                            <button onClick={() => addArrayItem('portfolio', 'items', { id: Date.now(), title: 'New Project', category: 'Web Design', image: '' })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"><Plus size={16} /> Add Project</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(localContent.portfolio.items || []).map((p, i) => (
                                <SectionBlock key={i} title={`Project #${i + 1}`}>
                                    <div className="flex justify-end mb-4"><button onClick={() => removeArrayItem('portfolio', 'items', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                                    <ImageUploadField label="Project Image" value={p.image} onChange={v => updateArrayItem('portfolio', 'items', i, 'image', v)} />
                                    <div className="grid grid-cols-1 gap-6 mt-6">
                                        <InputField label="Project Title" value={p.title} onChange={v => updateArrayItem('portfolio', 'items', i, 'title', v)} />
                                        <InputField label="Category" value={p.category} onChange={v => updateArrayItem('portfolio', 'items', i, 'category', v)} />
                                    </div>
                                </SectionBlock>
                            ))}
                        </div>
                    </div>
                 )}

                 {/* Pricing Section */}
                 {activeTab === 'pricing' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                         <div className="p-6 bg-white/[0.03] rounded-[28px] border border-white/10">
                            <h3 className="text-xl font-display font-bold text-white">Pricing Plans</h3>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Value Packages</p>
                         </div>
                         <div className="grid grid-cols-1 gap-8">
                            {(localContent.pricing.packages || []).map((pkg, i) => (
                                <SectionBlock key={i} title={pkg.name}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Package Name" value={pkg.name} onChange={v => updateArrayItem('pricing', 'packages', i, 'name', v)} />
                                        <InputField label="Price" value={pkg.price} onChange={v => updateArrayItem('pricing', 'packages', i, 'price', v)} />
                                        <div className="md:col-span-2">
                                            <TextArea label="Description" value={pkg.description} onChange={v => updateArrayItem('pricing', 'packages', i, 'description', v)} rows={2} />
                                        </div>
                                    </div>
                                    {/* Simplified feature editing could go here if needed */}
                                </SectionBlock>
                            ))}
                         </div>
                    </div>
                 )}

                 {/* Team Section */}
                 {activeTab === 'team' && localContent && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
                        <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                            <div>
                               <h3 className="text-xl font-display font-bold text-white">Team Members</h3>
                               <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Human Assets</p>
                            </div>
                            <button onClick={() => addArrayItem('team', 'members', { name: 'New Agent', role: 'Role', image: '', socials: {} })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all"><Plus size={16} /> Add Member</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {(localContent.team.members || []).map((m, i) => (
                                <SectionBlock key={i} title={m.name}>
                                    <div className="flex justify-end mb-4"><button onClick={() => removeArrayItem('team', 'members', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                                    <ImageUploadField label="Profile Image" value={m.image} onChange={v => updateArrayItem('team', 'members', i, 'image', v)} />
                                    <div className="grid grid-cols-1 gap-6 mt-8">
                                        <InputField label="Name" value={m.name} onChange={v => updateArrayItem('team', 'members', i, 'name', v)} />
                                        <InputField label="Role" value={m.role} onChange={v => updateArrayItem('team', 'members', i, 'role', v)} />
                                        <InputField label="WhatsApp" value={m.whatsapp || ''} onChange={v => updateArrayItem('team', 'members', i, 'whatsapp', v)} icon={MessageSquare} />
                                        <TextArea label="Bio" value={m.bio || ''} onChange={v => updateArrayItem('team', 'members', i, 'bio', v)} />
                                    </div>
                                    <div className="mt-10 border-t border-white/5 pt-10">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-5 block">Social Links</label>
                                        <SocialsManager socials={m.socials || {}} onChange={(p, v) => updateSocials('team', i, p, v)} />
                                    </div>
                                </SectionBlock>
                            ))}
                        </div>
                    </div>
                 )}

                 {/* Orders View */}
                 {activeTab === 'orders' && (
                    <OrdersView orders={orders} team={content.team.members} onAssign={assignRepresentative} />
                 )}

                 {/* Support View */}
                 {activeTab === 'support' && (
                    <div className="h-[calc(100vh-14rem)]">
                       <SupportChat 
                          users={chatUsers} 
                          selectedId={selectedChatId} 
                          onSelect={setSelectedChatId}
                          messages={messages}
                          reply={reply}
                          setReply={setReply}
                          onSend={handleSendReply}
                          isReplying={isReplying}
                          chatRef={chatRef}
                          onBack={() => setSelectedChatId(null)}
                       />
                    </div>
                 )}

                 {/* Settings View */}
                 {activeTab === 'settings' && (
                    <div className="max-w-2xl mx-auto space-y-6 animate-in zoom-in-95 duration-500">
                       <SectionBlock title="Admin Device Link">
                          <div className="flex items-center justify-between">
                             <div>
                                <h4 className="text-white font-bold mb-1">Push Notifications</h4>
                                <p className="text-sm text-white/50 max-w-sm">Connect this device to receive real-time alerts for new orders and chat messages.</p>
                             </div>
                             <button 
                               onClick={() => subscribeAdminDevice().then(token => token && alert("Device Connected!"))}
                               className="px-6 py-3 bg-white/5 hover:bg-purple-600 border border-white/10 hover:border-purple-500 rounded-xl text-white font-bold transition-all flex items-center gap-2"
                             >
                                <Bell size={18} /> Connect Device
                             </button>
                          </div>
                       </SectionBlock>
                    </div>
                 )}
              </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
