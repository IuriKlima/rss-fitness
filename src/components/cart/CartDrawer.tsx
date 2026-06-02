import { useCartStore } from '../../store/cartStore';
import { useSettingsStore } from '../../store/settingsStore';
import { X, Plus, Minus, Trash2, Phone } from 'lucide-react';

export const CartDrawer = () => {
  const { isOpen, setIsOpen, items, removeItem, updateQuantity, getWhatsAppLink } = useCartStore();
  const settings = useSettingsStore(state => state.settings);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-white shadow-xl flex flex-col transform transition-transform">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Orçamento</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <ShoppingCartIcon className="h-16 w-16 mb-4 text-gray-300" />
              <p>Sua lista está vazia.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-4 p-3 border rounded-lg bg-gray-50">
                  <img src={item.product.imageUrl} alt={item.product.title} className="w-20 h-20 object-cover rounded-md bg-white border" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-sm line-clamp-2">{item.product.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">SKU: {item.product.sku}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded bg-white">
                        <button 
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <a 
              href={getWhatsAppLink(settings.whatsapp_number)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-5 w-5" />
              Solicitar Orçamento via WhatsApp
            </a>
            <p className="text-xs text-center text-gray-500 mt-3">
              Você será redirecionado para o WhatsApp com a sua lista.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

import type { SVGProps } from 'react';

function ShoppingCartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}
