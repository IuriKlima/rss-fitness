import { create } from 'zustand';
import type { Product } from '../services/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getWhatsAppLink: (phoneNumber: string) => string;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
          isOpen: true,
        };
      }
      return { items: [...state.items, { product, quantity }], isOpen: true };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter(item => item.product.id !== productId)
    }));
  },
  updateQuantity: (productId, quantity) => {
    set((state) => ({
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }));
  },
  clearCart: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
  getWhatsAppLink: (phoneNumber) => {
    const { items } = get();
    if (items.length === 0) return `https://wa.me/${phoneNumber}`;
    
    let text = `Olá! Gostaria de solicitar um orçamento para os seguintes equipamentos Rss Fitness:%0A%0A`;
    items.forEach(item => {
      text += `- ${item.quantity}x ${item.product.title} (SKU: ${item.product.sku})%0A`;
    });
    text += `%0AAguardo o retorno. Obrigado!`;
    
    return `https://wa.me/${phoneNumber}?text=${text}`;
  }
}));
