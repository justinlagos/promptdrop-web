// screens-meetings.jsx, meetings list, live capture, meeting detail. Real data + AI.
const DSm = window.PromptDropDesignSystem_82c6c3;

function MeetingsScreen({ app }) {
  const pd = useData();
  const meetings = (pd.takes || []).filter(t => t.source === 'meeting').map(t => ({ id: t.id, title: t.title || 'Meeting', when: pd.svc.rel(t.createdAt), dur: pd.svc.clock(t.durationMs) }));
  return (
    <Screen>
      <ScrollArea>
        <LargeTitle title="Meetings" />
        <div style={{ padding: '4px 20px 0' }}>
          <button className="pd-tap" onClick={() => app.openMeeting()} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', border: 'none', borderRadius: 16, padding: 16, background: 'var(--surface-elevated)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 999, background: 'var(--recording)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="mic" size={22} color="#fff" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Record a meeting</div>
              <div style={{ marginTop: 3, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>Transcript, summary and actions.</div>
            </div>
            <Icon name="chevronR" size={20} color="var(--ink-600)" />
          </button>
        </div>
        <div style={{ padding: '24px 20px 0' }}><Eyebrow>Recent</Eyebrow></div>
        <div style={{ padding: '0 20px' }}>
          {meetings.map((m, i) => (
            <button key={m.id} className="pd-tap" onClick={() => app.nav('meeting', { id: m.id })} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '15px 0', borderBottom: i === meetings.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>{String(m.when).toUpperCase()} · {m.dur.toUpperCase()}</div>
              </div>
              <Icon name="chevronR" size={18} color="var(--ink-600)" />
            </button>
          ))}
          {meetings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 15, color: 'var(--text-secondary)' }}>No meetings yet.</div>
              <div style={{ marginTop: 4, fontSize: 13, color: 'var(--text-muted)' }}>Record one and get a transcript, summary and actions.</div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Screen>
  );
}

function MeetingLive({ onExit, onDone }) {
  const [phase, setPhase] = React.useState('recording'); // recording | processing
  const [elapsed, setElapsed] = React.useState(0);
  const [note, setNote] = React.useState('Transcribing the recording…');
  const streamRef = React.useRef(null); const recRef = React.useRef(null); const chunksRef = React.useRef([]); const startRef = React.useRef(0);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream; chunksRef.current = [];
        const mime = (window.MediaRecorder && MediaRecorder.isTypeSupported('audio/webm')) ? 'audio/webm' : '';
        const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        mr.ondataavailable = e => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
        mr.start(1000); recRef.current = mr; startRef.current = Date.now();
      } catch (e) { setNote('Microphone permission needed.'); }
    })();
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => { clearInterval(t); try { streamRef.current && streamRef.current.getTracks().forEach(x => x.stop()); } catch (e) {} };
  }, []);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  async function stop() {
    const mr = recRef.current; recRef.current = null; setPhase('processing');
    const dur = Date.now() - startRef.current;
    const finish = async (blob) => {
      try { streamRef.current && streamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {}
      const id = (crypto.randomUUID ? crypto.randomUUID() : 'mt' + Date.now());
      let transcript = '', summary = '', actions = [], decisions = [], questions = [];
      const tr = await PDsvc.transcribe(blob);
      if (tr.ok) {
        transcript = tr.text || '';
        if (transcript.trim()) {
          setNote('Summarising and pulling actions…');
          const sx = await PDsvc.ask('Summarise this call in 2 to 3 sentences. Return only the summary.', transcript); if (sx.ok) summary = sx.text;
          const ax = await PDsvc.ask('List the action items, one per line, no other text. If none, return nothing.', transcript); if (ax.ok) actions = ax.text.split('\n').map(s => s.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
          const dx = await PDsvc.ask('List the decisions made, one per line, no other text. If none, return nothing.', transcript); if (dx.ok) decisions = dx.text.split('\n').map(s => s.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
          const qx = await PDsvc.ask('List the open questions, one per line, no other text. If none, return nothing.', transcript); if (qx.ok) questions = qx.text.split('\n').map(s => s.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
        }
      } else { summary = tr.msg; }
      const title = 'Meeting · ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      try { await PDsvc.putTake({ id, createdAt: Date.now(), durationMs: dur, size: blob.size, source: 'meeting', title, blob, transcript, summary, actions, decisions, questions }); } catch (e) {}
      onDone(id);
    };
    if (!mr) { onDone(null); return; }
    mr.onstop = () => finish(new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' }));
    try { mr.stop(); } catch (e) { onDone(null); }
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--ink-1000, #050506)', zIndex: 30, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: TOP_INSET, paddingLeft: 16, paddingRight: 16, paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 12, padding: '10px 13px' }}>
          <Icon name="shield" size={18} color="var(--accent-primary)" />
          <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.35 }}>Recording in progress. You are responsible for getting everyone's consent first.</span>
        </div>
      </div>
      {phase === 'recording' && (
        <>
          <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span className="pd-rec-dot" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{fmt(elapsed)}</span>
            </div>
            <div style={{ marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.14em', color: '#FF8077' }}>RECORDING</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, height: 56, margin: '10px 0' }}>
            {Array.from({ length: 38 }).map((_, i) => <span key={i} className="pd-wave-bar" style={{ animationDelay: `${(i % 9) * 0.11}s` }} />)}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>Capturing the conversation. When you stop, PromptDrop transcribes it and pulls the summary, decisions and actions.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: '14px 0 calc(26px + env(safe-area-inset-bottom, 22px))' }}>
            <RoundBtn size={56} bg="var(--surface-elevated)" style={{ borderColor: 'var(--border-default)' }} onClick={onExit}><Icon name="x" size={22} color="var(--text-secondary)" /></RoundBtn>
            <button className="pd-tap" onClick={stop} style={{ width: 76, height: 76, borderRadius: 999, border: '4px solid rgba(255,255,255,0.2)', background: 'var(--recording)', boxShadow: 'var(--glow-recording)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <span style={{ width: 24, height: 24, borderRadius: 6, background: '#fff' }} />
            </button>
            <div style={{ width: 56 }} />
          </div>
        </>
      )}
      {phase === 'processing' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, paddingBottom: 60 }}>
          <PromptCharacter state="processing" size={92} />
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Making sense of the call…</div>
          <div style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>{note}</div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) { return (<div style={{ marginTop: 26 }}><Eyebrow style={{ marginBottom: 12 }}>{title}</Eyebrow>{children}</div>); }
const ASK_SUGGESTIONS = ['What did I commit to?', 'Summarise in one line', 'What should I say in the follow-up?'];

function MeetingDetailScreen({ app }) {
  const pd = useData();
  const [m, setM] = React.useState(null);
  const [tab, setTab] = React.useState('Summary');
  const [done, setDone] = React.useState({});
  const [chat, setChat] = React.useState([{ role: 'ai', t: 'Ask me anything about this call, what was decided, what you owe, or what to say next.' }]);
  const [draft, setDraft] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => { let live = true; (async () => { const t = await pd.svc.getTake(app.params.id); if (live) setM(t); })(); return () => { live = false; }; }, [app.params.id]);

  const ask = async (q) => {
    if (!q.trim() || busy) return;
    setChat(c => [...c, { role: 'me', t: q }]); setDraft(''); setBusy(true);
    const r = await pd.svc.ask(q, m ? (m.transcript || m.summary || '') : '');
    setBusy(false);
    setChat(c => [...c, { role: 'ai', t: r.ok ? r.text : (r.msg || 'Could not answer.') }]);
  };

  if (!m) return <Screen><NavHeader onBack={app.back} /><div style={{ padding: 40, color: 'var(--text-muted)' }}>Loading…</div></Screen>;
  const transcript = m.transcript || '';
  const tLines = transcript.trim() ? [{ s: 'Transcript', t: transcript }] : [];

  return (
    <Screen>
      <NavHeader onBack={app.back} />
      <div style={{ padding: '0 20px 4px' }}>
        <Eyebrow>{String(pd.svc.rel(m.createdAt)).toUpperCase()} · {pd.svc.clock(m.durationMs).toUpperCase()}</Eyebrow>
        <h1 style={{ margin: '8px 0 14px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>{m.title}</h1>
        <div style={{ display: 'flex', background: 'var(--surface-sunken)', borderRadius: 10, padding: 3, gap: 2 }}>
          {['Summary', 'Transcript', 'Ask'].map(o => (
            <button key={o} onClick={() => setTab(o)} className="pd-tap" style={{ flex: 1, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 600, background: tab === o ? 'var(--surface-raised)' : 'transparent', color: tab === o ? 'var(--text-primary)' : 'var(--text-muted)', boxShadow: tab === o ? 'var(--shadow-subtle)' : 'none' }}>{o}</button>
          ))}
        </div>
      </div>

      {tab !== 'Ask' && (
        <ScrollArea padBottom={TAB_H} style={{ padding: '0 20px' }}>
          {tab === 'Summary' && (
            <>
              <div style={{ marginTop: 20 }}><p style={{ margin: 0, fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.summary || 'No summary yet. If transcription is switched on, the summary appears here after recording.'}</p></div>
              {(m.actions && m.actions.length > 0) && (
                <Section title="Action items"><div>
                  {m.actions.map((a, i) => (
                    <button key={i} className="pd-tap" onClick={() => setDone(d => ({ ...d, [i]: !d[i] }))} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', cursor: 'pointer', borderBottom: i === m.actions.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1, border: done[i] ? 'none' : '1.5px solid var(--border-strong)', background: done[i] ? 'var(--accent-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{done[i] && <Icon name="check" size={13} color="#fff" />}</span>
                      <span style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.45, textDecoration: done[i] ? 'line-through' : 'none', opacity: done[i] ? 0.5 : 1 }}>{a}</span>
                    </button>
                  ))}
                </div></Section>
              )}
              {(m.decisions && m.decisions.length > 0) && (
                <Section title="Decisions"><div>
                  {m.decisions.map((d, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderBottom: i === m.decisions.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}><Icon name="check" size={16} color="var(--text-muted)" style={{ marginTop: 1, flexShrink: 0 }} /><span style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.45 }}>{d}</span></div>))}
                </div></Section>
              )}
              {(m.questions && m.questions.length > 0) && (
                <Section title="Open questions"><div>
                  {m.questions.map((q, i) => (<div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '11px 0', borderBottom: i === m.questions.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}><span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', flexShrink: 0, width: 16 }}>?</span><span style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.45 }}>{q}</span></div>))}
                </div></Section>
              )}
              <div style={{ height: 16 }} />
            </>
          )}
          {tab === 'Transcript' && (
            <div style={{ paddingTop: 18 }}>
              {transcript.trim() ? <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{transcript}</p> : <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>No transcript. Transcription needs to be switched on for your account.</p>}
              <div style={{ height: 16 }} />
            </div>
          )}
        </ScrollArea>
      )}

      {tab === 'Ask' && (
        <>
          <div className="pd-scroll" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {chat.map((c, i) => (
              <div key={i} style={{ alignSelf: c.role === 'me' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
                <div style={{ padding: '11px 14px', borderRadius: 16, fontSize: 14.5, lineHeight: 1.5, background: c.role === 'me' ? 'var(--accent-primary)' : 'var(--surface-elevated)', color: c.role === 'me' ? '#fff' : 'var(--text-primary)', border: c.role === 'me' ? 'none' : '1px solid var(--border-default)', borderBottomRightRadius: c.role === 'me' ? 5 : 16, borderBottomLeftRadius: c.role === 'me' ? 16 : 5, whiteSpace: 'pre-wrap' }}>{c.t}</div>
              </div>
            ))}
            {busy && <div style={{ alignSelf: 'flex-start', fontSize: 13, color: 'var(--text-muted)', padding: '4px 6px' }}>Thinking…</div>}
          </div>
          <div style={{ padding: '4px 16px 0' }}>
            <div className="pd-hscroll" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10 }}>
              {ASK_SUGGESTIONS.map(s => <button key={s} className="pd-tap" onClick={() => ask(s)} style={{ flexShrink: 0, height: 34, padding: '0 13px', borderRadius: 999, border: '1px solid var(--border-default)', background: 'var(--surface-elevated)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>{s}</button>)}
            </div>
          </div>
          <div style={{ padding: '6px 16px calc(14px + env(safe-area-inset-bottom, 22px))', display: 'flex', gap: 9, alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 999, padding: '0 6px 0 16px', height: 46 }}>
              <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask(draft)} placeholder="Ask about this call…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 15, fontFamily: 'var(--font-sans)' }} />
              <button className="pd-tap" onClick={() => ask(draft)} style={{ width: 34, height: 34, borderRadius: 999, border: 'none', background: draft.trim() ? 'var(--accent-primary)' : 'var(--surface-raised)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Icon name="send" size={16} color={draft.trim() ? '#fff' : 'var(--text-muted)'} />
              </button>
            </div>
          </div>
        </>
      )}
    </Screen>
  );
}

Object.assign(window, { MeetingsScreen, MeetingLive, MeetingDetailScreen });
