const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function TransferScreen() {
  const key = new URLSearchParams(window.location.search).get('key');
  const fromParam = new URLSearchParams(window.location.search).get('from');
  const [part, setPart] = React.useState(null);
  const [from, setFrom] = React.useState(fromParam || 'シンワ倉庫');
  const [to, setTo] = React.useState(window.ZaikoDB.getOperator() === 'シンワ倉庫' ? '' : window.ZaikoDB.getOperator());
  const [qty, setQty] = React.useState(1);
  const [error, setError] = React.useState('');
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
        <Header connected={connected} title="拠点間移動" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          <window.PartSearch onSelect={setPart} />
        </div>
      </div>
    );
  }
  const fq = from ? (part.locs[from] || 0) : null;
  const tq = to ? (part.locs[to] || 0) : null;
  const ready = from && to && from !== to && qty > 0;

  async function confirm() {
    if (!from || !to) { setError('移動元と移動先を選択してください'); return; }
    if (from === to) { setError('移動元と移動先が同じです'); return; }
    if (qty <= 0) { setError('数量を入力してください'); return; }
    if (qty > fq) { setError('移動元の在庫数が不足しています'); return; }
    setError(''); setSaving(true);
    try {
      if (key && connected) { await window.ZaikoDB.transferPart(key, part.name, from, to, qty); }
      window.location.href = key ? `部品詳細画面.html?key=${encodeURIComponent(key)}` : '部品詳細画面.html';
    } catch (e) {
      setError(e.message); setSaving(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="拠点間移動" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card padding={12}>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{part.no}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{part.name}</div>
        </Card>

        <Field label="移動元" as="select" options={['', ...LOCS]} value={from} onChange={(e) => { setFrom(e.target.value); setError(''); }} />
        <Field label="移動先" as="select" options={['', ...LOCS]} value={to} onChange={(e) => { setTo(e.target.value); setError(''); }} />

        <div>
          <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>移動数量</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{
              width: 56, height: 56, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              background: 'var(--color-surface)', fontSize: 24, fontWeight: 700, color: 'var(--color-text)', cursor: 'pointer',
            }}>−</button>
            <input
              type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
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

        <Card padding={14} style={{ textAlign: 'center', border: '2px solid var(--color-warning)', background: '#fff7ed' }}>
          {ready ? (
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>
              {from}（{fq} → {fq - qty}）　↔　{to}（{tq} → {tq + qty}）
            </div>
          ) : (
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>移動元と移動先を選択してください</div>
          )}
        </Card>

        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600, textAlign: 'center' }}>{error}</div>}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10,
      }}>
        <Button variant="outline" style={{ flex: 1, height: 54 }} onClick={() => { window.location.href = '部品詳細画面.html'; }}>キャンセル</Button>
        <Button disabled={saving} style={{
          flex: 1, height: 54, fontSize: 'var(--text-md)', fontWeight: 700, border: 'none', cursor: 'pointer',
          borderRadius: 'var(--radius-lg)', color: '#fff', fontFamily: 'var(--font-sans)', background: 'var(--color-warning)',
        }} onClick={confirm}>{saving ? '処理中…' : '↔ 移動を確定'}</Button>
      </div>
    </div>
  );
}

window.TransferScreen = TransferScreen;
