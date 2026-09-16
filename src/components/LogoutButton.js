"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center text-slate-500 hover:text-red-500 transition-colors ml-4 pl-4 border-l border-slate-200"
    >
      <LogOut className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">Sair</span>
    </button>
  );
}
