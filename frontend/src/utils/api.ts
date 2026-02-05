import { supabaseUrl } from './supabase';

// Configuration API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
const SUPABASE_STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'uploads';

export const getApiUrl = (endpoint: string) => {
  if (endpoint.startsWith('http')) return endpoint;
  return `${API_BASE_URL}${endpoint}`;
};

export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('data:')) return path;

  const normalizedPath = path.replace(/^\/+/, '');

  if (API_BASE_URL) {
    return getApiUrl(normalizedPath.startsWith('uploads/') ? `/${normalizedPath}` : `/${normalizedPath}`);
  }

  let objectPath = normalizedPath;
  if (objectPath.startsWith(`${SUPABASE_STORAGE_BUCKET}/`)) {
    objectPath = objectPath.slice(SUPABASE_STORAGE_BUCKET.length + 1);
  }
  if (objectPath.startsWith('uploads/')) {
    objectPath = objectPath.slice('uploads/'.length);
  }

  return `${supabaseUrl}/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/${objectPath}`;
};