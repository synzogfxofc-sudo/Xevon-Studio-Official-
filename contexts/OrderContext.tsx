import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order } from '../types';
import { supabase } from '../supabase';
import { sendAdminNotification } from '../utils/notificationService';

interface OrderContextType {
  orders: Order[];
  userOrders: Order[];
  currentOrder: Order | null;
  placeOrder: (packageName: string, price: string, customerName: string, customerWhatsapp: string) => Promise<void>;
  assignRepresentative: (orderId: string, repIndex: number) => Promise<void>;
  isOrderModalOpen: boolean;
  openOrderModal: (packageName?: string, price?: string) => void;
  closeOrderModal: () => void;
  selectedPackage: { name: string; price: string } | null;
  isStatusModalOpen: boolean;
  toggleStatusModal: () => void;
  visitorId: string;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]); // Global (Admin view)
  const [userOrders, setUserOrders] = useState<Order[]>([]); // Current User's list
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  
  // Persistent Visitor ID
  const [visitorId] = useState(() => {
    let id = localStorage.getItem('xevon_visitor_id');
    if (!id) {
      id = 'v_' + Math.random().toString(36).substr(2, 9) + Date.now();
      localStorage.setItem('xevon_visitor_id', id);
    }
    return id;
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; price: string } | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  // Load all orders and filter user specific orders
  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('xevon_orders')
        .select('*')
        .order('date', { ascending: false });

      if (data && !error) {
        setOrders(data);
        const filtered = data.filter(o => o.visitor_id === visitorId);
        setUserOrders(filtered);
        
        if (filtered.length > 0) {
          setCurrentOrder(filtered[0]);
        }
      }
    };

    fetchOrders();

    // Set up Realtime subscription for orders
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'xevon_orders' },
        () => fetchOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [visitorId]);

  const placeOrder = async (packageName: string, price: string, customerName: string, customerWhatsapp: string) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      visitor_id: visitorId,
      packageName,
      price,
      customerName,
      customerWhatsapp,
      status: 'pending',
      date: new Date().toLocaleDateString()
    };

    const { error } = await supabase
      .from('xevon_orders')
      .insert([newOrder]);

    if (!error) {
      // Refresh will happen via realtime or state
      setUserOrders(prev => [newOrder, ...prev]);
      setCurrentOrder(newOrder);

      // Trigger FCM Notification
      await sendAdminNotification(
        "New Order Received",
        `${packageName} purchased by ${customerName} (${price})`
      );
    } else {
      console.error("Error placing order:", error);
    }
  };

  const assignRepresentative = async (orderId: string, repIndex: number) => {
    const { error } = await supabase
      .from('xevon_orders')
      .update({ status: 'assigned', assignedRepIndex: repIndex })
      .eq('id', orderId);

    if (error) console.error("Error assigning rep:", error);
  };

  const openOrderModal = (packageName?: string, price?: string) => {
    if (packageName && price) {
      setSelectedPackage({ name: packageName, price });
    }
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setTimeout(() => setSelectedPackage(null), 300);
  };

  const toggleStatusModal = () => {
    setIsStatusModalOpen(prev => !prev);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      userOrders,
      currentOrder, 
      placeOrder, 
      assignRepresentative,
      isOrderModalOpen,
      openOrderModal,
      closeOrderModal,
      selectedPackage,
      isStatusModalOpen,
      toggleStatusModal,
      visitorId
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within a OrderProvider');
  }
  return context;
};