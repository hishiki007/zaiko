const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function LocationsScreen() {
  const [parts, setParts] = React.useState([]);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setParts(Object.values(data).map((p) => ({ locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  const stats = Object.fromEntries(LOCS.map((l) => [l, {
    parts: parts.filter((p) => (p.locs[l] || 0) !== 0).length,
    total: parts.reduce((s, p) => s + (p.locs[l] || 0), 0),
  }]));

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="拠点一覧" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 'var(--radius-md)',
          padding: 12, fontSize: 'var(--text-sm)', color: '#92400e',
        }}>
          拠点は5つで固定されています。追加・削除・名称変更はできません。
        </div>

        <button onClick={() => { window.location.href = '拠点別ダッシュボード画面.html'; }} style={{
          alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-primary)',
          fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
        }}>📊 拠点別ダッシュボードを見る →</button>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          拠点
        </div>
        <Card padding={0}>
          {LOCS.map((l, i) => (
            <div key={l} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '13px 14px',
              borderBottom: i < LOCS.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span style={{ fontSize: 20, width: 24, textAlign: 'center' }}>📍</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{l}</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>{stats[l].parts} 部品種</div>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{stats[l].total}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

window.LocationsScreen = LocationsScreen;
