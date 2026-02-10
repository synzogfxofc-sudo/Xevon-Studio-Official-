
import { ReactNode } from 'react';

export interface SectionProps {
  id?: string;
  className?: string;
}

export interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface TeamMember {
  id?: number; 
  name: string;
  role: string;
  image: string;
  whatsapp?: string; 
  bio?: string; // Detailed description for profile view
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
    github?: string;
  };
}

export interface AnalyticsData {
  name: string;
  visitors: number;
  pageViews: number;
}

export interface Review {
  id: string;
  visitor_id?: string; // Linked to user
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  visitor_id?: string; // Linked to user
  packageName: string;
  price: string;
  customerName: string;
  customerWhatsapp: string;
  status: 'pending' | 'assigned' | 'completed';
  assignedRepIndex?: number; 
  date: string;
}

export interface ChatMessage {
  id: number;
  visitor_id: string;
  text: string;
  is_user: boolean;
  created_at: string;
}
