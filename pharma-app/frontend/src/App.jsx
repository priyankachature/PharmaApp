import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DrugList from './pages/DrugList'
import DrugForm from './pages/DrugForm'
import DrugSearch from './pages/DrugSearch'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'
import StockHistory from './pages/StockHistory'
import ExpiryReport from './pages/ExpiryReport'
import LowStockReport from './pages/LowStockReport'

function AppLayout({ children }) {
  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><Dashboard /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/drugs" element={
            <ProtectedRoute>
              <AppLayout><DrugList /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/drugs/new" element={
            <ProtectedRoute>
              <AppLayout><DrugForm /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/drugs/edit/:id" element={
            <ProtectedRoute>
              <AppLayout><DrugForm /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/drugs/search" element={
            <ProtectedRoute>
              <AppLayout><DrugSearch /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/stock/in" element={
            <ProtectedRoute>
              <AppLayout><StockIn /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/stock/out" element={
            <ProtectedRoute>
              <AppLayout><StockOut /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/stock/history" element={
            <ProtectedRoute>
              <AppLayout><StockHistory /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/reports/expiry" element={
            <ProtectedRoute>
              <AppLayout><ExpiryReport /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/reports/low-stock" element={
            <ProtectedRoute>
              <AppLayout><LowStockReport /></AppLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
