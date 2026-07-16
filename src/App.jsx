import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LabLandingPage from './features/pdfcomponent/LabLandingPage.jsx'
import ExternalDataIntegrationPage from './features/pdfcomponent/ExternalDataIntegrationPage.jsx'
import PdfmeLabPage from './features/pdfcomponent/PdfmeLabPage.jsx'
import { getLabExamples } from './features/pdfcomponent/labs/examples/labExamples.js'

const labExamples = getLabExamples()

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LabLandingPage examples={labExamples} />} />
      <Route path="/lab" element={<LabLandingPage examples={labExamples} />} />
      <Route path="/lab/external-data-integration" element={<ExternalDataIntegrationPage />} />
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
