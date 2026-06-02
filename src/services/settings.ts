import { supabase } from '../lib/supabase';

export interface SiteSettings {
  id?: number;
  company_name: string;
  whatsapp_number: string;
  email: string;
  logo_url: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_text: string;
  hero_image_url: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  company_name: 'Rss Fitness',
  whatsapp_number: '5521964692374',
  email: 'contato@rssfitness.com.br',
  logo_url: '/logo.png',
  hero_title: 'Equipamentos Premium para o seu Treino.',
  hero_subtitle: 'Descubra a linha completa de equipamentos de alta performance Rss Fitness. Durabilidade, tecnologia e design para quem leva o treino a sério.',
  about_text: 'A Rss Fitness nasceu com a missão de transformar a experiência de treinos no Brasil, oferecendo equipamentos de qualidade comercial para academias e residências...',
  contact_text: 'Fale conosco pelo WhatsApp ou nos envie um email. Nosso time de especialistas está pronto para montar o melhor orçamento para você.',
  hero_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000'
};

export const getSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('rss_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error || !data) {
    console.warn('Using default settings. Ensure Supabase settings table is seeded.');
    return DEFAULT_SETTINGS;
  }
  return data;
};

export const updateSettings = async (settings: SiteSettings): Promise<void> => {
  const { id, ...updateData } = settings;
  const { error } = await supabase
    .from('rss_settings')
    .upsert({ id: id || 1, ...updateData });

  if (error) {
    throw error;
  }
};
