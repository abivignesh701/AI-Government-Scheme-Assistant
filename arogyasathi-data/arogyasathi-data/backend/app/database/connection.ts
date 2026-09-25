import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function connectDB() {
  if (!supabaseUrl || !supabaseKey) {
    console.error('SUPABASE_URL or SUPABASE_ANON_KEY is not defined in environment variables.');
    return; 
  }
  
  try {
    // Optionally test the connection here by making a lightweight query
    // const { data, error } = await supabase.from('users').select('id').limit(1);
    console.log('Supabase client initialized successfully.');
  } catch (error) {
    console.error('Supabase initialization error:', error);
    throw error;
  }
}
