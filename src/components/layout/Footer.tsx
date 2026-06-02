import { Dumbbell } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

const formatPhone = (num: string) => {
  if (!num) return '';
  const c = num.replace(/\D/g, '');
  if (c.length === 13) return `+${c.substring(0,2)} (${c.substring(2,4)}) ${c.substring(4,9)}-${c.substring(9)}`;
  if (c.length === 12) return `+${c.substring(0,2)} (${c.substring(2,4)}) ${c.substring(4,8)}-${c.substring(8)}`;
  if (c.length === 11) return `(${c.substring(0,2)}) ${c.substring(2,7)}-${c.substring(7)}`;
  if (c.length === 10) return `(${c.substring(0,2)}) ${c.substring(2,6)}-${c.substring(6)}`;
  return num;
};

export const Footer = () => {
  const settings = useSettingsStore(state => state.settings);

  return (
    <footer className="bg-primary text-white py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt={settings.company_name} className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            ) : (
              <>
                <Dumbbell className="h-6 w-6 text-accent" />
                <span className="text-xl font-bold tracking-wider">
                  RSS<span className="text-accent">FITNESS</span>
                </span>
              </>
            )}
          </div>
          <p className="text-gray-400">
            Equipamentos de alta performance para quem não aceita menos que o melhor. Transforme seu corpo com a {settings.company_name}.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Revenda Oficial</h3>
          <div className="flex flex-col gap-6 bg-white/5 p-5 rounded-xl border border-gray-800">
            <img src="https://alfafitness.com.br/img/Logo%20Alfa%20Oficial.png" alt="Alfa Fitness" className="h-8 object-contain object-left" />
            <img src="https://macsport.com.br/assets/logotipo-header.png" alt="Macsport" className="h-6 object-contain object-left brightness-0 invert" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="/catalog" className="hover:text-accent transition-colors">Catálogo Completo</a></li>
            <li><a href="/about" className="hover:text-accent transition-colors">Sobre Nós</a></li>
            <li><a href="/contact" className="hover:text-accent transition-colors">Contato</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Contato</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                WhatsApp: {formatPhone(settings.whatsapp_number)}
              </a>
            </li>
            <li>{settings.email}</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
        &copy; {new Date().getFullYear()} {settings.company_name}. Todos os direitos reservados.
      </div>
    </footer>
  );
};
