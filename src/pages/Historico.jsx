import { useStockMovements } from '../hooks/useStockMovements'

export default function Historico() {
  const { movements, loading, error } = useStockMovements()

  if (loading) return <p className="text-gray-400">Carregando histórico...</p>
  if (error) return <p className="text-red-400">Erro ao carregar dados: {error}</p>

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-100">Histórico de saídas</h1>

      <div className="overflow-x-auto rounded-2xl border border-navy-700">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-navy-900 text-gray-400">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Quantidade</th>
              <th className="px-4 py-3">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {movements.map((m) => (
              <tr key={m.id} className="bg-navy-900/40 hover:bg-navy-800">
                <td className="px-4 py-3 text-gray-300">
                  {new Date(m.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-gray-100">{m.products?.name ?? '-'}</td>
                <td className="px-4 py-3 font-semibold text-red-400">{m.quantity_change}</td>
                <td className="px-4 py-3 text-gray-300">{m.reason || '-'}</td>
              </tr>
            ))}
            {movements.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  Nenhuma saída registrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
