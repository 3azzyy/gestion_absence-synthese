import axios from 'axios';
const API = process.env.API_BASE || 'http://127.0.0.1:8000/api';
(async ()=>{
  const username = 'stat_' + Math.floor(Math.random()*100000);
  const pwd = 'Pwd12345';
  await axios.post(`${API}/register`, { username, password: pwd, full_name: 'Stat Tester' });
  const login = await axios.post(`${API}/login`, { username, password: pwd });
  const token = login.data.data.token;
  const headers = { Authorization: `Bearer ${token}` };

  const absStats = await axios.get(`${API}/absences/statistics`, { headers });
  console.log('absences stats status:', absStats.status, 'keys:', Object.keys(absStats.data.data || {}));

  const stuStats = await axios.get(`${API}/students/statistics`, { headers });
  console.log('students stats status:', stuStats.status, 'keys:', Object.keys(stuStats.data.data || {}));
})().catch(e=>{ console.error('stats error', e.response?.data || e.message); process.exit(1); });