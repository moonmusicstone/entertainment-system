import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Music from './pages/Music'
import Games from './pages/Games'
import Books from './pages/Books'
import { useThemeStore } from './stores/themeStore'
import { useEffect } from 'react'

function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/music" element={<Music />} />
            <Route path="/games" element={<Games />} />
            <Route path="/books" element={<Books />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: 'dark:bg-dark-800 dark:text-white',
        }}
      />
    </div>
  )
}

export default App