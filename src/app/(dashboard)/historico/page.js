"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Search, Filter, ChevronLeft, ChevronRight, Download, Package, ChevronDown } from "lucide-react";

const SPRING = { type: "spring", stiffness: 280, damping: 24 };
const STAGGER = { animate: { transition: { staggerChildren: 0.04 } } };
const ROW_VARIANTS = { hidden: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: SPRING } };

function StatusBadge({ status }) {
  const map = {
    CONCLUIDO: { label: 'ENTREGUE', className: 'bg-green-50 text-green-700 border-green-200' },
    SEPARACAO: { label: 'SEPARANDO', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    CONFERENCIA: { label: 'CONFERÊNCIA', className: 'bg-violet-50 text-violet-700 border-violet-200' },
    PENDENTE: { label: 'PENDENTE', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  };
  const s = map[status] || map.PENDENTE;
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider border inline-block ${s.className}`}>
      {s.label}
    </span>
  );
}

export default function HistoricoPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('/api/pedidos')
      .then(r => r.json())
      .then(data => { if (!data.error) setPedidos(data); setLoading(false); });
  }, []);

  const filteredPedidos = pedidos.filter(p => {
    const searchMatch = p.id.toString().includes(searchTerm) || p.user.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "TODOS" || p.status === statusFilter;
    let dateMatch = true;
    if (dateFilter !== "ALL") {
      const diff = Math.ceil(Math.abs(new Date() - new Date(p.createdAt)) / 86400000);
      dateMatch = dateFilter === "7D" ? diff <= 7 : diff <= 30;
    }
    return searchMatch && statusMatch && dateMatch;
  });

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPedidos = filteredPedidos.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative h-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-black text-slate-900 tracking-tight">Histórico de Pedidos</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Rastreabilidade completa · <span className="font-mono font-bold">{filteredPedidos.length}</span> registros
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.06 }}
        className="flex flex-col lg:flex-row gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-sm"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ID ou Solicitante..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="site-input w-full pl-10 pr-4 py-2.5 rounded-lg text-sm font-mono"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="site-select pl-10 pr-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer appearance-none"
            >
              <option value="TODOS">Todos os Status</option>
              <option value="CONCLUIDO">Entregues</option>
              <option value="PENDENTE">Pendentes</option>
              <option value="SEPARACAO">Em Separação</option>
              <option value="CONFERENCIA">Conferência</option>
            </select>
          </div>
          <select
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="site-select px-4 py-2.5 rounded-lg text-sm font-bold cursor-pointer appearance-none"
          >
            <option value="ALL">Todo Período</option>
            <option value="7D">Últimos 7 Dias</option>
            <option value="30D">Últimos 30 Dias</option>
          </select>
        </div>
      </motion.div>

      {/* Tabela */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-200 border-t-primary" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["ID Pedido", "Data / Hora", "Solicitante", "Status", "Itens"].map((h, i) => (
                    <th key={h} className={`py-3.5 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 whitespace-nowrap ${i === 4 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <motion.tbody variants={STAGGER} initial="hidden" animate="animate" className="divide-y divide-slate-100">
                {paginatedPedidos.length === 0 ? (
                  <motion.tr variants={ROW_VARIANTS}>
                    <td colSpan="5" className="py-16 text-center text-slate-400 font-medium">
                      Nenhum pedido encontrado com os filtros atuais.
                    </td>
                  </motion.tr>
                ) : (
                  paginatedPedidos.map(pedido => (
                    <React.Fragment key={pedido.id}>
                      <motion.tr
                        variants={ROW_VARIANTS}
                        onClick={() => setExpandedId(expandedId === pedido.id ? null : pedido.id)}
                        className="cursor-pointer hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-slate-900">
                          #{pedido.id.toString().padStart(4, '0')}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-mono text-sm text-slate-700">{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</div>
                          <div className="font-mono text-xs text-slate-400">{new Date(pedido.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-700">{pedido.user.nome}</td>
                        <td className="py-4 px-6"><StatusBadge status={pedido.status} /></td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="font-mono font-bold text-slate-600">{pedido.itens?.length || 0}</span>
                            <Package className="w-3.5 h-3.5 text-slate-400" />
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${expandedId === pedido.id ? 'rotate-180' : ''}`} />
                          </div>
                        </td>
                      </motion.tr>

                      <AnimatePresence>
                        {expandedId === pedido.id && (
                          <motion.tr
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <td colSpan="5" className="px-6 py-5 bg-slate-50/60 border-b border-slate-100">
                              <motion.div
                                initial={{ y: -6 }}
                                animate={{ y: 0 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5"
                              >
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">
                                  Detalhes dos Itens · {pedido.itens.length} SKUs
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {pedido.itens.map(pi => (
                                    <div key={pi.id} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-3 rounded-lg">
                                      <div>
                                        <p className="text-sm font-bold text-slate-800">{pi.item.nome}</p>
                                        <p className="text-[10px] font-mono text-slate-500">Cód: {pi.item.codigo}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Qtd</p>
                                        {pi.quantidadeEnviada !== null && pi.quantidadeEnviada !== pi.quantidade ? (
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs line-through text-slate-400">{pi.quantidade}</span>
                                            <span className="text-sm font-mono font-bold text-orange-600">{pi.quantidadeEnviada}</span>
                                          </div>
                                        ) : (
                                          <span className="text-sm font-mono font-bold text-primary">{pi.quantidade}</span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                )}
              </motion.tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <span className="text-sm font-medium text-slate-500 font-mono">
                {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredPedidos.length)} de {filteredPedidos.length}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-mono font-bold text-slate-600 px-2">{currentPage} / {totalPages}</span>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
