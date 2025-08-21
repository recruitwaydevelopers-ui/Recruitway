import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/auth-context.jsx'
import { CompanyProvider } from './context/company-context.jsx'
import { CandidateProvider } from './context/candidate-context.jsx'
import { SuperAdminProvider } from './context/superadmin-context.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <CompanyProvider>
        <CandidateProvider>
          <SuperAdminProvider>
            <App />
          </SuperAdminProvider>
        </CandidateProvider>
      </CompanyProvider>
    </AuthProvider>
  </BrowserRouter>
)
