import { Fragment, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useOrders } from '../../context/OrdersContext'
import { fmtDate, fmtDateTime, statusLabel } from '../../data/orderStatus'
import { formatPrice } from '../../data/products'

// رقم موبايل مصري 01xxxxxxxxx -> صيغة واتساب الدولية 201xxxxxxxxx
const waNumber = (phone) => `2${String(phone).replace(/\D/g, '')}`

export default function CustomersTab() {
  const { customers } = useAuth()
  const { orders } = useOrders()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return customers
      .filter((c) => (c.name + c.email + c.phone).toLowerCase().includes(term))
      .map((c) => {
        const mine = orders.filter((o) => o.userId === c.id)
        const valid = mine.filter((o) => o.status !== 'cancelled')
        return { ...c, orders: mine, count: valid.length, spent: valid.reduce((s, o) => s + o.total, 0) }
      })
  }, [customers, orders, q])

  return (
    <>
      <div className="filters glass">
        <span className="muted">{customers.length.toLocaleString('ar-EG')} عميل مسجّل</span>
        <input className="input" placeholder="ابحثي بالاسم أو الإيميل أو الموبايل…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="table-wrap glass">
        <table className="table">
          <thead>
            <tr><th>الاسم</th><th>الإيميل</th><th>الموبايل</th><th>الطلبات</th><th>إجمالي الشراء</th><th>تاريخ التسجيل</th><th /></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan="7" className="center muted">{customers.length ? 'مفيش نتائج مطابقة' : 'لسه مفيش عملاء مسجلين'}</td></tr>
            )}
            {rows.map((c) => (
              <Fragment key={c.id}>
                <tr>
                  <td><b>{c.name}</b></td>
                  <td dir="ltr" className="small">{c.email}</td>
                  <td dir="ltr" className="small">{c.phone}</td>
                  <td>{c.count}</td>
                  <td>{formatPrice(c.spent)}</td>
                  <td className="small">{fmtDate(c.createdAt)}</td>
                  <td className="row-actions">
                    <button className="link-btn" onClick={() => setOpen(open === c.id ? null : c.id)}>{open === c.id ? 'إخفاء' : 'تفاصيل'}</button>
                  </td>
                </tr>
                {open === c.id && (
                  <tr className="detail-row">
                    <td colSpan="7">
                      <div className="detail">
                        <div>
                          <h4>تواصل مع العميل</h4>
                          <div className="contact-btns">
                            <a className="btn btn-small btn-ghost" href={`mailto:${c.email}`}>📧 إيميل</a>
                            <a className="btn btn-small btn-ghost" href={`tel:${c.phone}`}>📞 اتصال</a>
                            <a className="btn btn-small btn-ghost" href={`https://wa.me/${waNumber(c.phone)}`} target="_blank" rel="noreferrer">💬 واتساب</a>
                          </div>
                        </div>
                        <div>
                          <h4>طلبات العميل ({c.orders.length})</h4>
                          {c.orders.length === 0 ? (
                            <p className="muted small">لسه معملش أي طلب.</p>
                          ) : (
                            c.orders.map((o) => (
                              <div key={o.id} className="mini-order">
                                <span><b>{o.id}</b> <span className="muted small">{fmtDateTime(o.createdAt)}</span></span>
                                <span className={`status s-${o.status}`}>{statusLabel(o.status)}</span>
                                <b>{formatPrice(o.total)}</b>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
