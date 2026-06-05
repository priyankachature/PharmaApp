import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/axios'

const EMPTY = {
  drugName: '', genericName: '', category: '', manufacturer: '',
  batchNumber: '', mfgDate: '', expiryDate: '', uom: '',
  qtyInStock: '', reorderLevel: '', storageCondition: ''
}

export default function DrugForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isEdit) return
    api.get(`/drugs/${id}`)
      .then(r => {
        const d = r.data
        setForm({
          drugName: d.drugName || '',
          genericName: d.genericName || '',
          category: d.category || '',
          manufacturer: d.manufacturer || '',
          batchNumber: d.batchNumber || '',
          mfgDate: d.mfgDate || '',
          expiryDate: d.expiryDate || '',
          uom: d.uom || '',
          qtyInStock: d.qtyInStock ?? '',
          reorderLevel: d.reorderLevel ?? '',
          storageCondition: d.storageCondition || ''
        })
      })
      .catch(() => setError('Failed to load drug details'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const payload = {
      ...form,
      qtyInStock: Number(form.qtyInStock),
      reorderLevel: Number(form.reorderLevel),
      mfgDate: form.mfgDate || null
    }
    try {
      if (isEdit) {
        await api.put(`/drugs/${id}`, payload)
        setSuccess('Drug updated successfully!')
      } else {
        await api.post('/drugs', payload)
        setSuccess('Drug added successfully!')
        setForm(EMPTY)
      }
      setTimeout(() => navigate('/drugs'), 1200)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save drug')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading">Loading drug...</div>

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{isEdit ? 'Edit Drug' : 'Add New Drug'}</div>
          <div className="page-subtitle">{isEdit ? `Editing drug ID ${id}` : 'Register a new drug in the system'}</div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/drugs')}>← Back to List</button>
      </div>

      <div className="card">
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Drug Name *</label>
              <input name="drugName" value={form.drugName} onChange={handleChange} required placeholder="e.g. Paracetamol 500mg" />
            </div>
            <div className="form-group">
              <label>Generic Name</label>
              <input name="genericName" value={form.genericName} onChange={handleChange} placeholder="e.g. Acetaminophen" />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Analgesic" />
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="e.g. Sun Pharma" />
            </div>
            <div className="form-group">
              <label>Batch Number</label>
              <input name="batchNumber" value={form.batchNumber} onChange={handleChange} placeholder="e.g. BN-2024-001" />
            </div>
            <div className="form-group">
              <label>Unit of Measure</label>
              <input name="uom" value={form.uom} onChange={handleChange} placeholder="e.g. Tablet, Capsule, ml" />
            </div>
            <div className="form-group">
              <label>Manufacture Date</label>
              <input type="date" name="mfgDate" value={form.mfgDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Expiry Date *</label>
              <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Quantity in Stock *</label>
              <input type="number" name="qtyInStock" value={form.qtyInStock} onChange={handleChange} required min="0" placeholder="0" />
            </div>
            <div className="form-group">
              <label>Reorder Level *</label>
              <input type="number" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} required min="0" placeholder="0" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Storage Condition</label>
              <input name="storageCondition" value={form.storageCondition} onChange={handleChange} placeholder="e.g. Store below 25°C in a dry place" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEdit ? '💾 Update Drug' : '➕ Add Drug')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/drugs')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
