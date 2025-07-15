#!/usr/bin/env node

// Script pour créer la table contact_messages
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createContactTable() {
  console.log('🗄️ Création de la table contact_messages...');
  
  try {
    const query = `
      -- Migration pour créer la table des messages de contact
      CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          user_type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'nouveau',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          admin_response TEXT,
          responded_at TIMESTAMP,
          responded_by INTEGER
      );

      -- Index pour améliorer les performances
      CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_user_type ON contact_messages(user_type);
    `;

    await pool.query(query);
    console.log('✅ Table contact_messages créée avec succès !');
    
    // Vérifier que la table a été créée
    const checkTable = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'contact_messages' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Structure de la table:');
    checkTable.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error);
  } finally {
    pool.end();
  }
}

createContactTable();
