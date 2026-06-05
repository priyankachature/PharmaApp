import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function StockHistory() {
  const [drugs, setDrugs] = useState([])
  const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 })
  const [drugId, setDrugId] = useState('')
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/drugs?page=0&size=1000').then(r => setDrugs(r.data.content))
  }, [])

  const fetchHistory = (p = 0, did = drugId) => {
    setLoading(true)
    const params = new URLSearchParams({ page: p, size: 20 })
    if (did) params.append('drugId', did)
    api.get(`/stock/history?${params}`)
      .then(r => { setData(r.data); setPage(p) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchHistory(0) }, []) // eslint-disable-line

  const handleFilter = e => {
    setDrugId(e.target.value)
    fetchHistory(0, e.target.value)
  }

  const formatDate = dt => dt ? new Date(dt).toLocaleString() : '—'

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📋 Stock History</div>
          <div className="page-subtitle">{data.totalElements} movement records</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="filter-row" style={{ marginBottom: 0 }}>
          <div className="form-group" style={{ maxWidth: 340 }}>
            <label>Filter by Drug</label>
            <select value={drugId} onChange={handleFilter}>
              <option value="">— All Drugs —</option>
              {drugs.map(d => (
                <option key={d.drugId} value={d.drugId}>{d.drugName} ({d.batchNumber})</option>
              ))}
            </select>
          </div>
          <div style={{ alignSelf: 'flex-end', paddingBottom: 1 }}>
            <button className="btn btn-secondary" onClick={() => { setDrugId(''); fetchHistory(0, '') }}>Clear Filter</button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading history...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date & Time</th>
                  <th>Drug Name</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Performed By</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {data.content.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: '#6b7280' }}>No movements found</td></tr>
                ) : data.content.map((m, i) => (
                  <tr key={m.movementId}>
                    <td style={{ color: '#6b7280', fontSize: 12 }}>{page * 20 + i + 1}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{formatDate(m.movementDate)}</td>
                    <td style={{ fontWeight: 600 }}>{m.drugName}</td>
                    <td>
                      <span className={`badge badge-${m.movementType.toLowerCase()}`}>{m.movementType}</span>
                    </td>
                    <td style={{ fontWeight: 700 }}>{m.movementType === 'OUT' ? '-' : '+'}{m.quantity}</td>
                    <td>{m.performedBy || '—'}</td>
                    <td style={{ color: '#6b7280' }}>{m.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => fetchHistory(page - 1)} disabled={page === 0}>‹ Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: '#6b7280' }}>
                Page {page + 1} of {data.totalPages}
              </span>
              <button onClick={() => fetchHistory(page + 1)} disabled={page >= data.totalPages - 1}>Next ›</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
