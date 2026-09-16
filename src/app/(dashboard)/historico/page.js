"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { History, Package, Clock, User as UserIcon, Archive } from "lucide-react";

export default function HistoricoPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const concluidos = data.filter(p => p.status === 'CONCLUIDO');
          setPedidos(concluidos);
        }
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 max-w-4xl mx-auto"
    >
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-white rounded-md shadow-sm border border-border">
          <History className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Histórico de Pedidos</h2>
          <p className="text-slate-500 font-medium mt-1">Consulte todos os itens já processados e enviados.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-accent"></div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-border text-center shadow-sm">
          <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">Nenhum pedido encontrado no histórico.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pedidos.map((pedido, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              key={pedido.id} 
              className="bg-white p-6 sm:p-8 rounded-lg border border-border shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-md">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-xl">Pedido #{pedido.id.toString().padStart(4, '0')}</h3>
                    <div className="flex items-center text-sm font-medium text-slate-500 mt-2 space-x-6">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                        {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1.5 opacity-70" />
                        {pedido.user.nome}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center md:flex-col md:items-end mt-2 md:mt-0">
                  <div className={`text-xs font-black uppercase tracking-widest px-4 py-2 rounded-md border-2 ${pedido.status === 'CONCLUIDO' ? 'bg-green-50/50 text-green-700 border-green-200' : 'bg-amber-50/50 text-amber-700 border-amber-200'}`}>
                    {pedido.status}
                  </div>
                </div>
              </div>

              {/* Lista de Itens Separados */}
              <div>
                <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-widest">Itens Separados:</h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {pedido.itens.map(pedidoItem => {
                    const diff = pedidoItem.quantidadeEnviada !== null && pedidoItem.quantidadeEnviada !== pedidoItem.quantidade;
                    
                    return (
                      <div key={pedidoItem.id} className="flex justify-between items-center bg-slate-50/70 p-4 rounded-md border border-border hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-800">{pedidoItem.item.nome}</p>
                          <p className="text-xs font-medium text-slate-500 mt-1">Cód: {pedidoItem.item.codigo}</p>
                        </div>
                        <div className="text-right ml-4">
                          {diff && (
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider line-through mb-1">
                              Solicitado: {pedidoItem.quantidade} un
                            </p>
                          )}
                          <p className={`font-black text-sm sm:text-base ${diff ? 'text-accent' : 'text-primary'}`}>
                            Enviado: {pedidoItem.quantidadeEnviada !== null ? pedidoItem.quantidadeEnviada : pedidoItem.quantidade} un
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
