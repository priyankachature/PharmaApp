import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function StockOut() {
  const [drugs, setDrugs] = useState([])
  const [form, setForm] = useState({ drugId: '', quantity: '', remarks: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadDrugs = () =>
    api.get('/drugs?page=0&size=1000').then(r => setDrugs(r.data.content))

  useEffect(() => { loadDrugs() }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await api.post('/stock/out', {
        drugId: Number(form.drugId),
        quantity: Number(form.quantity),
        remarks: form.remarks
      })
      const drug = drugs.find(d => d.drugId === Number(form.drugId))
      setSuccess(`✓ Stock Out recorded: ${form.quantity} units of "${drug?.drugName}" dispensed.`)
      setForm({ drugId: '', quantity: '', remarks: '' })
      loadDrugs()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record stock out')
    } finally {
      setLoading(false)
    }
  }

  const selectedDrug = drugs.find(d => d.drugId === Number(form.drugId))
  const requestedQty = Number(form.quantity)
  const insufficient = selectedDrug && requestedQty > 0 && requestedQty > selectedDrug.qtyInStock

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📤 Stock Out</div>
          <div className="page-subtitle">Record dispensing / outgoing stock</div>
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
                    {d.drugName} (Batch: {d.batchNumber}) — Available: {d.qtyInStock} {d.uom}
                  </option>
                ))}
              </select>
            </div>

            {selectedDrug && (
              <div style={{
                background: selectedDrug.qtyInStock <= selectedDrug.reorderLevel ? '#fff0f8' : '#f0fdf4',
                border: `1px solid ${selectedDrug.qtyInStock <= selectedDrug.reorderLevel ? '#f9a8d4' : '#86efac'}`,
                borderRadius: 6, padding: '10px 14px', fontSize: 13
              }}>
                <strong>{selectedDrug.drugName}</strong><br />
                <span style={{ color: '#6b7280' }}>
                  Available: <strong>{selectedDrug.qtyInStock} {selectedDrug.uom}</strong> &nbsp;·&nbsp;
                  Reorder: {selectedDrug.reorderLevel} &nbsp;·&nbsp;
                  Expires: {selectedDrug.expiryDate}
                </span>
              </div>
            )}

            <div className="form-group">
              <label>Quantity to Dispense *</label>
              <input
                type="number" name="quantity" value={form.quantity}
                onChange={handleChange} required min="1" placeholder="Enter quantity"
                style={{ borderColor: insufficient ? 'var(--danger)' : undefined }}
              />
              {insufficient && (
                <span style={{ color: 'var(--danger)', fontSize: 12 }}>
                  ⚠ Insufficient stock! Available: {selectedDrug.qtyInStock}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Remarks</label>
              <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="e.g. Dispensed to ward 3" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-danger" disabled={loading || insufficient}>
              {loading ? 'Processing...' : '📤 Record Stock Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
