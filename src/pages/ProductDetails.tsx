import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Check, Info, Dumbbell } from 'lucide-react';
import { getProducts } from '../services/products';
import type { Product } from '../services/products';
import { useCartStore } from '../store/cartStore';
import { ProductCard } from '../components/product/ProductCard';
import { Helmet } from 'react-helmet-async';

export const ProductDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProducts().then(products => {
      const p = products.find(prod => prod.slug === slug);
      setProduct(p || null);
      if (p) {
        // Encontrar produtos da mesma categoria, excluindo o atual
        const related = products.filter(prod => prod.category === p.category && prod.id !== p.id);
        // Se não tiver da mesma categoria, pega aleatórios
        const suggestions = related.length > 0 ? related : products.filter(prod => prod.id !== p.id);
        // Embaralha e pega 4
        setSuggestedProducts(suggestions.sort(() => 0.5 - Math.random()).slice(0, 4));
      }
      setLoading(false);
    });
    // Scroll to top
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAdd = () => {
    if (product) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">Produto não encontrado</h2>
        <Link to="/catalog" className="text-accent hover:underline">Voltar ao catálogo</Link>
      </div>
    );
  }

  const pageTitle = `${product.title} | Revenda Oficial MacSport e Alfa Fitness`;
  const pageDescription = product.description.substring(0, 150) + "... Adquira equipamentos direto de fábrica no RJ com a maior durabilidade do mercado.";
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.imageUrl,
    "description": product.description,
    "sku": product.sku,
    "brand": {
      "@type": "Brand",
      "name": "RSS Fitness"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": "0.00",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "RSS Fitness"
      }
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-500 hover:text-accent transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Image Gallery */}
        <div className="bg-gray-100 rounded-2xl overflow-hidden border aspect-square flex items-center justify-center">
          {imgError || !product.imageUrl ? (
            <Dumbbell className="h-32 w-32 text-gray-300" />
          ) : (
            <img 
              src={product.imageUrl} 
              alt={product.title} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            {product.subcategory && (
              <span className="ml-2 text-gray-500 text-sm">{product.subcategory}</span>
            )}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold text-primary mt-4 mb-2">{product.title}</h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide mb-4 md:mb-8">SKU: {product.sku}</p>

          <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-100 mb-6 md:mb-8">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Info className="h-5 w-5 text-accent" />
              Descrição do Equipamento
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t">
            <button 
              onClick={handleAdd}
              className={`w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
                added 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30' 
                  : 'bg-accent hover:bg-red-600 text-white shadow-lg shadow-accent/30'
              }`}
            >
              {added ? (
                <>
                  <Check className="h-6 w-6" />
                  Adicionado ao Orçamento!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  Adicionar ao Orçamento
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4 mb-6">
              Ao adicionar ao orçamento, você poderá revisar sua lista antes de enviar para nosso consultor no WhatsApp.
            </p>
            
            <div className="pt-6 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Revenda Oficial</p>
              <div className="flex items-center gap-6">
                <img src="https://alfafitness.com.br/img/Logo%20Alfa%20Oficial.png" alt="Alfa Fitness" className="h-8 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer" />
                <img src="https://macsport.com.br/assets/logotipo-header.png" alt="Macsport" className="h-6 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {suggestedProducts.length > 0 && (
        <div className="mt-12 md:mt-20 border-t pt-10 md:pt-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 md:mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {suggestedProducts.map(prod => (
              <Link to={`/produto/${prod.slug}`} key={prod.id} className="block h-full">
                <ProductCard product={prod} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
