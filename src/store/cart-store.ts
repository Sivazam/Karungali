import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  gstRate: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemsCount: () => number;
  getSubtotal: () => number;
  getGSTDetails: () => {
    cgst: { rate: number; amount: number };
    sgst: { rate: number; amount: number };
    igst: { rate: number; amount: number };
  };
  getTotalGST: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    const items = get().items;
    const existingItem = items.find(i => i.productId === item.productId);
    
    if (existingItem) {
      set({
        items: items.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      });
    } else {
      set({
        items: [...items, { ...item, id: Date.now().toString() }]
      });
    }
  },

  removeItem: (itemId) => {
    set({
      items: get().items.filter(item => item.id !== itemId)
    });
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    
    set({
      items: get().items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getItemsCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getGSTDetails: () => {
    const subtotal = get().getSubtotal();
    // For simplicity, assuming same state (CGST + SGST)
    // In real implementation, this would be based on user's state
    const totalGST = get().getTotalGST();
    
    return {
      cgst: { rate: totalGST / 2, amount: totalGST / 2 },
      sgst: { rate: totalGST / 2, amount: totalGST / 2 },
      igst: { rate: 0, amount: 0 }
    };
  },

  getTotalGST: () => {
    const subtotal = get().getSubtotal();
    // Calculate weighted average GST rate based on items
    const totalGST = get().items.reduce((gstTotal, item) => {
      const itemGST = (item.price * item.quantity * item.gstRate) / 100;
      return gstTotal + itemGST;
    }, 0);
    
    return totalGST;
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const totalGST = get().getTotalGST();
    // Adding shipping charges (flat rate for simplicity)
    const shippingCharges = subtotal > 999 ? 0 : 50;
    
    return subtotal + totalGST + shippingCharges;
  }
}));