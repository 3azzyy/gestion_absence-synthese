import { X, AlertOctagon, UserMinus, Trash2 } from "lucide-react";
import { useState } from "react";
import api from "../../../services/http";

export default function ConfirmeDeletemodal({ trainee, onClose }) {
    const [cef, setCef] = useState("");
    const [loading, setLoading] = useState(false);
    const confirmation = trainee.cef;

    const ConfirmeDelete = async () => {
        if (cef === confirmation) {
            setLoading(true);
            try {
                const response = await api.delete(`/students/${trainee.id}`);
                if (response.data.success) {
                    window.location.reload();
                    onClose();
                }
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert("Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        }
    };

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.8)', // Bleu-nuit profond
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)',
        },
        container: {
            backgroundColor: '#fff',
            width: '100%',
            maxWidth: '500px',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            border: '1px solid #f87171',
        },
        header: {
            padding: '24px',
            backgroundColor: '#7f1d1d', // Rouge bordeaux sérieux
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        },
        body: {
            padding: '30px',
        },
        dangerZone: {
            backgroundColor: '#fff1f2',
            border: '1px dashed #f43f5e',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
        },
        input: {
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: cef === confirmation ? '2px solid #ef4444' : '1px solid #d1d5db',
            fontSize: '1.1rem',
            textAlign: 'center',
            marginTop: '12px',
            outline: 'none',
            fontWeight: 'bold',
            backgroundColor: '#f9fafb',
            letterSpacing: '1px'
        },
        btnConfirm: {
            backgroundColor: cef === confirmation ? '#ef4444' : '#fca5a5',
            color: 'white',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '700',
            cursor: cef === confirmation ? 'pointer' : 'not-allowed',
            width: '100%',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
        }
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.container} onClick={e => e.stopPropagation()}>
                
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertOctagon size={28} color="#fca5a5" />
                        <h2 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Action irréversible</h2>
                    </div>
                    <X size={24} onClick={onClose} style={{ cursor: 'pointer', opacity: 0.8 }} />
                </div>

                <div style={styles.body}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <p style={{ color: '#64748b', marginBottom: '8px', fontSize: '1rem' }}>Vous allez supprimer définitivement :</p>
                        <h3 style={{ fontSize: '1.8rem', margin: 0, color: '#1e293b', fontWeight: '900' }}>
                            {trainee.full_name}
                        </h3>
                    </div>

                    <div style={styles.dangerZone}>
                        <UserMinus size={40} color="#f43f5e" />
                        <div>
                            <p style={{ margin: 0, color: '#9f1239', fontWeight: 'bold', fontSize: '0.95rem' }}>Conséquences :</p>
                            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', color: '#be123c', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                <li>Le profil du stagiaire sera supprimé.</li>
                                <li>Toutes ses absences liées au matricule {confirmation} seront effacées.</li>
                                <li>Cette opération sera tracée dans l'audit système.</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '0.9rem', color: '#475569', fontWeight: '600', display: 'block', textAlign: 'center' }}>
                            Saisissez le code CEF <span style={{color: '#ef4444'}}>{confirmation}</span> pour confirmer :
                        </label>
                        <input
                            type="text"
                            style={styles.input}
                            placeholder="Entrez le CEF ici"
                            value={cef}
                            onChange={(e) => setCef(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={ConfirmeDelete}
                            disabled={loading || cef !== confirmation}
                            style={styles.btnConfirm}
                        >
                            {loading ? "Suppression en cours..." : <><Trash2 size={20} /> Supprimer définitivement</>}
                        </button>
                        
                        <button 
                            onClick={onClose} 
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', padding: '8px' }}
                        >
                            Annuler et revenir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}