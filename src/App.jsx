import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LabLandingPage from './features/pdfcomponent/LabLandingPage.jsx'
import PdfmeLabPage from './features/pdfcomponent/PdfmeLabPage.jsx'
import { getLabExamples } from './features/pdfcomponent/examples/labExamples.js'
import './features/pdfcomponent/labRoutes.css'

const labExamples = getLabExamples()

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LabLandingPage examples={labExamples} />} />
      <Route path="/lab" element={<LabLandingPage examples={labExamples} />} />
      {labExamples.map((example) => (
        <Route
          key={example.id}
          path={example.path}
          element={<PdfmeLabPage key={example.id} exampleId={example.id} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
