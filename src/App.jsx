import { Navigate, Route, Routes } from 'react-router-dom'
import { getLab } from './examples/index.jsx'

const lab = getLab()

export default function App() {
  return (
    <Routes>
      {lab.map((route) => (
        <Route
          key={route.id}
          path={route.path}
          element={route.element}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
