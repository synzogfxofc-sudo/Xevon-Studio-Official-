
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
  Bell, Clock, Zap, Activity
} from 'lucide-react';
import { useContent, AppContent } from '../contexts/ContentContext';
import { useOrder } from '../contexts/OrderContext';
import { supabase } from '../supabase';
import { ChatMessage, Order, TeamMember } from '../types';
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

const SupportChat: React.FC<SupportChatProps> = ({ users, selectedId, onSelect, messages, reply, setReply, onSend, isReplying, chatRef, onBack }) => (
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
               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar relative z-10">
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
                          className="w-full bg-[#1a1025] border border-white/10 rounded-2xl pl-5 pr-12 py-4 text-sm text-white focus:border-purple-500/50 focus:bg-[#1f1230] outline-none shadow-inner placeholder-white/20 transition-all resize-none custom-scrollbar min-h-[56px] max-h-[120px]"
                        />
                        <div className="absolute right-3 bottom-3">
                           <button 
                             type="submit"
                             disabled={!reply.trim() || isReplying}
                             className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] disabled:opacity-30 disabled:shadow-none transition-all shadow-lg active:scale-95 flex items-center justify-center"
                           >
                              {isReplying ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send size={16} />}
                           </button>
                        </div>
                     </div>
                  </form>

                  <button 
                    onClick={() => onSelect(null)}
                    className="lg:hidden w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 group"
                  >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Inbox
                  </button>
               </div>
            </>
         )}
    </div>
  </div>
);

// --- Main Panel Component ---

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatUser {
  visitor_id: string;
  name: string;
  lastMessage?: string;
  lastTime?: string;
}

const MENU_ITEMS = [
  { id: 'orders', label: 'Nodes Pipeline', icon: ShoppingBag },
  { id: 'support', label: 'Neural Comms', icon: MessageSquare },
  { id: 'notifications', label: 'Push Alerts', icon: Bell },
  { type: 'divider', label: 'Core Content' },
  { id: 'company', label: 'Brand Profile', icon: Building },
  { id: 'hero', label: 'Hero Nexus', icon: Layout },
  { id: 'services', label: 'Specializations', icon: Briefcase },
  { id: 'portfolio', label: 'Visual Archive', icon: ImageIcon },
  { id: 'pricing', label: 'Value Plans', icon: CreditCard },
  { id: 'team', label: 'Human Assets', icon: Users },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { content, saveFullContent } = useContent();
  const { orders, assignRepresentative } = useOrder();
  const [activeTab, setActiveTab] = useState('orders');
  const [tempContent, setTempContent] = useState<AppContent>(content);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Chat State
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [currentChatMessages, setCurrentChatMessages] = useState<ChatMessage[]>([]);
  const [adminReply, setAdminReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Notifications State
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  useEffect(() => {
    if (isOpen) setTempContent(content);
  }, [content, isOpen]);

  // Fetch Chat Users and Subscribe for Updates (Side List)
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchChatUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('xevon_chats')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const userMap = new Map<string, ChatUser>();
        data.forEach(msg => {
          if (!userMap.has(msg.visitor_id)) {
            userMap.set(msg.visitor_id, {
              visitor_id: msg.visitor_id,
              name: `Visitor ${msg.visitor_id.substring(0, 8)}`,
              lastMessage: msg.text,
              lastTime: msg.created_at
            });
          }
        });

        const visitorIds = Array.from(userMap.keys());
        const { data: userData } = await supabase
          .from('xevon_users')
          .select('visitor_id, name')
          .in('visitor_id', visitorIds);

        if (userData) {
          userData.forEach(u => {
            const entry = userMap.get(u.visitor_id);
            if (entry) entry.name = u.name;
          });
        }

        setChatUsers(Array.from(userMap.values()));
      } catch (err) {
        console.error("Failed to fetch chat users:", err);
      }
    };

    fetchChatUsers();
    
    // Subscribe to new messages to update the list preview
    const channel = supabase
      .channel('admin_all_chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'xevon_chats' }, () => {
        // Debounced fetch or simple refetch
        fetchChatUsers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Fetch specific messages & Realtime Subscription for Active Chat
  useEffect(() => {
    if (!selectedVisitorId) {
      setCurrentChatMessages([]);
      return;
    }

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('xevon_chats')
        .select('*')
        .eq('visitor_id', selectedVisitorId)
        .order('created_at', { ascending: true });
      
      if (data) {
        setCurrentChatMessages(data);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    };

    fetchMessages();

    // Unique channel per active visitor to avoid conflicts
    const channel = supabase
      .channel(`admin_chat_view_${selectedVisitorId}`)
      .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'xevon_chats', 
            filter: `visitor_id=eq.${selectedVisitorId}` 
          }, 
          (payload) => {
            const newMessage = payload.new as ChatMessage;
            setCurrentChatMessages(prev => {
              // Prevent duplicates
              if (prev.some(m => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
            setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
          })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedVisitorId]);

  // --- State Manipulation Handlers ---

  const updateField = (section: keyof AppContent, field: string, value: any) => {
    setTempContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const updateItemInArray = (section: keyof AppContent, arrayName: string, index: number, field: string, value: any) => {
    setTempContent(prev => {
      const sectionData = { ...prev[section] } as any;
      const list = [...(sectionData[arrayName] || [])];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
      }
      return { ...prev, [section]: { ...sectionData, [arrayName]: list } };
    });
  };

  const addItemToArray = (section: keyof AppContent, arrayName: string, newItem: any) => {
    setTempContent(prev => {
      const sectionData = { ...prev[section] } as any;
      const list = [...(sectionData[arrayName] || [])];
      return { ...prev, [section]: { ...sectionData, [arrayName]: [...list, newItem] } };
    });
  };

  const removeItemFromArray = (section: keyof AppContent, arrayName: string, index: number) => {
    setTempContent(prev => {
      const sectionData = { ...prev[section] } as any;
      const list = (sectionData[arrayName] || []).filter((_: any, i: number) => i !== index);
      return { ...prev, [section]: { ...sectionData, [arrayName]: list } };
    });
  };

  const updateSocials = (section: keyof AppContent, memberIndex: number | null, platform: string, value: string) => {
    setTempContent(prev => {
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

  const handleSave = async () => {
    setIsLoading(true);
    await saveFullContent(tempContent);
    setIsLoading(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '@xevon.ad2026') setIsAuthenticated(true);
    else alert('Invalid security key');
  };

  const handleEnableNotifications = async () => {
    setIsSubscribing(true);
    await subscribeAdminDevice();
    setIsSubscribing(false);
  };

  const handleTestNotification = async () => {
    setIsSendingTest(true);
    await sendAdminNotification("System Alert", "Quantum uplink verified. Push notifications operational.");
    setIsSendingTest(false);
  };

  const handleAdminSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReply.trim() || !selectedVisitorId) return;
    setIsReplying(true);
    
    const { error } = await supabase
      .from('xevon_chats')
      .insert([{ 
        visitor_id: selectedVisitorId, 
        text: adminReply.trim(), 
        is_user: false 
      }]);
      
    if (!error) {
      setAdminReply("");
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
    setIsReplying(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center font-sans overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-2xl" onClick={onClose} />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full h-[100dvh] sm:h-[90vh] sm:max-w-[1400px] bg-[#0A0510] sm:border sm:border-white/10 sm:rounded-[36px] flex flex-col overflow-hidden z-10 shadow-[0_0_120px_rgba(168,85,247,0.2)]"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {!isAuthenticated ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative z-20">
             <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="w-24 h-24 rounded-3xl bg-[#0f0720] border border-white/10 flex items-center justify-center relative shadow-2xl">
                    <Shield size={48} className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                </div>
             </div>
             <h2 className="text-4xl font-display font-bold text-white mb-2 tracking-tight">Restricted Node</h2>
             <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-12">Neural Authentication Required</p>
             
             <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5">
               <div className="relative group">
                  <div className="absolute inset-0 bg-purple-500/10 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                  <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple-400 transition-colors z-10" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="SECURITY KEY" 
                    className="relative z-10 w-full bg-[#120b1d] border border-white/10 rounded-2xl pl-12 pr-4 py-5 text-white text-center focus:border-purple-500/50 outline-none transition-all tracking-[0.5em] font-mono text-xs placeholder-white/10 focus:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
                    autoFocus
                  />
               </div>
               <button className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.3em] text-[10px] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all duration-300">
                  Initialize Link
               </button>
               <button type="button" onClick={onClose} className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-6 hover:text-white/50 transition-colors">Abort Access</button>
             </form>
          </div>
        ) : (
          <div className="flex h-full relative z-20">
            <AnimatePresence>
              {(isSidebarOpen || window.innerWidth >= 1024) && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="lg:hidden absolute inset-0 bg-black/60 backdrop-blur-md z-[100]"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                  <motion.div 
                    initial={{ x: -280 }}
                    animate={{ x: 0 }}
                    exit={{ x: -280 }}
                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                    className="absolute lg:relative w-[300px] h-full border-r border-white/5 flex flex-col bg-[#0A0510]/95 lg:bg-transparent z-[110] backdrop-blur-3xl lg:backdrop-blur-none"
                  >
                    <div className="p-10 flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(168,85,247,0.2)] bg-black relative group">
                          <img src="https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                       </div>
                       <div>
                          <h3 className="font-display font-bold text-white text-base tracking-widest uppercase">Xevon Core</h3>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Online</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1.5 custom-scrollbar">
                      {MENU_ITEMS.map((item, i) => {
                        if (item.type === 'divider') {
                          return (
                            <div key={i} className="px-5 pt-8 pb-3 text-[9px] text-white/20 uppercase font-black tracking-[0.3em] border-t border-white/5 mt-4">{item.label}</div>
                          );
                        }
                        const Icon = item.icon;
                        const SafeIcon = Icon ? <Icon size={18} className={`transition-colors duration-300 ${activeTab === item.id ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-white/40 group-hover:text-white'}`} /> : null;

                        return (
                          <button 
                            key={item.id} 
                            onClick={() => {
                              setActiveTab(item.id!);
                              if (item.id === 'support') setSelectedVisitorId(null);
                              if (window.innerWidth < 1024) setIsSidebarOpen(false);
                            }} 
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all relative group overflow-hidden duration-300 ${
                              activeTab === item.id 
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_8px_25px_rgba(168,85,247,0.25)]' 
                                : 'text-white/40 hover:bg-white/[0.04] hover:text-white'
                            }`}
                          >
                            {SafeIcon}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            {activeTab === item.id && (
                              <motion.div layoutId="activeTab" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full shadow-[0_0_10px_white]" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-8 border-t border-white/5">
                      <button onClick={onClose} className="w-full flex items-center gap-4 px-5 py-4 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all group">
                        <LogOut size={18} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0 bg-[#0A0510]/50 overflow-hidden relative">
              {/* Context-Aware Header Navigation */}
              <div className="h-24 border-b border-white/5 flex items-center justify-between px-6 sm:px-10 shrink-0 bg-[#0A0510]/40 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                      if (activeTab === 'support' && selectedVisitorId) {
                        setSelectedVisitorId(null);
                      } else {
                        setIsSidebarOpen(true);
                      }
                    }}
                    className="flex items-center gap-2 p-3 -ml-2 text-white/50 hover:text-white hover:bg-white/5 rounded-xl transition-all lg:hidden"
                  >
                    {(activeTab === 'support' && selectedVisitorId) ? (
                      <ArrowLeft size={22} />
                    ) : (
                      <Menu size={22} />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-3xl font-display font-bold text-white uppercase tracking-widest truncate max-w-[200px] sm:max-w-none drop-shadow-lg">
                      {activeTab === 'support' && selectedVisitorId 
                        ? (chatUsers.find(u => u.visitor_id === selectedVisitorId)?.name || "Neural Comms")
                        : (MENU_ITEMS.find(m => m.id === activeTab)?.label || activeTab)}
                    </h2>
                    {activeTab === 'support' && selectedVisitorId && (
                      <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest leading-none mt-1 animate-pulse">Live Link Established</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {['orders', 'support', 'notifications'].indexOf(activeTab) === -1 && (
                    <button 
                      onClick={handleSave} 
                      disabled={isLoading} 
                      className="px-6 sm:px-8 py-3.5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-purple-600 hover:text-white hover:shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 flex items-center gap-3 relative overflow-hidden group duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer" />
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      <span className="hidden sm:inline">Sync Changes</span>
                      <span className="sm:hidden">Sync</span>
                    </button>
                  )}
                  <button onClick={onClose} className="w-12 h-12 flex items-center justify-center text-white/30 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/10"><X size={20} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-10 custom-scrollbar relative z-10">
                <div className="max-w-6xl mx-auto pb-10 h-full flex flex-col">
                  {activeTab === 'orders' && <OrdersView orders={orders} team={tempContent.team.members || []} onAssign={assignRepresentative} />}
                  
                  {activeTab === 'support' && (
                    <div className="flex-1 h-full min-h-0">
                      <SupportChat 
                        users={chatUsers} 
                        selectedId={selectedVisitorId} 
                        onSelect={setSelectedVisitorId} 
                        messages={currentChatMessages} 
                        reply={adminReply} 
                        setReply={setAdminReply} 
                        onSend={handleAdminSend} 
                        isReplying={isReplying}
                        chatRef={chatEndRef}
                        onBack={() => setIsSidebarOpen(true)}
                      />
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <SectionBlock title="Alert Management">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4">
                          <div className="flex-1">
                             <h4 className="text-white font-bold mb-2 text-lg">FCM Push Protocol</h4>
                             <p className="text-white/40 text-sm leading-relaxed max-w-lg">Initialize a secure connection to receive real-time neural alerts for orders and comms directly on this node. Ensure notifications are allowed in browser settings.</p>
                          </div>
                          <div className="flex gap-4 w-full sm:w-auto">
                            <button onClick={handleTestNotification} disabled={isSendingTest} className="flex-1 sm:flex-none px-6 py-4 rounded-2xl bg-white/5 text-white/50 text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 hover:text-white transition-all disabled:opacity-50">Test Uplink</button>
                            <button onClick={handleEnableNotifications} disabled={isSubscribing} className="flex-1 sm:flex-none px-8 py-4 rounded-2xl bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] active:scale-95 transition-all disabled:opacity-50">Connect Device</button>
                          </div>
                        </div>
                      </SectionBlock>
                    </div>
                  )}

                  {activeTab === 'company' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                      <SectionBlock title="Master Identity">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          <InputField label="Brand Name" value={tempContent.company.name} onChange={v => updateField('company', 'name', v)} />
                          <InputField label="WhatsApp Tunnel" value={tempContent.company.whatsapp} onChange={v => updateField('company', 'whatsapp', v)} icon={MessageSquare} />
                          <InputField label="Public Email" value={tempContent.company.email} onChange={v => updateField('company', 'email', v)} icon={Globe} />
                          <InputField label="HQ Coordinates" value={tempContent.company.address} onChange={v => updateField('company', 'address', v)} icon={Building} />
                        </div>
                        <div className="mt-8">
                          <TextArea label="Brand Narrative" value={tempContent.company.description} onChange={v => updateField('company', 'description', v)} />
                        </div>
                      </SectionBlock>
                      <SectionBlock title="Convergence Points">
                        <SocialsManager socials={tempContent.company.socials || {}} onChange={(p, v) => updateSocials('company', null, p, v)} />
                      </SectionBlock>
                    </div>
                  )}

                  {activeTab === 'hero' && (
                    <SectionBlock title="Neural Interface">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <InputField label="Atmospheric Tagline" value={tempContent.hero.tagline} onChange={v => updateField('hero', 'tagline', v)} />
                        <InputField label="Vector Header P1" value={tempContent.hero.titleLine1} onChange={v => updateField('hero', 'titleLine1', v)} />
                        <InputField label="Vector Header P2" value={tempContent.hero.titleLine2} onChange={v => updateField('hero', 'titleLine2', v)} />
                        <InputField label="Core Call-to-Action" value={tempContent.hero.ctaPrimary} onChange={v => updateField('hero', 'ctaPrimary', v)} />
                      </div>
                      <div className="mt-8">
                        <TextArea label="Mission Manifest" value={tempContent.hero.description} onChange={v => updateField('hero', 'description', v)} />
                      </div>
                    </SectionBlock>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                      <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                        <div>
                           <h3 className="text-xl font-display font-bold text-white">Service Matrix</h3>
                           <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Core Operational Capacities</p>
                        </div>
                        <button onClick={() => addItemToArray('services', 'items', { title: 'NEW CAPABILITY', description: 'Enter capacity description...' })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all"><Plus size={16} /> Add Module</button>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {(tempContent.services.items || []).map((s, i) => (
                          <SectionBlock key={i} title={`Capability Cluster #${i + 1}`}>
                            <div className="flex justify-end mb-4"><button onClick={() => removeItemFromArray('services', 'items', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                            <div className="space-y-6">
                               <InputField label="Cluster Name" value={s.title} onChange={v => updateItemInArray('services', 'items', i, 'title', v)} />
                               <TextArea label="Operational Description" value={s.description} onChange={v => updateItemInArray('services', 'items', i, 'description', v)} />
                            </div>
                          </SectionBlock>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'portfolio' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                      <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                        <div>
                           <h3 className="text-xl font-display font-bold text-white">Visual Archive</h3>
                           <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Proof of Innovation</p>
                        </div>
                        <button onClick={() => addItemToArray('portfolio', 'items', { id: Date.now(), title: 'NEW ARCHIVE', category: 'CATEGORY', image: '' })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all"><Plus size={16} /> New Asset</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(tempContent.portfolio.items || []).map((p, i) => (
                          <SectionBlock key={i} title={`Archive Node #${i + 1}`}>
                            <div className="flex justify-end mb-4"><button onClick={() => removeItemFromArray('portfolio', 'items', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                            <ImageUploadField label="Archive Preview" value={p.image} onChange={v => updateItemInArray('portfolio', 'items', i, 'image', v)} />
                            <div className="grid grid-cols-1 gap-6 mt-6">
                              <InputField label="Asset Identifier" value={p.title} onChange={v => updateItemInArray('portfolio', 'items', i, 'title', v)} />
                              <InputField label="Classification" value={p.category} onChange={v => updateItemInArray('portfolio', 'items', i, 'category', v)} />
                            </div>
                          </SectionBlock>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'team' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                      <div className="flex justify-between items-center bg-white/[0.03] p-6 rounded-[28px] border border-white/10 backdrop-blur-md shadow-lg">
                        <div>
                           <h3 className="text-xl font-display font-bold text-white">Neural Units</h3>
                           <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Human Intelligence Assets</p>
                        </div>
                        <button onClick={() => addItemToArray('team', 'members', { name: 'NEW AGENT', role: 'SPECIALIST', image: '', socials: {} })} className="px-6 py-3 bg-purple-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95 transition-all"><Plus size={16} /> Deploy Agent</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(tempContent.team.members || []).map((m, i) => (
                          <SectionBlock key={i} title={m.name}>
                            <div className="flex justify-end mb-4"><button onClick={() => removeItemFromArray('team', 'members', i)} className="p-2.5 text-white/20 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"><Trash2 size={18}/></button></div>
                            <ImageUploadField label="Asset Profile Image" value={m.image} onChange={v => updateItemInArray('team', 'members', i, 'image', v)} />
                            <div className="grid grid-cols-1 gap-6 mt-8">
                              <InputField label="Agent Identity" value={m.name} onChange={v => updateItemInArray('team', 'members', i, 'name', v)} />
                              <InputField label="Operational Role" value={m.role} onChange={v => updateItemInArray('team', 'members', i, 'role', v)} />
                            </div>
                            <div className="mt-10 border-t border-white/5 pt-10">
                              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-5 block">Social Link Convergences</label>
                              <SocialsManager socials={m.socials || {}} onChange={(p, v) => updateSocials('team', i, p, v)} />
                            </div>
                          </SectionBlock>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
