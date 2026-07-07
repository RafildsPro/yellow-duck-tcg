import { useState } from 'react'
import Modal from './Modal'

export default function StockOutModal({ product, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    const qty = Number(quantity)
    if (qty < 1 || qty > product.quantity) {
      setError(`Informe uma quantidade entre 1 e ${product.quantity}.`)
      return
    }
    setSaving(true)
    try {
      await onConfirm(qty, reason)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={`Registrar saída — ${product.name}`} onClose={onClose} maxWidth="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-gray-400">Estoque atual: {product.quantity} un.</p>

        <div>
          <label className="mb-1 block text-sm text-gray-300">Quantidade vendida/retirada</label>
          <input
            type="number"
            min="1"
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-gray-100 outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-300">Motivo (opcional)</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: venda balcão, venda online..."
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-3 py-2 text-gray-100 outline-none focus:border-gold-500"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-navy-700">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-950 hover:bg-gold-400 disabled:opacity-60"
          >
            {saving ? 'Registrando...' : 'Confirmar saída'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
