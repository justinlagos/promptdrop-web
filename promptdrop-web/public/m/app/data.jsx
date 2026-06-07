// data.jsx, icons, sample content, and shared visual primitives for the
// PromptDrop mobile prototype. British spelling throughout. No emoji.

// ───────────────────────── Icons (Lucide-style, 24px grid, 1.75 stroke) ──────
const ICONS = {
  library: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H9a1.5 1.5 0 0 1 1.5 1.5V19M4 5.5V19a1.5 1.5 0 0 0 1.5 1.5H9A1.5 1.5 0 0 0 10.5 19M14 4.2l4 .9a1.5 1.5 0 0 1 1.13 1.8L16.5 19.2',
  record: 'CIRCLE_DOT',
  meetings: 'M5 8a7 7 0 0 1 14 0v3.5M5 8v3.5M5 11.5a2 2 0 0 0 2 2h.5a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-1-1H7a2 2 0 0 0-2 2Zm14 0a2 2 0 0 1-2 2h-.5a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1H17a2 2 0 0 1 2 2ZM12 18.5v0a4 4 0 0 0 4-4',
  account: 'M5 20a7 7 0 0 1 14 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  back: 'M15 5l-7 7 7 7',
  chevronR: 'M9 5l7 7-7 7',
  chevronDown: 'M6 9l6 6 6-6',
  more: 'DOTS_H',
  play: 'TRI',
  pause: 'M9 5v14M15 5v14',
  sparkle: 'M12 4l1.6 4.8L18 10l-4.4 1.2L12 16l-1.6-4.8L6 10l4.4-1.2L12 4ZM18 4l.7 2 .3.7M5 17l.5 1.5.5.5',
  gear: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19 12a7 7 0 0 0-.1-1.2l1.8-1.4-2-3.4-2.1.9a7 7 0 0 0-2-1.2L12.3 3h-.6l-.3 2.5a7 7 0 0 0-2 1.2l-2.1-.9-2 3.4 1.8 1.4A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-1.8 1.4 2 3.4 2.1-.9a7 7 0 0 0 2 1.2l.3 2.3h.6l.3-2.3a7 7 0 0 0 2-1.2l2.1.9 2-3.4-1.8-1.4A7 7 0 0 0 19 12Z',
  mic: 'M12 14.5a3 3 0 0 0 3-3v-4a3 3 0 0 0-6 0v4a3 3 0 0 0 3 3ZM6 11a6 6 0 0 0 12 0M12 17.5V21M9 21h6',
  video: 'M3.5 8.5A1.5 1.5 0 0 1 5 7h8a1.5 1.5 0 0 1 1.5 1.5v7A1.5 1.5 0 0 1 13 17H5a1.5 1.5 0 0 1-1.5-1.5v-7ZM14.5 11l5-2.5v7L14.5 13',
  check: 'M5 12.5l4.5 4.5L19 6.5',
  checkCircle: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 12l2.5 2.5L16 9',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7.5V12l3 2',
  x: 'M6 6l12 12M18 6L6 18',
  type: 'M5 7V5h14v2M12 5v14M9 19h6',
  gauge: 'M12 14l4-4M5.5 17a8 8 0 1 1 13 0M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  redo: 'M20 9H9a5 5 0 0 0 0 10h6M20 9l-3-3M20 9l-3 3',
  trash: 'M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13',
  share: 'M12 15V4M12 4L8 8M12 4l4 4M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5',
  shield: 'M12 3l7 2.5V11c0 5-3.5 8-7 9.5C8.5 19 5 16 5 11V5.5L12 3ZM9 12l2 2 4-4',
  zap: 'M13 3L5 13h6l-1 8 8-10h-6l1-8Z',
  pencil: 'M4 20l1-4L16 5l3 3L8 19l-4 1ZM14 7l3 3',
  list: 'M8 7h12M8 12h12M8 17h8M4 7h.01M4 12h.01M4 17h.01',
  send: 'M5 12L20 5l-5 15-3-7-7-1Z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5L19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5L19 5',
  waveform: 'M4 12h2M9 7v10M14 4v16M19 9v6M22 11h-1',
  flag: 'M6 21V4M6 4h11l-2 4 2 4H6',
  bell: 'M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 19a2 2 0 0 0 4 0',
  lens: 'LENS',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  download: 'M12 4v11M12 15l-4-4M12 15l4-4M5 19h14',
  star: 'M12 4l2.3 5.2 5.7.5-4.3 3.8 1.3 5.5L12 16.6 7 18.5l1.3-5.5L4 9.2l5.7-.5L12 4Z',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.6M20 4v3.5h-3.5',
  helpDots: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.8.3-1.4 1-1.4 1.9v.3M12 16.5h.01',
};

function Icon({ name, size = 24, stroke = 1.75, color = 'currentColor', fill = 'none', style }) {
  const d = ICONS[name] || '';
  const common = { width: size, height: size, viewBox: '0 0 24 24', style, 'aria-hidden': true };
  if (d === 'CIRCLE_DOT') return (
    <svg {...common}><circle cx="12" cy="12" r="8.5" fill="none" stroke={color} strokeWidth={stroke} /><circle cx="12" cy="12" r="4" fill={color} /></svg>
  );
  if (d === 'TRI') return (<svg {...common}><polygon points="8 5 19 12 8 19" fill={color} /></svg>);
  if (d === 'DOTS_H') return (<svg {...common}><circle cx="6" cy="12" r="1.6" fill={color} /><circle cx="12" cy="12" r="1.6" fill={color} /><circle cx="18" cy="12" r="1.6" fill={color} /></svg>);
  if (d === 'LENS') return (<svg {...common}><circle cx="12" cy="12" r="7.5" fill="none" stroke={color} strokeWidth={stroke} /><circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth={stroke} /><circle cx="14.5" cy="9.5" r="1" fill={color} /></svg>);
  return (
    <svg {...common}>
      <path d={d} fill={fill} stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ───────────────────────── Shared primitives ────────────────────────────────
const TOP_INSET = 58;   // clears status bar + dynamic island
const TAB_H = 84;       // bottom tab bar incl. home-indicator safe area

// Mono eyebrow / metadata label
function Eyebrow({ children, color = 'var(--text-muted)', style }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
      letterSpacing: '0.14em', textTransform: 'uppercase', color, ...style,
    }}>{children}</div>
  );
}

// Scrollable screen body with a large-title header
function Screen({ children, pad = true, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      ...style,
    }}>{children}</div>
  );
}

function ScrollArea({ children, padBottom = TAB_H, style }) {
  return (
    <div className="pd-scroll" style={{
      flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch', paddingBottom: padBottom, ...style,
    }}>{children}</div>
  );
}

// Large iOS-style title block
function LargeTitle({ eyebrow, title, trailing, sub }) {
  return (
    <div style={{ padding: `${TOP_INSET}px 20px 8px` }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div>
          {eyebrow && <Eyebrow style={{ marginBottom: 8 }}>{eyebrow}</Eyebrow>}
          <h1 style={{ margin: 0, fontFamily: 'var(--font-sans)', fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.05 }}>{title}</h1>
          {sub && <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{sub}</p>}
        </div>
        {trailing}
      </div>
    </div>
  );
}

// Compact nav header for pushed screens (back chevron + optional action)
function NavHeader({ onBack, title, action, transparent }) {
  return (
    <div style={{
      paddingTop: TOP_INSET - 18, paddingLeft: 12, paddingRight: 12, paddingBottom: 8,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      background: transparent ? 'transparent' : 'var(--bg-primary)', position: 'relative', zIndex: 4,
    }}>
      <button onClick={onBack} className="pd-tap" style={iconBtn}>
        <Icon name="back" size={22} color="var(--text-primary)" />
      </button>
      {title && <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)', position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>{title}</div>}
      <div style={{ display: 'flex', gap: 4, zIndex: 1 }}>{action}</div>
    </div>
  );
}

const iconBtn = {
  width: 40, height: 40, borderRadius: 999, border: 'none', cursor: 'pointer',
  background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
};

// A round glassy icon button on dark camera surfaces
function RoundBtn({ onClick, children, size = 52, bg = 'rgba(255,255,255,0.12)', style }) {
  return (
    <button onClick={onClick} className="pd-tap" style={{
      width: size, height: size, borderRadius: 999, border: '1px solid rgba(255,255,255,0.14)',
      background: bg, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      color: '#fff', ...style,
    }}>{children}</button>
  );
}

// Camera-feed placeholder (cool, dark, cinematic) with a self-view silhouette
function CameraView({ children, dim = 0, style }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(120% 80% at 50% 18%, #1b2230 0%, #11151d 45%, #08090d 100%)',
      ...style,
    }}>
      {/* soft key light */}
      <div style={{ position: 'absolute', top: '-18%', left: '50%', transform: 'translateX(-50%)', width: '120%', height: '70%', background: 'radial-gradient(60% 60% at 50% 50%, rgba(108,140,190,0.22), transparent 70%)', filter: 'blur(8px)' }} />
      {/* silhouette */}
      <div style={{ position: 'absolute', bottom: '-6%', left: '50%', transform: 'translateX(-50%)', width: 280, height: 360 }}>
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 220, height: 240, borderRadius: '120px 120px 0 0', background: 'linear-gradient(180deg, rgba(40,52,72,0.55), rgba(20,26,36,0.2))' }} />
        <div style={{ position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)', width: 130, height: 150, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(52,66,90,0.6), rgba(28,36,50,0.25))' }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: `rgba(5,6,9,${dim})`, transition: 'background .4s' }} />
      {/* grain */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-radial-gradient(circle at 20% 30%, #fff 0 0.5px, transparent 1px 3px)', mixBlendMode: 'overlay' }} />
      {children}
    </div>
  );
}

// ───────────────────────── Real data layer (no mock data) ───────────────────
const PD_SUPA_URL = 'https://wbqteajanwvfcwvjqozt.supabase.co';
const PD_SUPA_ANON = 'sb_publishable_SMHHkaM94jLb9M9LRuQKgQ_QAdF-WPH';
const PD_FN = PD_SUPA_URL + '/functions/v1';
const _sb = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(PD_SUPA_URL, PD_SUPA_ANON, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

function pdWords(t){ t=(t||'').trim(); return t ? t.split(/\s+/).length : 0; }
function pdDurFor(words, wpm){ const s=Math.round((words/(wpm||142))*60); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }
function pdRel(ts){ if(!ts) return ''; const d=(Date.now()-new Date(ts).getTime())/1000; if(d<60)return 'just now'; if(d<3600)return Math.floor(d/60)+'m ago'; if(d<86400)return Math.floor(d/3600)+'h ago'; if(d<172800)return 'yesterday'; return Math.floor(d/86400)+'d ago'; }
function pdClock(ms){ const s=Math.round((ms||0)/1000); return Math.floor(s/60)+':'+String(s%60).padStart(2,'0'); }

function _idb(){ return new Promise((res,rej)=>{ const r=indexedDB.open('promptdrop',1); r.onupgradeneeded=()=>{const d=r.result; if(!d.objectStoreNames.contains('recordings'))d.createObjectStore('recordings',{keyPath:'id'});}; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
async function _idbAll(){ const d=await _idb(); return new Promise((res,rej)=>{ const out=[]; const c=d.transaction('recordings','readonly').objectStore('recordings').openCursor(); c.onsuccess=()=>{const cur=c.result; if(cur){const {blob,...meta}=cur.value; out.push(meta); cur.continue();} else res(out.sort((a,b)=>b.createdAt-a.createdAt));}; c.onerror=()=>rej(c.error); }); }
async function _idbGet(id){ const d=await _idb(); return new Promise((res,rej)=>{ const r=d.transaction('recordings','readonly').objectStore('recordings').get(id); r.onsuccess=()=>res(r.result||null); r.onerror=()=>rej(r.error); }); }
async function _idbPut(rec){ const d=await _idb(); return new Promise((res,rej)=>{ const t=d.transaction('recordings','readwrite'); t.objectStore('recordings').put(rec); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error); }); }
async function _idbDel(id){ const d=await _idb(); return new Promise((res,rej)=>{ const t=d.transaction('recordings','readwrite'); t.objectStore('recordings').delete(id); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error); }); }

const PDsvc = {
  sb: _sb, FN: PD_FN, anon: PD_SUPA_ANON, words: pdWords, durFor: pdDurFor, rel: pdRel, clock: pdClock,
  async token(){ if(!_sb) return null; const {data}=await _sb.auth.getSession(); return data?.session?.access_token||null; },
  async getUser(){ if(!_sb) return null; const {data}=await _sb.auth.getUser(); return data?.user||null; },
  async plan(uid){ if(!_sb||!uid) return 'free'; const {data}=await _sb.from('subscriptions').select('plan,status').eq('user_id',uid).maybeSingle(); if(!data) return 'free'; return ['active','trialing','past_due'].includes(data.status)?data.plan:'free'; },
  async scripts(){ if(!_sb) return []; const {data,error}=await _sb.from('scripts').select('id,title,body,updated_at').order('updated_at',{ascending:false}); return error?[]:(data||[]); },
  async createScript(title,body){ if(!_sb) return null; const {data:u}=await _sb.auth.getUser(); if(!u?.user) return null; const {data,error}=await _sb.from('scripts').insert({user_id:u.user.id,title:title||'Untitled',body:body||''}).select().single(); return error?null:data; },
  async updateScript(id,patch){ if(!_sb||!id) return; await _sb.from('scripts').update({...patch,updated_at:new Date().toISOString()}).eq('id',id); },
  async deleteScript(id){ if(!_sb||!id) return; await _sb.from('scripts').delete().eq('id',id); },
  takes: _idbAll, getTake: _idbGet, putTake: _idbPut, delTake: _idbDel,
  async transcribe(blob){ try{ const fd=new FormData(); fd.append('file',blob,'rec.webm'); const r=await fetch(PD_FN+'/transcribe',{method:'POST',headers:{Authorization:'Bearer '+PD_SUPA_ANON,apikey:PD_SUPA_ANON},body:fd}); const d=await r.json().catch(()=>({})); if(r.status===503)return{ok:false,msg:'AI is not switched on yet on the server.'}; if(!r.ok||d.error)return{ok:false,msg:d.message||'Transcription failed'}; return{ok:true,text:d.text||''}; }catch(e){return{ok:false,msg:String(e.message||e)};} },
  async ask(question,context){ try{ const r=await fetch(PD_FN+'/assistant',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+PD_SUPA_ANON,apikey:PD_SUPA_ANON},body:JSON.stringify({question,context})}); const d=await r.json().catch(()=>({})); if(r.status===503)return{ok:false,msg:'AI is not switched on yet on the server.'}; if(!r.ok||d.error)return{ok:false,msg:d.message||'Request failed'}; return{ok:true,text:d.answer||d.text||''}; }catch(e){return{ok:false,msg:String(e.message||e)};} },
  async checkout(plan,cycle){ const t=await this.token(); if(!t) return {ok:false,msg:'Sign in first.'}; try{ const r=await fetch(PD_FN+'/stripe-checkout',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t,apikey:PD_SUPA_ANON},body:JSON.stringify({plan,cycle,successUrl:location.origin+'/app',cancelUrl:location.origin+'/app'})}); const d=await r.json().catch(()=>({})); if(d.url){location.href=d.url; return {ok:true};} return {ok:false,msg:d.message||"Payments aren't switched on yet."}; }catch(e){return{ok:false,msg:String(e.message||e)};} },
  async signIn(email,pw){ if(!_sb) return {ok:false,msg:'Accounts not connected'}; const {error}=await _sb.auth.signInWithPassword({email,password:pw}); return error?{ok:false,msg:error.message}:{ok:true}; },
  async signUp(email,pw,name){ if(!_sb) return {ok:false,msg:'Accounts not connected'}; const {data,error}=await _sb.auth.signUp({email,password:pw,options:{data:{display_name:name}}}); return error?{ok:false,msg:error.message}:{ok:true,needsConfirm:!data.session}; },
  async signOut(){ if(_sb) await _sb.auth.signOut(); },
};

const PDDataCtx = React.createContext(null);
function DataProvider({ children }) {
  const [st,setSt]=React.useState({loading:true,user:null,plan:'free',scripts:[],takes:[]});
  const reload=React.useCallback(async()=>{
    const user=await PDsvc.getUser();
    const plan=user?await PDsvc.plan(user.id):'free';
    const scripts=user?await PDsvc.scripts():[];
    let takes=[]; try{ takes=await PDsvc.takes(); }catch(e){}
    setSt({loading:false,user,plan,scripts,takes});
  },[]);
  React.useEffect(()=>{ reload(); const o=_sb?_sb.auth.onAuthStateChange(()=>reload()):null; return ()=>{ try{o&&o.data.subscription.unsubscribe();}catch(e){} }; },[reload]);
  return React.createElement(PDDataCtx.Provider,{value:{...st,reload,svc:PDsvc}},children);
}
function useData(){ return React.useContext(PDDataCtx)||{loading:true,user:null,plan:'free',scripts:[],takes:[],reload(){},svc:PDsvc}; }

Object.assign(window, {
  Icon, Eyebrow, Screen, ScrollArea, LargeTitle, NavHeader, RoundBtn, CameraView,
  iconBtn, TOP_INSET, TAB_H, PDsvc, DataProvider, useData,
  PromptCharacter: window.PromptDropDesignSystem_82c6c3.PromptCharacter,
});
