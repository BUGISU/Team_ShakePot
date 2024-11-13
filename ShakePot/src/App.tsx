import {BrowserRouter} from 'react-router-dom'
import RoutesSetup from './routes/RoutesSetup'
import {AuthProvider} from './routes/AuthContext'
function App() {
  return (
    // <main className="flex items-center justify-center w-full h-full">
    <main>
      <AuthProvider>
        <BrowserRouter>
          <RoutesSetup />
        </BrowserRouter>
      </AuthProvider>
    </main>
  )
}

export default App
