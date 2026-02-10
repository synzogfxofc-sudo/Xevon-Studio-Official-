
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { Pricing } from './components/Pricing';
import { Analytics } from './components/Analytics';
import { Team } from './components/Team';
import { Rating } from './components/Rating';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { LiveChat } from './components/LiveChat';
import { ContentProvider } from './contexts/ContentContext';
import { OrderProvider, useOrder } from './contexts/OrderContext';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { AdminPanel } from './components/AdminPanel';
import { PurchaseModal } from './components/PurchaseModal';
import { OrderStatus } from './components/OrderStatus';
import { DynamicNotification } from './components/ui/DynamicNotification';
import { supabase } from './supabase';

// --- Global Event Listener for Admin Notifications ---
const AdminEventsListener = () => {
  const { showNotification } = useNotification();
  const { visitorId } = useOrder(); 

  useEffect(() => {
    const chatChannel = supabase
      .channel('admin-global-chats-listener')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'xevon_chats' }, 
        (payload) => {
          const msg = payload.new;
          if (msg.is_user && msg.visitor_id !== visitorId) {
             showNotification({
                title: 'New Message Received',
                message: `Visitor says: "${msg.text.substring(0, 30)}${msg.text.length > 30 ? '...' : ''}"`,
                icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"
             });
          }
        }
      )
      .subscribe();

    const orderChannel = supabase
      .channel('admin-global-orders-listener')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'xevon_orders' },
        (payload) => {
           const order = payload.new;
           showNotification({
              title: 'New Order Received',
              message: `${order.packageName} purchased by ${order.customerName}`,
              icon: "https://image2url.com/r2/default/images/1770543518698-44cdd9b3-f860-41c0-98cc-36ec0e607a27.jpeg"
           });
        }
      )
      .subscribe();

    return () => {
        supabase.removeChannel(chatChannel);
        supabase.removeChannel(orderChannel);
    }
  }, [visitorId, showNotification]);

  return null;
};

// --- Visitor Tracking Component ---
const VisitorTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      const sessionKey = 'xevon_session_tracked';
      if (sessionStorage.getItem(sessionKey)) return;

      try {
        // Fetch current stats
        const { data, error } = await supabase
          .from('xevon_content')
          .select('data')
          .eq('section', 'site_stats')
          .single();

        let totalVisits = 0;
        if (data && data.data) {
          totalVisits = data.data.total_visits || 0;
        }

        // Increment and Save
        const newStats = { total_visits: totalVisits + 1, last_visit: new Date().toISOString() };
        await supabase
          .from('xevon_content')
          .upsert({ section: 'site_stats', data: newStats }, { onConflict: 'section' });

        sessionStorage.setItem(sessionKey, 'true');
      } catch (err) {
        console.error("Tracking error:", err);
      }
    };

    trackVisit();
  }, []);

  return null;
};

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [userName, setUserName] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  return (
    <ContentProvider>
      <OrderProvider>
        <NotificationProvider>
          <div className={`min-h-screen w-full overflow-x-hidden transition-colors duration-500 ${
            darkMode 
              ? 'bg-[#050505] text-white selection:bg-purple-500/30' 
              : 'bg-slate-50 text-slate-900'
          }`}>
            <VisitorTracker />
            <AdminEventsListener />
            <DynamicNotification />
            <WelcomeModal onNameSubmit={handleNameSubmit} />
            <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
            <PurchaseModal />
            <OrderStatus />

            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
               {darkMode ? (
                 <>
                   <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                   <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                 </>
               ) : (
                 <>
                   <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-200/40 rounded-full blur-[120px]"></div>
                   <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-200/40 rounded-full blur-[100px]"></div>
                 </>
               )}
            </div>

            <div className="relative z-10 flex flex-col">
              <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
              <main className="flex-1"> 
                <Hero />
                <Services />
                <Portfolio />
                <Pricing />
                <Analytics />
                <Team />
                <Rating userName={userName} />
                <Contact />
              </main>
              <Footer onAdminClick={() => setIsAdminOpen(true)} />
              <LiveChat />
            </div>
          </div>
        </NotificationProvider>
      </OrderProvider>
    </ContentProvider>
  );
}

export default App;
