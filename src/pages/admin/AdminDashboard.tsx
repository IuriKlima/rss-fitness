import { useEffect, useState } from 'react';
import { getProducts } from '../../services/products';
import { Package, TrendingUp, ShoppingCart } from 'lucide-react';

export const AdminDashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    getProducts().then(res => setTotalProducts(res.length));
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Total de Produtos</p>
              <h3 className="text-4xl font-bold">{totalProducts}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Acessos Hoje (Simulado)</p>
              <h3 className="text-4xl font-bold">124</h3>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 font-medium mb-1">Orçamentos (Simulado)</p>
              <h3 className="text-4xl font-bold">12</h3>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
