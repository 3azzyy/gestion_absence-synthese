import { DEFAULT_SANCTION_CONFIG } from "./constants";

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


export const formatstudents = (students) => {
  if (!students || !Array.isArray(students)) return [];

  const sanctionConfig = DEFAULT_SANCTION_CONFIG;

  return students.map(student => 
  {
    const sanction = sanctionLabel(student.hours / 10 , sanctionConfig);

    return {
    ...student,
    id: student.id,
    cef : student.cef,
    sanction: sanction,
    name: student.full_name,
    days: parseFloat(student.days_absent) || 0,
    heures: parseFloat(student.hours) || 0,
    retards: student.tardies || 0,
    attendance: Math.max(0, 10 - (student.hours) / 10), // Assuming 10 hours = 1 day
    group: student.group?.name || student.class_group || 'Sans Groupe',
    absenceHistory: student.absences || []
  }
});
};