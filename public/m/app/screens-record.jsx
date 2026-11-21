// screens-record.jsx, Record setup, live prompting + recording, take review. Real camera.
const DSr = window.PromptDropDesignSystem_82c6c3;

function SettingRow({ children, top, testid }) { return <div data-testid={testid} style={{ padding: top ? '2px 0 16px' : '16px 0 0' }}>{children}</div>; }

function RecordSetupScreen({ app }) {
  const p = app.params;
  const lines = (p.lines && p.lines.length) ? p.lines : ['Your script is empty. Add lines in the editor, or just press record.'];
  // Start from the last-used preferences, not hardcoded defaults, and save every change.
  const saved = React.useMemo(() => pdLoadPrefs(), []);
  const [speed, setSpeed] = React.useState(saved.speed);
  const [font, setFont] = React.useState(saved.font);
  const [pos, setPos] = React.useState(saved.pos);
  const [autoRec, setAutoRec] = React.useState(saved.autoRec);
  const [follow, setFollow] = React.useState(saved.follow);
  const [sheet, setSheet] = React.useState(true);
  React.useEffect(() => { pdSavePrefs({ speed, font, pos, autoRec, follow }); }, [speed, font, pos, autoRec, follow]);

  return (
    <Screen style={{ background: '#000' }}>
      <div data-testid="record-setup" data-speed={speed} data-font={font} style={{ display: 'none' }} />
      <CameraView dim={0.12}>
        <div style={{ position: 'absolute', top: 0, left: 8, right: 8, height: 92, background: '#000', borderRadius: '0 0 28px 28px', border: '1px solid var(--promptdrop-border)', borderTop: 'none', boxShadow: '0 18px 40px -16px rgba(0,0,0,0.8)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ textAlign: 'center' }}>
            <Eyebrow color="var(--text-muted)" style={{ fontSize: 10 }}>{autoRec ? 'Will record' : 'Prompt only'}</Eyebrow>
            <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', maxWidth: 240, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', top: 54, left: 14, right: 14, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
          <RoundBtn size={44} onClick={app.back}><Icon name="x" size={20} color="#fff" /></RoundBtn>
        </div>
        <div style={{ position: 'absolute', top: 110, left: '50%', transform: 'translateX(-50%)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.5)' }}>YOUR CAMERA</div>
      </CameraView>

      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: 'var(--bg-secondary)', borderTopLeftRadius: 24, borderTopRightRadius: 24, border: '1px solid var(--border-default)', borderBottom: 'none', boxShadow: '0 -20px 50px -20px rgba(0,0,0,0.7)', transition: 'transform .42s cubic-bezier(.22,1,.36,1)', transform: sheet ? 'translateY(0)' : 'translateY(calc(100% - 168px))' }}>
        <button onClick={() => setSheet(v => !v)} className="pd-tap" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 9, background: 'var(--ink-600)', margin: '0 auto' }} />
        </button>
        <div style={{ padding: '6px 20px 8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>Prompt settings</span>
            <Eyebrow>{follow ? 'Follow voice' : 'Steady'}</Eyebrow>
          </div>
          <div style={{ marginTop: 14 }}>
            <SettingRow top testid="prompt-speed"><DSr.Slider label="Scroll speed" min={80} max={240} value={speed} suffix=" wpm" onChange={e => setSpeed(+e.target.value)} /></SettingRow>
            <SettingRow testid="prompt-font"><DSr.Slider label="Font size" min={28} max={64} value={font} suffix="px" onChange={e => setFont(+e.target.value)} /></SettingRow>
            <SettingRow>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>Text alignment</span>
                <DSr.SegmentedControl options={['Left', 'Centre', 'Right']} value={pos} onChange={setPos} />
              </div>
            </SettingRow>
            <SettingRow><DSr.Switch spread label="Follow my voice" checked={follow} onChange={e => setFollow(e.target.checked)} /></SettingRow>
            <SettingRow><DSr.Switch spread label="Record after countdown" checked={autoRec} onChange={e => setAutoRec(e.target.checked)} /></SettingRow>
          </div>
        </div>
        <div style={{ padding: '6px 20px calc(16px + env(safe-area-inset-bottom, 22px))', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button className="pd-tap" data-testid="record-start" onClick={() => app.openLive({ title: p.title, lines, speed, font, pos, autoRec, follow })} style={{ flex: 1, height: 60, borderRadius: 18, border: 'none', cursor: 'pointer', background: autoRec ? 'var(--recording)' : 'var(--accent-primary)', color: '#fff', fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: autoRec ? 'var(--glow-recording)' : 'var(--glow-accent)' }}>
            <span style={{ width: 14, height: 14, borderRadius: autoRec ? 999 : 4, background: '#fff' }} />
            {autoRec ? 'Record take' : 'Start prompting'}
          </button>
        </div>
      </div>
    </Screen>
  );
}

// ---- Fitting script text to the drop --------------------------------------
// The drop has a fixed height. A long paragraph at a large font does not fit, and used to
// be cut off top and bottom. Instead: work out how many rows of the current line fit,
// then split long paragraphs into chunks of at most that many rows. No words are dropped.
const PD_LINE_HEIGHT = 1.34;
const PD_LINE_PAD = 12; // 6px above and below each line
let _pdMeasureCtx = null;
function pdTextWidth(text, font) {
  try {
    if (!_pdMeasureCtx) _pdMeasureCtx = document.createElement('canvas').getContext('2d');
    _pdMeasureCtx.font = '600 ' + font + 'px Manrope, system-ui, -apple-system, "Segoe UI", sans-serif';
    return _pdMeasureCtx.measureText(text).width - 0.01 * font * text.length; // letter-spacing -0.01em
  } catch (e) { return text.length * font * 0.56; }
}
// How the drop is laid out for a given size: which neighbouring lines are shown and how
// many rows the current line may use. Neighbours are always one row each.
function pdPromptLayout({ font, boxW, boxH, follow }) {
  const row = font * PD_LINE_HEIGHT;
  const adjH = Math.round(font * 0.75) * PD_LINE_HEIGHT + PD_LINE_PAD;
  const farH = Math.round(font * 0.6) * PD_LINE_HEIGHT + PD_LINE_PAD;
  const hint = follow ? 30 : 0;
  const room = (reserved) => Math.floor((boxH - hint - reserved - PD_LINE_PAD) / row);
  // The line being read comes first. Take the richest layout that gives it three rows;
  // if none does, take whichever gives it the most (ties go to the richer layout).
  const options = [
    { showFar: true, showAdj: true, rows: room(farH * 2 + adjH) },
    { showFar: false, showAdj: true, rows: room(adjH) },
    { showFar: false, showAdj: false, rows: room(0) },
  ];
  let pick = options.find((o) => o.rows >= 3);
  if (!pick) pick = options.reduce((best, o) => (o.rows > best.rows ? o : best), options[0]);
  return { showFar: pick.showFar, showAdj: pick.showAdj, maxRows: Math.max(1, Math.min(pick.rows, 4)), width: boxW };
}
// Rows a run of words takes when wrapped at this width. A word wider than the box is
// broken across rows by the browser; those rows hold slightly less, so count them at 90%.
function pdWrapRows(words, font, width) {
  const space = pdTextWidth(' ', font) || font * 0.28;
  let rows = 1, cur = 0;
  for (const w of words) {
    const ww = pdTextWidth(w, font);
    if (cur > 0 && cur + space + ww > width) { rows++; cur = 0; }
    if (ww > width) { const extra = Math.ceil(ww / (width * 0.9)) - 1; rows += extra; cur = Math.max(1, ww - extra * width * 0.9); }
    else cur = cur > 0 ? cur + space + ww : ww;
  }
  return rows;
}
// A single word too long for the whole text area (a URL, say) is cut into pieces that fit.
function pdBreakLongWord(word, font, width, maxRows) {
  if (pdWrapRows([word], font, width) <= maxRows) return [word];
  const out = []; let piece = '';
  for (const ch of word) {
    if (piece && pdWrapRows([piece + ch], font, width) > maxRows) { out.push(piece); piece = ch; } else piece += ch;
  }
  if (piece) out.push(piece);
  return out;
}
// Split each script line into chunks that fit maxRows rows. Prefers to break after
// punctuation when that does not waste much of the chunk.
function pdFitLines(lines, { font, width, maxRows }) {
  const out = [];
  const safeW = Math.max(40, width * 0.97); // small margin for font rendering differences
  for (const line of lines || []) {
    const words = [].concat(...String(line).split(/\s+/).filter(Boolean).map((w) => pdBreakLongWord(w, font, safeW, maxRows)));
    if (!words.length) continue;
    let start = 0;
    while (start < words.length) {
      let end = start + 1, lastPunct = -1;
      while (end < words.length && pdWrapRows(words.slice(start, end + 1), font, safeW) <= maxRows) {
        if (/[.,;:!?…]$/.test(words[end - 1])) lastPunct = end;
        end++;
      }
      if (end < words.length && lastPunct > start && (lastPunct - start) >= (end - start) * 0.6) end = lastPunct;
      out.push(words.slice(start, end).join(' '));
      start = end;
    }
  }
  return out;
}

function LiveSession({ cfg, onExit, onComplete }) {
  const rootRef = React.useRef(null);
  // Size of the text area inside the open drop, measured from the real screen.
  const [box, setBox] = React.useState(() => ({ w: 300, h: 300 }));
  React.useLayoutEffect(() => {
    const measure = () => {
      const el = rootRef.current; if (!el) return;
      const W = el.clientWidth, H = el.clientHeight;
      const dropPx = Math.min(H * 0.64, 520);
      const w = Math.min(W - 12 - 52, 420), h = dropPx - 74 - 14; // 74 = status row, 14 = breathing room above the progress bar
      setBox((b) => (Math.abs(b.w - w) < 1 && Math.abs(b.h - h) < 1 ? b : { w, h }));
    };
    measure();
    window.addEventListener('resize', measure);
    let fontsDone = false;
    try { document.fonts && document.fonts.ready.then(() => { if (!fontsDone) setFontTick((n) => n + 1); }); } catch (e) {}
    return () => { fontsDone = true; window.removeEventListener('resize', measure); };
  }, []);
  const [fontTick, setFontTick] = React.useState(0);
  const layout = React.useMemo(() => pdPromptLayout({ font: cfg.font, boxW: box.w, boxH: box.h, follow: cfg.follow }), [cfg.font, cfg.follow, box.w, box.h]);
  const lines = React.useMemo(() => pdFitLines(cfg.lines, { font: cfg.font, width: layout.width, maxRows: layout.maxRows }), [cfg.lines, cfg.font, layout.width, layout.maxRows, fontTick]);
  const [phase, setPhase] = React.useState('countdown');
  const [count, setCount] = React.useState(3);
  const [idx, setIdx] = React.useState(0);
  const [elapsed, setElapsed] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [camOk, setCamOk] = React.useState(false);
  const [camErr, setCamErr] = React.useState(false);
  const recording = cfg.autoRec;
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);
  const recRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const startedRef = React.useRef(0);
  const savingRef = React.useRef(false);

  React.useEffect(() => { const t = setTimeout(() => setExpanded(true), 60); return () => clearTimeout(t); }, []);

  // camera + mic
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: true });
        if (!alive) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream; setCamOk(true);
        if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
      } catch (e) { setCamOk(false); setCamErr(true); }
    })();
    return () => { alive = false; try { streamRef.current && streamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {} };
  }, []);

  function pickRecMime() {
    const kinds = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
    if (!window.MediaRecorder) return null;
    for (const m of kinds) { try { if (MediaRecorder.isTypeSupported(m)) return m; } catch (e) {} }
    return '';   // let the browser choose its default (Safari -> mp4)
  }
  function startRec() {
    const stream = streamRef.current; if (!stream || !recording || !('MediaRecorder' in window) || recRef.current) return;
    chunksRef.current = [];
    let mr;
    try { const mime = pickRecMime(); mr = (mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream)); }
    catch (e) { try { mr = new MediaRecorder(stream); } catch (e2) { return; } }
    mr.ondataavailable = e => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
    // Some mobile browsers only emit data on stop; a timeslice makes them flush as we go.
    try { mr.start(1000); } catch (e) { try { mr.start(); } catch (e2) { return; } }
    recRef.current = mr; startedRef.current = Date.now();
  }
  async function finishRec() {
    const mr = recRef.current; recRef.current = null;
    const stopStream = () => { try { streamRef.current && streamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {} };
    if (savingRef.current) return;
    savingRef.current = true;
    const save = async (blob) => {
      const dur = Math.max(0, Date.now() - startedRef.current);
      const id = (crypto.randomUUID ? crypto.randomUUID() : 'tk' + Date.now());
      try { await PDsvc.putTake({ id, createdAt: Date.now(), durationMs: dur, size: blob ? blob.size : 0, type: blob ? (blob.type || '') : '', source: 'camera', title: cfg.title, blob: blob || null }); } catch (e) {}
      stopStream();
      onComplete({ id });
    };
    if (!mr) { save(null); return; }
    let done = false;
    const finalize = () => { if (done) return; done = true; save(new Blob(chunksRef.current, { type: mr.mimeType || 'video/webm' })); };
    mr.onstop = finalize;
    try {
      if (mr.state !== 'inactive') { try { mr.requestData(); } catch (e) {} mr.stop(); }
      else finalize();
    } catch (e) { finalize(); }
    // Safety net, if onstop never fires on this device, save what we have.
    setTimeout(finalize, 1500);
  }

  // Hold the countdown at "Go" until the camera is actually live, so the recorder always has a stream to capture.
  React.useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) { if (!recording || camOk || camErr) setPhase('prompting'); return; }
    const t = setTimeout(() => setCount(c => c - 1), 850); return () => clearTimeout(t);
  }, [phase, count, camOk, camErr, recording]);
  // Start recording as soon as we are prompting AND the camera is ready (whichever happens last).
  React.useEffect(() => { if (phase === 'prompting' && camOk) startRec(); }, [phase, camOk]);
  React.useEffect(() => { if (phase !== 'prompting') return; const t = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(t); }, [phase]);
  React.useEffect(() => {
    if (phase !== 'prompting' || cfg.follow) return;
    const words = (lines[idx] || '').split(/\s+/).length;
    // Short chunks made by splitting a long line keep the chosen pace; one second is the floor.
    const ms = Math.max(1000, (words / cfg.speed) * 60 * 1000);
    const t = setTimeout(() => setIdx(i => { if (i + 1 >= lines.length) { setPhase('complete'); return i; } return i + 1; }), ms);
    return () => clearTimeout(t);
  }, [phase, idx, cfg.follow, cfg.speed, lines]);
  React.useEffect(() => { if (phase === 'complete') finishRec(); }, [phase]);

  const advance = () => { if (phase === 'prompting' && cfg.follow) setIdx(i => { if (i + 1 >= lines.length) { setPhase('complete'); return i; } return i + 1; }); };
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const progress = phase === 'complete' ? 100 : (idx / Math.max(1, lines.length - 1)) * 100;
  const dim = phase === 'prompting' ? 0.5 : 0.2;
  const dropH = phase === 'complete' ? 360 : (phase === 'countdown' ? 320 : 'min(64%, 520px)');

  const renderLine = (i, kind, key) => {
    const t = lines[i]; if (!t) return <div key={key} style={{ height: 6 }} />;
    const styles = { cur: { fontSize: cfg.font, color: 'var(--tp-current)', fontWeight: 600 }, adj: { fontSize: Math.round(cfg.font * 0.75), color: 'var(--tp-adjacent)', fontWeight: 500 }, far: { fontSize: Math.round(cfg.font * 0.6), color: 'var(--tp-far)', fontWeight: 500 } }[kind];
    const align = cfg.pos === 'Left' ? 'left' : cfg.pos === 'Right' ? 'right' : 'center';
    // Neighbouring lines are previews: one row, cut with an ellipsis. Only the line being
    // read wraps, and pdFitLines has already made sure it fits.
    const oneRow = kind === 'cur' ? { overflowWrap: 'anywhere' } : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
    return <div key={key} data-testid={'live-line-' + kind} style={{ ...styles, ...oneRow, opacity: 1, lineHeight: PD_LINE_HEIGHT, letterSpacing: '-0.01em', textAlign: align, transition: 'color .3s ease, opacity .3s ease', padding: '6px 0' }}>{t}</div>;
  };

  const exit = () => { try { streamRef.current && streamRef.current.getTracks().forEach(t => t.stop()); } catch (e) {} onExit(); };

  return (
    <div ref={rootRef} data-testid="live-session" data-phase={phase} data-speed={cfg.speed} data-font={cfg.font} data-chunk={idx} data-chunks={lines.length} style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 30, overflow: 'hidden' }}>
      {camOk
        ? <video ref={videoRef} playsInline muted style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', filter: `brightness(${1 - dim})` }} />
        : <CameraView dim={dim} />}

      <div onClick={advance} data-testid="live-drop" style={{ position: 'absolute', top: 0, left: 6, right: 6, height: expanded ? dropH : 84, background: '#000', borderRadius: '0 0 40px 40px', border: '1px solid var(--promptdrop-border)', borderTop: 'none', boxShadow: 'var(--shadow-promptdrop)', transition: 'height .48s cubic-bezier(.22,1,.36,1)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', zIndex: 31 }}>
        <div style={{ paddingTop: 50, display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
          {recording && phase !== 'complete' && <span className="pd-rec-dot" />}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', color: recording ? '#FF8077' : 'var(--text-muted)' }}>
            {phase === 'countdown' ? (recording ? 'GET READY' : 'STARTING') : phase === 'complete' ? 'COMPLETE' : (recording ? `REC ${fmt(elapsed)}` : `PROMPTING ${fmt(elapsed)}`)}
          </span>
        </div>
        <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 26px' }}>
          {phase === 'countdown' && (
            <div style={{ textAlign: 'center' }}>
              <PromptCharacter state="countdown" size={64} />
              <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1, marginTop: 6 }}>{count === 0 ? 'Go' : count}</div>
            </div>
          )}
          {(phase === 'prompting' || phase === 'paused') && (
            <div data-testid="live-text" style={{ width: '100%', maxWidth: 420 }}>
              {layout.showFar && renderLine(idx - 1, 'far', 'prev')}{renderLine(idx, 'cur', 'cur')}{layout.showAdj && renderLine(idx + 1, 'adj', 'next')}{layout.showFar && renderLine(idx + 2, 'far', 'after')}
              {cfg.follow && phase === 'prompting' && <div style={{ marginTop: 14, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>TAP TO ADVANCE</div>}
            </div>
          )}
          {phase === 'complete' && (
            <div style={{ textAlign: 'center' }}>
              <PromptCharacter state="complete" size={76} />
              <div style={{ marginTop: 10, fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Nice take.</div>
              <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{fmt(elapsed)} · {cfg.speed} WPM</div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: 'var(--text-muted)' }}>Saving your take…</div>
            </div>
          )}
        </div>
        {(phase === 'prompting' || phase === 'paused') && <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: `${progress}%`, background: 'var(--accent-primary)', borderRadius: '0 3px 0 0', transition: 'width .4s linear' }} />}
      </div>

      {phase !== 'complete' && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '0 24px calc(26px + env(safe-area-inset-bottom, 22px))', zIndex: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <RoundBtn size={56} onClick={() => { setPhase('countdown'); setCount(3); setIdx(0); setElapsed(0); }}><Icon name="redo" size={22} color="#fff" /></RoundBtn>
            <button className="pd-tap" onClick={() => setPhase(p => p === 'paused' ? 'prompting' : 'paused')} disabled={phase === 'countdown'} style={{ width: 76, height: 76, borderRadius: 999, border: '4px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: phase === 'countdown' ? 0.4 : 1 }}>
              <Icon name={phase === 'paused' ? 'play' : 'pause'} size={30} color="#fff" />
            </button>
            <RoundBtn size={56} label="Stop and save take" testid="live-stop" bg="rgba(255,59,48,0.22)" style={{ borderColor: 'rgba(255,59,48,0.5)' }} onClick={() => setPhase('complete')}><span style={{ width: 20, height: 20, borderRadius: 5, background: 'var(--recording)' }} /></RoundBtn>
          </div>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <button className="pd-tap" onClick={exit} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TakeReviewScreen({ app }) {
  const pd = useData();
  const [take, setTake] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [url, setUrl] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const vref = React.useRef(null);
  const urlRef = React.useRef(null);
  React.useEffect(() => {
    let live = true;
    (async () => {
      const t = await pd.svc.getTake(app.params.id);
      if (!live) return;
      setTake(t || null); setLoaded(true);
      if (t && t.blob && t.blob.size > 0) { const u = URL.createObjectURL(t.blob); urlRef.current = u; setUrl(u); }
    })();
    return () => { live = false; if (urlRef.current) { URL.revokeObjectURL(urlRef.current); urlRef.current = null; } };
  }, [app.params.id]);
  const fmtSize = (b) => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.round(b / 1e3) + ' KB';
  const hasVideo = !!url;

  const insights = take ? [
    { icon: 'clock', label: 'Duration', value: pd.svc.clock(take.durationMs) },
    { icon: 'video', label: 'Source', value: take.source === 'screen' ? 'Screen + mic' : 'Camera + mic' },
    { icon: 'download', label: 'Size', value: fmtSize(take.size || 0) },
  ] : [];

  function toggle() { const v = vref.current; if (!v) return; if (v.paused) { v.play().then(() => setPlaying(true)).catch(() => {}); } else { v.pause(); setPlaying(false); } }
  function download() { if (!url) return; const ext = (take && take.type && take.type.indexOf('mp4') >= 0) ? 'mp4' : 'webm'; const a = document.createElement('a'); a.href = url; a.download = 'promptdrop-take.' + ext; a.click(); }

  return (
    <Screen>
      <NavHeader onBack={app.back} title="Take" action={hasVideo ? <button className="pd-tap" style={iconBtn} onClick={download}><Icon name="download" size={19} color="var(--text-secondary)" /></button> : null} />
      <ScrollArea padBottom={120}>
        <div style={{ margin: '6px 16px 0', borderRadius: 22, overflow: 'hidden', position: 'relative', aspectRatio: '9 / 13', maxHeight: 380, background: '#000' }}>
          {hasVideo ? (
            <>
              <video ref={vref} src={url} playsInline controls preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} style={{ width: '100%', height: '100%', objectFit: 'cover', background: '#000' }} />
              {!playing && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}><button className="pd-tap" onClick={toggle} style={{ width: 64, height: 64, borderRadius: 999, border: 'none', background: 'rgba(255,255,255,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', pointerEvents: 'auto' }}><Icon name="play" size={26} color="#000" /></button></div>}
            </>
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 26, textAlign: 'center', gap: 8 }}>
              <PromptCharacter state={loaded ? 'idle' : 'processing'} size={64} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{loaded ? 'No video was captured' : 'Loading your take…'}</div>
              {loaded && <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.45, maxWidth: 260 }}>This browser may not support in-app video recording. Allow camera and microphone access, or record from the desktop app.</div>}
            </div>
          )}
        </div>
        <div style={{ padding: '16px 20px 0' }}>
          <Eyebrow>{take ? pd.svc.rel(take.createdAt) : ''}</Eyebrow>
          <h2 style={{ margin: '6px 0 0', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{take ? (take.title || 'Take') : 'Loading…'}</h2>
        </div>
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ background: 'var(--surface-elevated)', borderRadius: 16, overflow: 'hidden' }}>
            {insights.map((i, n) => (
              <div key={i.label} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: n === insights.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
                <Icon name={i.icon} size={19} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 14.5, color: 'var(--text-secondary)' }}>{i.label}</span>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' }}>{i.value}</span>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 22px))', background: 'linear-gradient(transparent, var(--bg-primary) 28%)', display: 'flex', gap: 10 }}>
        <DSr.Button variant="secondary" size="lg" onClick={async () => { if (take) { await pd.svc.delTake(take.id); pd.reload(); } app.back(); }} iconLeft={<Icon name="trash" size={17} color="var(--text-primary)" />}>Delete</DSr.Button>
        <DSr.Button variant="primary" size="lg" fullWidth onClick={() => { app.toast('Saved to your takes'); app.back(); }} iconLeft={<Icon name="check" size={18} color="#fff" />}>Done</DSr.Button>
      </div>
    </Screen>
  );
}

Object.assign(window, { RecordSetupScreen, LiveSession, TakeReviewScreen });
