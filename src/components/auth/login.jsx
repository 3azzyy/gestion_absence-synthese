import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un délai pour l'effet de chargement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = onLogin(username.trim(), password);
    
    if (result.success) {
      setAlert({ type: 'success', message: '✓ Connexion réussie ! Redirection en cours...' });
    } else {
      setAlert({ type: 'danger', message: '✕ Identifiants incorrects. Veuillez réessayer.' });
      setIsSubmitting(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleInputChange = () => {
    setAlert(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Effet de grille en arrière-plan */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0,59,122,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,59,122,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        zIndex: 0
      }}></div>

      <div style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: '#ffffff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Section de bienvenue - Style Corporate */}
        <div style={{
          background: 'linear-gradient(135deg, #003b7a 0%, #001f3f 100%)',
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          overflow: 'hidden'
        }}>
          {/* Motif géométrique professionnel */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '300px',
            height: '300px',
            border: '60px solid rgba(255,255,255,0.03)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '350px',
            height: '350px',
            border: '70px solid rgba(255,255,255,0.03)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '-100px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.02)',
            transform: 'rotate(45deg)',
            pointerEvents: 'none'
          }}></div>

          {/* Logo professionnel */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '6px'
            }}>
              <img 
                src="Logo_ofppt-removebg-preview.png" 
                alt="OFPPT Logo" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              opacity: 0.9
            }}>
              Administration
            </div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 1, marginTop: '40px' }}>
            <div style={{
              fontSize: '13px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              opacity: 0.7,
              marginBottom: '16px'
            }}>
              Plateforme Administrative
            </div>
            
            <h1 style={{
              fontSize: '42px',
              fontWeight: '700',
              marginBottom: '20px',
              lineHeight: '1.2',
              letterSpacing: '-1.5px'
            }}>
              Système de Gestion<br/>des Absences
            </h1>
            
            <div style={{
              width: '60px',
              height: '4px',
              background: 'rgba(255,255,255,0.4)',
              marginBottom: '24px'
            }}></div>
            
            <p style={{
              fontSize: '15px',
              lineHeight: '1.8',
              opacity: 0.85,
              fontWeight: '400',
              maxWidth: '380px'
            }}>
              Accédez à l'interface d'administration pour gérer le suivi des présences, 
              analyser les statistiques et générer les rapports de l'établissement.
            </p>

            {/* Badges de sécurité */}
            <div style={{
              marginTop: '40px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Connexion Sécurisée</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>Chiffrement SSL</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Section de connexion - Style Pro */}
        <div style={{
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff'
        }}>
          {/* En-tête du formulaire */}
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1a2332',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>Authentification</h2>
            <p style={{
              fontSize: '14px',
              color: '#5a6c7d',
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              Connectez-vous avec vos identifiants d'administration
            </p>
          </div>
          
          {/* Alerte */}
          {alert && (
            <div style={{
              padding: '16px 18px',
              borderRadius: '10px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: alert.type === 'danger' ? '#fff5f5' : '#f0fdf4',
              border: `2px solid ${alert.type === 'danger' ? '#fecaca' : '#bbf7d0'}`,
              color: alert.type === 'danger' ? '#991b1b' : '#166534',
              animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: alert.type === 'danger' ? '#dc2626' : '#16a34a'
              }}></div>
              {alert.message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Champ Username */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1a2332',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Identifiant</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 1
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input 
                  style={{
                    width: '100%',
                    padding: '15px 20px 15px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    color: '#1a2332',
                    background: '#f9fafb',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  type="text"
                  placeholder="Votre nom d'utilisateur"
                  required 
                  autoComplete="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    handleInputChange();
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003b7a';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0,59,122,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            {/* Champ Password avec Toggle Professionnel */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1a2332',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 1
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input 
                  style={{
                    width: '100%',
                    padding: '15px 52px 15px 48px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    fontWeight: '500',
                    color: '#1a2332',
                    background: '#f9fafb',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  required 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    handleInputChange();
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#003b7a';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 4px rgba(0,59,122,0.08)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  disabled={isSubmitting}
                />
                
                {/* Bouton Toggle Password - Style Professionnel */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isSubmitting}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    transition: 'all 0.2s ease',
                    borderRadius: '6px',
                    opacity: isSubmitting ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.currentTarget.style.color = '#003b7a';
                      e.currentTarget.style.background = 'rgba(0,59,122,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#6b7280';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    // Icône Eye Off
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    // Icône Eye
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Bouton de connexion avec effet de chargement */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '16px',
                background: isSubmitting ? '#6b7280' : 'linear-gradient(135deg, #003b7a 0%, #001f3f 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isSubmitting ? 'none' : '0 4px 14px rgba(0,59,122,0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,59,122,0.35)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(0,59,122,0.25)';
                }
              }}
            >
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 968px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          
          div[style*="grid-template-columns"] > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;