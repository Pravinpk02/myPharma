export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const STORAGE_KEY = 'mypharma_notifications_db';

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'critical', title: 'Critical Stock Alert', body: 'Paracetamol 650mg is at 12% — immediate reorder required.', time: '2 min ago', read: false },
  { id: 'n2', type: 'critical', title: 'Critical Stock Alert', body: 'Amoxicillin 500mg at 18% — stock critically low.', time: '5 min ago', read: false },
  { id: 'n3', type: 'warning', title: 'Low Stock Warning', body: 'Metformin 1000mg at 32% — consider restocking.', time: '20 min ago', read: false },
  { id: 'n4', type: 'warning', title: 'Low Stock Warning', body: 'Atorvastatin 40mg at 27% — reorder suggested.', time: '45 min ago', read: false },
  { id: 'n5', type: 'success', title: 'Order Delivered', body: '#ORD-2841 successfully delivered to City Hospital, Chennai.', time: '1 hr ago', read: false },
  { id: 'n6', type: 'success', title: 'Order Delivered', body: '#ORD-2838 delivered to Fortis Pharmacy, Mumbai.', time: '2 hr ago', read: true },
  { id: 'n7', type: 'info', title: 'New Order Placed', body: '#ORD-2840 from Apollo Pharmacy, Bengaluru — ₹89,500.', time: '3 hr ago', read: true },
  { id: 'n8', type: 'info', title: 'Payment Confirmed', body: 'NEFT payment of ₹89,500 confirmed for ORD-2840.', time: '4 hr ago', read: true },
];

export const getNotifications = (): Notification[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
};

export const saveNotifications = (notifs: Notification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
};
