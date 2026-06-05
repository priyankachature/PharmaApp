import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Dashboard', icon: '📊', to: '/dashboard', section: 'Overview' },
  { label: 'Drug List', icon: '💊', to: '/drugs', section: 'Drug Master' },
  { label: 'Add Drug', icon: '➕', to: '/drugs/new', section: 'Drug Master', adminOnly: true },
  { label: 'Search Drugs', icon: '🔍', to: '/drugs/search', section: 'Drug Master' },
  { label: 'Stock In', icon: '📥', to: '/stock/in', section: 'Stock', adminOnly: true },
  { label: 'Stock Out', icon: '📤', to: '/stock/out', section: 'Stock', adminOnly: true },
  { label: 'Stock History', icon: '📋', to: '/stock/history', section: 'Stock' },
  { label: 'Expiry Report', icon: '📅', to: '/reports/expiry', section: 'Reports' },
  { label: 'Low Stock Report', icon: '⚠️', to: '/reports/low-stock', section: 'Reports' },
]

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sections = [...new Set(NAV.map(n => n.section))]

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <h1>⚕ PharmaSys</h1>
        <span>Inventory Management</span>
      </div>

      {sections.map(section => {
        const items = NAV.filter(n => n.section === section && (!n.adminOnly || isAdmin()))
        if (!items.length) return null
        return (
          <div className="sidebar-section" key={section}>
            <div className="sidebar-section-title">{section}</div>
            {items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        )
      })}

      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{user?.fullName}</div>
            <div className="user-role">{user?.role}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">⏏</button>
        </div>
      </div>
    </nav>
  )
}
