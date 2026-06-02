import { useEffect, useState } from 'react';
import { Edit2, Trash2, Save } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/categories';
import { uploadImageToImgbb } from '../../services/imgbb';
import type { Category } from '../../services/categories';

export const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(isEditing, formData);
        alert('Categoria atualizada com sucesso!');
      } else {
        await addCategory(formData);
        alert('Categoria adicionada com sucesso!');
      }
      setFormData({ name: '', image_url: '' });
      setIsEditing(null);
      fetchCategories();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Verifique o console.');
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(category.id);
    setFormData({ name: category.name, image_url: category.image_url });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria? Os produtos desta categoria ficarão sem categoria.')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (error) {
        console.error('Erro ao excluir:', error);
        alert('Erro ao excluir categoria.');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciar Categorias</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="Ex: Musculação" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem ou Upload</label>
                <div className="flex gap-2">
                  <input required type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} className="flex-1 p-2 border rounded-md" placeholder="https://" />
                  <label className="bg-gray-100 hover:bg-gray-200 border cursor-pointer px-4 py-2 rounded-md flex items-center justify-center transition-colors">
                    <span className="text-sm font-medium text-gray-600">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const url = await uploadImageToImgbb(e.target.files[0]);
                          setFormData({ ...formData, image_url: url });
                          alert('Upload concluído com sucesso!');
                        } catch (err: any) {
                          alert('Erro no upload: ' + err.message);
                        }
                      }
                    }} />
                  </label>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-primary hover:bg-black text-white px-4 py-2 rounded-md flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar
                </button>
                {isEditing && (
                  <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', image_url: '' }); }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-medium text-gray-600">Imagem</th>
                  <th className="p-4 font-medium text-gray-600">Nome</th>
                  <th className="p-4 font-medium text-gray-600 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <img src={category.image_url} alt={category.name} className="h-12 w-12 object-cover rounded-md" />
                    </td>
                    <td className="p-4 font-medium">{category.name}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(category.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
