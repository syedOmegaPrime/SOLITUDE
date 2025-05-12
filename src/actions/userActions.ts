'use server';
import { getDb } from '@/lib/db';
import type { User } from '@/types';
// WARNING: Storing passwords in plain text is insecure. Use hashing in a real app.

export async function registerUser(name: string, email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const db = getDb();
  try {
    const existingUserStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const existingUser = existingUserStmt.get(email);
    if (existingUser) {
      return { success: false, error: 'User already exists with this email.' };
    }

    const id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    // For the User type, password is not part of it as it's client-facing.
    // We handle password only within this server action.
    const newUser: User = { id, email, name }; 

    const insertStmt = db.prepare('INSERT INTO users (id, email, name, password) VALUES (?, ?, ?, ?)');
    insertStmt.run(newUser.id, newUser.email, newUser.name, pass); // Store password (plain text)
    
    return { success: true, user: newUser };
  } catch (error: any) {
    console.error('Error registering user:', error);
    return { success: false, error: error.message || 'Failed to register user.' };
  }
}

export async function loginUser(email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const db = getDb();
  try {
    // Select user fields excluding password for client-side User object
    const stmt = db.prepare('SELECT id, email, name FROM users WHERE email = ? AND password = ?');
    const userFromDb = stmt.get(email, pass) as User | undefined; 

    if (userFromDb) {
      return { success: true, user: userFromDb };
    } else {
      return { success: false, error: 'Invalid email or password.' };
    }
  } catch (error: any) {
    console.error('Error logging in user:', error);
    return { success: false, error: error.message || 'Failed to log in.' };
  }
}
