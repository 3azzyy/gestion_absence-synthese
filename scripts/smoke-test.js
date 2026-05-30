import axios from 'axios';

const API = process.env.API_BASE || 'https://absence.compusmanager.com/api';

function now() { return new Date().toISOString(); }

async function run() {
  const results = { start: now(), steps: [] };
  const username = 'smoke' + Math.floor(Math.random()*1000000);
  const password = 'Pwd12345';

  // 1) Register
  try {
    const res = await axios.post(`${API}/register`, { username, password, full_name: 'Smoke Tester' }, { headers: { Accept: 'application/json' } });
    results.steps.push({ name: 'register', ok: true, status: res.status, data: res.data });
  } catch (err) {
    const r = err.response || {};
    results.steps.push({ name: 'register', ok: false, status: r.status || null, data: r.data || err.message });
  }

  // 2) Login
  let token = null;
  try {
    const res = await axios.post(`${API}/login`, { username, password }, { headers: { Accept: 'application/json' } });
    results.steps.push({ name: 'login', ok: true, status: res.status, data: res.data });
    token = res.data?.data?.token || (res.data && res.data.token) || null;
  } catch (err) {
    const r = err.response || {};
    results.steps.push({ name: 'login', ok: false, status: r.status || null, data: r.data || err.message });
  }

  // 3) GET /user (protected)
  try {
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await axios.get(`${API}/user`, { headers });
    results.steps.push({ name: 'get_user', ok: true, status: res.status, data: res.data });
  } catch (err) {
    const r = err.response || {};
    results.steps.push({ name: 'get_user', ok: false, status: r.status || null, data: r.data || err.message });
  }

  // 4) GET /students (protected)
  try {
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await axios.get(`${API}/students`, { headers });
    results.steps.push({ name: 'get_students', ok: true, status: res.status, data: res.data });
  } catch (err) {
    const r = err.response || {};
    results.steps.push({ name: 'get_students', ok: false, status: r.status || null, data: r.data || err.message });
  }

  // 5) GET /students/export/csv
  try {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await axios.get(`${API}/students/export/csv`, { headers, responseType: 'arraybuffer' });
    const contentType = res.headers['content-type'] || null;
    results.steps.push({ name: 'export_csv', ok: true, status: res.status, contentType, length: res.data?.byteLength || null });
  } catch (err) {
    const r = err.response || {};
    results.steps.push({ name: 'export_csv', ok: false, status: r.status || null, data: r.data || err.message });
  }

  results.end = now();
  console.log(JSON.stringify(results, null, 2));
}

run().catch(e=>{ console.error(e); process.exit(1); });
