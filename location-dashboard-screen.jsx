const { Header, Card, Badge, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function LocationDashboardScreen() {
  const [loc, setLoc] = React.useState(LOCS[0]);
  const [parts, setParts] = React.useState([]);
  const [history, setHistory] = React.useState([]);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    let unsub1 = () => {}, unsub2 = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setParts(Object.values(data).map((p) => ({ no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub1 = u; });
    window.ZaikoDB.subscribeHistory((all) => setHistory(all), 500).then((u) => { unsub2 = u; });
    return () => { unsub1(); unsub2(); };
  }, []);

  const partsAtLoc = parts.filter((p) => (p.locs[loc] || 0) !== 0);
  const total = partsAtLoc.reduce((s, p) => s + (p.locs[loc] || 0), 0);
  const zero = parts.filter((p) => (p.locs[loc] || 0) === 0).length;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayOps = history.filter((h) => h.operator === loc && h.time >= todayStart.getTime()).length;
  const low = parts.filter((p) => { const q = p.locs[loc] || 0; return q > 0 && q <= 2; }).map((p) => p.name);
  const s = { parts: partsAtLoc.length, total, zero, todayOps };

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="拠点別ダッシュボード" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px', WebkitOverflowScrolling: 'touch' }}>
        {LOCS.map((l) => (
          <button key={l} onClick={() => setLoc(l)} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 'var(--radius-pill)',
            border: `2px solid ${loc === l ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: loc === l ? 'var(--color-primary)' : 'var(--color-surface)',
            color: loc === l ? '#fff' : 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{l}</button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Card padding={14}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>部品種数</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.parts}</div>
          </Card>
          <Card padding={14}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>合計在庫数</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.total}</div>
          </Card>
          <Card padding={14}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>ゼロ在庫</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.zero > 0 ? 'var(--color-danger)' : 'var(--color-text)' }}>{s.zero}</div>
          </Card>
          <Card padding={14}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>本日の操作</div>
            <div style={{ fontSize: 26, fontWeight: 700 }}>{s.todayOps}</div>
          </Card>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          在庫が少ない部品
        </div>
        {low.length === 0 ? (
          <Card padding={14} style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
            対象の部品はありません
          </Card>
        ) : (
          <Card padding={0}>
            {low.map((name, i) => (
              <div key={name} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
                borderBottom: i < low.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}>
                <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{name}</span>
                <Badge kind="warning">要確認</Badge>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}

window.LocationDashboardScreen = LocationDashboardScreen;
