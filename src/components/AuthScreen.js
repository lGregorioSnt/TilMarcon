"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldCheck, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";

// ─── Malha de Triângulos Interativa (Canvas) ──────────────────────────────────
function TriangleMesh() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouse.current = { x: -1000, y: -1000 };
    };
    
    // Ouve no parent para capturar mesmo sobre os inputs
    canvas.parentElement.addEventListener("mousemove", onMouseMove);
    canvas.parentElement.addEventListener("mouseleave", onMouseLeave);

    // Cria pontos
    const POINTS_COUNT = 90; // Densidade aumentada (dobro de triângulos)
    const points = [];
    for (let i = 0; i < POINTS_COUNT; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        originX: Math.random() * width,
        originY: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Atualiza posições
      for (let i = 0; i < points.length; i++) {
        let p = points[i];
        
        // Movimento natural
        p.originX += p.vx;
        p.originY += p.vy;
        
        // Rebate nas bordas
        if (p.originX < 0 || p.originX > width) p.vx *= -1;
        if (p.originY < 0 || p.originY > height) p.vy *= -1;

        // Atração magnética do mouse
        const dx = mouse.current.x - p.originX;
        const dy = mouse.current.y - p.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Se o mouse estiver perto, puxa o ponto em direção a ele
        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.x = p.originX + (dx * force * 0.4);
          p.y = p.originY + (dy * force * 0.4);
        } else {
          // Retorna suavemente para a origem
          p.x += (p.originX - p.x) * 0.1;
          p.y += (p.originY - p.y) * 0.1;
        }
      }

      // Desenha triângulos e linhas
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            // Desenha linha
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(27, 58, 107, ${0.08 * (1 - dist/120)})`; // Azul marinho sutil
            ctx.lineWidth = 1;
            ctx.stroke();

            // Tenta formar um triângulo com um terceiro ponto
            for (let k = j + 1; k < points.length; k++) {
              const dx2 = points[j].x - points[k].x;
              const dy2 = points[j].y - points[k].y;
              const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
              
              const dx3 = points[k].x - points[i].x;
              const dy3 = points[k].y - points[i].y;
              const dist3 = Math.sqrt(dx3 * dx3 + dy3 * dy3);

              if (dist2 < 120 && dist3 < 120) {
                // Checa distância do triângulo ao mouse para iluminar
                const avgX = (points[i].x + points[j].x + points[k].x) / 3;
                const avgY = (points[i].y + points[j].y + points[k].y) / 3;
                const mDx = mouse.current.x - avgX;
                const mDy = mouse.current.y - avgY;
                const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
                
                let opacity = 0.02; // Triângulo normal
                if (mDist < 150) {
                  opacity = 0.08 * (1 - mDist/150); // Acende ao passar o mouse
                }

                ctx.beginPath();
                ctx.moveTo(points[i].x, points[i].y);
                ctx.lineTo(points[j].x, points[j].y);
                ctx.lineTo(points[k].x, points[k].y);
                ctx.closePath();
                ctx.fillStyle = `rgba(27, 58, 107, ${opacity})`;
                ctx.fill();
              }
            }
          }
        }
        
        // Desenha o nó (ponto)
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(27, 58, 107, 0.2)";
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      if (canvasRef.current && canvasRef.current.parentElement) {
        canvasRef.current.parentElement.removeEventListener("mousemove", onMouseMove);
        canvasRef.current.parentElement.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
// ──────────────────────────────────────────────────────────────────────────────

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const res = await signIn("credentials", { email, senha, redirect: false });
    
    if (res?.error) {
      setError("Credenciais inválidas. Verifique e tente novamente.");
      setLoading(false);
    } else {
      // Animação de saída antes do redirect
      setIsExiting(true);
      setTimeout(() => {
        router.push("/pedidos");
      }, 600); // tempo para tocar a animação
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen flex w-full bg-white font-sans relative overflow-hidden"
      >
        {/* Overlay de saída azul */}
        <AnimatePresence>
          {isExiting && (
            <motion.div
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-[9999] bg-[#1B3A6B]"
            />
          )}
        </AnimatePresence>

          {/* ── Left: Formulário ───────────────────────────────────── */}
          <div className="w-full md:w-5/12 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-white relative shadow-[4px_0_40px_rgba(27,58,107,0.12)] z-10">
            
            {/* Canvas Interativo em Background */}
            <TriangleMesh />
            
            {/* Topo */}
            <div className="flex justify-between items-center relative z-10">
              <div className="inline-flex items-center px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Acesso Seguro
              </div>
              <span className="text-[10px] font-bold text-slate-300 tracking-widest">v2.1.0</span>
            </div>

            {/* Conteúdo central */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm mx-auto space-y-10"
            >
              {/* Logo */}
              <div className="flex justify-center md:justify-start">
                <Image
                  src="/Logo.png"
                  alt="Til Marcon Logo"
                  width={400} height={120}
                  className="object-contain h-20 sm:h-24 w-auto drop-shadow-sm"
                  priority
                />
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-3xl font-display font-black text-slate-900 tracking-tight">
                  Bem-vindo de volta
                </h1>
                <p className="text-slate-500 mt-1.5 text-sm font-medium">
                  Insira suas credenciais corporativas.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuth} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-red-500 text-sm font-bold text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="email"
                      placeholder="E-mail corporativo"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 pl-11 pr-4 font-medium text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                    <input
                      type="password"
                      placeholder="Senha"
                      required
                      value={senha}
                      onChange={e => setSenha(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md py-3.5 pl-11 pr-4 font-medium text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <a href="#" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                    Esqueceu a senha?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="relative w-full text-white font-black py-4 rounded-md flex items-center justify-center gap-2 text-sm tracking-widest uppercase overflow-hidden disabled:opacity-70 transition-shadow hover:shadow-[0_4px_20px_rgba(27,58,107,0.25)]"
                  style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #1e5fa8 100%)" }}
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent hover:animate-[shimmer_1.5s_infinite]" />
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Acessar
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>© {new Date().getFullYear()} Til Marcon</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Sistemas
              </span>
            </div>
          </div>

          {/* ── Right: Vídeo / Imagem de Fundo ─────────── */}
          <div className="hidden md:block w-7/12 relative overflow-hidden bg-slate-900">
            {/* Overlay com a cor da marca para manter a legibilidade e contraste */}
            <div className="absolute inset-0 bg-[#1B3A6B]/30 mix-blend-multiply z-10 pointer-events-none" />
            
            {/* --- Formas Geométricas Translúcidas (Glassmorphism) --- */}
            
            {/* Triângulo Base (Canto inferior direito) */}
            <div 
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                background: "rgba(27, 58, 107, 0.15)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                clipPath: "polygon(30% 100%, 100% 55%, 100% 100%)",
                borderTop: "1px solid rgba(255,255,255,0.05)"
              }}
            />

            {/* Raio / Faixa Diagonal (Canto superior esquerdo) */}
            <motion.div 
              animate={{ y: [0, -40, 0], x: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-5%] left-[-10%] w-[50%] h-[30%] z-20 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(27,58,107,0.2) 100%)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                borderRight: "1px solid rgba(255,255,255,0.1)"
              }}
            />

            {/* Losango / Diamante (Flutuando no canto superior direito) */}
            <motion.div 
              animate={{ y: [0, 30, 0], rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute top-[15%] right-[10%] w-32 h-32 z-20 pointer-events-none"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}
            />

            {/* Triângulo Menor (Canto inferior esquerdo) */}
            <motion.div 
              animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-0 left-0 w-[20%] h-[20%] z-20 pointer-events-none"
              style={{
                background: "rgba(249, 115, 22, 0.15)", /* Laranja mais forte */
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                clipPath: "polygon(0 0, 0 100%, 100% 100%)",
                borderRight: "1px solid rgba(255,255,255,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.1)"
              }}
            />
            {/* ----------------------------------------------------- */}

            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover z-0"
            >
              <source src="/gif-marcon.mp4" type="video/mp4" />
            </video>

            {/* Elementos decorativos por cima do vídeo */}
            <div className="absolute inset-0 z-30 pointer-events-none p-12 flex flex-col justify-end text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-md border border-white/20 mb-4">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold tracking-widest uppercase">Tecnologia Til Marcon</span>
                </div>
                <h2 className="text-4xl lg:text-5xl font-black font-display leading-tight mb-4 max-w-lg drop-shadow-lg uppercase tracking-tight">
                  SOMOS MOVIDOS PELA INOVAÇÃO
                </h2>
                <p className="text-white/80 text-lg font-medium max-w-md drop-shadow-md">
                  Organização inteligente para sua oficina.
                </p>
              </motion.div>
            </div>
          </div>
      </motion.div>
    </AnimatePresence>
  );
}
