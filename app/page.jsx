"use client";
import { useState, useRef, useCallback } from "react";

const CATEGORIES = [
  { id: "love", icon: "♥", title: "Love & Relationships", subtitle: "Heart line · Venus mount · Attachment lines", color: "#e8636a", glow: "rgba(232,99,106,0.25)" },
  { id: "business", icon: "◆", title: "Business & Wealth", subtitle: "Fate line · Mercury line · Jupiter mount", color: "#c9a84c", glow: "rgba(201,168,76,0.25)" },
  { id: "health", icon: "✦", title: "Health & Vitality", subtitle: "Life line · Health line · Mount fullness", color: "#5ba89e", glow: "rgba(91,168,158,0.25)" },
  { id: "full", icon: "⬡", title: "Full Soul Reading", subtitle: "Complete palm + zodiac + all dimensions", color: "#9b7fe8", glow: "rgba(155,127,232,0.25)" },
];

const PERSONAS = [
  { id: "kobe", name: "Kobe Bryant", emoji: "🐍", trait: "Mamba Mentality", color: "#c9a84c", quote: "Rest at the end, not in the middle." },
  { id: "jobs", name: "Steve Jobs", emoji: "🍎", trait: "Think Different", color: "#e8e8e8", quote: "The people who are crazy enough to think they can change the world are the ones who do." },
  { id: "tyson", name: "Mike Tyson", emoji: "🥊", trait: "Undeniable Force", color: "#e8636a", quote: "Everyone has a plan until they get punched in the mouth." },
  { id: "oprah", name: "Oprah Winfrey", emoji: "✨", trait: "Turn Pain Into Power", color: "#d4a0e8", quote: "You get in life what you have the courage to ask for." },
  { id: "ronaldo", name: "Cristiano Ronaldo", emoji: "⚽", trait: "Obsessive Excellence", color: "#4a9eda", quote: "Talent without working hard is nothing." },
  { id: "jordan", name: "Michael Jordan", emoji: "🏀", trait: "No Excuses", color: "#e07840", quote: "I never lost a game. I just ran out of time." },
  { id: "musk", name: "Elon Musk", emoji: "🚀", trait: "First Principles", color: "#5ba89e", quote: "When something is important enough, you do it even if the odds are not in your favor." },
  { id: "martha", name: "Martha Stewart", emoji: "🌿", trait: "Master Your Craft", color: "#a8c870", quote: "Life is too complicated not to be orderly." },
  { id: "tony", name: "Tony Robbins", emoji: "🔥", trait: "Unleash the Giant", color: "#ff8c42", quote: "The only impossible journey is the one you never begin." },
];

const IMPROVEMENT_PILLARS = [
  { id: "emotional", icon: "❤", label: "Emotional Intelligence", color: "#e8636a" },
  { id: "logic", icon: "⚡", label: "Logic & Mindset", color: "#c9a84c" },
  { id: "willpower", icon: "🔥", label: "Will & Discipline", color: "#e07840" },
  { id: "nutrition", icon: "🌿", label: "Eating & Nutrition", color: "#5ba89e" },
  { id: "health_habits", icon: "💎", label: "Health Habits", color: "#9b7fe8" },
  { id: "science", icon: "🧬", label: "Science-Based Tips", color: "#4a9eda" },
];

const ZODIAC_SIGNS = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
const PREMIUM_CATEGORIES = ["health", "full"];

function generatePDF(reading, suggestions, personas, category, handType, zodiac, userName) {
  const cat = CATEGORIES.find(c => c.id === category);
  const date = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });
  const personaNames = personas.map(id => PERSONAS.find(p => p.id === id)?.name).filter(Boolean).join(" & ");

  const pillarsHTML = suggestions ? IMPROVEMENT_PILLARS.map(p => {
    const content = suggestions[p.id];
    if (!content) return "";
    return `<div style="margin-bottom:22px;padding:18px 20px;background:#f9f7ff;border-left:4px solid ${p.color};border-radius:0 10px 10px 0;">
      <div style="font-size:12px;font-weight:700;color:${p.color};letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">${p.icon} ${p.label}</div>
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
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `Palmara-${cat.title.replace(/\s+/g,"-")}-${date}.html`;
  a.click(); URL.revokeObjectURL(url);
}

function Loader({ label }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, padding:"52px 0" }}>
      <div style={{ position:"relative", width:68, height:68 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ position:"absolute", inset:0, borderRadius:"50%", border:"1.5px solid rgba(201,168,76,0.45)", animation:`ring 2s ease-out ${i*0.5}s infinite` }}/>
        ))}
        <div style={{ position:"absolute", inset:"28%", borderRadius:"50%", background:"radial-gradient(circle,#c9a84c,#9b7fe8)", animation:"glow 2s ease-in-out infinite" }}/>
      </div>
      <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:"'Cormorant Garamond',serif", fontSize:17, letterSpacing:2 }}>{label}</p>
      <style>{`@keyframes ring{0%{transform:scale(.7);opacity:1}100%{transform:scale(2.4);opacity:0}}@keyframes glow{0%,100%{opacity:.6}50%{opacity:1}}`}</style>
    </div>
  );
}

function Paywall({ cat, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:24 }}>
      <div style={{ background:"linear-gradient(145deg,#1a1520,#100d18)", border:`1px solid ${cat.color}40`, borderRadius:24, padding:40, maxWidth:400, width:"100%", textAlign:"center", boxShadow:`0 0 80px ${cat.glow}` }}>
        <div style={{ fontSize:42, marginBottom:12 }}>{cat.icon}</div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:cat.color, marginBottom:10 }}>Unlock {cat.title}</h2>
        <p style={{ color:"rgba(255,255,255,0.45)", fontSize:15, lineHeight:1.7, marginBottom:28 }}>You have used your free reading. Join Palmara Pro for unlimited access to all readings, growth plans, and PDF exports.</p>
        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:20, marginBottom:24 }}>
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:11, letterSpacing:2, marginBottom:8 }}>PALMARA PRO</div>
          <div style={{ color:"#fff", fontSize:38, fontFamily:"'Cormorant Garamond',serif", fontWeight:700 }}>$9.99<span style={{ fontSize:16, color:"rgba(255,255,255,0.35)" }}>/mo</span></div>
          <div style={{ color:"rgba(255,255,255,0.35)", fontSize:13, marginTop:5 }}>Unlimited · All categories · PDF export · Persona coaching</div>
        </div>
        <button style={{ width:"100%", padding:15, borderRadius:12, background:`linear-gradient(135deg,${cat.color},${cat.color}88)`, border:"none", color:"#fff", fontSize:17, fontFamily:"'Cormorant Garamond',serif", letterSpacing:1, cursor:"pointer", marginBottom:10 }}>Start Palmara Pro →</button>
        <button onClick={onClose} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.2)", fontSize:13, cursor:"pointer" }}>Maybe later</button>
      </div>
    </div>
  );
}

function PalmaraLogo() {
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <style>{`
        @keyframes logoShimmer{0%{background-position:-300% center}100%{background-position:300% center}}
        @keyframes letterFloat0{0%,100%{transform:translateY(0px) rotate(-1deg)}50%{transform:translateY(-6px) rotate(1deg)}}
        @keyframes letterFloat1{0%,100%{transform:translateY(-3px) rotate(1deg)}50%{transform:translateY(3px) rotate(-1deg)}}
        @keyframes letterFloat2{0%,100%{transform:translateY(0px)}50%{transform:translateY(-8px)}}
        @keyframes letterFloat3{0%,100%{transform:translateY(-2px) rotate(-1deg)}50%{transform:translateY(4px) rotate(2deg)}}
        @keyframes letterFloat4{0%,100%{transform:translateY(0px) rotate(1deg)}50%{transform:translateY(-5px) rotate(-1deg)}}
        @keyframes letterFloat5{0%,100%{transform:translateY(-4px)}50%{transform:translateY(2px)}}
        @keyframes letterFloat6{0%,100%{transform:translateY(0px) rotate(-2deg)}50%{transform:translateY(-7px) rotate(1deg)}}
        @keyframes orbPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.3)}}
        .logo-letter{display:inline-block;font-family:'Cormorant Garamond',serif;font-weight:700;font-size:54px;letter-spacing:3px;line-height:1}
      `}</style>
      {"PALMARA".split("").map((letter, i) => (
        <span key={i} className="logo-letter" style={{
          background:`linear-gradient(135deg, #b08020 ${i*12}%, #e8d5a3 ${i*12+20}%, #c9a84c ${i*12+40}%, #9b7fe8 ${i*12+60}%, #c9a84c)`,
          backgroundSize:"300% auto",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          animation:`letterFloat${i % 7} ${2.5 + i * 0.3}s ease-in-out ${i * 0.12}s infinite, logoShimmer 4s linear ${i*0.1}s infinite`,
          textShadow:"none",
          filter:`drop-shadow(0 0 ${6 + i}px rgba(201,168,76,${0.2 + i*0.03}))`,
        }}>
          {letter}
        </span>
      ))}
    </div>
  );
}

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
  const [paywall, setPaywall] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [exportDone, setExportDone] = useState(false);
  const [firstHandReading, setFirstHandReading] = useState("");
  const [imageMediaType, setImageMediaType] = useState("image/jpeg");
  const fileRef = useRef();

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
    if (freeUsed && PREMIUM_CATEGORIES.includes(cat.id)) { setPaywall(cat); return; }
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
      love: "Focus on love and relationships. Analyze heart line depth, curve, length. Look at Venus mount fullness. Identify attachment/relationship lines. Give romantic profile, what they need in love, relationship patterns, and 3 specific insights.",
      business: "Focus on business and wealth. Analyze fate line strength, Mercury line, Jupiter mount. Give career archetype, money mindset, leadership style, best business environment, and 3 wealth-building insights.",
      health: "Focus on health and vitality. Analyze life line arc, depth, breaks. Look for health line and mount fullness. Give energy profile, stress indicators, physical strengths and vulnerabilities, and 3 actionable health insights.",
      full: `Give a complete reading covering heart line, head line, life line, fate line, and key mounts. ${zodiac ? `Weave in their ${zodiac} zodiac nature.` : ""} Cover love, business, and health. Close with their one-sentence life theme.`,
    };
    const sys = `You are Palmara, a world-class palm reader and intuitive life coach. Analyze the palm photo with depth and wisdom. Be specific, personal, and actionable. Use **bold** for section headers. Keep sections 3 to 5 sentences. Total under 450 words. Never be vague.`;
    const isSecondHand = !!firstHandReading;
    const otherHand = handType === "right" ? "left" : "right";
    const userText = isSecondHand
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
    const pillar = IMPROVEMENT_PILLARS.find(p => p.id === pillarId);
    const personaCtx = buildPersonaContext();
    const sys = `You are Palmara's life optimization coach. Give hyper-specific, science-backed, deeply actionable improvement advice. Use **bold** for key points. Give 4 to 6 real steps people can act on today. No fluff, no filler. ${personaCtx ? "When personas are provided, speak in their actual voice and philosophy. Use their real language and famous phrases naturally throughout." : ""}`;
    const prompt = `Palm reading result:\n${reading}\n\nCategory: ${category?.title}\nHand: ${handType}${zodiac ? `\nZodiac: ${zodiac}` : ""}\n${personaCtx}\n\nNow give specific improvement advice for this area: ${pillar.label}\n\nBase it on what the palm reading reveals about this specific person. Make it feel deeply personal. ${selectedPersonas.length ? `Channel the voice and philosophy of ${selectedPersonas.map(id => PERSONAS.find(p=>p.id===id)?.name).join(" and ")}.` : ""}`;
    try {
      const text = await callClaude([{ role:"user", content: prompt }], sys);
      setSuggestions(prev => ({ ...(prev||{}), [pillarId]: text }));
    } catch { setSuggestions(prev => ({ ...(prev||{}), [pillarId]: "Unable to generate. Please try again." })); }
    setLoadingSuggestions(false);
  };

  const handleExport = () => {
    generatePDF(reading, suggestions, selectedPersonas, category?.id, handType, zodiac, userName);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 3000);
  };

  const reset = () => {
    setStep("home"); setCategory(null); setZodiac(""); setHandType("right");
    setSelectedPersonas([]); setImageUrl(null); setImageB64(null);
    setReading(""); setSuggestions(null); setActivePillar(null); setExportDone(false);
    setFirstHandReading("");
  };

  const goToSecondHand = () => {
    setFirstHandReading(reading);
    setHandType(handType === "right" ? "left" : "right");
    setImageUrl(null); setImageB64(null);
    setReading(""); setSuggestions(null); setActivePillar(null);
    setStep("upload");
  };

  const formatText = (text, accentColor) => text?.split("\n").map((line, i) => {
    if (!line.trim()) return <br key={i}/>;
    if (line.startsWith("**") && line.endsWith("**"))
      return <h3 key={i} style={{ color: accentColor||"#c9a84c", fontFamily:"'Cormorant Garamond',serif", fontSize:20, margin:"20px 0 6px", letterSpacing:.5 }}>{line.replace(/\*\*/g,"")}</h3>;
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return <p key={i} style={{ color:"rgba(255,255,255,0.82)", lineHeight:1.88, marginBottom:7, fontSize:16 }}>
      {parts.map((p,j) => j%2===1 ? <strong key={j} style={{ color: accentColor||"#c9a84c" }}>{p}</strong> : p)}
    </p>;
  });

  const cat = category;

  return (
    <div style={{ minHeight:"100vh", background:"#09070f", fontFamily:"'Crimson Text',serif", position:"relative", overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#2a1f45;border-radius:2px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes orb1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(30px,-40px) scale(1.1)}}
        @keyframes orb2{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-20px,30px) scale(.9)}}
        @keyframes orb3{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,20px)}}
        @keyframes personaPulse{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 20px 4px rgba(201,168,76,0.15)}}
        .card-hover{transition:all .25s ease}.card-hover:hover{transform:translateY(-3px)}
        .btn-h{transition:all .2s ease}.btn-h:hover{transform:translateY(-2px);filter:brightness(1.1)}
        .pillar-btn{transition:all .2s ease}.pillar-btn:hover{transform:scale(1.02)}
        .persona-card{transition:all .22s ease;cursor:pointer}.persona-card:hover{transform:scale(1.03)}
      `}</style>

      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        <div style={{ position:"absolute", top:"5%", left:"5%", width:420, height:420, borderRadius:"50%", background:"radial-gradient(circle,rgba(155,127,232,0.07),transparent 65%)", animation:"orb1 12s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", bottom:"10%", right:"5%", width:360, height:360, borderRadius:"50%", background:"radial-gradient(circle,rgba(201,168,76,0.06),transparent 65%)", animation:"orb2 15s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", top:"45%", right:"20%", width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(232,99,106,0.05),transparent 65%)", animation:"orb3 9s ease-in-out 3s infinite" }}/>
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.012) 1px, transparent 0)", backgroundSize:"30px 30px" }}/>
      </div>

      <div style={{ position:"relative", zIndex:1, maxWidth:520, margin:"0 auto", padding:"0 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign:"center", padding:"48px 0 32px", animation:"fadeUp .7s ease" }}>
          <div style={{ fontSize:36, marginBottom:12, filter:"drop-shadow(0 0 28px rgba(201,168,76,.7))" }}>🔮</div>
          <PalmaraLogo/>
          <p style={{ color:"rgba(255,255,255,0.25)", fontSize:11, letterSpacing:6, textTransform:"uppercase", marginTop:8 }}>Palm · Zodiac · Soul</p>
          {!freeUsed && (
            <div style={{ marginTop:18, display:"inline-flex", alignItems:"center", gap:8, background:"rgba(201,168,76,0.07)", border:"1px solid rgba(201,168,76,0.22)", borderRadius:24, padding:"7px 20px" }}>
              <span style={{ color:"#c9a84c", fontSize:13 }}>✦ First reading free, no signup needed</span>
            </div>
          )}
        </div>

        {/* HOME */}
        {step === "home" && (
          <div style={{ animation:"fadeUp .5s ease .1s both" }}>
            <input placeholder="Your name (optional, appears on report)" value={userName} onChange={e => setUserName(e.target.value)}
              style={{ width:"100%", padding:"13px 18px", borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.7)", fontSize:15, fontFamily:"'Crimson Text',serif", marginBottom:24, outline:"none" }}/>
            <p style={{ color:"rgba(255,255,255,0.3)", textAlign:"center", marginBottom:18, fontSize:16, fontStyle:"italic" }}>What would you like insight on?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
              {CATEGORIES.map((c,i) => (
                <div key={c.id} className="card-hover" onClick={() => selectCategory(c)} style={{
                  background:"linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))",
                  border:`1px solid ${c.color}28`, borderRadius:18, padding:"17px 22px", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:15, animation:`fadeUp .5s ease ${.1*i+.2}s both`,
                  boxShadow:`0 4px 24px ${c.glow}12`,
                }}>
                  <div style={{ width:48, height:48, borderRadius:12, flexShrink:0, background:`${c.color}11`, border:`1px solid ${c.color}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:19, color:c.color }}>{c.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"#fff", fontSize:18, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, marginBottom:2 }}>{c.title}</div>
                    <div style={{ color:"rgba(255,255,255,0.28)", fontSize:13 }}>{c.subtitle}</div>
                  </div>
                  {freeUsed && PREMIUM_CATEGORIES.includes(c.id) && <span style={{ color:c.color, fontSize:11, border:`1px solid ${c.color}33`, borderRadius:8, padding:"3px 9px", letterSpacing:1 }}>PRO</span>}
                  <span style={{ color:"rgba(255,255,255,0.15)", fontSize:22 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PERSONA SELECTION */}
        {step === "persona" && cat && (
          <div style={{ animation:"fadeUp .45s ease" }}>
            <button onClick={() => setStep("home")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:14, marginBottom:22, display:"flex", alignItems:"center", gap:6 }}>← Back</button>
            <div style={{ textAlign:"center", marginBottom:28 }}>
              <div style={{ fontSize:28, color:cat.color, marginBottom:8 }}>{cat.icon}</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, color:"#fff", marginBottom:8 }}>Choose Your Mentors</h2>
              <p style={{ color:"rgba(255,255,255,0.35)", fontSize:15 }}>Pick up to 2 people you admire. Your growth advice will be guided by their philosophy and voice.</p>
              {selectedPersonas.length > 0 && (
                <div style={{ marginTop:12, display:"flex", justifyContent:"center", gap:8, flexWrap:"wrap" }}>
                  {selectedPersonas.map(id => {
                    const p = PERSONAS.find(x => x.id === id);
                    return <span key={id} style={{ background:`${p.color}20`, border:`1px solid ${p.color}50`, borderRadius:20, padding:"4px 14px", color:p.color, fontSize:13 }}>{p.emoji} {p.name}</span>;
                  })}
                </div>
              )}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
              {PERSONAS.map(p => {
                const selected = selectedPersonas.includes(p.id);
                const disabled = !selected && selectedPersonas.length >= 2;
                return (
                  <div key={p.id} className="persona-card" onClick={() => !disabled && togglePersona(p.id)} style={{
                    background: selected ? `${p.color}18` : "rgba(255,255,255,0.03)",
                    border:`1px solid ${selected ? p.color+"55" : "rgba(255,255,255,0.07)"}`,
                    borderRadius:14, padding:"14px 10px", textAlign:"center",
                    opacity: disabled ? .35 : 1,
                    boxShadow: selected ? `0 0 20px ${p.color}25` : "none",
                    animation: selected ? "personaPulse 2s ease-in-out infinite" : "none",
                  }}>
                    <div style={{ fontSize:26, marginBottom:5 }}>{p.emoji}</div>
                    <div style={{ color: selected ? p.color : "rgba(255,255,255,0.6)", fontSize:13, fontFamily:"'Cormorant Garamond',serif", fontWeight:600, lineHeight:1.2, marginBottom:3 }}>{p.name}</div>
                    <div style={{ color: selected ? p.color+"aa" : "rgba(255,255,255,0.25)", fontSize:11, lineHeight:1.3 }}>{p.trait}</div>
                    {selected && <div style={{ marginTop:5, color:p.color, fontSize:14 }}>✓</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-h" onClick={() => { setSelectedPersonas([]); setStep("upload"); }} style={{ flex:1, padding:"13px", borderRadius:12, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>
                Skip
              </button>
              <button className="btn-h" onClick={() => setStep("upload")} style={{ flex:2, padding:"13px", borderRadius:12, background:`linear-gradient(135deg,${cat.color},${cat.color}88)`, border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:17, letterSpacing:1, boxShadow:`0 6px 24px ${cat.glow}` }}>
                {selectedPersonas.length ? `Continue with ${selectedPersonas.length} mentor${selectedPersonas.length>1?"s":""}` : "Continue →"}
              </button>
            </div>
          </div>
        )}

        {/* UPLOAD */}
        {step === "upload" && cat && (
          <div style={{ animation:"fadeUp .45s ease" }}>
            <button onClick={() => setStep("persona")} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.3)", cursor:"pointer", fontSize:14, marginBottom:22, display:"flex", alignItems:"center", gap:6 }}>← Back</button>
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:28, color:cat.color, marginBottom:6 }}>{cat.icon}</div>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, color:"#fff", marginBottom:5 }}>
                {firstHandReading ? `Now Your ${handType.charAt(0).toUpperCase()+handType.slice(1)} Hand` : cat.title}
              </h2>
              <p style={{ color:"rgba(255,255,255,0.3)", fontSize:14 }}>
                {firstHandReading ? "Upload your other palm for a combined deep reading" : "Upload a clear palm photo, good lighting, fingers relaxed"}
              </p>
              {selectedPersonas.length > 0 && (
                <p style={{ color:"rgba(255,255,255,0.25)", fontSize:13, marginTop:6 }}>
                  Channeling {selectedPersonas.map(id => PERSONAS.find(p=>p.id===id)?.name).join(" & ")}
                </p>
              )}
            </div>
            <div style={{ display:"flex", gap:10, marginBottom:14 }}>
              {["left","right"].map(h => (
                <button key={h} onClick={() => setHandType(h)} style={{ flex:1, padding:"11px", borderRadius:11, cursor:"pointer", fontSize:15, fontFamily:"'Cormorant Garamond',serif", letterSpacing:1, transition:"all .2s", background: handType===h ? `${cat.color}18` : "rgba(255,255,255,0.03)", border:`1px solid ${handType===h ? cat.color : "rgba(255,255,255,0.07)"}`, color: handType===h ? cat.color : "rgba(255,255,255,0.35)" }}>
                  {h.charAt(0).toUpperCase()+h.slice(1)} Hand
                </button>
              ))}
            </div>
            {cat.id === "full" && (
              <select value={zodiac} onChange={e => setZodiac(e.target.value)} style={{ width:"100%", padding:"12px 16px", borderRadius:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color: zodiac?"#fff":"rgba(255,255,255,0.28)", fontSize:15, fontFamily:"'Crimson Text',serif", marginBottom:14, cursor:"pointer" }}>
                <option value="">Add your zodiac sign (optional)</option>
                {ZODIAC_SIGNS.map(z => <option key={z} value={z} style={{ background:"#1a1520" }}>{z}</option>)}
              </select>
            )}
            <div onDrop={e => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()} onClick={() => fileRef.current.click()}
              style={{ border:`2px dashed ${imageUrl ? cat.color : "rgba(255,255,255,0.1)"}`, borderRadius:18, padding:"26px 20px", textAlign:"center", cursor:"pointer", background:"rgba(255,255,255,0.01)", transition:"all .3s", marginBottom:14, minHeight:170, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
              {imageUrl ? (
                <div style={{ width:"100%" }}>
                  <img src={imageUrl} alt="Palm" style={{ maxHeight:190, borderRadius:10, objectFit:"cover", marginBottom:10 }}/>
                  <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, marginTop:4 }}>Tap to change photo</p>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:38, marginBottom:10, opacity:.28 }}>🤚</div>
                  <p style={{ color:"rgba(255,255,255,0.3)", fontSize:15 }}>Tap to upload or drag and drop</p>
                  <p style={{ color:"rgba(255,255,255,0.15)", fontSize:12, marginTop:4 }}>JPG or PNG, clear natural light</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => { if(e.target.files[0]) { handleFile(e.target.files[0]); e.target.value = ""; } }}/>
            <button className="btn-h" onClick={getReading} disabled={!imageB64} style={{ width:"100%", padding:18, borderRadius:14, fontSize:19, fontFamily:"'Cormorant Garamond',serif", letterSpacing:2, background: imageB64?`linear-gradient(135deg,${cat.color},${cat.color}99)`:"rgba(255,255,255,0.04)", border:"none", color: imageB64?"#fff":"rgba(255,255,255,0.2)", cursor: imageB64?"pointer":"not-allowed", boxShadow: imageB64?`0 8px 32px ${cat.glow}`:"none" }}>
              Read My Palm →
            </button>
          </div>
        )}

        {step === "loading" && <Loader label={loadingReading ? "Reading your palm lines..." : "Crafting your personal plan..."}/>}

        {/* RESULT */}
        {step === "result" && reading && (
          <div style={{ animation:"fadeUp .55s ease" }}>
            {selectedPersonas.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {selectedPersonas.map(id => {
                  const p = PERSONAS.find(x => x.id === id);
                  return (
                    <div key={id} style={{ flex:1, background:`${p.color}10`, border:`1px solid ${p.color}35`, borderRadius:12, padding:"10px 14px", minWidth:130 }}>
                      <div style={{ fontSize:18, marginBottom:3 }}>{p.emoji}</div>
                      <div style={{ color:p.color, fontSize:13, fontFamily:"'Cormorant Garamond',serif", fontWeight:600 }}>{p.name}</div>
                      <div style={{ color:"rgba(255,255,255,0.25)", fontSize:11, fontStyle:"italic", lineHeight:1.3, marginTop:2 }}>"{p.quote.slice(0,45)}..."</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ background:"linear-gradient(145deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))", border:`1px solid ${cat?.color}22`, borderRadius:22, padding:"26px 24px", marginBottom:20, boxShadow:`0 8px 48px ${cat?.glow}15` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18, paddingBottom:14, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`${cat?.color}14`, border:`1px solid ${cat?.color}33`, display:"flex", alignItems:"center", justifyContent:"center", color:cat?.color, fontSize:17 }}>{cat?.icon}</div>
                <div>
                  <div style={{ color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600 }}>{cat?.title}</div>
                  <div style={{ color:"rgba(255,255,255,0.28)", fontSize:12 }}>{handType.charAt(0).toUpperCase()+handType.slice(1)} Hand{zodiac?` · ${zodiac}`:""}</div>
                </div>
                <button className="btn-h" onClick={handleExport} style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:9, background: exportDone?"rgba(91,168,158,0.12)":"rgba(255,255,255,0.04)", border:`1px solid ${exportDone?"#5ba89e44":"rgba(255,255,255,0.08)"}`, color: exportDone?"#5ba89e":"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13, fontFamily:"'Crimson Text',serif" }}>
                  {exportDone?"✓ Saved":"↓ PDF"}
                </button>
              </div>
              <div>{formatText(reading, cat?.color)}</div>
            </div>

            {!firstHandReading && (
              <button className="btn-h" onClick={goToSecondHand} style={{ width:"100%", padding:16, borderRadius:14, background:"linear-gradient(135deg,rgba(201,168,76,0.12),rgba(155,127,232,0.12))", border:"1px solid rgba(201,168,76,0.35)", color:"#c9a84c", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:17, letterSpacing:1, marginBottom:20, textAlign:"center" }}>
                ✦ Add {handType === "right" ? "Left" : "Right"} Hand for a Deeper Reading →
              </button>
            )}

            <div style={{ marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, color:"#fff", marginBottom:4, textAlign:"center" }}>Your Growth Plan</h3>
              <p style={{ color:"rgba(255,255,255,0.28)", fontSize:13, textAlign:"center", marginBottom:16 }}>
                {selectedPersonas.length ? `Advice channeled through ${selectedPersonas.map(id=>PERSONAS.find(p=>p.id===id)?.name).join(" & ")}` : "Tap any area for personalised advice"}
              </p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
                {IMPROVEMENT_PILLARS.map(p => (
                  <div key={p.id} className="pillar-btn" onClick={() => getSuggestions(p.id)} style={{ background: activePillar===p.id?`${p.color}14`:"rgba(255,255,255,0.03)", border:`1px solid ${activePillar===p.id?p.color+"50":"rgba(255,255,255,0.07)"}`, borderRadius:13, padding:"13px 13px", cursor:"pointer", textAlign:"center", boxShadow: activePillar===p.id?`0 4px 20px ${p.color}18`:"none" }}>
                    <div style={{ fontSize:20, marginBottom:4 }}>{p.icon}</div>
                    <div style={{ color: activePillar===p.id?p.color:"rgba(255,255,255,0.5)", fontSize:13, fontFamily:"'Cormorant Garamond',serif", lineHeight:1.3 }}>{p.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {activePillar && (
              <div style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.color}28`, borderRadius:18, padding:"22px 20px", marginBottom:18, animation:"fadeUp .4s ease" }}>
                {loadingSuggestions ? (
                  <Loader label="Crafting your personal plan..."/>
                ) : (
                  <>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, paddingBottom:12, borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ fontSize:20 }}>{IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.icon}</span>
                      <span style={{ color:IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.color, fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:600 }}>{IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.label}</span>
                      {selectedPersonas.length > 0 && (
                        <span style={{ marginLeft:"auto", color:"rgba(255,255,255,0.2)", fontSize:12 }}>via {selectedPersonas.map(id=>PERSONAS.find(p=>p.id===id)?.emoji).join(" ")}</span>
                      )}
                    </div>
                    <div>{formatText(suggestions?.[activePillar], IMPROVEMENT_PILLARS.find(p=>p.id===activePillar)?.color)}</div>
                    <button className="btn-h" onClick={handleExport} style={{ marginTop:14, padding:"9px 18px", borderRadius:9, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", cursor:"pointer", fontSize:13, fontFamily:"'Crimson Text',serif" }}>
                      ↓ Export full report as PDF
                    </button>
                  </>
                )}
              </div>
            )}

            {freeUsed && (
              <div style={{ background:"linear-gradient(135deg,rgba(155,127,232,0.08),rgba(201,168,76,0.05))", border:"1px solid rgba(155,127,232,0.18)", borderRadius:18, padding:"20px 22px", marginBottom:18, textAlign:"center" }}>
                <p style={{ color:"#fff", fontFamily:"'Cormorant Garamond',serif", fontSize:19, marginBottom:5 }}>Unlock Palmara Pro</p>
                <p style={{ color:"rgba(255,255,255,0.3)", fontSize:13, marginBottom:16 }}>Unlimited readings · All categories · PDF reports · Persona coaching</p>
                <button className="btn-h" style={{ padding:"12px 28px", borderRadius:11, background:"linear-gradient(135deg,#9b7fe8,#c9a84c)", border:"none", color:"#fff", cursor:"pointer", fontSize:16, fontFamily:"'Cormorant Garamond',serif", letterSpacing:1 }}>Start for $9.99 per month →</button>
              </div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button className="btn-h" onClick={reset} style={{ flex:1, padding:"13px", borderRadius:11, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", color:"rgba(255,255,255,0.45)", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>New Reading</button>
              <button className="btn-h" onClick={() => { setStep("upload"); setImageUrl(null); setImageB64(null); setReading(""); setSuggestions(null); setActivePillar(null); }} style={{ flex:1, padding:"13px", borderRadius:11, background:`${cat?.color}12`, border:`1px solid ${cat?.color}33`, color:cat?.color, cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>Other Hand</button>
            </div>
          </div>
        )}
      </div>

      {paywall && <Paywall cat={paywall} onClose={() => setPaywall(null)}/>}
    </div>
  );
}
