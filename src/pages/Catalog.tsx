import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { getProducts } from '../services/products';
import { getCategories } from '../services/categories';
import { Helmet } from 'react-helmet-async';
import type { Product } from '../services/products';
import type { Category } from '../services/categories';
import { ProductCard } from '../components/product/ProductCard';

export const Catalog = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSubcategory = searchParams.get('subcategory') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);

  useEffect(() => {
    setCategory(searchParams.get('category') || '');
    setSubcategory(searchParams.get('subcategory') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    getProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
    getCategories().then(setCategoriesList);
  }, []);

  const availableSubcategories = Array.from(new Set(products.filter(p => p.category === category && p.subcategory).map(p => p.subcategory)));

  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                        p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todos' || category === '' || p.category === category;
    const matchSubcategory = subcategory === '' || p.subcategory === subcategory;
    
    return matchSearch && matchCategory && matchSubcategory;
  });

  return (
    <div className="container mx-auto px-4 lg:px-8 py-10">
      <Helmet>
        <title>Catálogo de Equipamentos | RSS Fitness</title>
        <meta name="description" content="Explore nosso catálogo completo de equipamentos para musculação, cardio e pesos livres. Máquinas de alta performance e durabilidade para academias e estúdios." />
      </Helmet>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Catálogo de Produtos</h1>
          <p className="text-gray-500">Encontre o equipamento perfeito para o seu objetivo.</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Buscar por nome ou SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border rounded-xl p-6 sticky top-28">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-4">
              <SlidersHorizontal className="h-5 w-5 text-accent" />
              Filtros
            </h2>
            
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Categorias</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => { setCategory('Todos'); setSubcategory(''); }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${category === 'Todos' || category === '' ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Todos
                  </button>
                </li>
                {categoriesList.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => { setCategory(cat.name); setSubcategory(''); }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${category === cat.name ? 'bg-primary text-white font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {category !== 'Todos' && category !== '' && availableSubcategories.length > 0 && (
              <div className="mb-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-700 mb-3">Subcategorias</h3>
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => setSubcategory('')}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${subcategory === '' ? 'bg-accent/10 text-accent font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      Todas de {category}
                    </button>
                  </li>
                  {availableSubcategories.map(sub => (
                    <li key={sub}>
                      <button 
                        onClick={() => setSubcategory(sub)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${subcategory === sub ? 'bg-accent/10 text-accent font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {sub}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-accent"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <Link to={`/produto/${product.slug}`} key={product.id} className="block h-full">
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-xl p-12 text-center">
              <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros ou termo de busca.</p>
              <button 
                onClick={() => { setSearch(''); setCategory(''); setSubcategory(''); }}
                className="mt-6 text-accent font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
