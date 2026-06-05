import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard')
      .then(r => setStats(r.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="alert alert-error">{error}</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Pharmaceutical inventory overview</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card total">
          <div className="stat-label">Total Drugs</div>
          <div className="stat-value">{stats.totalDrugs}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>All registered drugs</div>
        </div>
        <div className="stat-card expired">
          <div className="stat-label">Expired</div>
          <div className="stat-value">{stats.expiredCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Past expiry date</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-label">Critical</div>
          <div className="stat-value">{stats.criticalCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Expires within 7 days</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Warning</div>
          <div className="stat-value">{stats.warningCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>Expires within 30 days</div>
        </div>
        <div className="stat-card lowstock">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{stats.lowStockCount}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>At or below reorder level</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 8 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>Colour Legend</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <LegendItem color="#e02424" bg="#fff5f5" label="Expired – past expiry date" />
          <LegendItem color="#d03801" bg="#fff8f2" label="Critical – expires within 7 days" />
          <LegendItem color="#c27803" bg="#fffde7" label="Warning – expires within 30 days" />
          <LegendItem color="#bf125d" bg="#fff0f8" label="Low Stock – at or below reorder level" />
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, bg, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 16, height: 16, borderRadius: 3, background: bg, border: `2px solid ${color}` }} />
      <span style={{ fontSize: 12, color: '#374151' }}>{label}</span>
    </div>
  )
}
