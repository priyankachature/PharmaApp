import { useState } from 'react'
import api from '../api/axios'
import { useNavigate } from 'react-router-dom'
import DrugStatusBadge from '../components/DrugStatusBadge'
import { useAuth } from '../context/AuthContext'

function rowClass(drug) {
  if (drug.expiryStatus === 'EXPIRED') return 'row-expired'
  if (drug.expiryStatus === 'CRITICAL') return 'row-critical'
  if (drug.lowStock) return 'row-lowstock'
  if (drug.expiryStatus === 'WARNING') return 'row-warning'
  return ''
}

export default function DrugSearch() {
  const [filters, setFilters] = useState({ name: '', category: '', expiryFrom: '', expiryTo: '' })
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }))

  const doSearch = async (p = 0) => {
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: p, size: 20 })
    if (filters.name)       params.append('name', filters.name)
    if (filters.category)   params.append('category', filters.category)
    if (filters.expiryFrom) params.append('expiryFrom', filters.expiryFrom)
    if (filters.expiryTo)   params.append('expiryTo', filters.expiryTo)
    try {
      const r = await api.get(`/drugs/search?${params}`)
      setData(r.data)
      setPage(p)
    } catch {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = e => { e.preventDefault(); doSearch(0) }
  const handleReset = () => { setFilters({ name: '', category: '', expiryFrom: '', expiryTo: '' }); setData(null) }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Search Drugs</div>
          <div className="page-subtitle">Filter by name, category, or expiry date range</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <div className="filter-row">
            <div className="form-group">
              <label>Drug / Generic Name</label>
              <input name="name" value={filters.name} onChange={handleChange} placeholder="Search by name..." />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" value={filters.category} onChange={handleChange} placeholder="e.g. Antibiotic" />
            </div>
            <div className="form-group">
              <label>Expiry From</label>
              <input type="date" name="expiryFrom" value={filters.expiryFrom} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiry To</label>
              <input type="date" name="expiryTo" value={filters.expiryTo} onChange={handleChange} />
            </div>
            <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end', paddingBottom: 1 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>🔍 Search</button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading && <div className="loading">Searching...</div>}

      {data && !loading && (
        <>
          <div className="section-header">
            <div className="section-title">Results ({data.totalElements} found)</div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Drug Name</th>
                  <th>Generic</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Expiry</th>
                  <th>Qty</th>
                  <th>Status</th>
                  {isAdmin() && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr><td colSpan={isAdmin() ? 8 : 7} style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>No results found</td></tr>
                ) : data.content.map(drug => (
                  <tr key={drug.drugId} className={rowClass(drug)}>
                    <td style={{ fontWeight: 600 }}>{drug.drugName}</td>
                    <td>{drug.genericName}</td>
                    <td>{drug.category}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{drug.batchNumber}</td>
                    <td>{drug.expiryDate}</td>
                    <td>{drug.qtyInStock} <span style={{ fontSize: 11, color: '#6b7280' }}>{drug.uom}</span></td>
                    <td><DrugStatusBadge status={drug.expiryStatus} lowStock={drug.lowStock} /></td>
                    {isAdmin() && (
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/drugs/edit/${drug.drugId}`)}>Edit</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => doSearch(page - 1)} disabled={page === 0}>‹ Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: '#6b7280' }}>Page {page + 1} of {data.totalPages}</span>
              <button onClick={() => doSearch(page + 1)} disabled={page >= data.totalPages - 1}>Next ›</button>
            </div>
          )}
        </>
      )}

      {!data && !loading && (
        <div className="empty-state">
          <div style={{ fontSize: 40 }}>🔍</div>
          <p>Enter search criteria above and click Search</p>
        </div>
      )}
    </div>
  )
}
