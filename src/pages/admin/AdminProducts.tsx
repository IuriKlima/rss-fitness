import { useEffect, useState } from 'react';
import { Edit2, Trash2, Save, UploadCloud, FileText, Download } from 'lucide-react';
import { getProducts, addProduct, updateProduct, deleteProduct, addProductsBulk } from '../../services/products';
import { getCategories } from '../../services/categories';
import { uploadImageToImgbb } from '../../services/imgbb';
import type { Product } from '../../services/products';
import type { Category } from '../../services/categories';
import Papa from 'papaparse';

export const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Tabs
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'bulk'>('list');

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    title: '', description: '', sku: '', category: 'Cardio', subcategory: '', imageUrl: ''
  });

  const fetchProducts = async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(isEditing, formData);
      } else {
        await addProduct(formData);
      }
      setIsEditing(null);
      setFormData({ title: '', description: '', sku: '', category: 'Cardio', subcategory: '', imageUrl: '' });
      setActiveTab('list');
      fetchProducts();
    } catch (err) {
      alert('Erro ao salvar produto.');
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setFormData({
      title: product.title, description: product.description, sku: product.sku,
      category: product.category, subcategory: product.subcategory, imageUrl: product.imageUrl
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      await deleteProduct(id);
      setSelectedProductIds(new Set(Array.from(selectedProductIds).filter(x => x !== id)));
      fetchProducts();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.size === 0) return;
    if (confirm(`Tem certeza que deseja remover ${selectedProductIds.size} produtos selecionados?`)) {
      setLoading(true);
      for (const id of Array.from(selectedProductIds)) {
        await deleteProduct(id);
      }
      setSelectedProductIds(new Set());
      fetchProducts();
    }
  };

  const toggleSelectProduct = (id: string) => {
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsed = results.data as any[];
          const valid = parsed.every(p => p.title && p.sku && p.category && p.imageUrl);
          if (!valid) throw new Error('O CSV deve conter as colunas: title, sku, category, imageUrl');
          
          await addProductsBulk(parsed);
          alert(`${parsed.length} produtos adicionados com sucesso!`);
          setActiveTab('list');
          fetchProducts();
        } catch (err: any) {
          alert('Erro no upload em massa: ' + err.message);
        }
      },
      error: (error: any) => {
        alert('Erro ao ler CSV: ' + error.message);
      }
    });
    // reset input
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    const csvContent = "title,description,sku,category,subcategory,imageUrl\n\"Nome do Produto\",\"Descrição longa\",\"SKU-123\",\"Musculação\",\"Bancos\",\"https://link.com/imagem.jpg\"";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_produtos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(searchLower) || p.sku.toLowerCase().includes(searchLower);
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Gerenciar Produtos</h1>
        <div className="flex gap-2 border bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setActiveTab('list')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'list' ? 'bg-white shadow' : 'text-gray-500'}`}>Lista</button>
          <button onClick={() => {setActiveTab('create'); setIsEditing(null);}} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'create' ? 'bg-white shadow' : 'text-gray-500'}`}>Novo Produto</button>
          <button onClick={() => setActiveTab('bulk')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'bulk' ? 'bg-white shadow' : 'text-gray-500'}`}>Upload em Massa</button>
        </div>
      </div>

      {activeTab === 'list' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 bg-gray-50/50">
            <input 
              type="text" 
              placeholder="Buscar por nome ou código (SKU)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-accent outline-none"
            />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 border rounded-md min-w-[200px] focus:ring-2 focus:ring-accent outline-none"
            >
              <option value="">Todas as Categorias</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {selectedProductIds.size > 0 && (
            <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
              <span className="text-red-800 font-medium">{selectedProductIds.size} produto(s) selecionado(s)</span>
              <button onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors">
                <Trash2 className="h-4 w-4" />
                Deletar Selecionados
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                      <th className="p-4 w-12">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                          checked={filteredProducts.length > 0 && selectedProductIds.size === filteredProducts.length}
                          onChange={() => {
                            if (selectedProductIds.size === filteredProducts.length) {
                              setSelectedProductIds(new Set());
                            } else {
                              setSelectedProductIds(new Set(filteredProducts.map(p => p.id)));
                            }
                          }}
                        />
                      </th>
                  <th className="p-4 font-semibold">Produto</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Categoria</th>
                  <th className="p-4 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center p-8 text-gray-500">Carregando...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center p-8 text-gray-500">Nenhum produto encontrado.</td></tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedProductIds.has(product.id) ? 'bg-red-50/30' : ''}`}>
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-accent focus:ring-accent"
                          checked={selectedProductIds.has(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                        />
                      </td>
                      <td className="p-4 flex items-center gap-3">
                        <button 
                          onClick={() => {
                            setImageModalProduct(product);
                            setTempImageUrl('');
                          }}
                          className="cursor-pointer relative group block border-0 p-0 bg-transparent text-left" 
                          title="Clique para trocar a imagem"
                        >
                          <img src={product.imageUrl} alt={product.title} className="w-10 h-10 rounded object-cover border group-hover:opacity-50 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <UploadCloud className="h-4 w-4 text-gray-800 drop-shadow-md" />
                          </div>
                        </button>
                        <div className="font-medium text-sm">{product.title}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{product.sku}</td>
                      <td className="p-4 text-sm text-gray-600">{product.category}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors mr-2">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
          <h2 className="text-xl font-bold mb-6">{isEditing ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input required type="text" name="title" value={formData.title} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select required name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-md">
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  {categories.length === 0 && <option value="">Crie uma categoria primeiro</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoria</label>
                <input required type="text" name="subcategory" value={formData.subcategory} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem ou Upload</label>
              <div className="flex gap-2">
                <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="flex-1 p-2 border rounded-md" placeholder="https://" />
                <label className="bg-gray-100 hover:bg-gray-200 border cursor-pointer px-4 py-2 rounded-md flex items-center justify-center transition-colors">
                  <span className="text-sm font-medium text-gray-600">Upload ImgBB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      try {
                        // show a temporary state if needed, but alert is enough for error
                        const url = await uploadImageToImgbb(file);
                        setFormData({ ...formData, imageUrl: url });
                        alert('Upload concluído com sucesso!');
                      } catch (err: any) {
                        alert('Erro no upload: ' + err.message);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea required name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full p-2 border rounded-md"></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button type="button" onClick={() => setActiveTab('list')} className="px-6 py-2 border rounded-md font-bold hover:bg-gray-50">Cancelar</button>
              <button type="submit" className="bg-primary text-white px-8 py-2 rounded-md font-bold hover:bg-black transition-colors flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <UploadCloud className="h-8 w-8 text-accent" />
              <div>
                <h2 className="text-xl font-bold">Upload em Massa</h2>
                <p className="text-sm text-gray-500">Envie um arquivo CSV com seus produtos.</p>
              </div>
            </div>
            <button 
              onClick={handleDownloadTemplate}
              className="text-sm font-medium text-primary hover:text-white border border-gray-300 hover:bg-primary px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar Modelo CSV
            </button>
          </div>

          <div className="mb-4 bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-600">
            <p className="mb-2 text-gray-800 font-bold">Formato esperado na primeira linha (Cabeçalho):</p>
            <pre className="overflow-x-auto whitespace-pre-wrap">
title,description,sku,category,subcategory,imageUrl
"Esteira X100","Uma esteira top","SKU-123","Cardio","Esteiras","https://link.com/img.jpg"
            </pre>
          </div>

          <div className="mt-8 flex justify-center">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FileText className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para selecionar</span> ou arraste o arquivo CSV</p>
                <p className="text-xs text-gray-500">Apenas arquivos .csv</p>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} />
            </label>
          </div>
        </div>
      )}

      {/* Modal de Atualização de Imagem */}
      {imageModalProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-primary">Atualizar Imagem: {imageModalProduct.title}</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opção 1: Upload de Arquivo</label>
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <UploadCloud className="h-8 w-8 text-accent mb-2" />
                <span className="text-sm font-medium">Clique para escolher o arquivo</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      setLoading(true);
                      const pId = imageModalProduct.id;
                      setImageModalProduct(null);
                      try {
                        const url = await uploadImageToImgbb(e.target.files[0]);
                        await updateProduct(pId, { imageUrl: url });
                        fetchProducts();
                      } catch (err: any) {
                        alert('Erro no upload: ' + err.message);
                        setLoading(false);
                      }
                    }
                  }} 
                />
              </label>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-gray-400 text-sm font-medium">OU</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Opção 2: Colar URL (Link)</label>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  placeholder="https://" 
                  value={tempImageUrl}
                  onChange={e => setTempImageUrl(e.target.value)}
                  className="flex-1 p-2 border rounded-md"
                />
                <button 
                  onClick={async () => {
                    if (tempImageUrl) {
                      setLoading(true);
                      const pId = imageModalProduct.id;
                      setImageModalProduct(null);
                      try {
                        await updateProduct(pId, { imageUrl: tempImageUrl });
                        fetchProducts();
                      } catch (err) {
                        alert('Erro: ' + err);
                        setLoading(false);
                      }
                    }
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-black font-medium"
                >
                  Salvar
                </button>
              </div>
            </div>

            <button 
              onClick={() => setImageModalProduct(null)}
              className="w-full py-2 border rounded-md font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
