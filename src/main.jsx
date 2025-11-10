import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, path: "/", element: <LandingPage /> }
    ]
  }
])

const clientId = import.meta.env.VITE_clientId;

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId={clientId}>
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
  </GoogleOAuthProvider>

)
