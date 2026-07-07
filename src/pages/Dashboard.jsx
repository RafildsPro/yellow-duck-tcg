import { Wallet, TrendingUp, PiggyBank, Boxes, AlertTriangle } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { formatBRL } from '../lib/format'
import { LOW_STOCK_THRESHOLD } from '../lib/constants'

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-navy-700 bg-navy-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon size={18} className={accent ? 'text-gold-500' : 'text-gray-500'} />
      </div>
      <p className={`mt-2 text-2xl font-bold ${accent ? 'text-gold-500' : 'text-gray-100'}`}>
        {value}
      </p>
    </div>
  )
}

export default function Dashboard() {
  const { products, loading, error } = useProducts()

  const totalSaleValue = products.reduce((sum, p) => sum + p.quantity * p.sale_price, 0)
  const totalCostValue = products.reduce((sum, p) => sum + p.quantity * p.cost_price, 0)
  const potentialProfit = totalSaleValue - totalCostValue
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0)
  const lowStockProducts = products.filter((p) => p.quantity < LOW_STOCK_THRESHOLD)

  if (loading) return <p className="text-gray-400">Carregando dashboard...</p>
  if (error) return <p className="text-red-400">Erro ao carregar dados: {error}</p>

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Wallet} label="Valor total em estoque" value={formatBRL(totalSaleValue)} accent />
        <StatCard icon={PiggyBank} label="Valor total investido" value={formatBRL(totalCostValue)} />
        <StatCard icon={TrendingUp} label="Lucro potencial estimado" value={formatBRL(potentialProfit)} accent />
        <StatCard icon={Boxes} label="Itens em estoque" value={totalItems} />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-yellow-700/40 bg-yellow-900/10 p-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold text-yellow-400">
            <AlertTriangle size={16} />
            Estoque baixo (menos de {LOW_STOCK_THRESHOLD} unidades)
          </h2>
          <ul className="grid grid-cols-1 gap-1 text-sm text-gray-300 sm:grid-cols-2 lg:grid-cols-3">
            {lowStockProducts.map((p) => (
              <li key={p.id} className="flex justify-between rounded-lg bg-navy-900 px-3 py-1.5">
                <span>{p.name}</span>
                <span className="text-yellow-400">{p.quantity} un.</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
