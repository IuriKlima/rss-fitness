import { supabase } from '../lib/supabase';
import { generateSlug } from '../utils/slug';

export interface Product {
  id: string;
  title: string;
  description: string;
  sku: string;
  category: string;
  subcategory: string;
  imageUrl: string;
  slug?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('rss_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data as Product[]).map(p => ({
    ...p,
    slug: `${generateSlug(p.title)}-${generateSlug(p.sku)}`
  }));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const { data, error } = await supabase
    .from('rss_products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const addProductsBulk = async (products: Omit<Product, 'id'>[]): Promise<void> => {
  const { error } = await supabase
    .from('rss_products')
    .insert(products);

  if (error) throw error;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product> => {
  const { data, error } = await supabase
    .from('rss_products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('rss_products')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
