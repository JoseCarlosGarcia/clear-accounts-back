#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Secuencias de escape ANSI sin depender de bytes de control en el fuente.
const ESC = String.fromCharCode(27);
const ETX = String.fromCharCode(3); // Ctrl+C
const ARROW_UP = ESC + '[A';
const ARROW_DOWN = ESC + '[B';

const MIGRATIONS_DIR = path.join(
  __dirname,
  '..',
  'src',
  'database',
  'migrations',
);

const searchName = process.argv[2];
const newName = process.argv[3];

if (!searchName) {
  console.error('Error: You must provide the current migration name to search');
  console.error('Usage: npm run migration:rename CurrentName [NewName]');
  process.exit(1);
}

if (newName && !/^[A-Z][a-zA-Z0-9]*$/.test(newName)) {
  console.error('Error: New name must be in PascalCase (e.g. AddUserDeletedFlag)');
  process.exit(1);
}

function getMigrations(filterName) {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.ts') && /^\d+-.+\.ts$/.test(f));

  return files
    .map((file) => {
      const match = file.match(/^(\d+)-(.+)\.ts$/);
      if (!match) return null;
      const [, timestamp, name] = match;
      const date = new Date(Number(timestamp));
      return { file, timestamp, name, date };
    })
    .filter(Boolean)
    .filter((m) => m.name === filterName)
    .sort((a, b) => b.date - a.date);
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function promptNewName() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('\nNew name (PascalCase): ', (answer) => {
      rl.close();
      const trimmed = answer.trim();
      if (!trimmed) {
        console.error('Error: Name cannot be empty.');
        process.exit(1);
      }
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(trimmed)) {
        console.error('Error: Name must be in PascalCase (e.g. AddUserDeletedFlag)');
        process.exit(1);
      }
      resolve(trimmed);
    });
  });
}

function renameMigration(migration, name) {
  const oldPath = path.join(MIGRATIONS_DIR, migration.file);
  const newFile = `${migration.timestamp}-${name}.ts`;
  const newPath = path.join(MIGRATIONS_DIR, newFile);

  let content = fs.readFileSync(oldPath, 'utf-8');

  const oldClassName = `${migration.name}${migration.timestamp}`;
  const newClassName = `${name}${migration.timestamp}`;

  content = content.replace(new RegExp(oldClassName, 'g'), newClassName);

  fs.writeFileSync(oldPath, content, 'utf-8');
  fs.renameSync(oldPath, newPath);

  console.log(`\nRenamed successfully:`);
  console.log(`  File:  ${migration.file} -> ${newFile}`);
  console.log(`  Class: ${oldClassName} -> ${newClassName}`);
}

function renderList(migrations, selectedIndex) {
  if (renderList.rendered) {
    process.stdout.write(`${ESC}[${migrations.length}A`);
  }
  renderList.rendered = true;

  migrations.forEach((m, i) => {
    const prefix = i === selectedIndex ? `${ESC}[36m> ` : '  ';
    const reset = `${ESC}[0m`;
    const date = formatDate(m.date);
    const line = `${prefix}${date}  ${m.name}${reset}`;
    process.stdout.write(`${ESC}[2K${line}\n`);
  });
}
renderList.rendered = false;

function selectMigration(migrations) {
  return new Promise((resolve) => {
    let selectedIndex = 0;

    console.log('Select a migration to rename:\n');
    renderList(migrations, selectedIndex);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf-8');

    process.stdin.on('data', (key) => {
      if (key === ARROW_UP) {
        selectedIndex = Math.max(0, selectedIndex - 1);
        renderList(migrations, selectedIndex);
      } else if (key === ARROW_DOWN) {
        selectedIndex = Math.min(migrations.length - 1, selectedIndex + 1);
        renderList(migrations, selectedIndex);
      } else if (key === '\r' || key === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve(migrations[selectedIndex]);
      } else if (key === ETX || key === ESC) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log('\nCancelled.');
        process.exit(0);
      }
    });
  });
}

async function main() {
  const migrations = getMigrations(searchName);

  if (migrations.length === 0) {
    console.error(`No migrations found with name "${searchName}".`);
    process.exit(1);
  }

  let selected;
  if (migrations.length === 1) {
    selected = migrations[0];
    console.log(`Found: ${formatDate(selected.date)}  ${selected.name}`);
  } else {
    selected = await selectMigration(migrations);
  }

  const finalName = newName || (await promptNewName());
  renameMigration(selected, finalName);
}

main();
