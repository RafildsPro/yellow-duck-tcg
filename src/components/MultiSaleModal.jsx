import { useMemo, useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import Modal from './Modal'

const QUICK_REASONS = ['Venda Local', 'Venda Online', 'Troca', 'Perda/Dano']

export default function MultiSaleModal({ products, onClose, onConfirm }) {
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([]) // [{ product, quantity }]
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const results = useMemo(() => {
    if (!search.trim()) return []
    const term = search.toLowerCase()
    return products
      .filter((p) => p.name.toLowerCase().includes(term))
      .filter((p) => !items.some((i) => i.product.id === p.id))
      .slice(0, 6)
  }, [search, products, items])

  function addItem(product) {
    setItems((prev) => [...prev, { product, quantity: 1 }])
    setSearch('')
  }

  function updateQuantity(productId, quantity) {
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)))
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Adicione pelo menos um produto.')
      return
    }
    for (const i of items) {
      const qty = Number(i.quantity)
      if (qty < 1 || qty > i.product.quantity) {
        setError(`Quantidade inválida para "${i.product.name}" (estoque: ${i.product.quantity}).`)
        return
      }
    }

    setSaving(true)
    try {
      for (const i of items) {
        await onConfirm(i.product, Number(i.quantity), reason)
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="Venda múltipla" onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-300">Buscar produto</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Digite o nome do produto..."
              className="w-full rounded-lg border border-navy-600 bg-navy-800 py-2 pl-9 pr-3 text-gray-100 outline-none focus:border-gold-500"
            />
          </div>
          {results.length > 0 && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-lg border border-navy-600 bg-navy-800">
              {results.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addItem(p)}
                  className="block w-full px-3 py-2 text-left text-sm text-gray-100 hover:bg-navy-700"
                >
                  {p.name} <span className="text-gray-500">({p.quantity} un.)</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.product.id} className="flex items-center gap-2 rounded-lg bg-navy-800 px-3 py-2">
                <span className="flex-1 truncate text-sm text-gray-100">{i.product.name}</span>
                <input
                  type="number"
                  min="1"
                  max={i.product.quantity}
                  value={i.quantity}
                  onChange={(e) => updateQuantity(i.product.id, e.target.value)}
                  className="w-16 rounded-lg border border-navy-600 bg-navy-900 px-2 py-1 text-sm text-gray-100 outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i.product.id)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-navy-700 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm text-gray-300">Motivo (opcional, aplicado a todos)</label>
          <div className="mb-2 flex flex-wrap gap-2">
            {QUICK_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                className={`rounded-full border px-3 py-1 text-xs ${
                  reason === r
                    ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                    : 'border-navy-600 text-gray-300 hover:bg-navy-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
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
            {saving ? 'Registrando...' : `Confirmar venda (${items.length})`}
          </button>
        </div>
      </form>
    </Modal>
  )
}
