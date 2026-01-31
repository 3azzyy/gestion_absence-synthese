import axios from 'axios';

const API = process.env.API_BASE || 'http://127.0.0.1:8000/api';

async function run() {
  console.log('Starting E2E API smoke test');
  const username = 'e2e_' + Math.floor(Math.random()*100000);
  const pwd = 'Pwd12345';

  // register
  const reg = await axios.post(`${API}/register`, { username, password: pwd, full_name: 'E2E Tester' });
  console.log('register:', reg.status);

  // login
  const login = await axios.post(`${API}/login`, { username, password: pwd });
  const token = login.data?.data?.token;
  console.log('login:', login.status);

  const headers = { Authorization: `Bearer ${token}` };

  // create a group
  const groupRes = await axios.post(`${API}/groups`, { name: 'E2E Group ' + Date.now(), description: 'Created by E2E' }, { headers });
  console.log('create group:', groupRes.status, groupRes.data?.data?.id);
  const groupId = groupRes.data?.data?.id;

  // create a student
  const studentPayload = { cef: 'CEF' + Math.floor(Math.random()*90000+10000), first_name: 'E2E', last_name: 'Student', group_id: groupId };
  const studentRes = await axios.post(`${API}/students`, studentPayload, { headers });
  console.log('create student:', studentRes.status, studentRes.data?.data?.id);
  const studentId = studentRes.data?.data?.id;

  // create an absence for that student
  const absencePayload = { date: new Date().toISOString().slice(0,10), type: 'session', duration: 2, status: 'absent', session: 'S1', day_number: 1 };
  const absenceRes = await axios.post(`${API}/students/${studentId}/absences`, absencePayload, { headers });
  console.log('create absence:', absenceRes.status, absenceRes.data?.data?.id);
  const absenceId = absenceRes.data?.data?.id;

  // fetch student absences
  const listRes = await axios.get(`${API}/students/${studentId}/absences`, { headers });
  console.log('student absences count:', listRes.data?.data?.length);

  // update absence
  const updateRes = await axios.put(`${API}/absences/${absenceId}`, { status: 'justified' }, { headers });
  console.log('update absence:', updateRes.status, updateRes.data?.data?.status);

  // delete absence
  const delRes = await axios.delete(`${API}/absences/${absenceId}`, { headers });
  console.log('delete absence:', delRes.status);

  // sanctions config - list
  const sancList = await axios.get(`${API}/sanctions/config`, { headers });
  console.log('sanctions count:', sancList.data?.data?.length);

  // update a sanction config if exists
  if (sancList.data?.data?.length > 0) {
    const config = sancList.data.data[0];
    const upd = await axios.put(`${API}/sanctions/config`, { sanctions: [{...config, label: config.label + ' (updated)'}] }, { headers });
    console.log('update sanctions:', upd.status);
  }

  console.log('E2E API smoke test finished');
}

run().catch(e=>{ console.error('E2E error:', e.response?.data || e.message); process.exit(1); });
