import { getDB } from './database';

export type AuthResult = {
  success: boolean;
  error?: string;
};
// Helpers de validación
const MIN_LENGTH = 8;
const hasUppercase   = (s: string) => /[A-Z]/.test(s);
const hasLowercase   = (s: string) => /[a-z]/.test(s);
const hasNumber      = (s: string) => /\d/.test(s);
const hasSpecialChar = (s: string) => /[^A-Za-z0-9]/.test(s);

 /**
  * Inserta un nuevo usuario en `users`.
  * @returns true si todo OK, false si falla (p.ej. duplicado).
  */
export async function registerUser(
  email: string,
  password: string
): Promise<AuthResult> {
  const db = await getDB();

  // 1) email no puede estar vacío ni ya registrado
  if (!email.trim()) {
    return { success: false, error: 'El email no puede estar vacío.' };
  }
  const exists: any = await db.getFirstAsync(
    `SELECT 1 FROM users WHERE email = ?;`,
    email
  );
  if (exists) {
    return { success: false, error: 'Ya existe una cuenta con ese email.' };
  }

  // 2) validaciones de contraseña
  if (password.length < MIN_LENGTH) {
    return { success: false, error: `La contraseña debe tener al menos ${MIN_LENGTH} caracteres.` };
  }
  if (!hasUppercase(password)) {
    return { success: false, error: 'La contraseña debe incluir al menos una mayúscula.' };
  }
  if (!hasLowercase(password)) {
    return { success: false, error: 'La contraseña debe incluir al menos una minúscula.' };
  }
  if (!hasNumber(password)) {
    return { success: false, error: 'La contraseña debe incluir al menos un número.' };
  }
  if (!hasSpecialChar(password)) {
    return { success: false, error: 'La contraseña debe incluir al menos un carácter especial.' };
  }

  // 3) insertar usuario
  try {
    await db.runAsync(
      `INSERT INTO users (email, password, provider, created_at)
       VALUES (?, ?, 'email', datetime('now'));`,
      email,
      password
    );
    return { success: true };
  } catch (err: any) {
    console.error('🚨 registerUser error:', err);
    return { success: false, error: 'Error interno al registrar. Intenta más tarde.' };
  }
}

/**
 * Busca un usuario con email+password.
 * @returns true si coincide, false si no o hay error.
 */
export async function loginUser(
  email: string,
  password: string
): Promise<boolean> {
  const db = await getDB();
  try {
    const row = await db.getFirstAsync(
      'SELECT email FROM users WHERE email = ? AND password = ?;',
      email,
      password
    );
    const found = !!row;
    console.log('🔍 Login', found ? 'OK' : 'KO', email);
    return found;
  } catch (err: any) {
    console.error('🚨 Error en login:', err);
    return false;
  }
}

/** Genera un código de 6 dígitos */
function makeCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Envía un código al email (simulado) y guarda timestamp.
 * Sólo permite un envío cada 5 minutos.
 */
export async function sendVerificationCode(email: string): Promise<boolean> {
  const db = await getDB();

  // 1) Comprobar existencia de usuario
  const user: any = await db.getFirstAsync(
    'SELECT email FROM users WHERE email = ?;',
    email
  );
  if (!user) {
    console.warn(`✉️ sendVerificationCode: email no registrado → ${email}`);
    return false;
  }

  // 2) Comprobar límite de reenvío (1 envío/5min)
  const now = Date.now();
  const row: any = await db.getFirstAsync(
    'SELECT sent_at FROM verification_codes WHERE email = ?;',
    email
  );
  if (row) {
    const minsSince = (now - row.sent_at) / 1000 / 60;
    if (minsSince < 5) {
      console.warn(`✉️ sendVerificationCode: reenvío bloqueado (${minsSince.toFixed(1)} min)`);
      return false;
    }
  }

  // 3) Generar y guardar código
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await db.runAsync(
    `INSERT OR REPLACE INTO verification_codes (email, code, sent_at)
     VALUES (?, ?, ?);`,
    email,
    code,
    now
  );

  // 4) Envío “simulado”
  console.log(`✉️ Código para ${email}: ${code}`);
  // Aquí llamarías a tu API real de envío de correo

  return true;
}

/**
 * Comprueba que el código coincide y es reciente (digamos <30 min).
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<boolean> {
  const db = await getDB();
  const row: any = await db.getFirstAsync(
    'SELECT code, sent_at FROM verification_codes WHERE email = ?;',
    email
  );
  if (!row) return false;
  if (row.code !== code) return false;
  // opcionalmente verificar caducidad:
  if ((Date.now() - row.sent_at) / 1000 / 60 > 30) return false;
  return true;
}

/**
 * Cambia la contraseña de un usuario tras:
 * - comprobar que existe el email,
 * - que la nueva sea distinta,
 * - y que cumpla cada regla de complejidad.
 */
export async function resetPassword(
  email: string,
  newPassword: string
): Promise<AuthResult> {
  const db = await getDB();

  // 1) ¿Existe el usuario?
  const row: any = await db.getFirstAsync(
    `SELECT password FROM users WHERE email = ?;`,
    email.trim()
  );
  if (!row) {
    return { success: false, error: 'Email no registrado.' };
  }

  const current = row.password as string;

  try {
    // 2) Distinta de la actual?
    if (newPassword.trim() === current.trim()) {
      return { success: false, error: 'La nueva contraseña debe ser distinta de la actual.' };
    }

    // 3) Validaciones de complejidad
    if (newPassword.length < MIN_LENGTH) {
      return { success: false, error: `Debe tener al menos ${MIN_LENGTH} caracteres.` };
    }
    if (!hasUppercase(newPassword)) {
      return { success: false, error: 'Debe incluir al menos una letra mayúscula.' };
    }
    if (!hasLowercase(newPassword)) {
      return { success: false, error: 'Debe incluir al menos una letra minúscula.' };
    }
    if (!hasNumber(newPassword)) {
      return { success: false, error: 'Debe incluir al menos un número.' };
    }
    if (!hasSpecialChar(newPassword)) {
      return { success: false, error: 'Debe incluir al menos un carácter especial.' };
    }

    // 4) Si todo OK, actualizamos
    const result: any = await db.runAsync(
      `UPDATE users SET password = ? WHERE email = ?;`,
      newPassword,
      email
    );
    /* const rows = result.rowsAffected ?? 0;
    if (rows === 0) {
      return { success: false, error: 'No se pudo actualizar la contraseña.' };
    } */
    return { success: true };
  } catch (err: any) {
    console.error('[resetPassword] Error en UPDATE:', err);
    return { success: false, error: 'Error interno. Inténtalo más tarde.' };
  }
}