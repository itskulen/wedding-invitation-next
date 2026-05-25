import { useState, useEffect, useRef, type PointerEvent } from "react";

declare global {
  interface Window {
    _mX?: number;
    _mY?: number;
  }
}

// ── Bird SVG (6 types) ──
function BirdSVG({ type = "gliding", size = 28, color = "#3a2e26" }) {
  const p = {
    stroke: color,
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    fill: "none" as const,
  };
  if (type === "flapping") return <svg width={size} height={size*.55} viewBox="0 0 64 34"><path d="M32 22 Q22 4 4 2" {...p}/><path d="M32 22 Q42 4 60 2" {...p}/><path d="M28 22 Q32 26 36 22" {...p} strokeWidth={1.6}/></svg>;
  if (type === "diving") return <svg width={size} height={size*.4} viewBox="0 0 64 26"><path d="M32 10 Q20 18 2 22" {...p}/><path d="M32 10 Q44 18 62 22" {...p}/><path d="M29 10 Q32 14 35 10" {...p} strokeWidth={1.6}/></svg>;
  if (type === "soaring") return <svg width={size*1.4} height={size*.32} viewBox="0 0 92 24"><path d="M46 12 Q28 2 0 6" {...p} strokeWidth={2.2}/><path d="M46 12 Q64 2 92 6" {...p} strokeWidth={2.2}/><path d="M43 12 Q46 16 49 12" {...p} strokeWidth={1.4}/></svg>;
  if (type === "banking") return <svg width={size} height={size*.5} viewBox="0 0 64 32"><path d="M32 14 Q16 2 0 4" {...p}/><path d="M32 16 Q46 14 62 22" {...p}/><path d="M29 15 Q32 19 35 15" {...p} strokeWidth={1.6}/></svg>;
  if (type === "swift") return <svg width={size} height={size*.45} viewBox="0 0 64 28"><path d="M32 12 Q22 5 5 9" {...p} strokeWidth={2.2}/><path d="M32 12 Q42 5 59 9" {...p} strokeWidth={2.2}/><path d="M30 14 Q27 20 23 22" {...p} strokeWidth={1.3}/><path d="M34 14 Q37 20 41 22" {...p} strokeWidth={1.3}/></svg>;
  return <svg width={size} height={size*.45} viewBox="0 0 64 28"><path d="M32 17 Q19 3 0 7" {...p}/><path d="M32 17 Q45 3 64 7" {...p}/><path d="M29 17 Q32 20 35 17" {...p} strokeWidth={1.6}/></svg>;
}

// ── 82 Bird Burst (increased from 55) ──
const burstFlock = [
  // Close ring - 15 birds
  {sx:50,sy:42,ex:50,ey:-12,size:30,delay:0,dur:1.2,op:0.95,type:"gliding"},
  {sx:50,sy:42,ex:12,ey:5,size:28,delay:0.05,dur:1.3,op:0.92,type:"flapping"},
  {sx:50,sy:42,ex:88,ey:8,size:28,delay:0.08,dur:1.3,op:0.90,type:"soaring"},
  {sx:50,sy:42,ex:25,ey:-8,size:26,delay:0.12,dur:1.4,op:0.88,type:"banking"},
  {sx:50,sy:42,ex:75,ey:-6,size:26,delay:0.15,dur:1.4,op:0.88,type:"swift"},
  {sx:50,sy:42,ex:5,ey:20,size:24,delay:0.18,dur:1.5,op:0.85,type:"diving"},
  {sx:50,sy:42,ex:95,ey:22,size:24,delay:0.20,dur:1.5,op:0.85,type:"gliding"},
  {sx:50,sy:42,ex:35,ey:2,size:22,delay:0.10,dur:1.4,op:0.87,type:"flapping"},
  {sx:50,sy:42,ex:65,ey:4,size:22,delay:0.14,dur:1.4,op:0.87,type:"soaring"},
  {sx:50,sy:42,ex:18,ey:12,size:20,delay:0.22,dur:1.6,op:0.82,type:"banking"},
  {sx:50,sy:42,ex:82,ey:14,size:20,delay:0.24,dur:1.6,op:0.82,type:"swift"},
  {sx:50,sy:42,ex:8,ey:32,size:18,delay:0.28,dur:1.7,op:0.78,type:"diving"},
  {sx:50,sy:42,ex:92,ey:35,size:18,delay:0.30,dur:1.7,op:0.78,type:"gliding"},
  {sx:50,sy:42,ex:42,ey:-15,size:20,delay:0.06,dur:1.5,op:0.85,type:"flapping"},
  {sx:50,sy:42,ex:58,ey:-12,size:20,delay:0.09,dur:1.5,op:0.85,type:"soaring"},
  // Mid ring - 20 birds
  {sx:50,sy:42,ex:3,ey:45,size:16,delay:0.35,dur:1.9,op:0.72,type:"banking"},
  {sx:50,sy:42,ex:97,ey:48,size:16,delay:0.38,dur:1.9,op:0.72,type:"swift"},
  {sx:50,sy:42,ex:22,ey:55,size:15,delay:0.42,dur:2.0,op:0.68,type:"diving"},
  {sx:50,sy:42,ex:78,ey:58,size:15,delay:0.45,dur:2.0,op:0.68,type:"gliding"},
  {sx:50,sy:42,ex:15,ey:5,size:16,delay:0.32,dur:1.8,op:0.75,type:"flapping"},
  {sx:50,sy:42,ex:85,ey:7,size:16,delay:0.34,dur:1.8,op:0.75,type:"soaring"},
  {sx:50,sy:42,ex:30,ey:25,size:14,delay:0.48,dur:2.1,op:0.65,type:"banking"},
  {sx:50,sy:42,ex:70,ey:28,size:14,delay:0.50,dur:2.1,op:0.65,type:"swift"},
  {sx:50,sy:42,ex:10,ey:62,size:13,delay:0.55,dur:2.2,op:0.60,type:"diving"},
  {sx:50,sy:42,ex:90,ey:65,size:13,delay:0.58,dur:2.2,op:0.60,type:"gliding"},
  {sx:50,sy:42,ex:45,ey:-20,size:15,delay:0.26,dur:1.7,op:0.78,type:"flapping"},
  {sx:50,sy:42,ex:55,ey:-18,size:15,delay:0.28,dur:1.7,op:0.78,type:"soaring"},
  {sx:50,sy:42,ex:2,ey:15,size:14,delay:0.40,dur:2.0,op:0.70,type:"banking"},
  {sx:50,sy:42,ex:98,ey:18,size:14,delay:0.43,dur:2.0,op:0.70,type:"swift"},
  {sx:50,sy:42,ex:28,ey:42,size:12,delay:0.60,dur:2.3,op:0.58,type:"diving"},
  {sx:50,sy:42,ex:72,ey:45,size:12,delay:0.62,dur:2.3,op:0.58,type:"gliding"},
  {sx:50,sy:42,ex:38,ey:-10,size:14,delay:0.36,dur:1.9,op:0.72,type:"flapping"},
  {sx:50,sy:42,ex:62,ey:-8,size:14,delay:0.38,dur:1.9,op:0.72,type:"soaring"},
  {sx:50,sy:42,ex:6,ey:72,size:11,delay:0.68,dur:2.4,op:0.52,type:"banking"},
  {sx:50,sy:42,ex:94,ey:75,size:11,delay:0.70,dur:2.4,op:0.52,type:"swift"},
  // Outer ring - 25 birds
  {sx:50,sy:42,ex:1,ey:85,size:10,delay:0.75,dur:2.6,op:0.45,type:"diving"},
  {sx:50,sy:42,ex:99,ey:88,size:10,delay:0.78,dur:2.6,op:0.45,type:"gliding"},
  {sx:50,sy:42,ex:20,ey:78,size:9,delay:0.82,dur:2.7,op:0.40,type:"flapping"},
  {sx:50,sy:42,ex:80,ey:82,size:9,delay:0.85,dur:2.7,op:0.40,type:"soaring"},
  {sx:50,sy:42,ex:12,ey:92,size:8,delay:0.90,dur:2.8,op:0.35,type:"banking"},
  {sx:50,sy:42,ex:88,ey:95,size:8,delay:0.92,dur:2.8,op:0.35,type:"swift"},
  {sx:50,sy:42,ex:32,ey:68,size:10,delay:0.72,dur:2.5,op:0.48,type:"diving"},
  {sx:50,sy:42,ex:68,ey:72,size:10,delay:0.74,dur:2.5,op:0.48,type:"gliding"},
  {sx:50,sy:42,ex:48,ey:-25,size:12,delay:0.16,dur:1.6,op:0.80,type:"flapping"},
  {sx:50,sy:42,ex:52,ey:-22,size:12,delay:0.18,dur:1.6,op:0.80,type:"soaring"},
  {sx:50,sy:42,ex:-2,ey:35,size:9,delay:0.88,dur:2.9,op:0.38,type:"banking"},
  {sx:50,sy:42,ex:102,ey:38,size:9,delay:0.90,dur:2.9,op:0.38,type:"swift"},
  {sx:50,sy:42,ex:25,ey:98,size:7,delay:0.98,dur:3.0,op:0.30,type:"diving"},
  {sx:50,sy:42,ex:75,ey:100,size:7,delay:1.0,dur:3.0,op:0.30,type:"gliding"},
  {sx:50,sy:42,ex:40,ey:-28,size:10,delay:0.22,dur:1.8,op:0.75,type:"flapping"},
  {sx:50,sy:42,ex:60,ey:-26,size:10,delay:0.24,dur:1.8,op:0.75,type:"soaring"},
  {sx:50,sy:42,ex:4,ey:102,size:6,delay:1.05,dur:3.2,op:0.25,type:"banking"},
  {sx:50,sy:42,ex:96,ey:105,size:6,delay:1.08,dur:3.2,op:0.25,type:"swift"},
  {sx:50,sy:42,ex:35,ey:85,size:8,delay:0.95,dur:2.9,op:0.35,type:"diving"},
  {sx:50,sy:42,ex:65,ey:88,size:8,delay:0.96,dur:2.9,op:0.35,type:"gliding"},
  {sx:50,sy:42,ex:-5,ey:58,size:7,delay:1.10,dur:3.1,op:0.28,type:"flapping"},
  {sx:50,sy:42,ex:105,ey:62,size:7,delay:1.12,dur:3.1,op:0.28,type:"soaring"},
  {sx:50,sy:42,ex:18,ey:105,size:5,delay:1.15,dur:3.3,op:0.22,type:"banking"},
  {sx:50,sy:42,ex:82,ey:108,size:5,delay:1.18,dur:3.3,op:0.22,type:"swift"},
  {sx:50,sy:42,ex:50,ey:-32,size:9,delay:0.12,dur:1.7,op:0.78,type:"diving"},
  // Far scattered - 22 birds
  {sx:50,sy:42,ex:8,ey:48,size:11,delay:0.65,dur:2.4,op:0.55,type:"gliding"},
  {sx:50,sy:42,ex:92,ey:52,size:11,delay:0.68,dur:2.4,op:0.55,type:"flapping"},
  {sx:50,sy:42,ex:14,ey:38,size:10,delay:0.52,dur:2.2,op:0.62,type:"soaring"},
  {sx:50,sy:42,ex:86,ey:42,size:10,delay:0.54,dur:2.2,op:0.62,type:"banking"},
  {sx:50,sy:42,ex:42,ey:52,size:9,delay:0.78,dur:2.6,op:0.48,type:"swift"},
  {sx:50,sy:42,ex:58,ey:55,size:9,delay:0.80,dur:2.6,op:0.48,type:"diving"},
  {sx:50,sy:42,ex:26,ey:-5,size:12,delay:0.30,dur:1.8,op:0.75,type:"gliding"},
  {sx:50,sy:42,ex:74,ey:-3,size:12,delay:0.32,dur:1.8,op:0.75,type:"flapping"},
  {sx:50,sy:42,ex:-3,ey:22,size:8,delay:0.85,dur:2.8,op:0.42,type:"soaring"},
  {sx:50,sy:42,ex:103,ey:25,size:8,delay:0.88,dur:2.8,op:0.42,type:"banking"},
  {sx:50,sy:42,ex:16,ey:68,size:7,delay:0.92,dur:2.9,op:0.38,type:"swift"},
  {sx:50,sy:42,ex:84,ey:72,size:7,delay:0.95,dur:2.9,op:0.38,type:"diving"},
  {sx:50,sy:42,ex:33,ey:-15,size:11,delay:0.28,dur:1.8,op:0.72,type:"gliding"},
  {sx:50,sy:42,ex:67,ey:-12,size:11,delay:0.30,dur:1.8,op:0.72,type:"flapping"},
  {sx:50,sy:42,ex:10,ey:112,size:4,delay:1.20,dur:3.4,op:0.20,type:"soaring"},
  {sx:50,sy:42,ex:90,ey:115,size:4,delay:1.22,dur:3.4,op:0.20,type:"banking"},
  {sx:50,sy:42,ex:45,ey:62,size:8,delay:0.82,dur:2.7,op:0.45,type:"swift"},
  {sx:50,sy:42,ex:55,ey:65,size:8,delay:0.84,dur:2.7,op:0.45,type:"diving"},
  {sx:50,sy:42,ex:-6,ey:75,size:6,delay:1.05,dur:3.0,op:0.32,type:"gliding"},
  {sx:50,sy:42,ex:106,ey:78,size:6,delay:1.08,dur:3.0,op:0.32,type:"flapping"},
  {sx:50,sy:42,ex:28,ey:112,size:3,delay:1.25,dur:3.5,op:0.18,type:"soaring"},
  {sx:50,sy:42,ex:72,ey:115,size:3,delay:1.28,dur:3.5,op:0.18,type:"banking"},
];

// ── Ambient birds (12 floating) ──
const ambientCfg = [
  {bx:12,by:18,dx:55,dy:28,speed:0.38,size:16,type:"gliding",op:0.42,phase:0},
  {bx:82,by:12,dx:-48,dy:38,speed:0.34,size:15,type:"soaring",op:0.38,phase:1.2},
  {bx:25,by:72,dx:65,dy:-32,speed:0.42,size:13,type:"swift",op:0.36,phase:2.4},
  {bx:75,by:68,dx:-58,dy:-28,speed:0.36,size:14,type:"flapping",op:0.40,phase:0.8},
  {bx:8,by:48,dx:52,dy:42,speed:0.40,size:11,type:"banking",op:0.33,phase:3.6},
  {bx:90,by:45,dx:-52,dy:33,speed:0.35,size:12,type:"diving",op:0.35,phase:1.8},
  {bx:45,by:10,dx:38,dy:52,speed:0.38,size:10,type:"gliding",op:0.31,phase:4.8},
  {bx:55,by:85,dx:-38,dy:-48,speed:0.41,size:9,type:"swift",op:0.30,phase:2.0},
  {bx:20,by:35,dx:62,dy:23,speed:0.36,size:13,type:"soaring",op:0.38,phase:0.5},
  {bx:78,by:30,dx:-52,dy:42,speed:0.39,size:11,type:"flapping",op:0.34,phase:3.0},
  {bx:35,by:88,dx:42,dy:-38,speed:0.37,size:10,type:"banking",op:0.32,phase:1.5},
  {bx:65,by:80,dx:-42,dy:-33,speed:0.40,size:9,type:"diving",op:0.30,phase:4.2},
];

type AmbientBirdCfg = (typeof ambientCfg)[number];

function AmbientBird({ cfg, show }: { cfg: AmbientBirdCfg; show: boolean }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const tRef = useRef(cfg.phase);
  const rafRef = useRef(0);
  const opRef = useRef(0);
  
  useEffect(() => {
    if (!show) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return;
    }
    
    const tick = () => {
      tRef.current += 0.007 * cfg.speed;
      const t = tRef.current;
      const bx = (cfg.bx/100)*window.innerWidth + Math.sin(t)*cfg.dx;
      const by = (cfg.by/100)*window.innerHeight + Math.cos(t*.65)*cfg.dy;
      const mx = window._mX||-999, my = window._mY||-999;
      const dx = mx-bx, dy = my-by, dist = Math.sqrt(dx*dx+dy*dy), R = 160;
      let rx=0,ry=0;
      if(dist<R&&dist>1){const f=((R-dist)/R)**1.6;rx=-(dx/dist)*f*180;ry=-(dy/dist)*f*180;}
      opRef.current = Math.min(opRef.current+.015,cfg.op);
      if(ref.current){ref.current.style.transform=`translate(${bx+rx}px,${by+ry}px)`;ref.current.style.opacity=String(opRef.current);}
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  },[show, cfg]);
  
  return <div ref={ref} style={{position:"fixed",top:0,left:0,pointerEvents:"none",opacity:0,zIndex:50}}><BirdSVG type={cfg.type} size={cfg.size} color="rgba(58,46,38,0.65)"/></div>;
}

export default function ModernEnvelope({ onOpen }: { onOpen?: () => void }) {
  const [dragY,setDragY] = useState(0);
  const [phase,setPhase] = useState("idle");
  const [guestName,setGuestName] = useState("");
  const [burstVisible,setBurstVisible] = useState(false);
  const isDrag = useRef(false);
  const startY = useRef(0);
  const burstRefs = useRef<Array<HTMLDivElement | null>>([]);
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onM = (e: MouseEvent) => {window._mX=e.clientX;window._mY=e.clientY;};
    const onT = (e: TouchEvent) => {if(e.touches[0]){window._mX=e.touches[0].clientX;window._mY=e.touches[0].clientY;}};
    window.addEventListener("mousemove",onM,{passive:true});
    window.addEventListener("touchmove",onT,{passive:true});
    return () => {
      window.removeEventListener("mousemove",onM);
      window.removeEventListener("touchmove",onT);
      delete window._mX;
      delete window._mY;
    };
  },[]);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const g = p.get("guest");
    if(g) setGuestName(decodeURIComponent(g));
  },[]);

  // Navigation effect when envelope is opened
  useEffect(() => {
    if (phase === "ambient") {
      navigationTimeoutRef.current = setTimeout(() => {
        if (onOpen) {
          onOpen();
        }
      }, 300); // Quick transition to invitation
    }
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [phase, onOpen]);

  useEffect(() => {
    if(!burstVisible) {
      burstRefs.current.forEach(el => {
        if (el && el.getAnimations) {
          el.getAnimations().forEach(anim => anim.cancel());
        }
      });
      return;
    }
    
    burstRefs.current.forEach((el,i) => {
      if(!el) return;
      const b = burstFlock[i];
      const tx = ((b.ex-b.sx)/100)*window.innerWidth;
      const ty = ((b.ey-b.sy)/100)*window.innerHeight;
      const rot = b.ex<50?[-5,-14,-8]:[5,14,8];
      el.animate([
        {opacity:0,transform:`translate(0,0) scale(0.6) rotate(${rot[0]}deg)`,offset:0},
        {opacity:b.op,transform:`translate(${tx*.25}px,${ty*.25}px) scale(1.08) rotate(${rot[1]}deg)`,offset:0.1},
        {opacity:b.op*.88,transform:`translate(${tx*.82}px,${ty*.82}px) scale(0.96) rotate(${rot[2]}deg)`,offset:0.72},
        {opacity:0,transform:`translate(${tx}px,${ty}px) scale(0.92) rotate(${rot[2]}deg)`,offset:1},
      ],{duration:b.dur*1000,delay:b.delay*1000,fill:"forwards",easing:"cubic-bezier(0.22,0.61,0.36,1)"});
    });
  },[burstVisible]);

  const onPDown = (e: PointerEvent<HTMLDivElement>) => {
    if(phase!=="idle") return;
    isDrag.current=true;startY.current=e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);setPhase("dragging");
  };
  const onPMove = (e: PointerEvent<HTMLDivElement>) => {if(!isDrag.current) return;setDragY(Math.max(0,e.clientY-startY.current));};
  const onPUp = () => {
    if(!isDrag.current) return;
    isDrag.current=false;
    if(dragY>85){
      setPhase("opened");
      setBurstVisible(true);
      setTimeout(()=>setPhase("ambient"),400);
    }
    else{
      setDragY(0);
      setPhase("idle");
    }
  };

  const prog = Math.min(dragY/85,1);
  const isOpened = phase==="opened"||phase==="ambient";
  const isDragging = phase==="dragging";
  const showAmbient = phase==="ambient";

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(145deg,#f2ede8,#e5dfd6)",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:.65;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{box-shadow:0 6px 20px rgba(212,52,52,0.35),inset 0 2px 4px rgba(255,140,140,0.2)}50%{box-shadow:0 8px 28px rgba(212,52,52,0.5),inset 0 2px 4px rgba(255,140,140,0.3)}}
      `}</style>

      {/* Burst birds */}
      {burstVisible && (
        <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:999,overflow:"hidden"}}>
          {burstFlock.map((b,i) => (
            <div key={i} ref={(el) => { burstRefs.current[i] = el; }} style={{position:"absolute",left:`${b.sx}%`,top:`${b.sy}%`,opacity:0}}>
              <BirdSVG type={b.type} size={b.size} color={`rgba(58,46,38,${b.op})`}/>
            </div>
          ))}
        </div>
      )}

      {/* Ambient birds */}
      {ambientCfg.map((cfg,i) => <AmbientBird key={i} cfg={cfg} show={showAmbient}/>)}

      {/* Envelope */}
      <div
        style={{
          position:"relative",width:"min(380px,90vw)",aspectRatio:"3/3.8",
          userSelect:"none",touchAction:"none",
          cursor:isDragging?"grabbing":"grab",
          transform:isOpened?"translateY(75px)":"translateY(0)",
          opacity:isOpened?0:1,
          transition:isOpened?"transform .75s ease .4s, opacity .75s ease .4s":isDragging?"none":"transform .55s cubic-bezier(.25,1.2,.5,1)",
        }}
        onPointerDown={onPDown}
        onPointerMove={onPMove}
        onPointerUp={onPUp}
      >
        {/* Shadow */}
        <div style={{position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",width:"68%",height:32,background:"rgba(40,30,22,0.18)",filter:"blur(22px)",borderRadius:"50%",opacity:.65-prog*.35}}/>

        {/* Envelope body */}
        <div style={{position:"absolute",inset:0,borderRadius:28,background:"linear-gradient(155deg,#f5ebe0 0%,#e8dac8 55%,#dccbb5 100%)",border:"1px solid rgba(180,150,115,0.28)",boxShadow:"0 18px 45px rgba(50,38,28,0.15), inset 0 1px 0 rgba(255,248,240,0.5)",overflow:"hidden"}}>
          {/* Subtle paper texture */}
          <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(45deg,rgba(200,170,130,0.03) 0,rgba(200,170,130,0.03) 2px,transparent 2px,transparent 8px),repeating-linear-gradient(-45deg,rgba(200,170,130,0.025) 0,rgba(200,170,130,0.025) 2px,transparent 2px,transparent 8px)"}}/>
        </div>

        {/* Bottom fold triangles */}
        <div style={{position:"absolute",bottom:0,left:0,width:"50%",height:"56%",background:"linear-gradient(138deg,#d4c0a8,#c1aa8e)",clipPath:"polygon(0 0,100% 0,0 100%)",borderRadius:"0 0 0 28px"}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:"50%",height:"56%",background:"linear-gradient(222deg,#d4c0a8,#c1aa8e)",clipPath:"polygon(0 0,100% 0,100% 100%)",borderRadius:"0 0 28px 0"}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:"56%",background:"linear-gradient(180deg,#e0d0ba,#cbb89c)",clipPath:"polygon(0 100%,50% 0,100% 100%)"}}/>

        {/* Inner card */}
        <div style={{
          position:"absolute",left:"8.5%",right:"8.5%",top:"9%",height:"82%",
          borderRadius:20,background:"linear-gradient(172deg,#fffffc,#faf5ee)",
          boxShadow:"0 10px 32px rgba(50,38,28,0.12), 0 3px 10px rgba(50,38,28,0.08)",
          zIndex:5,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
          paddingBottom:22,overflow:"hidden",
          transform:isDragging?`translateY(${Math.min(dragY*.68,58)}px)`:"translateY(0)",
          transition:isDragging?"none":"transform .48s cubic-bezier(.25,1.2,.5,1)",
        }}>
          {/* Subtle top accent */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(to right,#c9a462,#e8c97a,#d4aa55,#c9a462)"}}/>

          <div style={{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:5,padding:"0 20px",width:"100%"}}>
            {guestName && (
              <div style={{width:"100%",maxWidth:240,padding:"11px 15px",marginBottom:10,background:"linear-gradient(162deg,#fbf8f2,#f4ede2)",borderRadius:11,border:"1px solid rgba(201,164,98,0.22)"}}>
                <p style={{fontSize:".46rem",letterSpacing:".22em",textTransform:"uppercase",color:"#aaa9a3",fontFamily:"system-ui,sans-serif",fontWeight:600,margin:"0 0 6px 0"}}>You are invited</p>
                <p style={{fontFamily:"Georgia,serif",fontSize:"clamp(1rem,3.5vw,1.35rem)",fontWeight:700,color:"#2a2420",lineHeight:1.2,margin:0}}>{guestName}</p>
                <div style={{width:28,height:1,background:"linear-gradient(to right,transparent,#c9a462,transparent)",margin:"7px auto 0"}}/>
              </div>
            )}
            <div style={{width:42,height:1,background:"linear-gradient(to right,transparent,#c9a462,transparent)",marginBottom:3}}/>
            <p style={{fontSize:".48rem",letterSpacing:".2em",textTransform:"uppercase",color:"#9a8e80",fontFamily:"system-ui,sans-serif",fontWeight:500,margin:0}}>The Wedding Of</p>
            <div style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.35rem,4.2vw,1.85rem)",color:"#2a2420",lineHeight:1.1,fontStyle:"italic",margin:"3px 0"}}>Latifah &amp; Valen</div>
            <p style={{fontSize:".48rem",letterSpacing:".18em",textTransform:"uppercase",color:"#9a8e80",fontFamily:"system-ui,sans-serif",fontWeight:500,margin:0}}>Saturday, 4th July 2026</p>
            <div style={{width:42,height:1,background:"linear-gradient(to right,transparent,#c9a462,transparent)",marginTop:3}}/>
          </div>
        </div>

        {/* Flap */}
        <div style={{
          position:"absolute",top:0,left:0,right:0,height:"52%",
          borderRadius:"28px 28px 0 0",
          clipPath:"polygon(50% 0%,0% 100%,100% 100%)",
          background:"linear-gradient(165deg,#f0e2d0 0%,#dcc6a8 58%,#cdb18c 100%)",
          border:"1px solid rgba(180,150,115,0.22)",
          zIndex:6,
          transformOrigin:"top center",
          transform:`perspective(850px) rotateX(${-prog*48}deg)`,
          transition:isDragging?"none":"transform .28s ease",
        }}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(175deg,rgba(240,230,210,0.4) 0%,transparent 55%)"}}/>
        </div>

        {/* Wax seal */}
        <div style={{
          position:"absolute",left:"50%",top:"calc(40% - 27px)",
          transform:`translateX(-50%) scale(${isDragging?.86:1})`,
          zIndex:8,width:54,height:54,borderRadius:"50%",
          background:"radial-gradient(circle at 38% 34%,#e85555 0%,#d43434 48%,#a82020 100%)",
          boxShadow:"0 6px 20px rgba(212,52,52,0.4), inset 0 2px 4px rgba(255,140,140,0.22), inset 0 -2px 4px rgba(0,0,0,0.25)",
          display:"flex",alignItems:"center",justifyContent:"center",
          transition:"transform .12s ease,opacity .12s ease",
          opacity:isDragging?.68:1,
          animation:!isDragging&&phase==="idle"?"glow 3.5s ease-in-out infinite":"none",
        }}>
          <div style={{position:"absolute",inset:5,borderRadius:"50%",border:"1px solid rgba(255,180,180,0.2)"}}/>
          <span style={{fontFamily:"Georgia,serif",fontSize:".74rem",fontWeight:700,color:"rgba(255,245,240,0.9)",letterSpacing:".05em",textShadow:"0 1px 3px rgba(0,0,0,0.3)",userSelect:"none"}}>LV</span>
        </div>

        {/* Drag hint */}
        {!isDragging && phase==="idle" && (
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,zIndex:10,animation:"float 2.8s ease-in-out infinite"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
              <svg width={16} height={9} viewBox="0 0 16 9" style={{opacity:.5,animation:"pulse 1.8s ease-in-out infinite"}}>
                <path d="M1 1L8 7.5L15 1" stroke="#8a7060" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width={16} height={9} viewBox="0 0 16 9" style={{opacity:.35,animation:"pulse 1.8s ease-in-out infinite .2s"}}>
                <path d="M1 1L8 7.5L15 1" stroke="#8a7060" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p style={{fontSize:".52rem",letterSpacing:".2em",textTransform:"uppercase",color:"rgba(138,112,96,.65)",fontFamily:"system-ui,sans-serif",margin:0,fontWeight:500}}>Drag down to open</p>
          </div>
        )}
      </div>
    </div>
  );
}