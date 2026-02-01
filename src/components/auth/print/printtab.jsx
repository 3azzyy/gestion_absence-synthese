import React, { useState } from 'react';
import { FileText, Printer } from 'lucide-react';

const PrintTab = ({ trainees, sanctionConfig }) => {
  const [printLevel, setPrintLevel] = useState('all');
  const [printFormat, setPrintFormat] = useState('detailed');
  const [preview, setPreview] = useState('');

  const uniqueCodes = [...new Set(sanctionConfig.map(s => s.code))];

  const generatePrintList = () => {
    let filtered = [...trainees];

    if (printLevel !== 'all') {
      if (printLevel === 'CD-Exclusion') {
        filtered = filtered.filter(t => t.days >= 6);
      } else {
        filtered = filtered.filter(t => t.sanction.code === printLevel);
      }
    }

    filtered.sort((a, b) => b.days - a.days);

    if (filtered.length === 0) {
      setPreview('<div class="alert alert-info">Aucun stagiaire ne correspond à ce niveau</div>');
      return;
    }

    let html = `<div style="background:white;padding:20px;">`;

    if (printFormat === 'simple') {
      html += `<table class="table"><thead><tr><th>N°</th><th>Nom complet</th><th>Groupe</th><th>Jours</th><th>Sanction</th></tr></thead><tbody>`;
      filtered.forEach((t, i) => {
        html += `<tr><td>${i+1}</td><td>${t.name}</td><td>${t.group}</td><td>${t.days.toFixed(2)}</td><td>${t.sanction.label}</td></tr>`;
      });
      html += '</tbody></table>';
    } else if (printFormat === 'detailed') {
      html += `<table class="table"><thead><tr><th>N°</th><th>Nom</th><th>Groupe</th><th>Heures</th><th>Retards</th><th>Jours</th><th>Assiduité</th><th>Sanction</th></tr></thead><tbody>`;
      filtered.forEach((t, i) => {
        html += `<tr>
          <td>${i+1}</td>
          <td><strong>${t.name}</strong></td>
          <td>${t.group}</td>
          <td>${t.heures.toFixed(1)}</td>
          <td>${t.retards}</td>
          <td>${t.days.toFixed(2)}</td>
          <td>${t.attendance.toFixed(1)}%</td>
          <td><span style="background:${t.sanction.color};padding:4px 8px;border-radius:4px;font-size:11px;color:#fff">${t.sanction.label}</span></td>
        </tr>`;
      });
      html += '</tbody></table>';
    }

    html += '</div>';
    setPreview(html);
  };

  const handlePrint = () => {
    if (!preview) {
      alert('Veuillez d\'abord générer une liste');
      return;
    }
    window.print();
  };

  return (
    <div className="card">
      <h2 className="card-header">Listes d'impression par niveau</h2>
      <p style={{color: 'var(--text-secondary)', marginBottom: 20}}>
        Générez et imprimez des listes de stagiaires par niveau de sanction.
      </p>

      <div className="controls-grid" style={{marginBottom: 20}}>
        <div className="form-group">
          <label className="form-label">Sélectionner le niveau</label>
          <select className="input" value={printLevel} onChange={(e) => setPrintLevel(e.target.value)}>
            <option value="all">Tous les stagiaires</option>
            <option value="Normal">Normal (Aucune sanction)</option>
            {uniqueCodes.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="CD-Exclusion">CD - Exclusion</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Format</label>
          <select className="input" value={printFormat} onChange={(e) => setPrintFormat(e.target.value)}>
            <option value="detailed">Détaillé (avec statistiques)</option>
            <option value="simple">Simple (liste nominative)</option>
          </select>
        </div>
        <button className="btn" onClick={generatePrintList}>
          <FileText size={16} /> Générer la liste
        </button>
        <button className="btn btn-success" onClick={handlePrint}>
          <Printer size={16} /> Imprimer
        </button>
      </div>

      <div className="print-content" dangerouslySetInnerHTML={{ __html: preview }} />
    </div>
  );
};

export default PrintTab;
