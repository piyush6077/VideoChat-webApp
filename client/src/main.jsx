import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {createBrowserRouter , RouterProvider} from "react-router-dom"
import LobbyScreen from './screens/lobby.jsx'
import {SocketProvider} from './context/SocketProvider.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <LobbyScreen/>
  }
]) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>,
)
