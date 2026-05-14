"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ChevronRight, Download, Check, FileDown,
  Hand, Sparkles, RotateCcw, ScanLine, Upload, Crown,
  Heart, Zap, Flame, Leaf, Gem, Microscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CATEGORIES = [
  { id: "love",     icon: "♥", title: "Love & Relationships", subtitle: "Heart line · Venus mount · Attachment lines", color: "#e8636a", glow: "rgba(232,99,106,0.25)" },
  { id: "business", icon: "◆", title: "Business & Wealth",    subtitle: "Fate line · Mercury line · Jupiter mount",    color: "#c9a84c", glow: "rgba(201,168,76,0.25)"  },
  { id: "health",   icon: "✦", title: "Health & Vitality",    subtitle: "Life line · Health line · Mount fullness",    color: "#5ba89e", glow: "rgba(91,168,158,0.25)"  },
  { id: "full",     icon: "⬡", title: "Full Soul Reading",    subtitle: "Complete palm + zodiac + all dimensions",     color: "#9b7fe8", glow: "rgba(155,127,232,0.25)" },
];

const PERSONAS = [
  { id: "kobe",    name: "Kobe Bryant",        emoji: "🐍", trait: "Mamba Mentality",       color: "#c9a84c", quote: "Rest at the end, not in the middle." },
  { id: "jobs",    name: "Steve Jobs",          emoji: "🍎", trait: "Think Different",        color: "#e8e8e8", quote: "The people who are crazy enough to think they can change the world are the ones who do." },
  { id: "tyson",   name: "Mike Tyson",          emoji: "🥊", trait: "Undeniable Force",       color: "#e8636a", quote: "Everyone has a plan until they get punched in the mouth." },
  { id: "oprah",   name: "Oprah Winfrey",       emoji: "✨", trait: "Turn Pain Into Power",   color: "#d4a0e8", quote: "You get in life what you have the courage to ask for." },
  { id: "ronaldo", name: "Cristiano Ronaldo",   emoji: "⚽", trait: "Obsessive Excellence",   color: "#4a9eda", quote: "Talent without working hard is nothing." },
  { id: "jordan",  name: "Michael Jordan",      emoji: "🏀", trait: "No Excuses",             color: "#e07840", quote: "I never lost a game. I just ran out of time." },
  { id: "musk",    name: "Elon Musk",           emoji: "🚀", trait: "First Principles",       color: "#5ba89e", quote: "When something is important enough, you do it even if the odds are not in your favor." },
  { id: "martha",  name: "Martha Stewart",      emoji: "🌿", trait: "Master Your Craft",      color: "#a8c870", quote: "Life is too complicated not to be orderly." },
  { id: "tony",    name: "Tony Robbins",        emoji: "🔥", trait: "Unleash the Giant",      color: "#ff8c42", quote: "The only impossible journey is the one you never begin." },
];

const IMPROVEMENT_PILLARS = [
  { id: "emotional",     Icon: Heart,       label: "Emotional Intelligence", color: "#e8636a", emoji: "❤"  },
  { id: "logic",         Icon: Zap,         label: "Logic & Mindset",        color: "#c9a84c", emoji: "⚡" },
  { id: "willpower",     Icon: Flame,       label: "Will & Discipline",      color: "#e07840", emoji: "🔥" },
  { id: "nutrition",     Icon: Leaf,        label: "Eating & Nutrition",     color: "#5ba89e", emoji: "🌿" },
  { id: "health_habits", Icon: Gem,         label: "Health Habits",          color: "#9b7fe8", emoji: "💎" },
  { id: "science",       Icon: Microscope,  label: "Science-Based Tips",     color: "#4a9eda", emoji: "🧬" },
];

const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const PREMIUM_CATEGORIES = ["health", "full"];

// ── animation presets ──────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const pageVariants = {
  initial: { opacity: 0, y: 22, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.42, ease } },
  exit:    { opacity: 0, y: -14, filter: "blur(3px)", transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } },
};
const cardItem = {
  hidden:  { opacity: 0, y: 18, scale: 0.97 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.36, ease } },
};
const staggerList = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

// ── generatePDF ────────────────────────────────────────────────────────────────
function generatePDF(reading, suggestions, personas, category, handType, zodiac, userName) {
  const cat  = CATEGORIES.find(c => c.id === category);
  const date = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const personaNames = personas.map(id => PERSONAS.find(p => p.id === id)?.name).filter(Boolean).join(" & ");

  const pillarsHTML = suggestions ? IMPROVEMENT_PILLARS.map(p => {
    const content = suggestions[p.id];
    if (!content) return "";
    return `<div style="margin-bottom:22px;padding:18px 20px;background:#f9f7ff;border-left:4px solid ${p.color};border-radius:0 10px 10px 0;">
      <div style="font-size:12px;font-weight:700;color:${p.color};letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${p.emoji} ${p.label}</div>
      <div style="font-size:15px;color:#2d2d3a;line-height:1.85;">${content.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}</div>
    </div>`;
  }).join("") : "";

  const readingHTML = reading.replace(/\*\*(.*?)\*\*/g,`<strong style="color:${cat.color}">$1</strong>`).replace(/\n/g,"<br>");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Palmara — ${cat.title}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Crimson Text',serif;background:#fff;color:#2d2d3a}
.cover{background:linear-gradient(145deg,#09070f,#1a1228);padding:56px 48px;text-align:center}
.logo{font-family:'Cormorant Garamond',serif;font-size:58px;font-weight:700;color:#c9a84c;letter-spacing:8px;margin-bottom:4px}
.tagline{color:rgba(255,255,255,0.3);font-size:11px;letter-spacing:5px;text-transform:uppercase;margin-bottom:30px}
.badge{display:inline-block;background:${cat.color}22;border:1px solid ${cat.color}66;border-radius:30px;padding:8px 24px;color:${cat.color};font-size:14px;letter-spacing:2px;margin-bottom:16px}
.meta{color:rgba(255,255,255,0.35);font-size:13px}
.personas-cover{margin-top:20px;color:rgba(255,255,255,0.5);font-size:14px;font-style:italic}
.body{padding:48px;max-width:700px;margin:0 auto}
.sec-title{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:700;color:#09070f;margin-bottom:4px}
.sec-sub{color:#bbb;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid #eee}
.reading{font-size:16px;line-height:1.9;color:#2d2d3a;margin-bottom:48px}
.divider{width:50px;height:3px;background:${cat.color};margin:14px 0 30px;border-radius:2px}
.footer{background:#09070f;padding:22px 48px;display:flex;justify-content:space-between;align-items:center}
.footer-logo{font-family:'Cormorant Garamond',serif;color:#c9a84c;font-size:22px;letter-spacing:4px}
.footer-meta{color:rgba(255,255,255,0.25);font-size:11px;text-align:right}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div class="cover">
  <div class="logo">PALMARA</div>
  <div class="tagline">Palm · Zodiac · Soul</div>
  <div class="badge">${cat.icon} ${cat.title.toUpperCase()}</div><br>
  <div class="meta">${userName ? userName + " · " : ""}${handType.charAt(0).toUpperCase()+handType.slice(1)} Hand${zodiac ? " · " + zodiac : ""} · ${date}</div>
  ${personaNames ? `<div class="personas-cover">Guided by the energy of ${personaNames}</div>` : ""}
</div>
<div class="body">
  <div class="sec-title">Your Palm Reading</div>
  <div class="sec-sub">${cat.title} · ${handType.charAt(0).toUpperCase()+handType.slice(1)} Hand</div>
  <div class="reading">${readingHTML}</div>
  ${pillarsHTML ? `<div class="sec-title">Your Growth Plan</div><div class="divider"></div>${pillarsHTML}` : ""}
</div>
<div class="footer">
  <div class="footer-logo">PALMARA</div>
  <div class="footer-meta">palmara.app · ${date}<br>For personal reflection only</div>
</div>
</body></html>`;

  const blob = new Blob([html], { type:"text/html" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = `Palmara-${cat.title.replace(/\s+/g,"-")}-${date}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── ParticleCanvas ─────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    const COUNT      = 72;
    const CONNECT    = 130;
    const MOUSE_R    = 160;
    const MOUSE_F    = 0.018;

    const pts = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  0.7 + Math.random() * 1.4,
      baseAlpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
      spd:  0.008 + Math.random() * 0.012,
    }));

    let tick = 0;
    let raf;

    function draw() {
      ctx.clearRect(0, 0, W, H);
      tick++;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const p of pts) {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_R * MOUSE_R && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = ((MOUSE_R - d) / MOUSE_R) * MOUSE_F;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }

        p.vx *= 0.992;
        p.vy *= 0.992;
        p.x  += p.vx;
        p.y  += p.vy;

        // Wrap at edges
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        const alpha = p.baseAlpha * (0.55 + 0.45 * Math.sin(tick * p.spd + p.phase));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();
      }

      // Constellation lines
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECT) {
            const a = (1 - d / CONNECT) * 0.14;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${a})`;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    const onMouse = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()  => { mouseRef.current = { x: -9999,     y: -9999     }; };

    window.addEventListener("resize",      onResize);
    window.addEventListener("mousemove",   onMouse);
    window.addEventListener("mouseleave",  onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize",     onResize);
      window.removeEventListener("mousemove",  onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ── ProgressBar ────────────────────────────────────────────────────────────────
const STEP_LABELS = ["Category", "Mentors", "Upload", "Reading"];
const STEP_IDX    = { home: 0, persona: 1, upload: 2, loading: 3, result: 3 };

function ProgressBar({ step }) {
  const active = STEP_IDX[step] ?? 0;
  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-2.5 pb-1 px-5"
      style={{ background: "linear-gradient(to bottom, rgba(9,7,15,0.95) 60%, transparent)" }}>
      <div className="max-w-[520px] mx-auto flex gap-2">
        {STEP_LABELS.map((label, i) => {
          const done    = i <= active;
          const current = i === active;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-[5px]">
              <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  className="h-full rounded-full origin-left"
                  style={{ background: "linear-gradient(90deg,#c9a84c,#9b7fe8)" }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.55, ease, delay: i * 0.06 }}
                />
              </div>
              <span className="text-[8.5px] tracking-[1.5px] uppercase transition-colors duration-300"
                style={{ color: current ? "rgba(201,168,76,0.85)" : done ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)" }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Loader ─────────────────────────────────────────────────────────────────────
function Loader({ label }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-7 py-20"
    >
      <div className="relative w-20 h-20">
        {[0, 1, 2].map(i => (
          <motion.div key={i}
            className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.38)]"
            animate={{ scale: [0.55, 2.7], opacity: [0.85, 0] }}
            transition={{ duration: 2.2, ease: "easeOut", delay: i * 0.55, repeat: Infinity }}
          />
        ))}
        <motion.div
          className="absolute rounded-full"
          style={{ inset: "26%", background: "radial-gradient(circle, #c9a84c, #9b7fe8)" }}
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.88, 1.12, 0.88] }}
          transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
      <motion.p
        animate={{ opacity: [0.3, 0.75, 0.3] }}
        transition={{ duration: 2.6, repeat: Infinity }}
        className="font-garamond text-lg tracking-[3px] text-white/40"
      >{label}</motion.p>
    </motion.div>
  );
}

// ── ScanningLoader ─────────────────────────────────────────────────────────────
function ScanningLoader({ imageUrl }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 py-10"
    >
      <div className="relative w-full max-w-[300px] rounded-2xl overflow-hidden"
        style={{ height: 230, boxShadow: "0 0 48px rgba(201,168,76,0.18), 0 0 0 1px rgba(201,168,76,0.15)" }}>
        <Image src={imageUrl} alt="Palm" fill unoptimized className="object-cover" sizes="300px" />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom,rgba(9,7,15,0.15),rgba(9,7,15,0.5))" }} />

        {/* Analysis grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(201,168,76,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.05) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }} />

        {/* Scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,transparent 0%,rgba(201,168,76,0.2) 10%,rgba(201,168,76,0.9) 50%,rgba(201,168,76,0.2) 90%,transparent 100%)", boxShadow: "0 0 14px 4px rgba(201,168,76,0.45)" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Corner markers */}
        {["top-2 left-2","top-2 right-2","bottom-2 left-2","bottom-2 right-2"].map((pos, i) => (
          <motion.div key={i} className={`absolute ${pos} w-4 h-4`}
            style={{
              borderTop:    i < 2 ? "1.5px solid rgba(201,168,76,0.7)" : "none",
              borderBottom: i >= 2 ? "1.5px solid rgba(201,168,76,0.7)" : "none",
              borderLeft:   i % 2 === 0 ? "1.5px solid rgba(201,168,76,0.7)" : "none",
              borderRight:  i % 2 === 1 ? "1.5px solid rgba(201,168,76,0.7)" : "none",
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.p
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="font-garamond text-lg tracking-[3px] text-white/50"
        >Reading your palm lines...</motion.p>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i} className="w-1 h-1 rounded-full"
              style={{ background: "#c9a84c" }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.4, delay: i * 0.18, repeat: Infinity }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Paywall ────────────────────────────────────────────────────────────────────
function Paywall({ cat, onClose }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleCheckout = async () => {
    setLoading(true); setErr("");
    try {
      const res  = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setErr(data.error || "Something went wrong. Please try again."); setLoading(false); }
    } catch { setErr("Payment unavailable. Please try again."); setLoading(false); }
  };

  return (
    <Dialog open onOpenChange={v => !v && onClose()}>
      <DialogContent accentColor={cat.color} glow={cat.glow}>
        <DialogHeader>
          <motion.div
            animate={{ rotate:[0,8,-8,0], scale:[1,1.1,1] }}
            transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
            className="text-5xl mb-1"
          >{cat.icon}</motion.div>
          <DialogTitle className="text-3xl" style={{ color: cat.color }}>Unlock {cat.title}</DialogTitle>
          <DialogDescription className="text-[15px] leading-relaxed">
            You have used your free reading. Join Palmara Pro for unlimited access to all readings, growth plans, and PDF exports.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-5 mb-6">
          <Badge variant="pro" className="mb-3">PALMARA PRO</Badge>
          <div className="font-garamond text-[40px] font-bold leading-none text-white">
            $9.99<span className="text-base font-normal text-white/35">/mo</span>
          </div>
          <p className="text-[13px] text-white/30 mt-2">Unlimited · All categories · PDF export · Persona coaching</p>
        </div>

        {err && <p className="text-[13px] text-[#e8636a] mb-3 text-center">{err}</p>}

        <Button size="lg" className="w-full mb-3 gap-2" disabled={loading} onClick={handleCheckout}
          style={{ background:`linear-gradient(135deg,${cat.color},${cat.color}88)`, color:"#fff", boxShadow:`0 6px 28px ${cat.glow}` }}
        >
          {loading && (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          )}
          {loading ? "Redirecting to Stripe…" : "Start Palmara Pro — $9.99/mo →"}
        </Button>

        <button onClick={onClose} className="text-[13px] text-white/20 cursor-pointer bg-transparent border-0 hover:text-white/40 transition-colors">
          Maybe later
        </button>
      </DialogContent>
    </Dialog>
  );
}

// ── PalmaraLogo ────────────────────────────────────────────────────────────────
function PalmaraLogo() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:-300% center}100%{background-position:300% center}}`}</style>
      <motion.div
        className="relative inline-block"
        animate={{
          filter: [
            "drop-shadow(0 0 18px rgba(201,168,76,0.4))",
            "drop-shadow(0 0 52px rgba(201,168,76,0.95)) drop-shadow(0 0 90px rgba(155,127,232,0.35))",
            "drop-shadow(0 0 18px rgba(201,168,76,0.4))",
          ]
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {"PALMARA".split("").map((letter, i) => (
          <motion.span key={i}
            className="inline-block font-garamond font-bold leading-none"
            style={{
              fontSize: 62,
              letterSpacing: 5,
              background: "linear-gradient(135deg,#8a6010 0%,#f0d98a 20%,#c9a84c 40%,#e8d5a3 55%,#9b7fe8 75%,#c9a84c 100%)",
              backgroundSize: "400% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: `shimmer ${4 + i * 0.15}s ${i * 0.1}s linear infinite`,
            }}
            animate={{ y: [0, -(3 + (i % 3) * 2.5), 0] }}
            transition={{ duration: 2.8 + i * 0.22, ease: "easeInOut", delay: i * 0.08, repeat: Infinity }}
          >{letter}</motion.span>
        ))}
      </motion.div>
    </>
  );
}

// ── ResultUpsellButton ─────────────────────────────────────────────────────────
function ResultUpsellButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    setLoading(false);
  };

  return (
    <Button size="lg" disabled={loading} onClick={handleCheckout} className="gap-2"
      style={{ background:"linear-gradient(135deg,#9b7fe8,#c9a84c)", color:"#fff" }}>
      {loading && (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
      )}
      {loading ? "Opening Stripe…" : "Start for $9.99 per month →"}
    </Button>
  );
}

// ── PalmaraApp ─────────────────────────────────────────────────────────────────
export default function PalmaraApp() {
  const [step, setStep] = useState("home");
  const [category, setCategory] = useState(null);
  const [zodiac, setZodiac] = useState("");
  const [handType, setHandType] = useState("right");
  const [userName, setUserName] = useState("");
  const [selectedPersonas, setSelectedPersonas] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageB64, setImageB64] = useState(null);
  const [reading, setReading] = useState("");
  const [suggestions, setSuggestions] = useState(null);
  const [loadingReading, setLoadingReading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [freeUsed, setFreeUsed] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [paywall, setPaywall] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [flippedPillar, setFlippedPillar] = useState(null);
  const [pdfState, setPdfState] = useState("idle"); // "idle" | "saving" | "done"
  const [firstHandReading, setFirstHandReading] = useState("");
  const [imageMediaType, setImageMediaType] = useState("image/jpeg");
  const fileRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pro") === "true") {
      setIsPro(true); setFreeUsed(false);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const handleFile = useCallback((file) => {
    setImageUrl(URL.createObjectURL(file));
    setImageMediaType(file.type || "image/jpeg");
    const r = new FileReader();
    r.onload = e => setImageB64(e.target.result.split(",")[1]);
    r.readAsDataURL(file);
  }, []);

  const togglePersona = (id) => {
    setSelectedPersonas(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 2) return prev;
      return [...prev, id];
    });
  };

  const selectCategory = (cat) => {
    if (!isPro && freeUsed && PREMIUM_CATEGORIES.includes(cat.id)) { setPaywall(cat); return; }
    setCategory(cat); setStep("persona");
  };

  const buildPersonaContext = () => {
    if (!selectedPersonas.length) return "";
    const personas = selectedPersonas.map(id => PERSONAS.find(p => p.id === id));
    return `
The user admires these people and wants advice channeled through their philosophy and voice:
${personas.map(p => `${p.name} (${p.trait}): Known for saying "${p.quote}"`).join("\n")}

When giving improvement advice, channel their actual voice, philosophy, and famous sayings. Use their real language and approach. Kobe would say mamba mentality. Jobs would say think different. Tyson would be raw and direct. Make it feel like THEY are speaking.`;
  };

  const callClaude = async (messages, system) => {
    const res = await fetch("/api/reading", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, system, messages }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "API error");
    const text = data.content?.map(b => b.text || "").join("") || "";
    if (!text) throw new Error("Empty response from API");
    return text;
  };

  const getReading = async () => {
    if (!imageB64) return;
    setLoadingReading(true); setStep("loading");
    const catPrompts = {
      love:     "Focus on love and relationships. Analyze heart line depth, curve, length. Look at Venus mount fullness. Identify attachment/relationship lines. Give romantic profile, what they need in love, relationship patterns, and 3 specific insights.",
      business: "Focus on business and wealth. Analyze fate line strength, Mercury line, Jupiter mount. Give career archetype, money mindset, leadership style, best business environment, and 3 wealth-building insights.",
      health:   "Focus on health and vitality. Analyze life line arc, depth, breaks. Look for health line and mount fullness. Give energy profile, stress indicators, physical strengths and vulnerabilities, and 3 actionable health insights.",
      full:     `Give a complete reading covering heart line, head line, life line, fate line, and key mounts. ${zodiac ? `Weave in their ${zodiac} zodiac nature.` : ""} Cover love, business, and health. Close with their one-sentence life theme.`,
    };
    const sys = `You are Palmara, a world-class palm reader and intuitive life coach. Analyze the palm photo with depth and wisdom. Be specific, personal, and actionable. Use **bold** for section headers. Keep sections 3 to 5 sentences. Total under 450 words. Never be vague.`;
    const isSecondHand = !!firstHandReading;
    const otherHand    = handType === "right" ? "left" : "right";
    const userText     = isSecondHand
      ? `I already read the ${otherHand} hand:\n${firstHandReading}\n\nNow analyze this ${handType} hand for a ${category.title} reading.\n\n${catPrompts[category.id]}\n\nCombine insights from both hands into a unified, deeper reading.`
      : `Analyze this ${handType} hand for a ${category.title} reading.\n\n${catPrompts[category.id]}`;
    try {
      const text = await callClaude([{ role:"user", content:[
        { type:"image", source:{ type:"base64", media_type: imageMediaType, data:imageB64 } },
        { type:"text", text: userText }
      ]}], sys);
      setReading(text);
      if (!freeUsed) setFreeUsed(true);
    } catch (err) { setReading(`Error: ${err.message}`); }
    setLoadingReading(false); setStep("result");
  };

  const getSuggestions = async (pillarId) => {
    if (suggestions?.[pillarId]) { setActivePillar(pillarId); return; }
    setActivePillar(pillarId); setLoadingSuggestions(true);
    const pillar     = IMPROVEMENT_PILLARS.find(p => p.id === pillarId);
    const personaCtx = buildPersonaContext();
    const sys    = `You are Palmara's life optimization coach. Give hyper-specific, science-backed, deeply actionable improvement advice. Use **bold** for key points. Give 4 to 6 real steps people can act on today. No fluff, no filler. ${personaCtx ? "When personas are provided, speak in their actual voice and philosophy. Use their real language and famous phrases naturally throughout." : ""}`;
    const prompt = `Palm reading result:\n${reading}\n\nCategory: ${category?.title}\nHand: ${handType}${zodiac ? `\nZodiac: ${zodiac}` : ""}\n${personaCtx}\n\nNow give specific improvement advice for this area: ${pillar.label}\n\nBase it on what the palm reading reveals about this specific person. Make it feel deeply personal. ${selectedPersonas.length ? `Channel the voice and philosophy of ${selectedPersonas.map(id => PERSONAS.find(p=>p.id===id)?.name).join(" and ")}.` : ""}`;
    try {
      const text = await callClaude([{ role:"user", content: prompt }], sys);
      setSuggestions(prev => ({ ...(prev||{}), [pillarId]: text }));
    } catch { setSuggestions(prev => ({ ...(prev||{}), [pillarId]: "Unable to generate. Please try again." })); }
    setLoadingSuggestions(false);
  };

  const handlePillarClick = (id) => {
    setFlippedPillar(id);
    getSuggestions(id);
    setTimeout(() => setFlippedPillar(null), 650);
  };

  const handleExport = () => {
    if (pdfState !== "idle") return;
    setPdfState("saving");
    setTimeout(() => {
      generatePDF(reading, suggestions, selectedPersonas, category?.id, handType, zodiac, userName);
      setPdfState("done");
      setTimeout(() => setPdfState("idle"), 3000);
    }, 900);
  };

  const reset = () => {
    setStep("home"); setCategory(null); setZodiac(""); setHandType("right");
    setSelectedPersonas([]); setImageUrl(null); setImageB64(null);
    setReading(""); setSuggestions(null); setActivePillar(null); setFlippedPillar(null);
    setPdfState("idle"); setFirstHandReading("");
  };

  const goToSecondHand = () => {
    setFirstHandReading(reading);
    setHandType(handType === "right" ? "left" : "right");
    setImageUrl(null); setImageB64(null);
    setReading(""); setSuggestions(null); setActivePillar(null);
    setStep("upload");
  };

  const formatText = (text, accentColor) => {
    if (!text) return null;
    return (
      <motion.div variants={staggerList} initial="hidden" animate="visible">
        {text.split("\n").map((line, i) => {
          if (!line.trim()) return <div key={i} className="h-2" />;
          if (line.startsWith("**") && line.endsWith("**"))
            return (
              <motion.h3 key={i} variants={cardItem}
                className="font-garamond text-xl mt-5 mb-1.5 tracking-wide"
                style={{ color: accentColor || "#c9a84c" }}>
                {line.replace(/\*\*/g, "")}
              </motion.h3>
            );
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <motion.p key={i} variants={cardItem} className="text-white/[0.82] leading-[1.88] mb-2 text-base">
              {parts.map((p, j) => j % 2 === 1 ? <strong key={j} style={{ color: accentColor || "#c9a84c" }}>{p}</strong> : p)}
            </motion.p>
          );
        })}
      </motion.div>
    );
  };

  const cat = category;

  return (
    <div className="min-h-screen bg-[#09070f] font-crimson relative overflow-x-hidden">

      {/* Canvas particle background */}
      <ParticleCanvas />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div className="absolute top-[5%] left-[5%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(155,127,232,0.06),transparent 65%)" }}
          animate={{ x:[0,35,0], y:[0,-45,0], scale:[1,1.12,1] }}
          transition={{ duration:14, ease:"easeInOut", repeat:Infinity }} />
        <motion.div className="absolute bottom-[8%] right-[5%] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(201,168,76,0.05),transparent 65%)" }}
          animate={{ x:[0,-25,0], y:[0,35,0], scale:[1,0.9,1] }}
          transition={{ duration:17, ease:"easeInOut", repeat:Infinity }} />
        <motion.div className="absolute top-[45%] right-[15%] w-[240px] h-[240px] rounded-full"
          style={{ background: "radial-gradient(circle,rgba(232,99,106,0.04),transparent 65%)" }}
          animate={{ x:[0,22,0], y:[0,22,0] }}
          transition={{ duration:10, ease:"easeInOut", delay:3, repeat:Infinity }} />
      </div>

      {/* Progress bar */}
      <ProgressBar step={step} />

      <div className="relative z-[1] max-w-[520px] mx-auto px-5 pb-20 pt-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.6, ease }}
          className="text-center pt-10 pb-8"
        >
          <motion.div
            animate={{ scale:[1,1.12,1], filter:["drop-shadow(0 0 20px rgba(201,168,76,.5))","drop-shadow(0 0 44px rgba(201,168,76,1.0))","drop-shadow(0 0 20px rgba(201,168,76,.5))"] }}
            transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut" }}
            className="text-4xl mb-4"
          >🔮</motion.div>

          <PalmaraLogo />

          <motion.p
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.4, duration:0.6 }}
            className="text-white/20 text-[10px] tracking-[7px] uppercase mt-2"
          >Palm · Zodiac · Soul</motion.p>

          <AnimatePresence>
            {isPro && (
              <motion.div
                initial={{ opacity:0, scale:0.8, y:6 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8 }}
                transition={{ type:"spring", stiffness:300, damping:24 }}
                className="mt-4 flex justify-center"
              >
                <Badge variant="pro" className="text-[12px] px-4 py-1.5 gap-1.5">
                  <Crown className="w-3 h-3" /> Palmara Pro
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!freeUsed && !isPro && (
              <motion.div
                initial={{ opacity:0, scale:0.8, y:6 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.8 }}
                transition={{ delay:0.5, type:"spring", stiffness:300, damping:24 }}
                className="mt-5 flex justify-center"
              >
                <Badge variant="free" className="text-[13px] px-5 py-2 rounded-3xl gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  First reading free, no signup needed
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Step content ── */}
        <AnimatePresence mode="wait">

          {/* HOME */}
          {step === "home" && (
            <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <motion.div
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.08, duration:0.35, ease }}
                className="mb-7"
              >
                <Input
                  placeholder="Your name (optional, appears on report)"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                />
              </motion.div>

              <motion.p
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay:0.15 }}
                className="text-white/25 text-center mb-6 text-base italic tracking-wide"
              >What would you like insight on?</motion.p>

              <motion.div variants={staggerList} initial="hidden" animate="visible" className="flex flex-col gap-3.5">
                {CATEGORIES.map((c) => (
                  <motion.div key={c.id} variants={cardItem}
                    whileHover={{ y:-4, boxShadow:`0 18px 52px ${c.glow}` }}
                    whileTap={{ scale:0.98 }}
                    onClick={() => selectCategory(c)}
                    className="flex items-center gap-4 px-6 py-5 rounded-[20px] cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: `1px solid ${c.color}30`,
                      boxShadow: `0 6px 28px ${c.glow}18, inset 0 1px 0 rgba(255,255,255,0.06)`,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale:1.16, rotate:8 }}
                      transition={{ type:"spring", stiffness:420, damping:18 }}
                      className="w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-[22px]"
                      style={{ background:`${c.color}14`, border:`1px solid ${c.color}35`, color:c.color, boxShadow:`0 0 20px ${c.glow}` }}
                    >{c.icon}</motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="font-garamond font-semibold text-[19px] text-white mb-0.5">{c.title}</div>
                      <div className="text-[12.5px] text-white/25">{c.subtitle}</div>
                    </div>

                    {!isPro && freeUsed && PREMIUM_CATEGORIES.includes(c.id) && <Badge variant="pro">PRO</Badge>}

                    <motion.div
                      animate={{ x:[0,4,0] }}
                      transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
                    >
                      <ChevronRight className="w-5 h-5 text-white/15" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* PERSONA */}
          {step === "persona" && cat && (
            <motion.div key="persona" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <motion.button
                whileHover={{ x:-3 }} whileTap={{ scale:0.96 }}
                onClick={() => setStep("home")}
                className="flex items-center gap-2 text-sm text-white/30 mb-6 bg-transparent border-0 cursor-pointer hover:text-white/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>

              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.08, ease }}
                className="text-center mb-8"
              >
                <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
                  className="text-[30px] mb-3" style={{ color:cat.color }}>{cat.icon}</motion.div>
                <h2 className="font-garamond text-[30px] text-white mb-2">Choose Your Mentors</h2>
                <p className="text-white/30 text-[14px] leading-relaxed">
                  Pick up to 2 people you admire.<br/>Your growth advice will channel their philosophy.
                </p>

                <AnimatePresence>
                  {selectedPersonas.length > 0 && (
                    <motion.div
                      initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                      transition={{ duration:0.3, ease }}
                      className="mt-4 flex justify-center gap-2 flex-wrap overflow-hidden"
                    >
                      {selectedPersonas.map(id => {
                        const p = PERSONAS.find(x => x.id === id);
                        return (
                          <motion.span key={id}
                            initial={{ scale:0.7, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.7, opacity:0 }}
                            transition={{ type:"spring", stiffness:320, damping:22 }}
                            className="rounded-2xl px-4 py-1.5 text-[13px]"
                            style={{ background:`${p.color}20`, border:`1px solid ${p.color}50`, color:p.color }}
                          >{p.emoji} {p.name}</motion.span>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 2-col game character grid */}
              <motion.div
                variants={staggerList} initial="hidden" animate="visible"
                className="grid grid-cols-2 gap-3 mb-7"
              >
                {PERSONAS.map(p => {
                  const selected = selectedPersonas.includes(p.id);
                  const disabled = !selected && selectedPersonas.length >= 2;
                  return (
                    <motion.div key={p.id} variants={cardItem}
                      whileHover={!disabled ? { y:-3, boxShadow:`0 16px 40px ${p.color}28` } : {}}
                      whileTap={!disabled ? { scale:0.97 } : {}}
                      animate={selected ? { boxShadow:[`0 0 0px ${p.color}00`,`0 0 28px ${p.color}40`,`0 0 0px ${p.color}00`] } : { boxShadow:"none" }}
                      transition={selected ? { boxShadow:{ duration:2.2, repeat:Infinity, ease:"easeInOut" } } : { duration:0.25 }}
                      onClick={() => !disabled && togglePersona(p.id)}
                      className="relative rounded-2xl p-5 flex flex-col transition-all duration-200"
                      style={{
                        background: selected
                          ? `linear-gradient(145deg,${p.color}18,${p.color}08)`
                          : "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        border: `1px solid ${selected ? p.color+"55" : "rgba(255,255,255,0.08)"}`,
                        boxShadow: selected ? `inset 0 1px 0 rgba(255,255,255,0.1)` : "none",
                        opacity: disabled ? 0.3 : 1,
                        cursor: disabled ? "not-allowed" : "pointer",
                        minHeight: 172,
                      }}
                    >
                      <div className="text-[42px] mb-2 leading-none">{p.emoji}</div>
                      <div className="font-garamond font-bold text-[16px] leading-tight mb-0.5 transition-colors duration-200"
                        style={{ color: selected ? p.color : "rgba(255,255,255,0.82)" }}>{p.name}</div>
                      <div className="text-[10px] tracking-[1.2px] uppercase mb-2.5 transition-colors duration-200"
                        style={{ color: selected ? p.color+"aa" : "rgba(255,255,255,0.22)" }}>{p.trait}</div>
                      <div className="text-[11.5px] italic leading-[1.55] transition-colors duration-200 mt-auto"
                        style={{ color: selected ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)" }}>
                        "{p.quote}"
                      </div>
                      <AnimatePresence>
                        {selected && (
                          <motion.div
                            initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0, opacity:0 }}
                            transition={{ type:"spring", stiffness:420, damping:22 }}
                            className="absolute top-3 right-3"
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: p.color }}>
                              <Check className="w-3 h-3 text-black" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </motion.div>

              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.28, ease }}
                className="flex gap-2.5"
              >
                <Button variant="outline" size="lg" className="flex-1"
                  onClick={() => { setSelectedPersonas([]); setStep("upload"); }}
                >Skip</Button>
                <Button size="lg" className="flex-[2] gap-1.5"
                  style={{ background:`linear-gradient(135deg,${cat.color},${cat.color}88)`, color:"#fff", boxShadow:`0 6px 24px ${cat.glow}` }}
                  onClick={() => setStep("upload")}
                >
                  {selectedPersonas.length ? `Continue with ${selectedPersonas.length} mentor${selectedPersonas.length>1?"s":""}` : "Continue"}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* UPLOAD */}
          {step === "upload" && cat && (
            <motion.div key="upload" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <motion.button
                whileHover={{ x:-3 }} whileTap={{ scale:0.96 }}
                onClick={() => setStep("persona")}
                className="flex items-center gap-2 text-sm text-white/30 mb-6 bg-transparent border-0 cursor-pointer hover:text-white/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </motion.button>

              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.08, ease }}
                className="text-center mb-7"
              >
                <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}
                  className="text-[30px] mb-2" style={{ color:cat.color }}>{cat.icon}</motion.div>
                <h2 className="font-garamond text-[28px] text-white mb-1.5">
                  {firstHandReading ? `Now Your ${handType.charAt(0).toUpperCase()+handType.slice(1)} Hand` : cat.title}
                </h2>
                <p className="text-white/25 text-[14px]">
                  {firstHandReading ? "Upload your other palm for a combined deep reading" : "Clear palm photo · Good lighting · Fingers relaxed"}
                </p>
                {selectedPersonas.length > 0 && (
                  <p className="text-white/20 text-[13px] mt-2 italic">
                    Channeling {selectedPersonas.map(id => PERSONAS.find(p=>p.id===id)?.name).join(" & ")}
                  </p>
                )}
              </motion.div>

              {/* Hand selector */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.14 }}
                className="flex gap-2.5 mb-4">
                {["left","right"].map(h => (
                  <motion.button key={h}
                    onClick={() => setHandType(h)}
                    whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3.5 rounded-xl font-garamond text-[15px] tracking-wide transition-all duration-200 cursor-pointer"
                    style={{
                      background: handType===h ? `${cat.color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${handType===h ? cat.color : "rgba(255,255,255,0.07)"}`,
                      color: handType===h ? cat.color : "rgba(255,255,255,0.3)",
                      boxShadow: handType===h ? `0 0 20px ${cat.glow}` : "none",
                    }}
                  >
                    <Hand className="w-4 h-4 opacity-70" />
                    {h.charAt(0).toUpperCase()+h.slice(1)} Hand
                  </motion.button>
                ))}
              </motion.div>

              {/* Zodiac */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.18 }} className="mb-4">
                <select
                  value={zodiac} onChange={e => setZodiac(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-[15px] font-crimson cursor-pointer transition-colors duration-200 focus:outline-none focus:border-[rgba(201,168,76,0.4)]"
                  style={{ color: zodiac ? "#fff" : "rgba(255,255,255,0.25)", appearance:"none" }}
                >
                  <option value="" style={{ background:"#1a1520" }}>Add your zodiac sign (optional)</option>
                  {ZODIAC_SIGNS.map(z => <option key={z} value={z} style={{ background:"#1a1520" }}>{z}</option>)}
                </select>
              </motion.div>

              {/* Drop zone */}
              <motion.div
                initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.22, ease }}
                onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current.click()}
                className="flex flex-col items-center justify-center rounded-[22px] p-6 text-center cursor-pointer mb-4 transition-all duration-300"
                style={{
                  minHeight: 240,
                  border: `2px dashed ${imageUrl ? cat.color : "rgba(255,255,255,0.1)"}`,
                  background: imageUrl ? `${cat.color}06` : "rgba(255,255,255,0.015)",
                  boxShadow: imageUrl ? `0 0 40px ${cat.glow}` : "none",
                }}
                whileHover={{ borderColor: imageUrl ? cat.color : "rgba(255,255,255,0.22)" }}
              >
                {imageUrl ? (
                  <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.32, ease }} className="w-full">
                    <div className="relative w-full rounded-xl overflow-hidden mb-3" style={{ height: 200 }}>
                      <Image src={imageUrl} alt="Palm reading photo" fill unoptimized className="object-cover" sizes="480px" />
                      {/* Scan animation overlay when fresh drop */}
                      <motion.div className="absolute inset-0 rounded-xl"
                        style={{ background: `linear-gradient(to top, ${cat.color}18, transparent)` }}
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity }} />
                    </div>
                    <p className="text-white/30 text-[13px]">Tap to change photo</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      animate={{ y:[0,-9,0] }}
                      transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}
                      className="mb-4"
                    >
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <Upload className="w-9 h-9 text-white/20" />
                      </div>
                    </motion.div>
                    <p className="text-white/30 text-[15px] mb-1">Tap to upload or drag and drop</p>
                    <p className="text-white/15 text-[13px]">JPG or PNG · Clear natural light</p>
                  </>
                )}
              </motion.div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { if(e.target.files[0]) { handleFile(e.target.files[0]); e.target.value = ""; } }} />

              {/* CTA */}
              <motion.div
                animate={imageB64 ? { boxShadow:[`0 8px 36px ${cat.glow}`,`0 16px 56px ${cat.glow}`,`0 8px 36px ${cat.glow}`] } : {}}
                transition={imageB64 ? { boxShadow:{ duration:2.5, repeat:Infinity, ease:"easeInOut" } } : {}}
                className="rounded-[14px]"
              >
                <Button size="xl" className="w-full tracking-widest gap-2" disabled={!imageB64} onClick={getReading}
                  style={imageB64 ? { background:`linear-gradient(135deg,${cat.color},${cat.color}99)`, color:"#fff" } : {}}
                  variant={imageB64 ? "default" : "outline"}
                >
                  <ScanLine className="w-5 h-5" />
                  Read My Palm
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* LOADING */}
          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              {imageUrl
                ? <ScanningLoader imageUrl={imageUrl} />
                : <Loader label="Reading your palm lines..." />
              }
            </motion.div>
          )}

          {/* RESULT */}
          {step === "result" && reading && (
            <motion.div key="result" variants={pageVariants} initial="initial" animate="animate" exit="exit">

              {/* Persona chips */}
              {selectedPersonas.length > 0 && (
                <motion.div variants={staggerList} initial="hidden" animate="visible" className="flex gap-2 mb-5 flex-wrap">
                  {selectedPersonas.map(id => {
                    const p = PERSONAS.find(x => x.id === id);
                    return (
                      <motion.div key={id} variants={cardItem}
                        className="flex-1 rounded-xl p-4 min-w-[130px]"
                        style={{ background:`${p.color}10`, border:`1px solid ${p.color}30`, backdropFilter:"blur(12px)" }}
                      >
                        <div className="text-[22px] mb-1">{p.emoji}</div>
                        <div className="font-garamond font-semibold text-[14px]" style={{ color:p.color }}>{p.name}</div>
                        <div className="text-[11px] italic leading-tight mt-1 text-white/22">"{p.quote.slice(0,48)}..."</div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* Reading card */}
              <motion.div
                initial={{ opacity:0, y:16, scale:0.98 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ duration:0.45, ease }}
                className="rounded-[24px] p-7 mb-5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${cat?.color}25`,
                  boxShadow: `0 8px 52px ${cat?.glow}18, inset 0 1px 0 rgba(255,255,255,0.07)`,
                }}
              >
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.05]">
                  <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-[18px]"
                    style={{ background:`${cat?.color}16`, border:`1px solid ${cat?.color}35`, color:cat?.color }}
                  >{cat?.icon}</div>
                  <div>
                    <div className="font-garamond font-semibold text-[18px] text-white">{cat?.title}</div>
                    <div className="text-xs text-white/25">{handType.charAt(0).toUpperCase()+handType.slice(1)} Hand{zodiac?` · ${zodiac}`:""}</div>
                  </div>

                  {/* PDF export button with state machine */}
                  <motion.button
                    onClick={handleExport}
                    disabled={pdfState !== "idle"}
                    whileHover={pdfState === "idle" ? { scale:1.05 } : {}}
                    whileTap={pdfState === "idle" ? { scale:0.96 } : {}}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all duration-200 border border-transparent cursor-pointer"
                    style={{
                      color: pdfState === "done" ? "#5ba89e" : "rgba(255,255,255,0.35)",
                      borderColor: pdfState === "done" ? "rgba(91,168,158,0.3)" : "rgba(255,255,255,0.08)",
                      background: pdfState === "done" ? "rgba(91,168,158,0.08)" : "rgba(255,255,255,0.04)",
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {pdfState === "idle" && (
                        <motion.div key="idle" className="flex items-center gap-1.5"
                          initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                          transition={{ duration:0.15 }}>
                          <motion.div animate={{ y:[0,-2,0] }} transition={{ duration:1.8, repeat:Infinity }}>
                            <Download className="w-3.5 h-3.5" />
                          </motion.div>
                          PDF
                        </motion.div>
                      )}
                      {pdfState === "saving" && (
                        <motion.div key="saving" className="flex items-center gap-1.5"
                          initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                          transition={{ duration:0.15 }}>
                          <motion.div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-white/20 border-t-white/70"
                            animate={{ rotate:360 }} transition={{ duration:0.7, repeat:Infinity, ease:"linear" }} />
                          Saving...
                        </motion.div>
                      )}
                      {pdfState === "done" && (
                        <motion.div key="done" className="flex items-center gap-1.5"
                          initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.7 }}
                          transition={{ type:"spring", stiffness:400, damping:22 }}>
                          <Check className="w-3.5 h-3.5" /> Saved
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
                {formatText(reading, cat?.color)}
              </motion.div>

              {/* Second hand CTA */}
              {!firstHandReading && (
                <motion.div
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.28, ease }}
                  className="mb-5"
                >
                  <Button variant="outline" size="lg" className="w-full tracking-wide gap-2"
                    style={{ borderColor:"rgba(201,168,76,0.3)", color:"#c9a84c", background:"linear-gradient(135deg,rgba(201,168,76,0.06),rgba(155,127,232,0.06))" }}
                    onClick={goToSecondHand}
                  >
                    <Hand className="w-4 h-4" />
                    Add {handType === "right" ? "Left" : "Right"} Hand for Deeper Reading
                  </Button>
                </motion.div>
              )}

              {/* Growth plan */}
              <motion.div
                initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.34, ease }}
                className="mb-5"
              >
                <h3 className="font-garamond text-[24px] text-white mb-1 text-center">Your Growth Plan</h3>
                <p className="text-white/25 text-[13px] text-center mb-5">
                  {selectedPersonas.length
                    ? `Advice channeled through ${selectedPersonas.map(id=>PERSONAS.find(p=>p.id===id)?.name).join(" & ")}`
                    : "Tap any pillar to reveal personalised advice"}
                </p>
                <motion.div variants={staggerList} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3">
                  {IMPROVEMENT_PILLARS.map(({ id, Icon: PillarIcon, label, color }) => (
                    <motion.div key={id} variants={cardItem}
                      animate={flippedPillar === id
                        ? { rotateY: [0, 90, 180, 270, 360] }
                        : activePillar === id
                          ? { boxShadow: [`0 0 0px ${color}00`, `0 6px 24px ${color}28`, `0 0 0px ${color}00`] }
                          : {}
                      }
                      transition={flippedPillar === id
                        ? { duration: 0.6, ease: "easeInOut" }
                        : activePillar === id
                          ? { boxShadow: { duration: 2.2, repeat: Infinity } }
                          : { duration: 0.25 }
                      }
                      whileHover={{ scale:1.04, y:-2 }}
                      whileTap={{ scale:0.97 }}
                      onClick={() => handlePillarClick(id)}
                      className="rounded-[14px] p-4 text-center cursor-pointer transition-colors duration-200"
                      style={{
                        background: activePillar===id ? `${color}14` : "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                        border: `1px solid ${activePillar===id ? color+"45" : "rgba(255,255,255,0.07)"}`,
                      }}
                    >
                      <PillarIcon className="w-5 h-5 mx-auto mb-2 transition-colors duration-200"
                        style={{ color: activePillar===id ? color : "rgba(255,255,255,0.35)" }} />
                      <div className="font-garamond text-[13px] leading-tight transition-colors duration-200"
                        style={{ color: activePillar===id ? color : "rgba(255,255,255,0.45)" }}>{label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Pillar detail panel */}
              <AnimatePresence>
                {activePillar && (
                  <motion.div
                    key={activePillar}
                    initial={{ opacity:0, height:0, y:8 }}
                    animate={{ opacity:1, height:"auto", y:0 }}
                    exit={{ opacity:0, height:0, y:-4 }}
                    transition={{ duration:0.36, ease }}
                    className="rounded-[20px] p-6 mb-5 overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      backdropFilter: "blur(16px)",
                      border: `1px solid ${IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.color}25`,
                    }}
                  >
                    {loadingSuggestions ? <Loader label="Crafting your personal plan..."/> : (() => {
                      const ap = IMPROVEMENT_PILLARS.find(p => p.id === activePillar);
                      const ApIcon = ap?.Icon;
                      return (
                        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.1 }}>
                          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/[0.05]">
                            {ApIcon && <ApIcon className="w-5 h-5 shrink-0" style={{ color:ap.color }} />}
                            <span className="font-garamond font-semibold text-[19px]" style={{ color:ap?.color }}>{ap?.label}</span>
                            {selectedPersonas.length > 0 && (
                              <span className="ml-auto text-xs text-white/20">
                                via {selectedPersonas.map(id=>PERSONAS.find(p=>p.id===id)?.emoji).join(" ")}
                              </span>
                            )}
                          </div>
                          <div>{formatText(suggestions?.[activePillar], ap?.color)}</div>
                          <Button variant="ghost" size="sm" className="mt-5 gap-1.5" onClick={handleExport}>
                            <FileDown className="w-4 h-4" /> Export full report as PDF
                          </Button>
                        </motion.div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pro upsell */}
              <AnimatePresence>
                {freeUsed && !isPro && (
                  <motion.div
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.5, ease }}
                    className="rounded-[20px] p-6 mb-5 text-center"
                    style={{
                      background: "linear-gradient(135deg,rgba(155,127,232,0.08),rgba(201,168,76,0.05))",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(155,127,232,0.2)",
                    }}
                  >
                    <p className="font-garamond text-[20px] text-white mb-1.5">Unlock Palmara Pro</p>
                    <p className="text-white/25 text-[13px] mb-5">Unlimited readings · All categories · PDF reports · Persona coaching</p>
                    <ResultUpsellButton />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom actions */}
              <motion.div
                initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay:0.4 }}
                className="flex gap-2.5"
              >
                <Button variant="outline" size="lg" className="flex-1 gap-1.5" onClick={reset}>
                  <RotateCcw className="w-4 h-4" /> New Reading
                </Button>
                <Button variant="outline" size="lg" className="flex-1 gap-1.5"
                  style={{ borderColor:`${cat?.color}30`, color:cat?.color }}
                  onClick={() => { setStep("upload"); setImageUrl(null); setImageB64(null); setReading(""); setSuggestions(null); setActivePillar(null); }}
                >
                  <Hand className="w-4 h-4" /> Other Hand
                </Button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {paywall && <Paywall cat={paywall} onClose={() => setPaywall(null)}/>}
    </div>
  );
}
