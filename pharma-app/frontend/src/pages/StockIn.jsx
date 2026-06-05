import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function StockIn() {
  const [drugs, setDrugs] = useState([])
  const [form, setForm] = useState({ drugId: '', quantity: '', remarks: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    api.get('/drugs?page=0&size=1000')
      .then(r => setDrugs(r.data.content))
      .catch(() => setError('Failed to load drugs'))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const r = await api.post('/stock/in', {
        drugId: Number(form.drugId),
        quantity: Number(form.quantity),
        remarks: form.remarks
      })
      const drug = drugs.find(d => d.drugId === Number(form.drugId))
      setSuccess(`✓ Stock In recorded: ${form.quantity} units of "${drug?.drugName}". New qty: ${r.data.quantity} added.`)
      setForm({ drugId: '', quantity: '', remarks: '' })
      // Refresh drug list
      api.get('/drugs?page=0&size=1000').then(r => setDrugs(r.data.content))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record stock in')
    } finally {
      setLoading(false)
    }
  }

  const selectedDrug = drugs.find(d => d.drugId === Number(form.drugId))

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📥 Stock In</div>
          <div className="page-subtitle">Record incoming stock for a drug</div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 560 }}>
        {error   && <div className="alert alert-error">⚠ {error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label>Select Drug *</label>
              <select name="drugId" value={form.drugId} onChange={handleChange} required>
                <option value="">-- Select a drug --</option>
                {drugs.map(d => (
                  <option key={d.drugId} value={d.drugId}>
                    {d.drugName} (Batch: {d.batchNumber}) — Current: {d.qtyInStock} {d.uom}
                  </option>
                ))}
              </select>
            </div>

            {selectedDrug && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 6, padding: '10px 14px', fontSize: 13 }}>
                <strong>{selectedDrug.drugName}</strong><br />
                <span style={{ color: '#6b7280' }}>
                  Current Stock: <strong>{selectedDrug.qtyInStock} {selectedDrug.uom}</strong> &nbsp;·&nbsp;
                  Reorder Level: {selectedDrug.reorderLevel} &nbsp;·&nbsp;
                  Expires: {selectedDrug.expiryDate}
                </span>
              </div>
            )}

            <div className="form-group">
              <label>Quantity to Add *</label>
              <input
                type="number" name="quantity" value={form.quantity}
                onChange={handleChange} required min="1" placeholder="Enter quantity"
              />
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="e.g. Purchase order #12345" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Processing...' : '📥 Record Stock In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
