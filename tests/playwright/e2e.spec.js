import { test, expect } from '@playwright/test';

const API = 'https://absence.compusmanager.com/api';

function toTrainee(student) {
  return {
    name: `${student.first_name} ${student.last_name}`,
    group: student.group?.name || 'Général',
    heures: student.hours ?? 0,
    retards: student.tardies ?? 0,
    indiscipline: 0
  };
}

test('UI smoke: login via API + render students + export CSV', async ({ page, request }) => {
  // 1) register + login via API
  const username = 'pw' + Date.now();
  const password = 'Pwd12345';
  await request.post(`${API}/register`, { data: { username, password, full_name: 'PW User' } });
  const login = await request.post(`${API}/login`, { data: { username, password } });
  const loginJson = await login.json();
  const token = loginJson.data.token;
  const user = loginJson.data.user;

  // Install session into localStorage before page loads
  const session = {
    username: user.username,
    fullName: user.full_name || user.fullName || user.username,
    role: user.role,
    token,
    loginTime: new Date().toISOString()
  };
  await page.addInitScript(value => localStorage.setItem('ista_auth_session', value), JSON.stringify(session));

  // 2) prepare a trainees dataset using an existing backend student so UI renders meaningful data
  const studentsRes = await request.get(`${API}/students`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } });
  if (studentsRes.status() !== 200) {
    const txt = await studentsRes.text();
    throw new Error(`Failed to fetch students: ${studentsRes.status()} - ${txt.slice(0,200)}`);
  }
  const studentsJson = await studentsRes.json();
  const firstStudent = studentsJson.data.data[0];
  const traineeId = 'ST' + Date.now();
  const appData = { trainees: { [traineeId]: toTrainee(firstStudent) } };
  await page.addInitScript(value => localStorage.setItem('gestion_absences_2025', value), JSON.stringify(appData));

  // 3) navigate to app
  await page.goto('/');

  // verify header shows logged in user's name
  await expect(page.locator('.user-badge')).toContainText(session.fullName);

  // go to Students tab
  await page.click('button:has-text("Stagiaires")');

  // assert students table contains the student name
  await expect(page.locator('table')).toContainText(appData.trainees[traineeId].name);

  // click Export and expect a CSV download
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('button:has-text("Exporter")')
  ]);
  const filename = download.suggestedFilename();
  expect(filename).toContain('students_export');

  // click the view button on the student's row (first button in row) and expect an alert
  const row = page.locator('tr', { hasText: appData.trainees[traineeId].name });
  await row.locator('button').first().click();
  await expect(page.locator('.alert-container')).toContainText('Vue détaillée à venir');
});
