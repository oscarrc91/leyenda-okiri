import * as SQLite from 'expo-sqlite';

// Forzamos a TS a no quejarse de que no existen estos métodos:
const SQLiteAsync = SQLite as any;

let dbPromise: Promise<any> | null = null;

/**
 * Abre (o retorna) la base de datos de forma asíncrona.
 */
export function getDB(): Promise<any> {
  if (!dbPromise) {
    dbPromise = SQLiteAsync.openDatabaseAsync('okiri.db');
  }
  return dbPromise!;
}

/**
 * Crea la tabla `users` si no existe.
 */
export async function initDatabase(): Promise<void> {
  const db = await getDB();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        email      TEXT PRIMARY KEY NOT NULL,
        password   TEXT NOT NULL,
        created_at TEXT
      );
    `);
    console.log('✅ Tabla users creada');

    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS verification_codes (
        email     TEXT PRIMARY KEY NOT NULL,
        code      TEXT NOT NULL,
        sent_at   INTEGER NOT NULL
      );`
    );
    console.log('✅ Tabla verification_codes creada');
  } catch (err: any) {
    console.error('🚨 Error creando una tabla:', err);
  }
}