import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Zap, Globe, BarChart3, PenTool, Smartphone, Layers } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

const icons = [Zap, Globe, BarChart3, PenTool, Smartphone, Layers];

export const Services: React.FC = () => {
  const { content } = useContent();
  const { services } = content;

  return (
    <section id="services" className="py-24 relative overflow-hidden">
       <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
       
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">{services.title}</h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {services.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.items.map((service, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full group hover:border-purple-500/30 transition-colors">
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-8 h-8 ${
                      index % 3 === 0 ? 'text-yellow-400' :
                      index % 3 === 1 ? 'text-blue-400' : 'text-green-400'
                    }`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-purple-300 transition-colors">{service.title}</h3>
                  <p className="text-white/60 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};