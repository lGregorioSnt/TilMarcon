"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, CheckSquare, ShieldCheck, Cpu, Activity, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

// Malha técnica sutil ao fundo
const TechnicalGrid = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="industrial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#industrial-grid)" />
  </svg>
);

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      senha,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais inválidas.");
      setLoading(false);
    } else {
      router.push("/pedidos");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background sm:bg-white font-sans relative overflow-hidden">
      
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-24 bg-white/95 backdrop-blur-sm z-10 relative">
        
        {/* Top Badge */}
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Acesso Seguro
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">v2.1.0</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative mx-auto flex-1 flex flex-col justify-center"
        >
          {/* Logo Original */}
          <div className="mb-14 flex justify-center md:justify-start">
            <Image src="/Logo.png" alt="Til Marcon Logo" width={500} height={150} className="object-contain h-28 sm:h-36 w-auto drop-shadow-sm" priority />
          </div>

          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Portal do Colaborador</h1>
            <p className="text-slate-500 mt-3 font-medium text-lg leading-relaxed">Insira suas credenciais corporativas para acessar o almoxarifado digital.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-md border border-red-200 font-bold text-center md:text-left flex items-center">
                <Info className="w-5 h-5 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">E-mail Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="seu.nome@tilmarcon.com.br"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg shadow-sm hover:bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Senha</span>
                <a href="#" className="text-primary hover:underline lowercase tracking-normal">esqueci minha senha</a>
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors duration-300" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-lg shadow-sm hover:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="w-5 h-5 border-2 border-slate-300 rounded flex items-center justify-center group-hover:border-primary transition-colors shadow-sm bg-white">
                  <CheckSquare className="w-3.5 h-3.5 text-transparent group-hover:text-primary/40" />
                </div>
                <span className="text-sm font-bold text-slate-600 select-none">Lembrar-me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:brightness-110 disabled:opacity-70 text-white font-black py-4 rounded-md flex items-center justify-center gap-2 shadow-md text-lg mt-6 tracking-wide uppercase transition-all duration-300 hover:shadow-lg"
            >
              {loading ? (
                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <span>Acessar Almoxarifado</span>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs font-bold text-slate-400">
          <p>© {new Date().getFullYear()} Til Marcon.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Sistemas Operacionais
          </p>
        </div>
      </div>

      {/* Right Side - Dynamic Art Container */}
      <div className="hidden md:flex w-1/2 p-4 z-10">
        <div className="w-full h-full rounded-[2rem] relative overflow-hidden shadow-2xl bg-[#0f172a] border border-slate-800">
          
          {/* Background Geometries (Dinâmico) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] opacity-90" />
            <TechnicalGrid />
            
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.05, 1] }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] rounded-full border-[1px] border-primary/20 opacity-30"
            />
            <motion.div 
              animate={{ rotate: -360, scale: [1, 1.1, 1] }}
              transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-[-10%] right-[-10%] w-[90%] h-[90%] rounded-full border-[2px] border-primary/10 opacity-20 border-dashed"
            />
            
            {/* Glow dinâmico no centro */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary/30 rounded-full blur-[100px]"
            />

            {/* Elementos Flutuantes Extras no quadrado azul */}
            <motion.div 
              animate={{ y: [0, -20, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[20%] right-[15%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-xl"
            >
              <div className="flex items-center space-x-3 text-white/90">
                <div className="p-2 bg-primary/30 rounded-md">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Processamento</p>
                  <p className="text-lg font-black font-display">Conectado</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[25%] left-[10%] bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-lg shadow-xl"
            >
              <div className="flex items-center space-x-3 text-white/90">
                <div className="p-2 bg-green-500/20 text-green-400 rounded-md">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Status do Banco</p>
                  <p className="text-lg font-black font-display">Operacional</p>
                </div>
              </div>
            </motion.div>
            
            {/* Linhas decorativas horizontais */}
            <div className="absolute top-[40%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
          </div>

        </div>
      </div>

    </div>
  );
}
