import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ProductCard } from '../components/product/ProductCard';
import { getProducts } from '../services/products';
import { getCategories } from '../services/categories';
import { useSettingsStore } from '../store/settingsStore';
import type { Product } from '../services/products';
import type { Category } from '../services/categories';

export const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const settings = useSettingsStore(state => state.settings);
  useEffect(() => {
    getProducts().then(products => {
      setFeaturedProducts(products.slice(0, 8));
    });
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>RSS Fitness | Equipamentos de Musculação e Revenda Oficial no RJ</title>
        <meta name="description" content="Sua revenda oficial MacSport e Alfa Fitness no Rio de Janeiro. Equipamentos direto da fábrica com a biomecânica e robustez que o seu espaço exige." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-primary text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={settings.hero_image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000'} 
            alt="Gym interior" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 lg:px-8 relative pt-32 pb-40">
          <div className="max-w-2xl">
            <span className="text-accent font-bold tracking-wider text-sm uppercase mb-4 block">
              REVENDA AUTORIZADA NO RIO DE JANEIRO
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Sua revenda oficial MacSport e Alfa Fitness no RJ.
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Equipamentos direto da fábrica, com a biomecânica e robustez que seu espaço exige.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/catalog" 
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-red-600 text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors shadow-lg shadow-accent/30"
              >
                Solicitar Orçamento
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a 
                href={`https://wa.me/${settings.whatsapp_number}`} 
                target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-lg py-4 px-8 rounded-lg transition-colors border border-gray-600"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
              <Activity className="h-8 w-8 text-accent" />
              O equipamento certo para o seu objetivo.
            </h2>
            <p className="text-gray-500 text-lg">Soluções completas para todos os segmentos com alto padrão de qualidade.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link to={`/catalog?category=${cat.name}`} key={cat.id} className="group relative rounded-2xl overflow-hidden aspect-[4/5] block bg-gray-200">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold mb-2">{cat.name}</h3>
                  <span className="text-accent text-sm font-semibold inline-block group-hover:translate-x-2 transition-transform">Ver produtos &rarr;</span>
                </div>
              </Link>
            ))}
            {categories.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl text-gray-400">
                As categorias aparecerão aqui quando cadastradas no painel.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-accent" />
                Destaques da Semana
              </h2>
              <p className="text-gray-500">Os equipamentos mais procurados do nosso catálogo</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 font-bold text-accent hover:text-red-700 transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <Link to={`/produto/${product.slug}`} key={product.id} className="block h-full">
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <Link to="/catalog" className="inline-flex items-center gap-2 font-bold text-accent hover:text-red-700 transition-colors">
              Ver todos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-primary text-white text-center border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para montar o seu projeto?</h2>
          <p className="text-xl text-gray-300 mb-10">Fale com um consultor especialista no Rio de Janeiro e receba um orçamento sob medida.</p>
          <a 
            href={`https://wa.me/${settings.whatsapp_number}`} 
            target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-red-600 text-white font-bold text-xl py-5 px-10 rounded-xl transition-all shadow-lg shadow-accent/30 hover:scale-105"
          >
            Quero um Orçamento Personalizado
          </a>
        </div>
      </section>
    </div>
  );
};
