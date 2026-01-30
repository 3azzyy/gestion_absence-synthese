import { DEFAULT_USERS } from './constants';

const AUTH_KEY = 'ista_auth_session';
const USERS_KEY = 'ista_users';

// Initialiser les utilisateurs par défaut
export const initDefaultUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
  }
};

// Vérifier la session
export const getSession = () => {
  const session = localStorage.getItem(AUTH_KEY);
  return session ? JSON.parse(session) : null;
};

// Créer une session
export const createSession = (user) => {
  const session = {
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    loginTime: new Date().toISOString()
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return session;
};

// Supprimer la session
export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY);
};

// Authentification
export const authenticateUser = (username, password) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY));
  const user = users[username];
  
  if (!user || user.password !== password) {
    return { success: false, error: 'Identifiants incorrects' };
  }
  
  // Mettre à jour la dernière connexion
  users[username].lastLogin = new Date().toISOString();
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  const session = createSession(user);
  return { success: true, user, session };
};