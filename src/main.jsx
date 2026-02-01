import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AllStorage from './local.jsx'
import MultiJsonAttendanceImporter from './importclasses/jsonabsenceimport.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <AllStorage />
    <MultiJsonAttendanceImporter /> */}
  </StrictMode>,
)