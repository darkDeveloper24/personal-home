import { Navigate, Route, Routes } from 'react-router-dom'

import { AppShell } from './components/layout/AppShell'
import { BodyPage } from './routes/BodyPage'
import { MoneyPage } from './routes/MoneyPage'
import { NotFoundPage } from './routes/NotFoundPage'
import { WorkPage } from './routes/WorkPage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Navigate to="/work" replace />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/body" element={<BodyPage />} />
        <Route path="/money" element={<MoneyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
