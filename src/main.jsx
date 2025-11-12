import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "./index.css"
import Chatpage from './pages/chatpage.jsx'
import {Provider} from "react-redux";
import store from './redux/store.js'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, path: "/", element: <LandingPage /> },
      { path: "/chatpage", element: <Chatpage /> }
    ]
  }
])

const clientId = import.meta.env.VITE_clientId;

createRoot(document.getElementById('root')).render(

  <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
  <RouterProvider router={router}>
    <App />
  </RouterProvider>
    </Provider>
  </GoogleOAuthProvider>

)
