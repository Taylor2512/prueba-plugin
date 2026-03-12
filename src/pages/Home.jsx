import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <main>
      <h1>sisadbeta</h1>
      <p>Proyecto Vite con integración local de paquetes `@pdfme/*`.</p>
      <p>
        Abre el <Link to="/pdfme">PDFME Lab</Link> para probar la edición, render y conversión de
        PDFs.
      </p>
    </main>
  )
}
