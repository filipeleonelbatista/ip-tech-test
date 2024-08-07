import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import Routes from './Routes'
import { AuthContextProvider } from './contexts/AuthContext'
import { PatientProvider } from './contexts/PatientsContext'
import { Toaster } from './components/ui/toaster'
import { AtendimentoProvider } from './contexts/AtendimentosContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <PatientProvider>
        <AtendimentoProvider>
          <Routes />
          <Toaster />
        </AtendimentoProvider>
      </PatientProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
