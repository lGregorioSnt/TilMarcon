import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { History, ClipboardList } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-slate-800 relative overflow-hidden">
      {/* Top Navbar Corporativa */}
      <header className="fixed top-0 inset-x-0 h-16 bg-white/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 sm:px-8 z-50 shadow-sm transition-all">
        <div className="flex items-center">
          <Link href="/pedidos" className="flex items-center group">
            <Image src="/Logo.png" alt="Til Marcon Logo" width={200} height={48} className="object-contain h-14 sm:h-16 w-auto group-hover:opacity-90 transition-opacity" priority />
          </Link>
          <div className="ml-4 pl-4 sm:ml-6 sm:pl-6 border-l border-border hidden sm:block">
            <span className="text-[10px] sm:text-xs font-black text-primary uppercase tracking-[0.2em]">Almoxarifado</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-8">
          <Link href="/pedidos" className="flex items-center text-slate-500 hover:text-accent font-bold transition-all hover:-translate-y-0.5">
            <ClipboardList className="w-5 h-5 mr-2" />
            <span className="text-sm">Pedidos</span>
          </Link>
          <Link href="/historico" className="flex items-center text-slate-500 hover:text-accent font-bold transition-all hover:-translate-y-0.5">
            <History className="w-5 h-5 mr-2" />
            <span className="text-sm">Histórico</span>
          </Link>
          
          <div className="pl-6 border-l border-border">
            <LogoutButton />
          </div>
        </div>
      </header>
      
      {/* Content Area */}
      <main className="pt-24 px-4 sm:px-8 pb-24 sm:pb-8 relative z-10 min-h-screen max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-border flex items-center justify-around z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        <Link href="/pedidos" className="flex flex-col items-center justify-center text-slate-500 hover:text-accent w-full h-full transition-colors active:bg-slate-50">
          <ClipboardList className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-wider">Pedidos</span>
        </Link>
        <Link href="/historico" className="flex flex-col items-center justify-center text-slate-500 hover:text-accent w-full h-full transition-colors active:bg-slate-50">
          <History className="w-6 h-6 mb-1" />
          <span className="text-[10px] font-black uppercase tracking-wider">Histórico</span>
        </Link>
        <div className="flex flex-col items-center justify-center text-slate-500 w-full h-full active:bg-slate-50">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
