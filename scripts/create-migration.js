#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Nombre de la migracion desde los argumentos.
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: Debes proporcionar un nombre para la migracion');
  console.error('Uso: npm run migration:create <nombre-de-migracion>');
  process.exit(1);
}

// Migracion VACIA escrita a mano (sin diff de entidades).
const migrationPath = path.join('./src/database/migrations/', migrationName);
const command = `npx typeorm-ts-node-commonjs migration:create ${migrationPath}`;

try {
  execSync(command, { stdio: 'inherit' });
  console.log(`\nMigracion ${migrationName} creada exitosamente.`);
} catch (error) {
  console.error('Error al crear la migracion:', error.message);
  process.exit(1);
}
