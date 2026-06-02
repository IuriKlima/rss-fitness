import { useState, useEffect } from 'react';
import { Save, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { updateSettings } from '../../services/settings';
import { uploadImageToImgbb } from '../../services/imgbb';

export const AdminSettings = () => {
  const { settings, updateSettingsLocally } = useSettingsStore();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      updateSettingsLocally(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-primary mb-8">Configurações Gerais</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
        
        {/* Company Info */}
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Dados da Empresa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
              <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL da Logo (PNG/JPG) ou Upload</label>
              <div className="flex gap-2">
                <input type="text" name="logo_url" value={formData.logo_url} onChange={handleChange} required placeholder="/logo.png ou https://..." className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
                <label className="bg-gray-100 hover:bg-gray-200 border cursor-pointer px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-sm font-medium text-gray-600">Upload ImgBB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        const url = await uploadImageToImgbb(e.target.files[0]);
                        setFormData({ ...formData, logo_url: url });
                        alert('Upload concluído!');
                      } catch (err: any) {
                        alert('Erro no upload: ' + err.message);
                      }
                    }
                  }} />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Dica: Faça o upload clicando no botão ao lado para hospedar a logo automaticamente no ImgBB.</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (Apenas números, inclua 55)</label>
              <input type="text" name="whatsapp_number" value={formData.whatsapp_number} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contato</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
            </div>
          </div>
        </section>

        {/* Home Page */}
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Página Inicial</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título Principal (Hero)</label>
              <input type="text" name="hero_title" value={formData.hero_title} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo (Hero)</label>
              <textarea name="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} required rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Fundo (Banner Hero)</label>
              <div className="flex gap-2">
                <input type="text" name="hero_image_url" value={formData.hero_image_url || ''} onChange={handleChange} required placeholder="https://..." className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" />
                <label className="bg-gray-100 hover:bg-gray-200 border cursor-pointer px-4 py-2 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-sm font-medium text-gray-600">Upload ImgBB</span>
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        const url = await uploadImageToImgbb(e.target.files[0]);
                        setFormData({ ...formData, hero_image_url: url });
                        alert('Upload concluído!');
                      } catch (err: any) {
                        alert('Erro no upload: ' + err.message);
                      }
                    }
                  }} />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Extra Pages */}
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Páginas Institucionais</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto da Página "Sobre"</label>
              <textarea name="about_text" value={formData.about_text} onChange={handleChange} required rows={5} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Conte a história da Rss Fitness..."></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto da Página "Contato"</label>
              <textarea name="contact_text" value={formData.contact_text} onChange={handleChange} required rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-accent outline-none" placeholder="Horário de atendimento, etc..."></textarea>
            </div>
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-white transition-colors ${
              saved ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-black'
            }`}
          >
            {saved ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}
            {saving ? 'Salvando...' : saved ? 'Salvo com sucesso!' : 'Salvar Configurações'}
          </button>
        </div>

      </form>
    </div>
  );
};
