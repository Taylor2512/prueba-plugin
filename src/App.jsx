import React, { Suspense, lazy } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
const Pdfme = lazy(() => import('./pages/Pdfme'))

export default function App() {
  return (
    <div className="app-shell">
      <nav className="main-nav">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/pdfme">PDFME Lab</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/pdfme"
          element={(
            <Suspense fallback={<main><p>Cargando PDFME Lab...</p></main>}>
              <Pdfme />
            </Suspense>
          )}
        />
      </Routes>
    </div>
  )
}
