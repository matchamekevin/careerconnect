import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://dnymaogyfcsgpuurboor.supabase.co';
const supabaseKey = 'sb_publishable_epxT8BBIPewYreONDxQAsQ_fKNCSscg';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types pour TypeScript
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  university?: string;
  level?: string;
  field?: string;
  account_status: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: number;
  name: string;
  contact_name?: string;
  email: string;
  password_hash: string;
  phone?: string;
  address?: string;
  sector?: string;
  size?: string;
  logo_url?: string;
  website_url?: string;
  is_connected: boolean;
  account_status: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: number;
  title: string;
  description?: string;
  location?: string;
  type?: string;
  salary?: string;
  tags?: string[];
  company?: string;
  company_id: number;
  logo_url?: string;
  posted_at?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: number;
  student_id: string;
  job_id: number;
  cover_letter?: string;
  status: string;
  applied_at: string;
  email?: string;
  phone?: string;
  country?: string;
  cv_url?: string;
}

export interface Review {
  id: number;
  user_id?: string | null;
  rating?: number | null;
  comment?: string | null;
  content?: string | null;
  status?: string | null;
  type?: string | null;
  parent_id?: number | null;
  user_name?: string | null;
  user_email?: string | null;
  display_email?: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  user_type?: 'student' | 'company' | 'other';
  created_at: string;
}