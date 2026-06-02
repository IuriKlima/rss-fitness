import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { useSettingsStore } from '../../store/settingsStore';

export const Layout = () => {
  const settings = useSettingsStore(state => state.settings);
  
  useEffect(() => {
    if (settings.logo_url) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.logo_url;
    }
    
    if (settings.company_name) {
      document.title = settings.company_name;
    }
  }, [settings.logo_url, settings.company_name]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 bg-background">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      
      {/* Floating WhatsApp Button */}
      {settings.whatsapp_number && (
        <a 
          href={`https://wa.me/${settings.whatsapp_number}`}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-lg shadow-green-500/30 hover:scale-110 hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center group"
          aria-label="Falar no WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="0" fill="currentColor" className="group-hover:rotate-12 transition-transform duration-300">
            <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.274-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.065-.301-.15-1.265-.466-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.297-.018-.458.13-.606.134-.133.301-.347.446-.52.151-.172.202-.296.3-.495.101-.199.05-.371-.025-.52-.075-.149-.672-1.62-.922-2.218-.239-.57-.49-.492-.673-.501-.173-.008-.371-.01-.571-.01-.198 0-.52.074-.792.372-.277.296-1.049 1.02-1.049 2.486s1.073 2.876 1.223 3.074c.15.197 2.105 3.197 5.101 4.49 2.377 1.022 3.242.923 3.901.782.748-.162 2.373-.974 2.709-1.921.336-.948.336-1.76.236-1.926-.098-.166-.37-.265-.672-.416zm-5.484 7.643H12a9.92 9.92 0 0 1-5.06-1.378l-.36-.214-3.766.988 1.009-3.666-.236-.375A9.873 9.873 0 0 1 2.016 12C2.016 6.486 6.51 2 12.016 2s9.998 4.486 9.998 10-4.484 10-9.998 10z"/>
          </svg>
        </a>
      )}
    </div>
  );
};
