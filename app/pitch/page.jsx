"use client";

import { useState, useEffect, useRef } from "react";
import {
  PawPrint, LayoutDashboard, Clock, ClipboardList, Image,
  BookOpen, MessageCircle, GraduationCap, Building2, Users,
  Stethoscope, CalendarDays, Bell, Upload, Lock, Target,
  CheckCircle, Baby, Zap, BarChart3, Send, AlertTriangle,
  X, Check, Heart, Activity, ShieldCheck, ArrowRight,
  FileText, Users2, BrainCircuit, TrendingUp,
  Network, ScanLine, ChevronRight
} from "lucide-react";

// ─── Color tokens — identical to platform ─────────────────────────────────────
const C = {
  orange:      "#F87171",
  orangeLight: "#FDF0E8",
  orangeMid:   "#FAE0CC",
  cream:       "#FDFAF6",
  white:       "#FFFFFF",
  dark:        "#1A1510",
  gray:        "#6B6259",
  grayLight:   "#E8E2D9",
  teal:        "#3AAFA0",
  blue:        "#4A90D9",
  red:         "#E05252",
  purple:      "#8B5CF6",
};

const SLIDES = [
  { id: "s1", num: "01", label: "O Problema",        color: C.red    },
  { id: "s2", num: "02", label: "A Solução",          color: C.orange },
  { id: "s3", num: "03", label: "IA Clínica",         color: C.teal   },
  { id: "s4", num: "04", label: "Tração & Visão",     color: C.blue   },
];

// ─── Intersection Observer hook ───────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function Reveal({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

// ─── Active slide tracker ─────────────────────────────────────────────────────
function useActiveSlide() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = SLIDES.map(s => document.getElementById(s.id)).filter(Boolean);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const i = els.indexOf(e.target);
          if (i >= 0) setActive(i);
        }
      });
    }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return active;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = "", suffix = "", duration = 1600 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(ease * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString("pt-BR")}{suffix}</span>;
}

// ─── MockupShell — identical to platform ─────────────────────────────────────
function MockupShell({ children, title }) {
  return (
    <div className="mockup-shell" style={{
      background: C.white, borderRadius: 16,
      boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
      overflow: "hidden", border: `1px solid ${C.grayLight}`,
    }}>
      <div style={{
        background: C.orangeLight, padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 8,
        borderBottom: `1px solid ${C.orangeMid}`,
      }}>
        {["#F87171","#FCD34D","#4ADE80"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: 8, fontSize: 11, color: C.gray, fontWeight: 500 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

// ─── Sidebar — identical to platform ─────────────────────────────────────────
const SIDEBAR_ICONS = [LayoutDashboard, Clock, ClipboardList, Image, BookOpen, MessageCircle, GraduationCap];
const SIDEBAR_LABELS = ["Dashboard","Sessões","Relatórios","Mídia","PEI","Mensagens","Escola"];

function Sidebar({ active }) {
  return (
    <div className="mockup-sidebar" style={{ width: 148, background: "#FAF7F3", borderRight: `1px solid ${C.grayLight}`, padding: "12px 0", flexShrink: 0 }}>
      <div style={{ padding: "4px 14px 14px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 24, height: 24, background: C.orange, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <PawPrint size={13} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.dark }}>CasaUrso</span>
      </div>
      {SIDEBAR_LABELS.map((lbl, i) => {
        const Icon = SIDEBAR_ICONS[i];
        return (
          <div key={i} style={{
            padding: "8px 14px", display: "flex", alignItems: "center", gap: 8,
            background: i === active ? C.orangeLight : "transparent",
            borderLeft: i === active ? `3px solid ${C.orange}` : "3px solid transparent",
          }}>
            <Icon size={13} color={i === active ? C.orange : C.gray} strokeWidth={i === active ? 2.5 : 1.8} />
            <span style={{ fontSize: 11, fontWeight: i === active ? 600 : 400, color: i === active ? C.orange : C.gray }}>{lbl}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Slide wrapper ────────────────────────────────────────────────────────────
function Slide({ id, bg, children }) {
  return (
    <section id={id} className="slide-section" style={{
      minHeight: "100vh",
      background: bg || C.cream,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "88px 32px 80px 72px",
      position: "relative", overflow: "hidden",
      scrollSnapAlign: "start",
    }}>
      {children}
    </section>
  );
}

// ─── Slide label — same visual language as platform's FeatureLabel ─────────────
function SlideLabel({ num, label, color }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: `${color}15`, borderRadius: 10, padding: "8px 14px", marginBottom: 20,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1 }}>{num}</span>
      <div style={{ width: 1, height: 12, background: `${color}40` }} />
      <span style={{ fontSize: 12, fontWeight: 700, color }}>{label}</span>
    </div>
  );
}

// ─── Bullet row — same style as platform's FRow ───────────────────────────────
function Bullet({ text, color, Icon }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        {Icon
          ? <Icon size={15} color={color} strokeWidth={2} />
          : <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
        }
      </div>
      <span style={{ fontSize: 15, color: C.dark, lineHeight: 1.65, paddingTop: 4 }}>{text}</span>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, sub, color, prefix = "", suffix = "", animate = true }) {
  return (
    <div style={{
      background: C.cream, borderRadius: 14, padding: "20px 18px",
      border: `1px solid ${C.grayLight}`, borderTop: `3px solid ${color}`,
    }}>
      <div style={{ fontSize: 36, fontWeight: 800, color, lineHeight: 1, marginBottom: 6, fontFamily: "'DM Serif Display', serif" }}>
        {animate
          ? <Counter to={value} prefix={prefix} suffix={suffix} />
          : `${prefix}${value}${suffix}`}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: C.dark }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: C.gray, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

// ─── Problem mockup ───────────────────────────────────────────────────────────
function AnimatedProblemSvg() {
  const [svgMarkup, setSvgMarkup] = useState("");
  const [hasAnimated, setHasAnimated] = useState(false);
  const hostRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    fetch("/div.svg")
      .then((res) => res.text())
      .then((text) => {
        if (mounted) setSvgMarkup(text);
      })
      .catch(() => {
        if (mounted) setSvgMarkup("");
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!svgMarkup || hasAnimated || !hostRef.current) return;
    const nodes = hostRef.current.querySelectorAll("svg > *");
    nodes.forEach((node) => {
      node.style.opacity = "0";
      node.style.transform = "translateY(10px) scale(0.98)";
      node.style.transformOrigin = "center";
    });
  }, [svgMarkup, hasAnimated]);

  useEffect(() => {
    if (!svgMarkup || hasAnimated || !hostRef.current) return;
    const allNodes = Array.from(hostRef.current.querySelectorAll("svg > *"));
    const connectorNodes = allNodes.filter((node) => {
      const tag = node.tagName.toLowerCase();
      if (tag === "mask" || tag === "defs") return false;
      return Boolean(node.getAttribute("stroke-dasharray"));
    });
    const contentNodes = allNodes.filter((node) => {
      const tag = node.tagName.toLowerCase();
      if (tag === "mask" || tag === "defs") return false;
      return !connectorNodes.includes(node);
    });

    // Clusters are based on the known geometry of div.svg (viewBox 460x380):
    // center node first, then peripheral nodes around it.
    const clusterCenters = [
      { key: "center", x: 233, y: 190 },
      { key: "peripheral", x: 233, y: 74 },
      { key: "peripheral", x: 112, y: 132 },
      { key: "peripheral", x: 347, y: 125 },
      { key: "peripheral", x: 347, y: 244 },
      { key: "peripheral", x: 233, y: 320 },
      { key: "peripheral", x: 112, y: 240 },
    ];

    const centerNodes = [];
    const peripheralNodes = [];
    const otherNodes = [];

    contentNodes.forEach((node) => {
      try {
        const box = node.getBBox();
        const cx = box.x + box.width / 2;
        const cy = box.y + box.height / 2;
        let nearest = null;
        let minDist = Infinity;
        clusterCenters.forEach((c) => {
          const d = Math.hypot(cx - c.x, cy - c.y);
          if (d < minDist) {
            minDist = d;
            nearest = c;
          }
        });
        if (nearest && minDist <= 88) {
          if (nearest.key === "center") centerNodes.push(node);
          else peripheralNodes.push(node);
        } else {
          otherNodes.push(node);
        }
      } catch {
        otherNodes.push(node);
      }
    });

    centerNodes.forEach((node, index) => {
      node.style.animation = "svgAppear 420ms ease forwards";
      node.style.animationDelay = `${index * 18}ms`;
    });

    const peripheralsStart = Math.max(260, centerNodes.length * 18 + 120);
    peripheralNodes.forEach((node, index) => {
      node.style.animation = "svgAppear 420ms ease forwards";
      node.style.animationDelay = `${peripheralsStart + index * 14}ms`;
    });

    const remainingStart = peripheralsStart + Math.max(260, peripheralNodes.length * 14 + 120);
    otherNodes.forEach((node, index) => {
      node.style.animation = "svgAppear 380ms ease forwards";
      node.style.animationDelay = `${remainingStart + index * 10}ms`;
    });

    const linesStart = remainingStart + Math.max(220, otherNodes.length * 10 + 100);
    connectorNodes.forEach((node, index) => {
      node.style.animation = "svgAppear 520ms ease forwards";
      node.style.animationDelay = `${linesStart + index * 90}ms`;
    });

    const forceVisible = setTimeout(() => {
      allNodes.forEach((node) => {
        node.style.opacity = "1";
        node.style.transform = "none";
      });
    }, Math.max(1800, linesStart + connectorNodes.length * 90 + 700));
    setHasAnimated(true);
    return () => clearTimeout(forceVisible);
  }, [svgMarkup, hasAnimated]);

  if (!svgMarkup) {
    return (
      <img
        src="/div.svg"
        alt="Mockup estado atual do cuidado"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    );
  }

  return (
    <div className="problem-svg-wrap">
      <div ref={hostRef} className="problem-svg" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
    </div>
  );
}

function ProblemMockup() {
  return (
    <div
      className="mockup-shell"
      style={{
        background: "transparent",
        borderRadius: 16,
        boxShadow: "none",
        overflow: "hidden",
        border: "none",
      }}
    >
      <AnimatedProblemSvg />
    </div>
  );
}

// ─── Solution mockup ──────────────────────────────────────────────────────────
function SolutionMockup() {
  return (
    <div
      className="mockup-shell"
      style={{
        background: "transparent",
        borderRadius: 16,
        boxShadow: "none",
        overflow: "hidden",
        border: "none",
      }}
    >
      <img
        src="/img.png"
        alt="Mockup ecossistema Casa do Urso"
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}

// ─── AI Mockup ────────────────────────────────────────────────────────────────
function AIMockup() {
  const inputs = [
    { label: "Sessão terapêutica", Icon: Clock,        color: C.orange },
    { label: "Evolução escolar",   Icon: GraduationCap, color: C.teal  },
    { label: "Feedback familiar",  Icon: Users,         color: C.blue  },
    { label: "Avaliação clínica",  Icon: Stethoscope,   color: C.purple},
  ];
  const outputs = [
    { label: "Relatório automático", Icon: ClipboardList, color: C.teal   },
    { label: "Padrões detectados",   Icon: Activity,      color: C.orange },
    { label: "Alertas clínicos",     Icon: Bell,          color: C.red    },
    { label: "PEI adaptado",         Icon: Target,        color: C.purple },
  ];
  return (
    <MockupShell title="Casa AI Engine — Fluxo de dados clínicos">
      <div style={{ padding: 20, height: 310 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 64px 1fr", gap: 10, height: "100%", alignItems: "center" }}>
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {inputs.map((inp, i) => {
              const Icon = inp.Icon;
              return (
                <div key={i} style={{
                  background: C.cream, borderRadius: 8, padding: "8px 10px",
                  border: `1px solid ${C.grayLight}`, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${inp.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} color={inp.color} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 10, color: C.dark, fontWeight: 500 }}>{inp.label}</span>
                </div>
              );
            })}
          </div>
          {/* AI Core */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            {[0,1,2].map(i => <ChevronRight key={i} size={11} color={C.orangeMid} strokeWidth={2} />)}
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: C.orangeLight, border: `2px solid ${C.orange}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1,
            }}>
              <BrainCircuit size={20} color={C.orange} strokeWidth={1.8} />
              <span style={{ fontSize: 7, fontWeight: 700, color: C.orange }}>Casa AI</span>
            </div>
            {[0,1,2].map(i => <ChevronRight key={i} size={11} color={C.teal} strokeWidth={2} />)}
          </div>
          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {outputs.map((out, i) => {
              const Icon = out.Icon;
              return (
                <div key={i} style={{
                  background: `${out.color}10`, borderRadius: 8, padding: "8px 10px",
                  border: `1px solid ${out.color}25`, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: `${out.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={13} color={out.color} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 10, color: C.dark, fontWeight: 500 }}>{out.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MockupShell>
  );
}

// ─── Traction mockup ──────────────────────────────────────────────────────────
function TractionMockup() {
  return (
    <div
      className="mockup-shell"
      style={{
        background: "transparent",
        borderRadius: 16,
        boxShadow: "none",
        overflow: "visible",
        border: "none",
      }}
    >
      <div className="traction-wrap" style={{ position: "relative", display: "inline-block" }}>
        <img
          src="/img-2.png"
          alt="Mockup tração e roadmap Casa do Urso"
          style={{ display: "block", width: "600px", height: "auto", marginLeft: "-29px", marginRight: "-29px" }}
        />

        <img
          src="/coracao.png"
          alt="Coracao decorativo"
          className="traction-float traction-heart"
          style={{
            position: "absolute",
            top: -28,
            left: -34,
            marginLeft: 133,
            marginRight: 133,
            marginTop: 139,
            marginBottom: 139,
            width: 800,
            height: "auto",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />

        <img
          src="/Ursinho.png"
          alt="Ursinho decorativo"
          className="traction-float traction-bear"
          style={{
            position: "absolute",
            right: -24,
            bottom: -14,
            marginTop: -118,
            marginBottom: -118,
            marginLeft: 134,
            marginRight: 134,
            width: 900,
            height: "auto",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}

// ─── Side navigation ──────────────────────────────────────────────────────────
function SideNav({ active }) {
  return (
    <nav className="side-nav" style={{
      position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)",
      zIndex: 300, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end",
    }}>
      {SLIDES.map((s, i) => (
        <button key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
          {active === i && (
            <span style={{
              fontSize: 10, color: s.color, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700, whiteSpace: "nowrap",
              background: `${s.color}12`, padding: "4px 10px", borderRadius: 20,
              border: `1px solid ${s.color}25`,
            }}>
              {s.label}
            </span>
          )}
          <div style={{
            width: active === i ? 20 : 6, height: 6, borderRadius: 3,
            background: active === i ? s.color : C.grayLight,
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </button>
      ))}
      <div style={{ marginTop: 6, fontSize: 10, color: C.gray, fontFamily: "'DM Sans', sans-serif", textAlign: "right" }}>
        {String(active + 1).padStart(2, "0")} / 04
      </div>
    </nav>
  );
}

// ─── Grid layout — same as platform ──────────────────────────────────────────
const grid = {
  maxWidth: 1100, width: "100%",
  display: "grid", gridTemplateColumns: "1fr 1fr",
  columnGap: 60, rowGap: 0, alignItems: "center",
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function PitchDeck() {
  const [scrollY, setScrollY] = useState(0);
  const active = useActiveSlide();

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="pitch-root" style={{ fontFamily: "'DM Sans', sans-serif", color: C.dark }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-snap-type:y mandatory;overflow-y:scroll;scroll-behavior:smooth;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:${C.orange};border-radius:2px;}
        @keyframes bf{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes svgAppear{0%{opacity:0;transform:translateY(10px) scale(0.98)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes tractionFloatA{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes tractionFloatB{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .bf{animation:bf 4s ease-in-out infinite;}
        .traction-float{animation:tractionFloatA 3.8s ease-in-out infinite;}
        .traction-bear{animation-name:tractionFloatB;animation-duration:4.4s;animation-delay:.2s;}
        .na{font-size:13px;color:${C.gray};text-decoration:none;font-weight:500;transition:color .2s;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;}
        .na:hover{color:${C.orange};}
        .pitch-grid{max-width:1100px;width:100%;display:grid;grid-template-columns:1fr 1fr;column-gap:60px;row-gap:0;align-items:center;}
        .problem-svg-wrap,.problem-svg{width:100%;}
        .problem-svg svg{display:block;width:100%;height:auto;}

        @media (max-width: 1100px){
          .slide-section{padding:88px 24px 64px 24px !important;}
          .pitch-grid{column-gap:32px !important;row-gap:0 !important;}
          .top-nav{padding:0 20px !important;}
        }

        @media (max-width: 900px){
          .pitch-grid{grid-template-columns:1fr !important;}
          .slide-section{min-height:auto !important;padding:84px 16px 52px 16px !important;}
          .side-nav{display:none !important;}
          .top-nav{height:58px !important;padding:0 14px !important;}
          .top-nav-links{display:none !important;}
          .top-nav-note{display:none !important;}
          .top-nav-button{padding:7px 14px !important;font-size:12px !important;}
          .pitch-footer{padding:28px 16px !important;flex-direction:column;align-items:flex-start !important;}
          .pitch-footer-claim{width:100%;text-align:left !important;}
          .pitch-footer-actions{width:100%;flex-wrap:wrap;}
        }

        @media (max-width: 640px){
          .slide-section h2{font-size:clamp(28px,9vw,40px) !important;}
          .slide-section p{font-size:14px !important;line-height:1.65 !important;}
          .mockup-sidebar{display:none !important;}
          .mockup-shell{border-radius:12px !important;}
          .pitch-footer-actions > div{width:100%;justify-content:center;}
        }
      `}</style>

      {/* ─── Navbar — identical to platform ─── */}
      <nav className="top-nav" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        background: scrollY > 40 ? "rgba(253,250,246,0.95)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(12px)" : "none",
        borderBottom: scrollY > 40 ? `1px solid ${C.grayLight}` : "none",
        padding: "0 40px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s, border 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src="/Horizontal.png"
            alt="Casa do Urso"
            style={{ height: "fit-content", width: "100px", display: "block" }}
          />
          <span style={{ fontSize: 11, background: C.orangeLight, color: C.orange, padding: "2px 10px", borderRadius: 20, fontWeight: 700, border: `1px solid ${C.orangeMid}` }}>Pitch</span>
        </div>
        <div className="top-nav-links" style={{ display: "flex", gap: 24, alignItems: "center" }}>
          {SLIDES.map(s => (
            <button key={s.id} className="na" onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}>
              {s.label}
            </button>
          ))}
        </div>
        <div className="top-nav-cta" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="top-nav-note" style={{ fontSize: 11, color: C.gray }}>Confidencial · 2025</span>
          <div className="top-nav-button" style={{ background: C.orange, color: "white", fontSize: 13, fontWeight: 600, padding: "8px 20px", borderRadius: 30, cursor: "pointer" }}>
            Falar com a equipe
          </div>
        </div>
      </nav>

      <SideNav active={active} />

      {/* ═══════════════════════════════════════════════════════
          SLIDE 01 — O PROBLEMA
      ═══════════════════════════════════════════════════════ */}
      <Slide id="s1" bg={C.cream}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 400, height: 400, background: `radial-gradient(circle, ${C.orangeMid}70, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: -80, width: 320, height: 320, background: `radial-gradient(circle, ${C.red}08, transparent 70%)`, pointerEvents: "none" }} />
        <div className="pitch-grid" style={grid}>
          <div>
            <Reveal>
              <SlideLabel num="01" label="O Problema" color={C.red} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 1.1, color: C.dark, marginBottom: 16 }}>
                O cuidado em<br />neurodesenvolvimento<br />
                está <em style={{ color: C.red }}>fragmentado.</em>
              </h2>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
                Uma criança com autismo trabalha com múltiplos profissionais que nunca se falam. O histórico mora no WhatsApp, em planilhas e na memória de cada terapeuta.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Bullet color={C.red} Icon={Users}         text="Terapeutas, escolas e famílias operam em silos completos." />
              <Bullet color={C.red} Icon={FileText}      text="Relatórios em papel. Agendamentos em planilha. Histórico perdido." />
              <Bullet color={C.red} Icon={AlertTriangle} text="Sem visão compartilhada, decisões clínicas ficam no escuro." />
              <Bullet color={C.red} Icon={X}             text="Resultado: atrasos evitáveis no desenvolvimento da criança." />
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ marginTop: 28, padding: "14px 18px", background: `${C.red}08`, border: `1px solid ${C.red}20`, borderRadius: 12 }}>
                <span style={{ fontSize: 13, color: C.gray, lineHeight: 1.7 }}>
                  No Brasil, <strong style={{ color: C.dark }}>+600 mil crianças</strong> com TEA dependem de equipes multidisciplinares sem nenhuma infraestrutura digital de coordenação.
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}><ProblemMockup /></Reveal>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════════════════════
          SLIDE 02 — A SOLUÇÃO
      ═══════════════════════════════════════════════════════ */}
      <Slide id="s2" bg={C.white}>
        <div style={{ position: "absolute", top: "50%", right: -100, width: 500, height: 500, background: `radial-gradient(circle, ${C.orangeMid}50, transparent 70%)`, transform: "translateY(-50%)", pointerEvents: "none" }} />
        <div className="pitch-grid" style={grid}>
          <Reveal><SolutionMockup /></Reveal>
          <div>
            <Reveal delay={0.1}>
              <SlideLabel num="02" label="A Solução" color={C.orange} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 1.1, color: C.dark, marginBottom: 16 }}>
                Uma plataforma que<br />
                <em style={{ color: C.orange }}>conecta</em> toda a<br />
                equipe de cuidados.
              </h2>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
                Casa do Urso Platform cria um espaço compartilhado onde clínica, escola e família ficam alinhados em tempo real — com a criança sempre no centro.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <Bullet color={C.orange} Icon={Network}       text="Plano terapêutico único, visível para toda a equipe." />
              <Bullet color={C.orange} Icon={ClipboardList} text="Relatórios estruturados: draft → revisão → publicação." />
              <Bullet color={C.orange} Icon={MessageCircle} text="Comunicação contextual por criança, em tempo real." />
              <Bullet color={C.orange} Icon={ShieldCheck}   text="Acesso granular: terapeuta, supervisor, escola, família." />
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
                {[[Building2, "Clínicas", C.orange], [GraduationCap, "Escolas", C.teal], [Users, "Famílias", C.blue]].map(([Icon, l, color]) => (
                  <div key={l} style={{ flex: 1, background: `${color}10`, border: `1px solid ${color}20`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                    <Icon size={20} color={color} strokeWidth={1.8} style={{ display: "block", margin: "0 auto 6px" }} />
                    <div style={{ fontSize: 12, color, fontWeight: 700 }}>{l}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════════════════════
          SLIDE 03 — INTELIGÊNCIA ARTIFICIAL
      ═══════════════════════════════════════════════════════ */}
      <Slide id="s3" bg={C.cream}>
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, background: `radial-gradient(circle, ${C.teal}12, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -60, right: 100, width: 300, height: 300, background: `radial-gradient(circle, ${C.orangeMid}40, transparent 70%)`, pointerEvents: "none" }} />
        <div className="pitch-grid" style={grid}>
          <div>
            <Reveal>
              <SlideLabel num="03" label="Inteligência Artificial" color={C.teal} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 1.1, color: C.dark, marginBottom: 16 }}>
                Dados clínicos viram<br />
                <em style={{ color: C.teal }}>inteligência</em><br />
                terapêutica.
              </h2>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, marginBottom: 28, maxWidth: 420 }}>
                A IA não substitui o terapeuta — ela amplifica sua capacidade de decisão. Cada sessão alimenta um modelo de evolução individual da criança.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Bullet color={C.teal} Icon={ClipboardList}  text="Relatórios automáticos gerados a partir de notas de sessão." />
              <Bullet color={C.teal} Icon={Activity}        text="Detecção de padrões de desenvolvimento ao longo do tempo." />
              <Bullet color={C.teal} Icon={Bell}            text="Alertas para terapeutas sobre regressões ou metas estagnadas." />
              <Bullet color={C.teal} Icon={Target}          text="PEI adaptado dinamicamente com base na evolução real." />
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                {[
                  { before: "7 dias", after: "< 1h",   label: "Latência de relatório", color: C.teal   },
                  { before: "Manual", after: "Automático", label: "Detecção de padrões", color: C.orange },
                ].map((r, i) => (
                  <div key={i} style={{ flex: 1, background: C.white, border: `1px solid ${C.grayLight}`, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: C.gray, marginBottom: 6 }}>{r.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, color: C.gray, textDecoration: "line-through" }}>{r.before}</span>
                      <ArrowRight size={12} color={r.color} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.after}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}><AIMockup /></Reveal>
        </div>
      </Slide>

      {/* ═══════════════════════════════════════════════════════
          SLIDE 04 — TRAÇÃO & VISÃO
      ═══════════════════════════════════════════════════════ */}
      <Slide id="s4" bg={C.orangeLight}>
        <div style={{ position: "absolute", top: -80, left: "25%", width: 500, height: 500, background: `radial-gradient(circle, ${C.orangeMid}80, transparent 70%)`, pointerEvents: "none" }} />
        <div className="pitch-grid" style={grid}>
          <Reveal><TractionMockup /></Reveal>
          <div>
            <Reveal delay={0.1}>
              <SlideLabel num="04" label="Tração & Visão" color={C.orange} />
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 1.1, color: C.dark, marginBottom: 16 }}>
                Nascemos de uma<br />
                clínica <em style={{ color: C.orange }}>real.</em><br />
                Escalamos um setor.
              </h2>
              <p style={{ fontSize: 15, color: C.gray, lineHeight: 1.75, marginBottom: 24, maxWidth: 420 }}>
                A clínica em São Paulo é o laboratório vivo do produto. Entendemos o problema de dentro para fora — e já provamos que há demanda.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                <StatCard value={30} prefix="R$" suffix="k" label="MRR atual" sub="clínica operando em SP" color={C.orange} />
                <StatCard value={70} prefix="R$" suffix="k" label="Projeção 12m" sub="crescimento validado" color={C.teal} />
                <StatCard value={600} suffix="k+" label="Crianças com TEA" sub="mercado endereçável BR" color={C.blue} />
                <StatCard value={0} prefix="" suffix="↗" label="MVP em construção" sub="validação em campo" color={C.purple} animate={false} />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ padding: "16px 18px", background: C.white, border: `1px solid ${C.orangeMid}`, borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, marginBottom: 4, letterSpacing: 0.5, textTransform: "uppercase" }}>Por que agora</div>
                <div style={{ fontSize: 13, color: C.gray, lineHeight: 1.7 }}>
                  Diagnósticos de TEA crescem <strong style={{ color: C.dark }}>15% ao ano</strong> no Brasil. Regulamentações de saúde digital amadurecendo. A janela está aberta.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Slide>

      {/* ─── Footer — same as platform ─── */}
      <footer className="pitch-footer" style={{ background: C.dark, padding: "40px 60px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="bf" style={{ width: 36, height: 36, background: C.orange, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PawPrint size={18} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16, fontWeight: 700, color: C.white }}>Casa do Urso</div>
            <div style={{ fontSize: 11, color: `${C.white}50` }}>A infraestrutura do cuidado em neurodesenvolvimento.</div>
          </div>
        </div>
        <div className="pitch-footer-claim" style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: C.white, lineHeight: 1.5 }}>
            Construindo a infraestrutura do<br />
            <em style={{ color: C.orange }}>cuidado em neurodesenvolvimento.</em>
          </div>
        </div>
        <div className="pitch-footer-actions" style={{ display: "flex", gap: 12 }}>
          <div style={{ background: C.orange, color: "white", fontSize: 14, fontWeight: 600, padding: "13px 28px", borderRadius: 40, cursor: "pointer", boxShadow: `0 8px 24px ${C.orange}50`, display: "flex", alignItems: "center", gap: 8 }}>
            Falar com a equipe <ArrowRight size={15} color="white" />
          </div>
          <div style={{ color: C.white, fontSize: 14, padding: "13px 24px", borderRadius: 40, cursor: "pointer", border: `1.5px solid ${C.white}20` }}>
            Ver produto
          </div>
        </div>
      </footer>
    </div>
  );
}
