import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  image_url: string;
}

export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('rss_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.warn('Erro ao buscar categorias', error);
    return [];
  }
  return data as Category[];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('rss_categories')
    .insert([category])
    .select()
    .single();

  if (error) throw error;
  return data as Category;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const { data, error } = await supabase
    .from('rss_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('rss_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
