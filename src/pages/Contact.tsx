import { useSettingsStore } from '../store/settingsStore';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

const formatPhone = (num: string) => {
  if (!num) return '';
  const c = num.replace(/\D/g, '');
  if (c.length === 13) return `+${c.substring(0,2)} (${c.substring(2,4)}) ${c.substring(4,9)}-${c.substring(9)}`;
  if (c.length === 12) return `+${c.substring(0,2)} (${c.substring(2,4)}) ${c.substring(4,8)}-${c.substring(8)}`;
  if (c.length === 11) return `(${c.substring(0,2)}) ${c.substring(2,7)}-${c.substring(7)}`;
  if (c.length === 10) return `(${c.substring(0,2)}) ${c.substring(2,6)}-${c.substring(6)}`;
  return num;
};

export const Contact = () => {
  const settings = useSettingsStore(state => state.settings);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fale Conosco</h1>
          <p className="text-xl text-gray-300 max-w-2xl">Estamos prontos para atender você e montar o orçamento ideal.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <h2 className="text-3xl font-bold mb-6">Entre em Contato</h2>
            <div className="prose prose-lg text-gray-600 mb-10 whitespace-pre-wrap">
              {settings.contact_text || 'Em construção...'}
            </div>

            <div className="space-y-6">
              <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-accent hover:shadow-md transition-all group">
                <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-500 transition-colors">
                  <MessageCircle className="h-6 w-6 text-green-600 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">WhatsApp</div>
                  <div className="text-lg font-bold text-gray-800">Falar no WhatsApp</div>
                </div>
              </a>

              <a href={`mailto:${settings.email}`} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-accent hover:shadow-md transition-all group">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-500 transition-colors">
                  <Mail className="h-6 w-6 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">E-mail</div>
                  <div className="text-lg font-bold text-gray-800">{settings.email}</div>
                </div>
              </a>
              
              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 font-medium">Telefone</div>
                  <div className="text-lg font-bold text-gray-800">{formatPhone(settings.whatsapp_number)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full min-h-[400px] flex items-center justify-center flex-col text-center">
            <MapPin className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Atendimento Online</h3>
            <p className="text-gray-500">Nossa equipe atende todo o Brasil remotamente com a máxima agilidade.</p>
          </div>

        </div>
      </div>
    </div>
  );
};
