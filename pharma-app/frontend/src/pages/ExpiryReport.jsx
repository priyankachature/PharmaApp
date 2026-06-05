import { useState } from 'react'
import api from '../api/axios'
import DrugStatusBadge from '../components/DrugStatusBadge'

function rowClass(drug) {
  if (drug.expiryStatus === 'EXPIRED') return 'row-expired'
  if (drug.expiryStatus === 'CRITICAL') return 'row-critical'
  if (drug.expiryStatus === 'WARNING') return 'row-warning'
  return ''
}

export default function ExpiryReport() {
  const [days, setDays] = useState(30)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchReport = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await api.get(`/reports/expiry?days=${days}`)
      setData(r.data)
    } catch {
      setError('Failed to load expiry report')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = e => { e.preventDefault(); fetchReport() }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📅 Expiry Report</div>
          <div className="page-subtitle">Drugs expiring within a specified number of days</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form onSubmit={handleSubmit}>
          <div className="filter-row" style={{ marginBottom: 0 }}>
            <div className="form-group" style={{ maxWidth: 200 }}>
              <label>Days from Today</label>
              <input
                type="number" value={days}
                onChange={e => setDays(Number(e.target.value))}
                min="1" max="365" required
              />
            </div>
            <div style={{ alignSelf: 'flex-end', paddingBottom: 1 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : '📅 Generate Report'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data && !loading && (
        <>
          <div className="section-header">
            <div className="section-title">
              Drugs expiring within {days} days — {data.length} found
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug Name</th>
                  <th>Generic Name</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Expiry Date</th>
                  <th>Qty</th>
                  <th>Manufacturer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>
                    No drugs expiring within {days} days 🎉
                  </td></tr>
                ) : data.map((drug, i) => (
                  <tr key={drug.drugId} className={rowClass(drug)}>
                    <td style={{ color: '#6b7280', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{drug.drugName}</td>
                    <td>{drug.genericName}</td>
                    <td>{drug.category}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{drug.batchNumber}</td>
                    <td style={{ fontWeight: 700 }}>{drug.expiryDate}</td>
                    <td>{drug.qtyInStock} <span style={{ fontSize: 11, color: '#6b7280' }}>{drug.uom}</span></td>
                    <td>{drug.manufacturer}</td>
                    <td><DrugStatusBadge status={drug.expiryStatus} lowStock={drug.lowStock} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!data && !loading && (
        <div className="empty-state">
          <div style={{ fontSize: 40 }}>📅</div>
          <p>Set the number of days and click Generate Report</p>
        </div>
      )}
    </div>
  )
}
