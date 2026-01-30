import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = onLogin(username.trim(), password);
    
    if (result.success) {
      setAlert({ type: 'success', message: '✓ Connexion réussie ! Chargement en cours...' });
    } else {
      setAlert({ type: 'danger', message: '✕ Identifiants incorrects. Veuillez réessayer.' });
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleInputChange = () => {
    setAlert(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#f5f5f5',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        maxHeight: 'calc(100vh - 40px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#ffffff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        {/* Section de bienvenue */}
        <div style={{
          background: 'linear-gradient(135deg, #003b7a 0%, #0066cc 100%)',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          overflow: 'hidden'
        }}>
          {/* Éléments décoratifs */}
          <div style={{
            content: '""',
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            bottom: '-150px',
            left: '-100px'
          }}></div>
          <div style={{
            content: '""',
            position: 'absolute',
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '50%',
            top: '-100px',
            right: '-80px'
          }}></div>

          {/* Logo Badge */}
          <div style={{
            position: 'absolute',
            top: '30px',
            left: '50px',
            width: '60px',
            height: '60px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width="40" height="40">
              <text x='50' y='65' fontFamily='Arial,sans-serif' fontSize='35' fontWeight='bold' fill='white' textAnchor='middle'>ISTA</text>
            </svg>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '12px',
              lineHeight: '1.2',
              letterSpacing: '-1px'
            }}>BIENVENUE</h1>
            <p style={{
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '8px',
              opacity: '0.95'
            }}>Suivi des Absences</p>
            
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              opacity: '0.85',
              marginTop: '20px'
            }}>
              Plateforme sécurisée de gestion et de suivi des absences pour l'administration de l'ISTA. 
              Accédez à votre espace de travail pour gérer efficacement les présences et absences.
            </p>
          </div>
        </div>
        
        {/* Section de connexion */}
        <div style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 40px)'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#212529',
              marginBottom: '6px'
            }}>Connexion Sécurisée</h2>
            <p style={{
              fontSize: '14px',
              color: '#495057',
              lineHeight: '1.5'
            }}>Veuillez vous authentifier pour accéder au système</p>
          </div>
          
          {alert && (
            <div style={{
              padding: '14px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: alert.type === 'danger' ? '#fee' : '#efe',
              border: `1px solid ${alert.type === 'danger' ? '#fcc' : '#cfc'}`,
              color: alert.type === 'danger' ? '#c00' : '#080',
              animation: 'slideDown 0.3s ease'
            }}>
              {alert.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#212529',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>Nom d'utilisateur</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#495057',
                  fontSize: '18px'
                }}>👤</span>
                <input 
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '2px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    color: '#212529',
                    background: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                  type="text"
                  placeholder="Entrez votre identifiant"
                  required 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleInputChange();
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003b7a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,59,122,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#212529',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#495057',
                  fontSize: '18px'
                }}>🔒</span>
                <input 
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    border: '2px solid #ced4da',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    color: '#212529',
                    background: '#ffffff',
                    transition: 'all 0.2s ease'
                  }}
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  required 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003b7a';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,59,122,0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ced4da';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '14px',
                background: '#003b7a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginTop: '4px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#001f3f';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,59,122,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#003b7a';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Connexion
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            max-width: 440px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
