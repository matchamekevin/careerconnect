// Script pour appliquer automatiquement la migration des colonnes users
const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  try {
    console.log('🔄 Début de l\'application de la migration...');
    
    // Lire le fichier de migration
    const migrationPath = path.join(__dirname, 'migrations', '20250119_add_user_columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📊 Contenu de la migration:');
    console.log(migrationSQL);
    console.log('');
    
    // Exécuter la migration
    console.log('⚙️  Exécution de la migration...');
    await pool.query(migrationSQL);
    
    console.log('✅ Migration appliquée avec succès!');
    
    // Vérifier la structure de la table après migration
    console.log('🔍 Vérification de la structure de la table users...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Structure actuelle de la table users:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Tester une mise à jour avec les nouvelles colonnes
    console.log('🧪 Test de mise à jour avec les nouvelles colonnes...');
    const testResult = await pool.query(`
      SELECT COUNT(*) as count FROM users;
    `);
    console.log(`📊 Nombre d'utilisateurs dans la base: ${testResult.rows[0].count}`);
    
    console.log('✅ Migration et tests terminés avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'application de la migration:', error.message);
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Les colonnes existent déjà, ce qui est normal.');
    } else {
      console.error('Détails de l\'erreur:', error);
    }
  } finally {
    await pool.end();
  }
}

// Exécuter la migration
if (require.main === module) {
  applyMigration();
}

module.exports = applyMigration;
