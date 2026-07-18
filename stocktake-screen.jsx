const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function StocktakeScreen() {
  const [loc, setLoc] = React.useState(window.ZaikoDB.getOperator());
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());
  const [parts, setParts] = React.useState([]);
  const [counts, setCounts] = React.useState({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setParts(Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    setCounts(Object.fromEntries(parts.map((p) => [p.key || p.no, String(p.locs[loc] || 0)])));
  }, [loc, parts]);

  const diffs = parts.map((p) => ({ p, before: p.locs[loc] || 0, after: Number(counts[p.key || p.no]) || 0 }))
    .filter((d) => d.before !== d.after);

  function update(id, val) {
    setCounts((prev) => ({ ...prev, [id]: val }));
  }

  async function apply() {
    setSaving(true);
    if (connected) {
      for (const d of diffs) {
        if (d.p.key) { await window.ZaikoDB.adjustStock(d.p.key, d.p.name, loc, 'set', d.after); }
      }
    }
    window.location.href = '在庫管理 ホーム画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="棚卸し" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ padding: '10px 16px 0' }}>
        <select value={loc} onChange={(e) => setLoc(e.target.value)} style={{
          width: '100%', height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
          padding: '0 12px', fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-sans)',
          color: 'var(--color-text)', background: '#fff', boxSizing: 'border-box',
        }}>
          {LOCS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          {loc} の実数を入力
        </div>
        {parts.map((p) => {
          const id = p.key || p.no;
          const before = p.locs[loc] || 0;
          const after = Number(counts[id]) || 0;
          const changed = before !== after;
          return (
            <Card key={id} padding={12} style={changed ? { border: '1px solid var(--color-warning)', background: '#fff7ed' } : {}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{p.no}</div>
                  <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>システム上: {before}</div>
                </div>
                <input
                  type="number" value={counts[id]} onChange={(e) => update(id, e.target.value)}
                  style={{
                    width: 64, height: 44, textAlign: 'center', fontSize: 'var(--text-lg)', fontWeight: 700,
                    borderRadius: 'var(--radius-md)', border: `1px solid ${changed ? 'var(--color-warning)' : 'var(--color-border)'}`,
                    color: 'var(--color-text)', fontFamily: 'var(--font-sans)', background: '#fff', flexShrink: 0,
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="primary" disabled={diffs.length === 0 || saving} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: diffs.length ? 1 : 0.5 }}
          onClick={() => { if (diffs.length) apply(); }}>
          {saving ? '反映中…' : diffs.length > 0 ? `${diffs.length}件の差分を反映する` : '差分はありません'}
        </Button>
      </div>
    </div>
  );
}

window.StocktakeScreen = StocktakeScreen;
