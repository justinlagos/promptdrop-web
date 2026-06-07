// screens-account.jsx, onboarding, account, plan upgrade. Real user + checkout.
const DSa = window.PromptDropDesignSystem_82c6c3;

const ONB = [
  { eyebrow: 'PROMPTDROP', title: 'Keep your eyes on the lens.', body: 'A teleprompter that lives beside your camera, so you read naturally and still look people in the eye.', art: 'drop' },
  { eyebrow: 'PROMPT ON CAMERA', title: 'Read like you mean it.', body: 'Your script sits right by the lens. Set the pace, or let it follow your voice. Record a take in a tap.', art: 'prompt' },
  { eyebrow: 'MEETINGS', title: 'Never lose the thread of a call.', body: 'Record a conversation and get a clean transcript, a summary, decisions and the actions you owe.', art: 'meeting' },
];

function OnbArt({ kind }) {
  if (kind === 'prompt') return (
    <div style={{ width: 240, height: 200, position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 210, height: 150, background: '#000', borderRadius: '0 0 40px 40px', border: '1px solid var(--promptdrop-border)', borderTop: 'none', boxShadow: 'var(--shadow-promptdrop)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0 22px' }}>
        <div style={{ display: 'flex', gap: 7, position: 'absolute', top: 14 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 9, background: 'var(--ink-50)', opacity: 0.9 }} />)}</div>
        <div style={{ fontSize: 13, color: 'var(--tp-far)' }}>that keeps your eyes</div>
        <div style={{ fontSize: 19, fontWeight: 600, color: 'var(--tp-current)', textAlign: 'center' }}>right next to the lens.</div>
        <div style={{ fontSize: 13, color: 'var(--tp-adjacent)' }}>No more glancing away.</div>
      </div>
    </div>
  );
  if (kind === 'meeting') return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, height: 200 }}>
      {Array.from({ length: 26 }).map((_, i) => <span key={i} className="pd-wave-bar" style={{ animationDelay: `${(i % 9) * 0.12}s` }} />)}
    </div>
  );
  return (
    <div style={{ position: 'relative', width: 240, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, var(--blue-tint), transparent 65%)' }} />
      <div style={{ width: 180, height: 130, background: '#000', borderRadius: 36, border: '1px solid var(--promptdrop-border)', boxShadow: 'var(--shadow-promptdrop)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8, position: 'absolute', top: 16 }}>{[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: 9, background: 'var(--ink-50)' }} />)}</div>
        <PromptCharacter state="idle" size={72} />
      </div>
    </div>
  );
}

function OnboardingScreen({ app }) {
  const [i, setI] = React.useState(0);
  const [consent, setConsent] = React.useState(false);
  const last = i === ONB.length - 1;
  if (consent) return (
    <Screen>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 18 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'var(--blue-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shield" size={32} color="var(--accent-primary)" /></div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>Honest by default</h1>
          <p style={{ margin: 0, fontSize: 15.5, color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 320 }}>PromptDrop needs your camera and microphone to prompt and record. Takes stay on your device until you choose to save or share them. You are always told when recording is on, and you are responsible for getting consent before recording others.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320, marginTop: 6 }}>
            {[['video', 'Camera', 'For prompting and your takes'], ['mic', 'Microphone', 'For takes and meeting capture']].map(([ic, t, d]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-elevated)', border: '1px solid var(--border-default)', borderRadius: 14, textAlign: 'left' }}>
                <Icon name={ic} size={20} color="var(--text-secondary)" />
                <div style={{ flex: 1 }}><div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' }}>{t}</div><div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{d}</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '0 0 calc(20px + env(safe-area-inset-bottom, 22px))' }}>
          <DSa.Button variant="primary" size="lg" fullWidth onClick={app.finishOnboarding}>Allow & continue</DSa.Button>
          <p style={{ textAlign: 'center', margin: '12px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>You can change this anytime in Settings.</p>
        </div>
      </div>
    </Screen>
  );
  return (
    <Screen>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', padding: '0 28px' }}>
        <div style={{ paddingTop: TOP_INSET + 6, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="pd-tap" onClick={() => setConsent(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Skip</button>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 22 }}>
          <OnbArt kind={ONB[i].art} />
          <Eyebrow color="var(--accent-primary)">{ONB[i].eyebrow}</Eyebrow>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1, maxWidth: 320 }}>{ONB[i].title}</h1>
          <p style={{ margin: 0, fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 330 }}>{ONB[i].body}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 7, marginBottom: 20 }}>
          {ONB.map((_, j) => <span key={j} style={{ width: j === i ? 22 : 7, height: 7, borderRadius: 9, background: j === i ? 'var(--accent-primary)' : 'var(--ink-700)', transition: 'all .3s' }} />)}
        </div>
        <div style={{ padding: '0 0 calc(20px + env(safe-area-inset-bottom, 22px))' }}>
          <DSa.Button variant="primary" size="lg" fullWidth onClick={() => last ? setConsent(true) : setI(i + 1)}>{last ? 'Get started' : 'Continue'}</DSa.Button>
        </div>
      </div>
    </Screen>
  );
}

function Group({ header, children }) { return (<div style={{ marginTop: 22 }}>{header && <div style={{ padding: '0 8px 8px' }}><Eyebrow>{header}</Eyebrow></div>}<div style={{ background: 'var(--surface-elevated)', border: 'none', borderRadius: 16, overflow: 'hidden' }}>{children}</div></div>); }
function Row({ icon, label, value, onClick, last, control }) {
  return (
    <div onClick={onClick} className={onClick ? 'pd-tap' : ''} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 14px', cursor: onClick ? 'pointer' : 'default', borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      {icon && <Icon name={icon} size={19} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
      <span style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)' }}>{label}</span>
      {value && <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{value}</span>}
      {control}
      {onClick && <Icon name="chevronR" size={17} color="var(--ink-600)" />}
    </div>
  );
}

const PLAN_NAME = { free: 'Free', creator_pro: 'Creator Pro', studio_pro: 'Studio Pro' };

function AccountScreen({ app }) {
  const pd = useData();
  const user = pd.user || {};
  const email = user.email || '';
  const name = (user.user_metadata && user.user_metadata.display_name) || (email ? email.split('@')[0] : 'You');
  const initials = (name || 'Y').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const planName = PLAN_NAME[pd.plan] || 'Free';
  return (
    <Screen>
      <ScrollArea>
        <LargeTitle title="Account" />
        <div style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 16px', background: 'var(--surface-elevated)', border: 'none', borderRadius: 18 }}>
            <div style={{ width: 52, height: 52, borderRadius: 999, background: 'var(--blue-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 17, fontWeight: 600, color: '#fff' }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</div><div style={{ fontSize: 13.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div></div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--text-muted)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '3px 7px' }}>{planName.toUpperCase()}</span>
          </div>

          {pd.plan === 'free' && (
            <button className="pd-tap" onClick={() => app.nav('upgrade')} style={{ width: '100%', textAlign: 'left', marginTop: 12, cursor: 'pointer', border: 'none', borderRadius: 18, padding: 16, background: 'var(--surface-elevated)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--blue-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="zap" size={20} color="var(--accent-primary)" /></div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Upgrade to Studio Pro</div><div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Unlimited takes, meetings, AI notes</div></div>
              <Icon name="chevronR" size={20} color="var(--ink-600)" />
            </button>
          )}

          <Group header="Recording">
            <Row icon="video" label="Camera" value="Front" />
            <Row icon="mic" label="Microphone" value="Device mic" />
            <Row icon="gauge" label="Default speed" value="142 wpm" last />
          </Group>
          <Group header="Privacy & trust">
            <Row icon="shield" label="Consent & recording" onClick={() => { location.href = '/acceptable-use'; }} />
            <Row icon="download" label="Privacy policy" onClick={() => { location.href = '/privacy'; }} last />
          </Group>

          <div style={{ marginTop: 20 }}>
            <button className="pd-tap" onClick={async () => { await pd.svc.signOut(); pd.reload(); }} style={{ width: '100%', padding: '14px', background: 'var(--surface-elevated)', border: 'none', borderRadius: 14, color: 'var(--error)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Sign out</button>
          </div>
          <p style={{ textAlign: 'center', margin: '16px 0 0', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-600)', letterSpacing: '0.05em' }}>PROMPTDROP</p>
        </div>
      </ScrollArea>
    </Screen>
  );
}

const PRO_FEATURES = ['Unlimited takes & recordings', 'Unlimited meeting capture', 'AI transcripts, notes & Ask', 'Follow-my-voice prompting', 'Desktop overlay for meetings', 'Cloud sync across devices'];

function UpgradeScreen({ app }) {
  const pd = useData();
  const [plan, setPlan] = React.useState('year');
  const [busy, setBusy] = React.useState(false);
  async function buy() { setBusy(true); const r = await pd.svc.checkout('studio_pro', plan === 'year' ? 'yearly' : 'monthly'); setBusy(false); if (!r.ok) app.toast(r.msg || 'Payments pending'); }
  return (
    <Screen>
      <NavHeader onBack={app.back} title="Studio Pro" />
      <ScrollArea padBottom={150}>
        <div style={{ padding: '4px 24px 0', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto', background: 'linear-gradient(135deg, var(--blue-500), var(--violet-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-accent)' }}><Icon name="zap" size={30} color="#fff" /></div>
          <h1 style={{ margin: '16px 0 0', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>PromptDrop Studio Pro</h1>
          <p style={{ margin: '8px 0 0', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5 }}>Everything you need to look your best on camera, every time.</p>
        </div>
        <div style={{ padding: '22px 24px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {PRO_FEATURES.map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--blue-tint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name="check" size={14} color="var(--accent-primary)" /></div>
              <span style={{ fontSize: 15, color: 'var(--text-primary)' }}>{f}</span>
            </div>
          ))}
        </div>
        <div style={{ padding: '24px 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[['year', 'Yearly', '$95 / year', 'Best value'], ['month', 'Monthly', '$9 / month', null]].map(([id, t, price, n]) => (
            <button key={id} className="pd-tap" onClick={() => setPlan(id)} style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 16, background: 'var(--surface-elevated)', border: `1.5px solid ${plan === id ? 'var(--accent-primary)' : 'var(--border-default)'}`, boxShadow: plan === id ? '0 0 0 3px var(--blue-tint)' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: 999, border: `2px solid ${plan === id ? 'var(--accent-primary)' : 'var(--border-strong)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{plan === id && <span style={{ width: 11, height: 11, borderRadius: 999, background: 'var(--accent-primary)' }} />}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 15.5, fontWeight: 700, color: 'var(--text-primary)' }}>{t}</div>{n && <div style={{ fontSize: 12.5, color: 'var(--success)' }}>{n}</div>}</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{price}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 24px calc(14px + env(safe-area-inset-bottom, 22px))', background: 'linear-gradient(transparent, var(--bg-primary) 30%)' }}>
        <DSa.Button variant="launch" size="lg" fullWidth onClick={buy}>{busy ? 'Opening checkout…' : `Upgrade, ${plan === 'year' ? '$95/yr' : '$9/mo'}`}</DSa.Button>
        <p style={{ textAlign: 'center', margin: '10px 0 0', fontSize: 11.5, color: 'var(--text-muted)' }}>Cancel anytime. Renews automatically.</p>
      </div>
    </Screen>
  );
}

Object.assign(window, { OnboardingScreen, AccountScreen, UpgradeScreen });
