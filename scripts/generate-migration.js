#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Nombre de la migracion desde los argumentos.
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Debes proporcionar un nombre para la migracion');
  console.error('Uso: npm run migration:generate <nombre-de-migracion>');
  process.exit(1);
}

// Genera la migracion comparando las entidades (*.model.ts) contra el schema
// actual de la base de datos apuntada por el DataSource.
const migrationPath = path.join('./src/database/migrations/', migrationName);
const command = `npx typeorm-ts-node-commonjs migration:generate -d src/database/typeorm.config.ts ${migrationPath}`;

try {
  execSync(command, { stdio: 'inherit' });
  console.log(`\nMigracion ${migrationName} generada exitosamente.`);
} catch (error) {
  // TypeORM sale con codigo 1 cuando no hay cambios de schema; es esperado.
  console.error('\nNo se genero la migracion (sin cambios de schema o error).');
  process.exit(1);
}
