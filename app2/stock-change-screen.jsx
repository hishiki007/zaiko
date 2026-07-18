const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

const MODE_STYLE = {
  in: { bg: '#dcfce7', color: 'var(--color-success)', border: 'var(--color-success)', label: '入庫数量' },
  out: { bg: '#fff', color: 'var(--color-text)', border: 'var(--color-danger)', label: '出庫数量' },
  set: { bg: '#fff', color: 'var(--color-text)', border: 'var(--color-primary)', label: '在庫数（直接指定）' },
};

function StockChangeScreen() {
  const key = new URLSearchParams(window.location.search).get('key');
  const locParam = new URLSearchParams(window.location.search).get('loc');
  const [part, setPart] = React.useState(null);
  const [mode, setMode] = React.useState('in');
  const [loc, setLoc] = React.useState(locParam || window.ZaikoDB.getOperator());
  const [qty, setQty] = React.useState(1);
  const [saving, setSaving] = React.useState(false);
  const connected = window.ZaikoDB.isReady();

  React.useEffect(() => {
    if (!key) return;
    let unsub = () => {};
    window.ZaikoDB.subscribePart(key, (p) => { if (p) setPart(p); }).then((u) => { unsub = u; });
    return () => unsub();
  }, [key]);

  if (!part) {
    return (
      <div style={{
        fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
        height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
      }}>
        <Header connected={connected} title="在庫変更" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          <window.PartSearch onSelect={setPart} />
        </div>
      </div>
    );
  }
  const cur = part.locs[loc] || 0;
  const next = mode === 'in' ? cur + qty : mode === 'out' ? cur - qty : qty;

  function selectMode(m) {
    setMode(m);
    setQty(m === 'set' ? cur : 1);
  }

  async function confirm() {
    setSaving(true);
    if (key && connected) { await window.ZaikoDB.adjustStock(key, part.name, loc, mode, qty); }
    window.location.href = key ? `部品詳細画面.html?key=${encodeURIComponent(key)}` : '部品詳細画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="在庫変更" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padding={12}>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{part.no}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{part.name}</div>
        </Card>

        <Field label="保管場所" as="select" options={LOCS} value={loc} onChange={(e) => setLoc(e.target.value)} />

        <div style={{ display: 'flex', gap: 8 }}>
          {['in', 'out', 'set'].map((m) => (
            <button key={m} onClick={() => selectMode(m)} style={{
              flex: 1, height: 48, borderRadius: 'var(--radius-lg)', fontWeight: 700, fontSize: 'var(--text-sm)',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              background: mode === m ? MODE_STYLE[m].bg : '#fff',
              color: mode === m ? MODE_STYLE[m].color : 'var(--color-text)',
              border: `2px solid ${mode === m ? MODE_STYLE[m].border : 'var(--color-border)'}`,
            }}>{m === 'in' ? '📥 入庫 ＋' : m === 'out' ? '📤 出庫 −' : '✏️ 直接指定'}</button>
          ))}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
            {MODE_STYLE[mode].label}
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setQty((q) => Math.max(0, q - 1))} style={{
              width: 56, height: 56, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              background: 'var(--color-surface)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer',
            }}>−</button>
            <input
              type="number" value={qty} onChange={(e) => setQty(Math.max(0, Number(e.target.value) || 0))}
              style={{
                flex: 1, height: 56, textAlign: 'center', fontSize: 'var(--text-2xl)', fontWeight: 700,
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text)',
                background: '#fff', fontFamily: 'var(--font-sans)', boxSizing: 'border-box',
              }}
            />
            <button onClick={() => setQty((q) => q + 1)} style={{
              width: 56, height: 56, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              background: 'var(--color-surface)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer',
            }}>＋</button>
          </div>
        </div>

        <Card padding={12} style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)' }}>{loc}: </span>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{cur}</span>
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--color-text-muted)' }}> → </span>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{next}</span>
        </Card>
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="primary" disabled={saving} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)' }} onClick={confirm}>
          {saving ? '処理中…' : 'この内容で確定する'}
        </Button>
      </div>
    </div>
  );
}

window.StockChangeScreen = StockChangeScreen;
