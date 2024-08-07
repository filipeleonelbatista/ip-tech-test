import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import Routes from './Routes.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthContextProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <Routes />
      <Toaster />
    </AuthContextProvider>
  </StrictMode>,
)
