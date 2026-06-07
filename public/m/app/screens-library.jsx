// screens-library.jsx, Library (scripts + takes) and the Script editor. Real data.
const DS = window.PromptDropDesignSystem_82c6c3;

function ScriptRow({ s, onOpen, last }) {
  return (
    <button onClick={onOpen} className="pd-tap" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', padding: '16px 0', borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title || 'Untitled'}</div>
        <div style={{ marginTop: 5, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{s.dur} · {String(s.updated || '').toUpperCase()}</div>
      </div>
      <Icon name="chevronR" size={18} color="var(--ink-600)" />
    </button>
  );
}

function TakeRow({ t, onOpen, last }) {
  return (
    <button onClick={onOpen} className="pd-tap" style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div style={{ width: 50, height: 50, borderRadius: 12, background: 'radial-gradient(120% 90% at 50% 20%, #1b2230, #0a0d13)', position: 'relative', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="play" size={16} color="rgba(255,255,255,0.9)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.script}</div>
        <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{t.dur} · {String(t.when || '').toUpperCase()}</div>
      </div>
      <Icon name="chevronR" size={18} color="var(--ink-600)" />
    </button>
  );
}

function LibraryScreen({ app }) {
  const pd = useData();
  const [seg, setSeg] = React.useState('Scripts');
  const [q, setQ] = React.useState('');

  const scripts = pd.scripts
    .filter(s => (s.title || '').toLowerCase().includes(q.toLowerCase()))
    .map(s => { const w = pd.svc.words(s.body); return { id: s.id, title: s.title, dur: pd.svc.durFor(w, 142), updated: 'edited ' + pd.svc.rel(s.updated_at), body: s.body }; });
  const takes = (pd.takes || []).filter(t => t.source !== 'meeting').map(t => ({ id: t.id, script: t.title || (t.source === 'screen' ? 'Screen take' : 'Camera take'), dur: pd.svc.clock(t.durationMs), when: pd.svc.rel(t.createdAt) }));

  return (
    <Screen>
      <ScrollArea>
        <LargeTitle
          title="Library"
          trailing={
            <button className="pd-tap" onClick={() => app.nav('script', { id: null })} style={{ width: 44, height: 44, borderRadius: 999, border: 'none', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Icon name="plus" size={22} color="#fff" />
            </button>
          }
        />
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-elevated)', border: 'none', borderRadius: 12, padding: '0 12px', height: 42 }}>
            <Icon name="search" size={18} color="var(--text-muted)" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search scripts" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15, fontFamily: 'var(--font-sans)' }} />
          </div>
        </div>

        <div style={{ padding: '14px 20px 4px' }}>
          <div style={{ display: 'flex', background: 'var(--surface-sunken)', borderRadius: 10, padding: 3, gap: 2 }}>
            {['Scripts', 'Takes'].map(o => (
              <button key={o} onClick={() => setSeg(o)} className="pd-tap" style={{ flex: 1, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, background: seg === o ? 'var(--surface-raised)' : 'transparent', color: seg === o ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: seg === o ? 'var(--shadow-subtle)' : 'none' }}>{o}</button>
            ))}
          </div>
        </div>

        {seg === 'Scripts' && (
          <div style={{ padding: '8px 20px 0' }}>
            {scripts.map((s, i) => <ScriptRow key={s.id} s={s} last={i === scripts.length - 1} onOpen={() => app.nav('script', { id: s.id })} />)}
            {scripts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No scripts yet.</div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>Tap + to write your first one. It syncs to your account.</div>
              </div>
            )}
          </div>
        )}

        {seg === 'Takes' && (
          <div style={{ padding: '8px 20px 0' }}>
            {takes.map((t, i) => <TakeRow key={t.id} t={t} last={i === takes.length - 1} onOpen={() => app.nav('takeReview', { id: t.id })} />)}
            {takes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No takes yet.</div>
                <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>Record one from a script and it appears here, on this device.</div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </Screen>
  );
}

const REWRITES = ['Make punchier', 'Shorten', 'More conversational', 'Warm up the intro'];

function ScriptScreen({ app }) {
  const pd = useData();
  const existing = pd.scripts.find(x => x.id === app.params.id);
  const isNew = !app.params.id;
  const [title, setTitle] = React.useState(existing ? existing.title : '');
  const [body, setBody] = React.useState(existing ? (existing.body || '') : '');
  const [aiOpen, setAiOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const idRef = React.useRef(app.params.id || null);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const secs = Math.round((words / 142) * 60);
  const dur = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  async function persist() {
    const t = title || 'Untitled script';
    if (idRef.current) { await pd.svc.updateScript(idRef.current, { title: t, body }); }
    else if (body.trim() || title.trim()) { const row = await pd.svc.createScript(t, body); if (row) idRef.current = row.id; }
    pd.reload();
  }
  async function rewrite(kind) {
    if (!body.trim()) return;
    setBusy(true);
    const r = await pd.svc.ask(`Rewrite this script to be ${kind.toLowerCase()}. Return only the rewritten script.`, body);
    setBusy(false);
    if (r.ok && r.text) { setBody(r.text); app.toast('Rewritten'); } else { app.toast(r.msg || 'AI not available'); }
  }
  const launch = async () => { await persist(); app.nav('recordSetup', { id: idRef.current, title: title || 'Untitled script', lines: (body.trim() ? body.split(/\n\n+/).map(l => l.trim()).filter(Boolean) : []) }); };
  const back = async () => { await persist(); app.back(); };

  return (
    <Screen>
      <NavHeader onBack={back} action={<>
        <button className="pd-tap" style={iconBtn} onClick={() => setAiOpen(v => !v)}><Icon name="sparkle" size={20} color={aiOpen ? 'var(--accent-secondary)' : 'var(--text-secondary)'} /></button>
        <button className="pd-tap" style={iconBtn} onClick={async () => { if (idRef.current) { await pd.svc.deleteScript(idRef.current); pd.reload(); } app.back(); }}><Icon name="trash" size={19} color="var(--text-secondary)" /></button>
      </>} />
      <ScrollArea padBottom={120}>
        <div style={{ padding: '4px 20px 0' }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Untitled script" style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-sans)' }} />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            <span>{words} WORDS</span><span style={{ opacity: 0.4 }}>·</span><span>~{dur} AT 142 WPM</span>
          </div>
        </div>
        {aiOpen && (
          <div style={{ padding: '16px 20px 0' }}>
            <DS.Card variant="accent" style={{ borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon name="sparkle" size={18} color="var(--accent-secondary)" />
                <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Rewrite with AI</span>
              </div>
              <p style={{ margin: '6px 0 12px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>Tighten your intro or change the tone. {busy ? 'Working…' : 'Tap an option to rewrite your script.'}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {REWRITES.map(r => (
                  <button key={r} className="pd-tap" disabled={busy} onClick={() => rewrite(r)} style={{ height: 34, padding: '0 13px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'var(--surface-raised)', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>{r}</button>
                ))}
              </div>
            </DS.Card>
          </div>
        )}
        <div style={{ padding: '18px 20px 0' }}>
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Write or paste your script…" style={{ width: '100%', minHeight: 320, background: 'none', border: 'none', outline: 'none', resize: 'none', color: 'var(--text-primary)', fontSize: 19, lineHeight: 1.6, fontFamily: 'var(--font-sans)', letterSpacing: '-0.01em' }} />
        </div>
      </ScrollArea>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 22px))', background: 'linear-gradient(transparent, var(--bg-primary) 28%)' }}>
        <DS.Button variant="launch" size="lg" fullWidth onClick={launch} iconRight={<Icon name="arrowRight" size={18} color="#fff" />}>Launch Prompt Drop</DS.Button>
      </div>
    </Screen>
  );
}

Object.assign(window, { LibraryScreen, ScriptScreen });
