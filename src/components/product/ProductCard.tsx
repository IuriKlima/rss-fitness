import { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import type { Product } from '../../services/products';
import { ShoppingCart, Dumbbell } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore(state => state.addItem);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-shadow group flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
        {imgError || !product.imageUrl ? (
          <Dumbbell className="h-16 w-16 text-gray-300" />
        ) : (
          <img 
            src={product.imageUrl} 
            alt={product.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider">
          {product.category}
        </div>
      </div>
      
      <div className="p-3 md:p-5 flex flex-col flex-1 border-t border-gray-100">
        <div className="text-[10px] md:text-xs text-gray-400 mb-1 md:mb-2 font-medium tracking-wide">SKU: {product.sku}</div>
        <h3 className="font-bold text-sm md:text-lg leading-tight mb-1 md:mb-2 text-primary">{product.title}</h3>
        <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-4 md:mb-6 flex-1">
          {product.description}
        </p>
        
        <div className="mt-auto">
          <button 
            onClick={(e) => {
              e.preventDefault(); // Prevent link click if wrapped in Link
              addItem(product);
            }}
            className="w-full bg-accent hover:bg-red-600 text-white font-bold py-2 px-2 md:py-3 md:px-4 rounded-lg flex items-center justify-center gap-1 md:gap-2 transition-colors shadow-md shadow-accent/20 text-xs md:text-base"
          >
            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Adicionar ao Orçamento</span>
            <span className="inline sm:hidden">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
