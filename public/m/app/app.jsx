// app.jsx, store + navigation + tab bar for the PromptDrop mobile app (real data).

const FULLSCREEN = { script: 1, recordSetup: 1, takeReview: 1, meeting: 1, upgrade: 1 };
const ROOTS = { library: LibraryScreen, meetings: MeetingsScreen, account: AccountScreen };
const PUSHED = { script: ScriptScreen, recordSetup: RecordSetupScreen, takeReview: TakeReviewScreen, meeting: MeetingDetailScreen, upgrade: UpgradeScreen };

const TABS = [
  { id: 'library', label: 'Library', icon: 'library' },
  { id: 'record', label: 'Record', icon: 'record' },
  { id: 'meetings', label: 'Meetings', icon: 'meetings' },
  { id: 'account', label: 'Account', icon: 'account' },
];

function TabBar({ tab, onTab, onRecord }) {
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20, paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)', paddingTop: 8, background: 'rgba(10,10,11,0.82)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around' }}>
      {TABS.map(t => {
        const active = tab === t.id;
        if (t.id === 'record') return (
          <button key={t.id} className="pd-tap" onClick={onRecord} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1, marginTop: -4 }}>
            <span style={{ width: 50, height: 50, borderRadius: 999, background: 'var(--recording)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-recording)' }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, background: '#fff' }} />
            </span>
            <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text-muted)' }}>{t.label}</span>
          </button>
        );
        return (
          <button key={t.id} className="pd-tap" onClick={() => onTab(t.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1, paddingTop: 4 }}>
            <Icon name={t.icon} size={25} color={active ? 'var(--accent-primary)' : 'var(--ink-450)'} />
            <span style={{ fontSize: 10.5, fontWeight: 600, color: active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const linesFromBody = (b) => (b && b.trim() ? b.split(/\n\n+/).map(l => l.trim()).filter(Boolean) : []);

// Real email + password auth gate, in the design language.
function AuthScreen({ onDone }) {
  const [mode, setMode] = React.useState('signin');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [name, setName] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState(null);
  const inputStyle = { width: '100%', height: 50, borderRadius: 14, border: '1px solid var(--border-default)', background: 'var(--surface-elevated)', color: 'var(--text-primary)', fontSize: 16, padding: '0 14px', fontFamily: 'var(--font-sans)', outline: 'none', marginBottom: 10 };
  async function go() {
    if (mode === 'signup' && !agree) { setMsg('Please agree to the Terms and Privacy Policy.'); return; }
    setBusy(true); setMsg(null);
    const r = mode === 'signin' ? await PDsvc.signIn(email, pw) : await PDsvc.signUp(email, pw, name || email.split('@')[0]);
    setBusy(false);
    if (!r.ok) { setMsg(r.msg || 'Something went wrong.'); return; }
    if (mode === 'signup' && r.needsConfirm) { setMsg('Check your email to confirm, then sign in.'); setMode('signin'); return; }
    onDone && onDone();
  }
  return (
    <Screen>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 26px', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-secondary)' }}>Sync your scripts and plan across devices.</p>
        </div>
        {mode === 'signup' && <input style={inputStyle} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />}
        <input style={inputStyle} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={inputStyle} type="password" placeholder="Password (6+ characters)" value={pw} onChange={e => setPw(e.target.value)} />
        {mode === 'signup' && (
          <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45, margin: '2px 2px 12px' }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0 }} />
            <span>I agree to the Terms and Privacy Policy, and I am responsible for getting consent before recording anyone.</span>
          </label>
        )}
        {msg && <div style={{ fontSize: 13, color: 'var(--accent-primary)', marginBottom: 10, textAlign: 'center' }}>{msg}</div>}
        <button className="pd-tap" onClick={go} disabled={busy} style={{ height: 52, borderRadius: 14, border: 'none', background: 'var(--accent-primary)', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>{busy ? 'Working…' : (mode === 'signin' ? 'Sign in' : 'Create account')}</button>
        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 14, color: 'var(--text-secondary)' }}>
          {mode === 'signin'
            ? <span>New here? <button className="pd-tap" onClick={() => { setMode('signup'); setMsg(null); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Create an account</button></span>
            : <span>Have an account? <button className="pd-tap" onClick={() => { setMode('signin'); setMsg(null); }} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontWeight: 600, cursor: 'pointer' }}>Sign in</button></span>}
        </div>
      </div>
    </Screen>
  );
}

function PromptDropApp() {
  const data = useData();
  const [onboarded, setOnboarded] = React.useState(() => { try { return localStorage.getItem('pd.onboarded') === '1'; } catch { return false; } });
  const [tab, setTab] = React.useState('library');
  const [stack, setStack] = React.useState([]);
  const [live, setLive] = React.useState(null);
  const [meeting, setMeeting] = React.useState(false);
  const [toast, setToast] = React.useState(null);

  const top = stack[stack.length - 1];
  const showTab = !top || !FULLSCREEN[top.screen];
  const showTabBar = showTab && !live && !meeting;

  const app = {
    params: top ? top.params || {} : {},
    nav: (screen, params) => setStack(s => [...s, { screen, params }]),
    back: () => setStack(s => s.slice(0, -1)),
    setTab: (t) => { setTab(t); setStack([]); },
    openLive: (cfg) => setLive(cfg),
    closeLive: () => setLive(null),
    openMeeting: () => setMeeting(true),
    finishOnboarding: () => { try { localStorage.setItem('pd.onboarded', '1'); } catch {} setOnboarded(true); },
    toast: (t) => { setToast(t); setTimeout(() => setToast(null), 2200); },
    reload: data.reload,
  };

  if (!onboarded) return <div style={{ position: 'absolute', inset: 0 }}><OnboardingScreen app={app} /></div>;
  if (data.loading) return <div style={{ position: 'absolute', inset: 0, background: 'var(--bg-primary)' }} />;
  if (!data.user) return <div style={{ position: 'absolute', inset: 0 }}><AuthScreen onDone={data.reload} /></div>;

  const Root = ROOTS[tab] || LibraryScreen;
  const onRecord = () => { const s = data.scripts[0]; app.nav('recordSetup', s ? { id: s.id, title: s.title, lines: linesFromBody(s.body) } : { id: null, title: 'Untitled', lines: [] }); };

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Root app={app} />
      {stack.map((entry, i) => {
        const Comp = PUSHED[entry.screen];
        if (!Comp) return null;
        return (<div key={i} className="pd-push" style={{ position: 'absolute', inset: 0, zIndex: 10 + i }}><Comp app={{ ...app, params: entry.params || {} }} /></div>);
      })}
      {showTabBar && <TabBar tab={tab} onTab={app.setTab} onRecord={onRecord} />}
      {live && <LiveSession cfg={live} onExit={() => setLive(null)} onComplete={(res) => { setLive(null); setStack(s => s.filter(e => e.screen !== 'recordSetup')); app.reload(); if (res && res.id) app.nav('takeReview', { id: res.id }); }} />}
      {meeting && <MeetingLive onExit={() => setMeeting(false)} onDone={(id) => { setMeeting(false); app.reload(); if (id) app.nav('meeting', { id }); }} />}
      {toast && (
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: showTabBar ? 110 : 40, zIndex: 40, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 16px', background: 'var(--surface-raised)', border: '1px solid var(--border-default)', borderRadius: 999, boxShadow: 'var(--shadow-floating)' }}>
            <Icon name="checkCircle" size={17} color="var(--success)" />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

window.PromptDropApp = PromptDropApp;

const _mount = document.getElementById('app-root');
if (_mount) {
  ReactDOM.createRoot(_mount).render(<DataProvider><PromptDropApp /></DataProvider>);
}
