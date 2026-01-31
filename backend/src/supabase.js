// Configuration Supabase
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Récupérer les variables d'environnement Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('⚠️ Variables Supabase manquantes!');
  console.error('Assurez-vous de définir SUPABASE_URL et SUPABASE_ANON_KEY dans votre fichier .env');
}

// Créer le client Supabase
const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
