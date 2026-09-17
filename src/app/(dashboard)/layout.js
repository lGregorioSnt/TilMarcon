"use client";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { History, ClipboardList } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/pedidos", label: "Pedidos", icon: ClipboardList },
    { href: "/historico", label: "Histórico", icon: History },
  ];

  return (
    <div className="min-h-screen bg-background text-slate-800 relative">
      {/* Malha técnica sutil ao fundo */}
      <div className="technical-grid fixed inset-0 pointer-events-none z-0" aria-hidden="true" />

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 h-16 z-50 flex items-center justify-between px-4 sm:px-8 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="flex items-center">
          <Link href="/pedidos" className="flex items-center group">
            <Image
              src="/Logo.png"
              alt="Til Marcon Logo"
              width={200} height={48}
              className="object-contain h-12 sm:h-14 w-auto group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
          <div className="ml-4 pl-4 sm:ml-6 sm:pl-6 border-l border-border hidden sm:block">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Almoxarifado</span>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center space-x-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
                  ${isActive
                    ? 'text-primary bg-blue-50 border border-blue-100'
                    : 'text-slate-500 hover:text-primary hover:bg-slate-50'}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Link>
            );
          })}
          <div className="pl-4 ml-2 border-l border-border">
            <LogoutButton />
          </div>
        </div>

        <div className="sm:hidden">
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      <main className="pt-20 px-4 sm:px-8 pb-24 sm:pb-8 relative z-10 min-h-screen w-full max-w-[1800px] mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 h-16 z-50 bg-white/95 backdrop-blur-md border-t border-border flex items-center justify-around shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors
                ${isActive ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
            </Link>
          );
        })}
        <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
