export function resolveEnvFilePath(): string {
  return process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
}
