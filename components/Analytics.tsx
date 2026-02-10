
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { AnalyticsData } from '../types';
import { Activity, Users, Eye, TrendingUp, Zap, Globe, Smartphone, Wifi, Server, MapPin, ArrowUpRight } from 'lucide-react';
import { supabase } from '../supabase';

const data: AnalyticsData[] = [
  { name: '00:00', visitors: 120, pageViews: 450 },
  { name: '04:00', visitors: 80, pageViews: 200 },
  { name: '08:00', visitors: 450, pageViews: 1200 },
  { name: '12:00', visitors: 980, pageViews: 2800 },
  { name: '16:00', visitors: 1400, pageViews: 3900 },
  { name: '20:00', visitors: 1100, pageViews: 3100 },
  { name: '23:59', visitors: 600, pageViews: 1800 },
];

const regions = [
  { country: "United States", value: 45, color: "bg-purple-500" },
  { country: "Germany", value: 24, color: "bg-blue-500" },
  { country: "Japan", value: 18, color: "bg-pink-500" },
  { country: "Brazil", value: 13, color: "bg-emerald-500" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const visitors = payload[0];
    const views = payload[1];

    return (
      <div className="bg-black/90 border border-white/10 backdrop-blur-2xl p-3 rounded-xl shadow-2xl ring-1 ring-white/10">
        <p className="font-display font-bold text-white/50 text-[9px] uppercase tracking-widest mb-2">{label}</p>
        <div className="space-y-1.5">
          {visitors && (
            <div className="flex items-center gap-3 min-w-[100px] justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                <span className="text-[10px] font-medium text-white/80">Visitors</span>
              </div>
              <span className="text-[11px] font-bold text-white tabular-nums">{visitors.value}</span>
            </div>
          )}
          {views && (
            <div className="flex items-center gap-3 min-w-[100px] justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
                <span className="text-[10px] font-medium text-white/80">Views</span>
              </div>
              <span className="text-[11px] font-bold text-white tabular-nums">{views.value}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('24h');
  const [totalVisits, setTotalVisits] = useState(0);
  const [activeUsers, setActiveUsers] = useState(128);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('xevon_content')
          .select('data')
          .eq('section', 'site_stats')
          .single();

        if (data && data.data) {
          setTotalVisits(data.data.total_visits || 0);
        }
      } catch (e) {}
    };

    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
      setActiveUsers(prev => Math.max(100, prev + Math.floor(Math.random() * 11) - 5));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="analytics" className="py-20 relative overflow-hidden bg-black/20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[400px] bg-purple-900/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md mb-3">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
               <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Global Live Feed</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-1">Ecosystem Pulse</h2>
            <p className="text-white/30 text-xs md:text-sm max-w-md">Streaming real-time engagement vectors.</p>
          </motion.div>
          
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-xl shadow-xl"
          >
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-0.5">Total Connections</span>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-display font-bold text-white tabular-nums tracking-tight">{totalVisits.toLocaleString()}</span>
                   <ArrowUpRight className="text-emerald-400" size={14} />
                </div>
             </div>
             <div className="w-px h-8 bg-white/10 mx-1"></div>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-0.5">Active Now</span>
                <div className="flex items-center gap-2">
                   <span className="text-xl font-display font-bold text-purple-400 tabular-nums tracking-tight">{activeUsers}</span>
                </div>
             </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Reduced height from 320px to 260px for a more compact UI */}
            <GlassCard className="h-[260px] flex flex-col p-0 overflow-hidden border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl">
               <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2.5">
                     <div className="p-1.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <Activity size={14} className="text-purple-400" />
                     </div>
                     <span className="text-xs font-bold text-white tracking-wide">Traffic Velocity</span>
                  </div>
                  <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                     {['1h', '24h', '7d'].map(t => (
                        <button 
                           key={t}
                           onClick={() => setActiveTab(t)}
                           className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                           {t}
                        </button>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 w-full p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#A855F7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="rgba(255,255,255,0.05)" 
                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9}} 
                        axisLine={false} 
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.05)" 
                        tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 9}} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                      
                      <Area 
                        type="monotone" 
                        dataKey="visitors" 
                        stroke="#A855F7" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorVisitors)"
                        animationDuration={1500}
                      />
                      
                      <Area 
                        type="monotone" 
                        dataKey="pageViews" 
                        stroke="#3b82f6" 
                        strokeWidth={1.5}
                        fillOpacity={1} 
                        fill="url(#colorViews)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </GlassCard>
          </div>

          <div className="space-y-4">
             <GlassCard className="p-0 border-white/5 bg-black/40 backdrop-blur-3xl shadow-xl">
                <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2.5">
                      <Globe size={14} className="text-blue-400" />
                      <span className="text-xs font-bold text-white tracking-wide">Top Clusters</span>
                   </div>
                   <MapPin size={12} className="text-white/20" />
                </div>
                <div className="p-4 space-y-3">
                   {regions.map((region, i) => (
                      <div key={i} className="space-y-1">
                         <div className="flex justify-between text-[9px] font-bold">
                            <span className="text-white/50 tracking-wide uppercase">{region.country}</span>
                            <span className="text-white/80">{region.value}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: `${region.value}%` }}
                               transition={{ duration: 1.2, delay: 0.3 }}
                               className={`h-full ${region.color} rounded-full`} 
                            />
                         </div>
                      </div>
                   ))}
                </div>
             </GlassCard>

             <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-3xl">
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                         <Wifi size={14} className="text-emerald-400" />
                      </div>
                      <span className="text-[8px] font-black text-emerald-400 uppercase">99.9%</span>
                   </div>
                   <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Stability</p>
                   <p className="text-xs font-bold text-white">Nominal</p>
                </div>
                
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 shadow-lg backdrop-blur-3xl">
                   <div className="flex justify-between items-start mb-2">
                      <div className="p-1.5 bg-blue-500/10 rounded-lg">
                         <Server size={14} className="text-blue-400" />
                      </div>
                      <span className="text-[8px] font-black text-blue-400 uppercase">28ms</span>
                   </div>
                   <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1">Latency</p>
                   <p className="text-xs font-bold text-white">Quantum</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
