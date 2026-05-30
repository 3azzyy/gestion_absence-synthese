import { authAPI } from '../services/api';

const AUTH_KEY = 'ista_auth_session';
const USERS_KEY = 'ista_users';
const LOGIN_ATTEMPTS_KEY = 'ista_login_attempts';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;

// Utilisateurs par défaut
const DEFAULT_USERS = {
  admin: {
    username: 'admin',
    password: 'admin123',
    fullName: 'Administrateur',
    role: 'admin',
    createdAt: new Date().toISOString()
  },
  prof: {
    username: 'prof',
    password: 'prof123',
    fullName: 'Professeur',
    role: 'prof',
    createdAt: new Date().toISOString()
  },
  viewer: {
    username: 'viewer',
    password: 'viewer123',
    fullName: 'Observateur',
    role: 'viewer',
    createdAt: new Date().toISOString()
  }
};

const safeLocalStorageGet = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Erreur lecture ${key}:`, error);
    return null;
  }
};

const safeLocalStorageSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Erreur écriture ${key}:`, error);
    return false;
  }
};

// Initialiser les utilisateurs par défaut (FONCTION AJOUTÉE)
export const initDefaultUsers = () => {
  try {
    const existingUsers = safeLocalStorageGet(USERS_KEY);
    if (!existingUsers) {
      const success = safeLocalStorageSet(USERS_KEY, DEFAULT_USERS);
      if (!success) {
        throw new Error('Impossible de créer les utilisateurs par défaut');
      }
    }
  } catch (error) {
    console.error('Erreur initialisation utilisateurs:', error);
    throw error;
  }
};

export const getSession = () => {
  try {
    const session = safeLocalStorageGet(AUTH_KEY);
    if (session && session.loginTime) {
      const loginDate = new Date(session.loginTime);
      const now = new Date();
      const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
      if (hoursSinceLogin > 24) {
        clearSession();
        return null;
      }
    }
    return session;
  } catch (error) {
    console.error('Erreur vérification session:', error);
    return null;
  }
};

export const createSession = (user, token) => {
  try {
    const session = {
      username: user.username,
      fullName: user.full_name || user.fullName,
      role: user.role,
      token: token,
      loginTime: new Date().toISOString()
    };
    const success = safeLocalStorageSet(AUTH_KEY, session);
    if (!success) throw new Error('Impossible de créer la session');
    return session;
  } catch (error) {
    console.error('Erreur création session:', error);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
    return true;
  } catch (error) {
    console.error('Erreur suppression session:', error);
    return false;
  }
};

const getLoginAttempts = () => {
  return safeLocalStorageGet(LOGIN_ATTEMPTS_KEY) || { count: 0, lastAttempt: null, lockedUntil: null };
};

const incrementLoginAttempts = () => {
  const attempts = getLoginAttempts();
  attempts.count += 1;
  attempts.lastAttempt = new Date().toISOString();
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
  }
  safeLocalStorageSet(LOGIN_ATTEMPTS_KEY, attempts);
  return attempts;
};

const resetLoginAttempts = () => {
  safeLocalStorageSet(LOGIN_ATTEMPTS_KEY, { count: 0, lastAttempt: null, lockedUntil: null });
};

const isAccountLocked = () => {
  const attempts = getLoginAttempts();
  if (!attempts.lockedUntil) return false;
  const now = new Date();
  const lockedUntil = new Date(attempts.lockedUntil);
  if (now < lockedUntil) {
    const minutesLeft = Math.ceil((lockedUntil - now) / (1000 * 60));
    return { locked: true, minutesLeft };
  }
  resetLoginAttempts();
  return false;
};

const validateInput = (username, password) => {
  const errors = [];
  if (!username || username.trim().length === 0) errors.push('Le nom d\'utilisateur est requis');
  if (!password || password.length === 0) errors.push('Le mot de passe est requis');
  if (username && username.length > 50) errors.push('Le nom d\'utilisateur est trop long');
  if (password && password.length > 100) errors.push('Le mot de passe est trop long');
  const dangerousChars = /[<>'"]/;
  if (username && dangerousChars.test(username)) errors.push('Le nom d\'utilisateur contient des caractères non autorisés');
  return errors;
};

// VERSION POUR MODE LOCAL (sans backend)
const authenticateUserLocal = (username, password) => {
  try {
    const users = safeLocalStorageGet(USERS_KEY);
    if (!users) {
      return { 
        success: false, 
        error: 'Erreur système : impossible de charger les utilisateurs',
        systemError: true
      };
    }
    
    const user = users[username];
    
    if (!user || user.password !== password) {
      const attempts = incrementLoginAttempts();
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts.count;
      
      if (remainingAttempts > 0) {
        return { 
          success: false, 
          error: `Identifiants incorrects. ${remainingAttempts} tentative(s) restante(s).`,
          remainingAttempts: remainingAttempts
        };
      } else {
        return { 
          success: false, 
          error: `Trop de tentatives échouées. Compte verrouillé pendant 15 minutes.`,
          locked: true
        };
      }
    }
    
    // Connexion réussie
    resetLoginAttempts();
    
    users[username].lastLogin = new Date().toISOString();
    safeLocalStorageSet(USERS_KEY, users);
    
    const session = createSession(user, 'local-token-' + Date.now());
    if (!session) {
      return { 
        success: false, 
        error: 'Erreur lors de la création de session',
        systemError: true
      };
    }
    
    return { success: true, user, session };
    
  } catch (error) {
    console.error('Erreur critique authentification:', error);
    return { 
      success: false, 
      error: 'Erreur système. Veuillez réessayer plus tard.',
      systemError: true,
      details: error.message
    };
  }
};

// VERSION POUR MODE API (avec backend Laravel)
const authenticateUserAPI = async (username, password) => {
  try {
    const result = await authAPI.login(username, password);
    
    if (result.success) {
      resetLoginAttempts();
      const session = createSession(result.data.user, result.data.token);
      if (!session) {
        return { success: false, error: 'Erreur lors de la création de session', systemError: true };
      }
      return { success: true, user: result.data.user, session };
    } else {
      const attempts = incrementLoginAttempts();
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts.count;
      if (remainingAttempts > 0) {
        return { 
          success: false, 
          error: `${result.error}. ${remainingAttempts} tentative(s) restante(s).`,
          remainingAttempts: remainingAttempts
        };
      } else {
        return { 
          success: false, 
          error: 'Trop de tentatives échouées. Compte verrouillé pendant 15 minutes.',
          locked: true
        };
      }
    }
  } catch (error) {
    console.error('Erreur critique authentification:', error);
    return { 
      success: false, 
      error: 'Erreur système. Veuillez réessayer plus tard.',
      systemError: true,
      details: error.message
    };
  }
};

// Fonction principale d'authentification
export const authenticateUser = async (username, password) => {
  const lockStatus = isAccountLocked();
  if (lockStatus && lockStatus.locked) {
    return { 
      success: false, 
      error: `Compte temporairement verrouillé. Réessayez dans ${lockStatus.minutesLeft} minute(s).`,
      locked: true
    };
  }
  
  const validationErrors = validateInput(username, password);
  if (validationErrors.length > 0) {
    return { success: false, error: validationErrors[0], validationError: true };
  }
  
  // Déterminer si on utilise le mode API ou local
  const useAPI = import.meta.env.VITE_USE_API === 'true';
  
  if (useAPI) {
    return await authenticateUserAPI(username, password);
  } else {
    return authenticateUserLocal(username, password);
  }
};

export const logoutUser = async () => {
  try {
    const useAPI = import.meta.env.VITE_USE_API === 'true';
    if (useAPI) {
      await authAPI.logout();
    }
    clearSession();
    return { success: true };
  } catch (error) {
    console.error('Erreur déconnexion:', error);
    clearSession();
    return { success: true };
  }
};

export const unlockAccount = () => {
  resetLoginAttempts();
  return { success: true, message: 'Compte débloqué' };
};

export const getLoginStatus = () => {
  const attempts = getLoginAttempts();
  const lockStatus = isAccountLocked();
  return {
    attempts: attempts.count,
    locked: lockStatus ? lockStatus.locked : false,
    minutesLeft: lockStatus ? lockStatus.minutesLeft : 0
  };
};