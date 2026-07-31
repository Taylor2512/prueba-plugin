import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { getLabExamples } from './examples/index.jsx'

const labExamples = getLabExamples()

export default function App() {
  return (
    <Routes>
      {labExamples.map((example) => (
        <Route
          key={example.id}
          path={example.path}
          element={example.element}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
