import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import DrugStatusBadge from '../components/DrugStatusBadge'

function rowClass(drug) {
  if (drug.expiryStatus === 'EXPIRED') return 'row-expired'
  if (drug.expiryStatus === 'CRITICAL') return 'row-critical'
  if (drug.lowStock) return 'row-lowstock'
  if (drug.expiryStatus === 'WARNING') return 'row-warning'
  return ''
}

export default function DrugList() {
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(null)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const fetchDrugs = (p = 0) => {
    setLoading(true)
    api.get(`/drugs?page=${p}&size=20`)
      .then(r => { setData(r.data); setPage(p) })
      .catch(() => setError('Failed to load drugs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDrugs(0) }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await api.delete(`/drugs/${id}`)
      fetchDrugs(page)
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  if (loading && !data.content.length) return <div className="loading">Loading drugs...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Drug Master</div>
          <div className="page-subtitle">{data.totalElements} drugs registered</div>
        </div>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={() => navigate('/drugs/new')}>
            ➕ Add Drug
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Drug Name</th>
              <th>Generic Name</th>
              <th>Category</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Qty</th>
              <th>Reorder</th>
              <th>Status</th>
              {isAdmin() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.content.length === 0 ? (
              <tr><td colSpan={isAdmin() ? 10 : 9} style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>No drugs found</td></tr>
            ) : data.content.map((drug, i) => (
              <tr key={drug.drugId} className={rowClass(drug)}>
                <td style={{ color: '#6b7280', fontSize: 12 }}>{page * 20 + i + 1}</td>
                <td style={{ fontWeight: 600 }}>{drug.drugName}</td>
                <td>{drug.genericName}</td>
                <td>{drug.category}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{drug.batchNumber}</td>
                <td style={{ fontWeight: 500 }}>{drug.expiryDate}</td>
                <td style={{ fontWeight: 700 }}>{drug.qtyInStock} <span style={{ fontSize: 11, color: '#6b7280' }}>{drug.uom}</span></td>
                <td>{drug.reorderLevel}</td>
                <td><DrugStatusBadge status={drug.expiryStatus} lowStock={drug.lowStock} /></td>
                {isAdmin() && (
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/drugs/edit/${drug.drugId}`)}>Edit</button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(drug.drugId, drug.drugName)}
                        disabled={deleting === drug.drugId}
                      >
                        {deleting === drug.drugId ? '...' : 'Del'}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => fetchDrugs(0)} disabled={page === 0}>««</button>
          <button onClick={() => fetchDrugs(page - 1)} disabled={page === 0}>‹ Prev</button>
          {[...Array(Math.min(data.totalPages, 7))].map((_, i) => {
            const p = Math.max(0, page - 3) + i
            if (p >= data.totalPages) return null
            return <button key={p} className={p === page ? 'active' : ''} onClick={() => fetchDrugs(p)}>{p + 1}</button>
          })}
          <button onClick={() => fetchDrugs(page + 1)} disabled={page >= data.totalPages - 1}>Next ›</button>
          <button onClick={() => fetchDrugs(data.totalPages - 1)} disabled={page >= data.totalPages - 1}>»»</button>
        </div>
      )}
    </div>
  )
}
