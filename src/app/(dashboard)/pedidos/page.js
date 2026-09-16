"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock, User as UserIcon, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pedidos')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const pendentes = data.filter(p => p.status === 'PENDENTE');
          setPedidos(pendentes);
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
          <ClipboardList className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-black text-slate-900 tracking-tight">Pedidos para Separação</h2>
          <p className="text-slate-500 font-medium mt-1">Selecione um pedido para iniciar o processo de picking.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-accent"></div>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-border text-center shadow-sm">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">Nenhum pedido aguardando separação no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pedidos.map((pedido, i) => (
            <Link href={`/separacao/${pedido.id}`} key={pedido.id}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white p-6 rounded-md border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-accent hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
              >
                <div className="mb-4 sm:mb-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">Pendente</span>
                    <h3 className="font-black text-slate-900 text-xl">Pedido #{pedido.id.toString().padStart(4, '0')}</h3>
                  </div>
                  <div className="flex items-center text-sm font-medium text-slate-500 space-x-6">
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
                
                <div className="flex items-center justify-between sm:justify-end space-x-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-border">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Contém</div>
                    <div className="text-lg font-black text-slate-900 flex items-center">
                      {pedido.itens?.length || 0} itens
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-md group-hover:bg-accent group-hover:text-white text-slate-400 transition-colors shadow-sm">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}
