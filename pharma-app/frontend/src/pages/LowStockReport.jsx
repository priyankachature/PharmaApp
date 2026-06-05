import { useState, useEffect } from 'react'
import api from '../api/axios'
import DrugStatusBadge from '../components/DrugStatusBadge'

export default function LowStockReport() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/reports/low-stock')
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load low stock report'))
      .finally(() => setLoading(false))
  }, [])

  const refresh = () => {
    setLoading(true)
    api.get('/reports/low-stock')
      .then(r => setData(r.data))
      .catch(() => setError('Failed to refresh'))
      .finally(() => setLoading(false))
  }

  if (loading) return <div className="loading">Loading report...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">⚠️ Low Stock Report</div>
          <div className="page-subtitle">Drugs at or below their reorder level</div>
        </div>
        <button className="btn btn-secondary" onClick={refresh}>🔄 Refresh</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {data && (
        <>
          {data.length > 0 && (
            <div className="alert" style={{ background: '#fff0f8', border: '1px solid #f9a8d4', color: '#bf125d' }}>
              ⚠ <strong>{data.length} drug{data.length !== 1 ? 's' : ''}</strong> at or below reorder level. Immediate restocking recommended.
            </div>
          )}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Drug Name</th>
                  <th>Generic Name</th>
                  <th>Category</th>
                  <th>Batch</th>
                  <th>Current Qty</th>
                  <th>Reorder Level</th>
                  <th>Shortage</th>
                  <th>Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>
                    All drugs are adequately stocked 🎉
                  </td></tr>
                ) : data.map((drug, i) => (
                  <tr key={drug.drugId} className="row-lowstock">
                    <td style={{ color: '#6b7280', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{drug.drugName}</td>
                    <td>{drug.genericName}</td>
                    <td>{drug.category}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{drug.batchNumber}</td>
                    <td style={{ fontWeight: 700, color: 'var(--danger)' }}>
                      {drug.qtyInStock} <span style={{ fontSize: 11, color: '#6b7280' }}>{drug.uom}</span>
                    </td>
                    <td>{drug.reorderLevel}</td>
                    <td style={{ fontWeight: 600, color: 'var(--pink)' }}>
                      {Math.max(0, drug.reorderLevel - drug.qtyInStock)} needed
                    </td>
                    <td>{drug.expiryDate}</td>
                    <td><DrugStatusBadge status={drug.expiryStatus} lowStock={drug.lowStock} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
