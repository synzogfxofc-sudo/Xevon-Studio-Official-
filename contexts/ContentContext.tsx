
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TeamMember, PortfolioItem } from '../types';
import { supabase } from '../supabase';

// Define the shape of our content
export interface AppContent {
  company: {
    name: string;
    logo?: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    socials: {
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      github?: string;
      facebook?: string;
    }
  };
  hero: {
    tagline: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  portfolio: {
    title: string;
    subtitle: string;
    items: PortfolioItem[];
  };
  pricing: {
    title: string;
    subtitle: string;
    packages: {
      name: string;
      price: string;
      description: string;
      features: { name: string; description: string }[];
    }[];
  };
  team: {
    title: string;
    subtitle: string;
    members: TeamMember[];
  };
  // Admin specific settings (not always fetched for public, but defined here for typing)
  adminSettings?: {
    fcm_token?: string;
    updated_at?: string;
  };
}

// Default content (Initial State)
const defaultContent: AppContent = {
  company: {
    name: "Xevon Studio",
    logo: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg",
    description: "Crafting futuristic digital experiences that blend art, technology, and strategy to elevate brands beyond the ordinary.",
    email: "yourmail@gmail.com",
    phone: "+8801*********",
    whatsapp: "+8801*********",
    address: "Innovation District, Dhaka, Bangladesh",
    socials: {
      twitter: "#",
      instagram: "#",
      linkedin: "#",
      github: "#",
      facebook: ""
    }
  },
  hero: {
    tagline: "The Future of Digital Marketing",
    titleLine1: "Elevate Your",
    titleLine2: "Digital Presence",
    description: "We craft glossy, high-performance digital experiences that captivate audiences and drive results. Step into the future with Xevon Studio.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "View Our Work"
  },
  services: {
    title: "Our Expertise",
    subtitle: "We combine creativity with technology to deliver comprehensive digital solutions.",
    items: [
      { title: "Brand Strategy", description: "Defining your voice and visual identity to stand out in a crowded digital landscape." },
      { title: "Web Development", description: "Building ultra-fast, responsive, and visually stunning websites with modern tech." },
      { title: "Digital Marketing", description: "Data-driven campaigns that maximize ROI and drive organic traffic to your business." },
      { title: "UI/UX Design", description: "Creating intuitive and beautiful interfaces that users love to interact with." },
      { title: "Mobile Apps", description: "Native and cross-platform mobile applications tailored for performance and scale." },
      { title: "Content Creation", description: "Engaging multimedia content that tells your brand's story effectively." }
    ]
  },
  portfolio: {
    title: "Selected Works",
    subtitle: "A showcase of our digital masterpieces and creative breakthroughs.",
    items: [
      { id: 1, title: "Neon Future", category: "Web Design", image: "https://picsum.photos/600/400?random=1" },
      { id: 2, title: "Cyber Finance", category: "App Development", image: "https://picsum.photos/600/400?random=2" },
      { id: 3, title: "Abstract Art", category: "Branding", image: "https://picsum.photos/600/400?random=3" },
      { id: 4, title: "Eco Tech", category: "Web Design", image: "https://picsum.photos/600/400?random=4" },
      { id: 5, title: "Urban Fashion", category: "Marketing", image: "https://picsum.photos/600/400?random=5" },
      { id: 6, title: "Data Flow", category: "App Development", image: "https://picsum.photos/600/400?random=6" },
    ]
  },
  pricing: {
    title: "Invest in Excellence",
    subtitle: "Transparent pricing for world-class digital craftsmanship. Choose the plan that elevates your brand to the next dimension.",
    packages: [
      {
        name: "Starter",
        price: "৳99,000",
        description: "Perfect for startups looking to make a bold entrance.",
        features: [
           { name: "Custom UI/UX Design", description: "Tailored interface design that reflects your unique brand identity and values." },
           { name: "Mobile Responsive", description: "Optimized layout ensuring your site looks perfect on phones, tablets, and desktops." },
           { name: "Basic SEO Setup", description: "Essential search engine optimization including meta tags and sitemap to help you get found." },
           { name: "5 Pages", description: "Up to 5 unique pages (e.g., Home, About, Services, Contact, Blog)." },
           { name: "1 Month Support", description: "30 days of post-launch maintenance, bug fixes, and technical assistance." }
        ]
      },
      {
        name: "Visionary",
        price: "৳250,000",
        description: "Complete digital transformation for growing brands.",
        features: [
           { name: "Premium Web & Mobile Design", description: "High-end, interactive design experiences with advanced animations and motion graphics." },
           { name: "Advanced SEO & Analytics", description: "Comprehensive SEO strategy and a custom real-time visitor tracking dashboard." },
           { name: "CMS Integration", description: "Easy-to-use Content Management System allowing you to update your site without code." },
           { name: "10 Pages", description: "Up to 10 unique pages with custom layouts, transitions, and interactions." },
           { name: "Brand Identity System", description: "Complete visual guide including logo usage, color palette, typography, and assets." },
           { name: "3 Months Priority Support", description: "Expedited support response times and dedicated maintenance for 90 days." }
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        description: "Full-scale solutions for market leaders.",
        features: [
           { name: "Full Product Design", description: "End-to-end product design from prototyping and user testing to final production." },
           { name: "Custom Web App Development", description: "Complex functionality, API integrations, and database architecture tailored to business logic." },
           { name: "E-commerce Suite", description: "Complete online store setup with secure payment gateways and inventory management." },
           { name: "Unlimited Pages", description: "Scalable architecture supporting an unlimited number of dynamic pages and content types." },
           { name: "24/7 Dedicated Team", description: "Round-the-clock access to senior developers and designers for immediate needs." },
           { name: "Global Marketing Strategy", description: "Data-driven multi-channel marketing campaigns designed to reach international audiences." }
        ]
      }
    ]
  },
  team: {
    title: "Meet The Visionaries",
    subtitle: "The minds behind the magic.",
    members: [
      { 
        name: "Alex Xevon", 
        role: "Founder & CEO", 
        image: "https://picsum.photos/400/400?random=10",
        whatsapp: "+8801*********",
        bio: "Visionary leader with a passion for disruptive technology and futuristic design. Alex founded Xevon Studio to bridge the gap between imagination and digital reality.",
        socials: { linkedin: "#", twitter: "#", instagram: "#" }
      },
      { 
        name: "Sarah Nova", 
        role: "Creative Director", 
        image: "https://picsum.photos/400/400?random=11",
        whatsapp: "+8801*********",
        bio: "Award-winning designer with over 10 years of experience crafting world-class brand identities. Sarah leads the creative team in pushing the boundaries of aesthetics.",
        socials: { linkedin: "#", instagram: "#" }
      },
      { 
        name: "David Tech", 
        role: "Lead Developer", 
        image: "https://picsum.photos/400/400?random=12",
        whatsapp: "+8801*********",
        bio: "Full-stack architect specializing in high-performance web applications and quantum-inspired UI interactions. David ensures that every pixel moves with purpose.",
        socials: { github: "#", twitter: "#" }
      },
      { 
        name: "Elena Flow", 
        role: "UX Specialist", 
        image: "https://picsum.photos/400/400?random=13",
        whatsapp: "+8801*********",
        bio: "User-centric designer focused on creating intuitive digital journeys. Elena specializes in human-computer interaction and conversion-optimized interfaces.",
        socials: { linkedin: "#", instagram: "#" }
      },
    ]
  }
};

interface ContentContextType {
  content: AppContent;
  updateContent: (section: keyof AppContent, data: any) => Promise<void>;
  saveFullContent: (data: AppContent) => Promise<void>;
  resetContent: () => Promise<void>;
  isLoading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('xevon_content')
          .select('*')
          .eq('section', 'all')
          .single();

        if (data && !error) {
          setContent({ ...defaultContent, ...data.data });
        }
      } catch (e) {
        console.log("Supabase content not found or error, using defaults.");
      }
      setIsLoading(false);
    };

    fetchContent();
  }, []);

  const updateContent = async (section: keyof AppContent, data: any) => {
    const newContent = { ...content, [section]: data };
    setContent(newContent);
    
    const { error } = await supabase
      .from('xevon_content')
      .upsert({ section: 'all', data: newContent }, { onConflict: 'section' });
      
    if (error) console.error("Error saving content to Supabase:", error);
  };

  const saveFullContent = async (newContent: AppContent) => {
    setContent(newContent);
    const { error } = await supabase
      .from('xevon_content')
      .upsert({ section: 'all', data: newContent }, { onConflict: 'section' });
      
    if (error) console.error("Error saving full content to Supabase:", error);
  };

  const resetContent = async () => {
    setContent(defaultContent);
    const { error } = await supabase
      .from('xevon_content')
      .upsert({ section: 'all', data: defaultContent }, { onConflict: 'section' });
    
    if (error) console.error("Error resetting content on Supabase:", error);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, saveFullContent, resetContent, isLoading }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
