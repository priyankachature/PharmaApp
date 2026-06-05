export default function DrugStatusBadge({ status, lowStock }) {
  return (
    <span style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {status === 'EXPIRED'  && <span className="badge badge-expired">Expired</span>}
      {status === 'CRITICAL' && <span className="badge badge-critical">Critical</span>}
      {status === 'WARNING'  && <span className="badge badge-warning">Warning</span>}
      {status === 'OK'       && <span className="badge badge-ok">OK</span>}
      {lowStock              && <span className="badge badge-lowstock">Low Stock</span>}
    </span>
  )
}
