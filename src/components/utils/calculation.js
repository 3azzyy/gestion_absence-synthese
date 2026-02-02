export const calculateDays = (heures, retards, settings) => {
  const joursAbs = Number(heures || 0) / settings.hoursPerDay;
  const joursRet = Math.floor(Number(retards || 0) / settings.retardsPerDay);
  return joursAbs + joursRet;
};

export const sanctionLabel = (days, sanctionConfig) => {
  const d = Number(days);
  for (let sanction of sanctionConfig) {
    if (d >= sanction.daysMin && d <= sanction.daysMax) {
      return {
        code: sanction.code,
        label: sanction.name,
        action: sanction.action,
        color: sanction.color,
        level: sanction.level
      };
    }
  }
  return { code: 'Normal', label: 'Normal', action: 'Aucune', color: '#2e7d32', level: 0 };
};

export const exportToCSV = (trainees, settings, sanctionConfig) => {
  const headers = ['Matricule', 'Nom', 'Groupe', 'Heures', 'Retards', 'Jours', 'Assiduité', 'Sanction', 'Action'];
  
  const rows = trainees.map(t => [
    t.id,
    t.name,
    t.group,
    t.heures.toFixed(1),
    t.retards,
    t.days.toFixed(2),
    t.attendance.toFixed(1) + '/10',
    t.sanction.label,
    t.sanction.action
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `absences_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};