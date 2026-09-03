import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';

const SRC = join(process.cwd(), 'src');

function repositoryFiles(): string[] {
  return readdirSync(SRC, { recursive: true })
    .map(String)
    .map((file) => file.replaceAll('\\', '/'))
    .filter((file) => file.includes('infrastructure/typeorm/'))
    .filter((file) => file.endsWith('.repository.ts'));
}

it('todo repositorio de TypeORM extiende BaseTypeOrmRepository', () => {
  const files = repositoryFiles();
  expect(files.length).toBeGreaterThan(0);

  const offenders: string[] = [];

  for (const file of files) {
    const source = ts.createSourceFile(
      file,
      readFileSync(join(SRC, file), 'utf8'),
      ts.ScriptTarget.Latest,
    );

    source.forEachChild((node) => {
      if (!ts.isClassDeclaration(node) || !node.name) return;

      const isAbstract = node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.AbstractKeyword,
      );
      if (isAbstract) return;

      const extendsBase = node.heritageClauses?.some(
        (clause) =>
          clause.token === ts.SyntaxKind.ExtendsKeyword &&
          clause.types.some(
            (type) =>
              ts.isIdentifier(type.expression) &&
              type.expression.text === 'BaseTypeOrmRepository',
          ),
      );

      if (!extendsBase) offenders.push(`${node.name.text} (${file})`);
    });
  }

  expect(offenders).toEqual([]);
});
