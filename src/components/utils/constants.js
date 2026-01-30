export const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export const DEFAULT_SANCTION_CONFIG = [
  { level: 1, name: 'Mise en garde (SC)', daysMin: 1, daysMax: 1.99, action: 'Lettre aux parents', color: '#fff3cd', code: 'SC' },
  { level: 2, name: '2ème mise en garde (SC)', daysMin: 2, daysMax: 2.99, action: 'Convocation parents', color: '#ffe8a1', code: 'SC' },
  { level: 3, name: '1er avertissement (D)', daysMin: 3, daysMax: 3.99, action: 'Avertissement écrit', color: '#ffcc80', code: 'D' },
  { level: 4, name: '2ème avertissement (D)', daysMin: 4, daysMax: 4.99, action: 'Convocation conseil', color: '#ffb84d', code: 'D' },
  { level: 5, name: 'Blâme (CD)', daysMin: 5, daysMax: 5.99, action: 'Conseil de classe', color: '#ff7043', code: 'CD' },
  { level: 6, name: 'Exclusion 2j (CD)', daysMin: 6, daysMax: 6.99, action: 'Exclusion temporaire 2j', color: '#ff8c66', code: 'CD' },
  { level: 7, name: 'Exclusion 5j (CD)', daysMin: 7, daysMax: 7.99, action: 'Exclusion temporaire 5j', color: '#ff6b4a', code: 'CD' },
  { level: 8, name: 'Exclusion 1sem (CD)', daysMin: 8, daysMax: 8.99, action: 'Exclusion 1 semaine', color: '#d04444', code: 'CD' },
  { level: 9, name: 'Exclusion 2sem (CD)', daysMin: 9, daysMax: 9.99, action: 'Exclusion 2 semaines', color: '#d04444', code: 'CD' },
  { level: 10, name: 'Conseil discipline (CD)', daysMin: 10, daysMax: 10.99, action: 'Conseil de discipline', color: '#d32f2f', code: 'CD' },
  { level: 11, name: 'Exclusion définitive', daysMin: 11, daysMax: 999, action: 'Exclusion définitive', color: '#8B0000', code: 'CDD' }
];

export const DEFAULT_USERS = {
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