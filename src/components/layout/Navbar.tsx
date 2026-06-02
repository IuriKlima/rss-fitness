import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Dumbbell } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useSettingsStore } from '../../store/settingsStore';
import { getCategories } from '../../services/categories';
import { getProducts } from '../../services/products';
import type { Category } from '../../services/categories';
import type { Product } from '../../services/products';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { items, toggleCart } = useCartStore();
  const settings = useSettingsStore(state => state.settings);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getProducts().then(setProducts).catch(console.error);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-primary text-white sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} className="h-16 md:h-20 object-contain" />
            ) : (
              <>
                <Dumbbell className="h-8 w-8 text-accent" />
                <span className="text-2xl font-bold tracking-wider">
                  RSS<span className="text-accent">FITNESS</span>
                </span>
              </>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link to="/" className="hover:text-accent transition-colors">Início</Link>
            {categories.map(c => {
              const subs = Array.from(new Set(products.filter(p => p.category === c.name && p.subcategory).map(p => p.subcategory)));
              return (
                <div key={c.id} className="relative group py-6">
                  <Link to={`/catalog?category=${c.name}`} className="hover:text-accent transition-colors flex items-center gap-1">
                    {c.name}
                  </Link>
                  {subs.length > 0 && (
                    <div className="absolute top-14 left-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden border border-gray-100">
                      {subs.map(s => (
                        <Link key={s} to={`/catalog?category=${c.name}&subcategory=${s}`} className="block px-4 py-3 hover:bg-gray-50 hover:text-accent border-b border-gray-50 last:border-0 font-medium">
                          {s}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link to="/contact" className="hover:text-accent transition-colors">Contato</Link>
            <Link to="/about" className="hover:text-accent transition-colors">Sobre</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleCart}
              className="relative p-2 hover:text-accent transition-colors flex items-center gap-2"
              aria-label="Carrinho de orçamentos"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#111] border-t border-gray-800 animate-slideDown">
          <ul className="flex flex-col py-6 px-6 gap-1">
            <li>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-white font-medium transition-colors">
                Início
              </Link>
            </li>
            <li className="my-2 border-t border-gray-800"></li>
            {categories.map(c => {
              const subs = Array.from(new Set(products.filter(p => p.category === c.name && p.subcategory).map(p => p.subcategory)));
              return (
                <li key={c.id}>
                  <Link to={`/catalog?category=${c.name}`} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-white font-medium transition-colors">
                    {c.name}
                  </Link>
                  {subs.length > 0 && (
                    <ul className="pl-8 space-y-1 mb-2">
                      {subs.map(s => (
                        <li key={s}>
                          <Link to={`/catalog?category=${c.name}&subcategory=${s}`} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-white/5 text-sm text-gray-400 transition-colors">
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="my-2 border-t border-gray-800"></li>
            <li>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-white font-medium transition-colors">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/5 text-white font-medium transition-colors">
                Sobre Nós
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};
