const { Header, Card, Button, Toast } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function today() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function CSVExportScreen() {
  const [toast, setToast] = React.useState('');
  const [parts, setParts] = React.useState(null);
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setParts(Object.values(data).map((p) => ({ no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  const list = parts || [];
  const counts = Object.fromEntries(LOCS.map((l) => [l, list.reduce((s, p) => s + (p.locs[l] || 0), 0)]));
  const total = Object.values(counts).reduce((s, n) => s + n, 0);

  function doExport() {
    const header = ['部品名', '部品番号', ...LOCS];
    const rows = list.map((p) => [p.name, p.no, ...LOCS.map((l) => p.locs[l] || 0)]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `部品在庫_${today()}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast('📄 CSVをダウンロードしました');
    setTimeout(() => setToast(''), 2200);
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="CSVエクスポート" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!connected && (
          <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 'var(--text-xs)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
            ⚠️ Firebase未接続のため出力内容は空になります
          </div>
        )}
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          出力内容（{list.length}部品種）
        </div>
        <Card padding={0}>
          {LOCS.map((l, i) => (
            <div key={l} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
              borderBottom: i < LOCS.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{l}</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{counts[l]}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--color-bg)' }}>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>合計</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{total}</span>
          </div>
        </Card>

        <Card padding={14}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>ファイル名</div>
          <div style={{ fontSize: 'var(--text-md)', fontFamily: 'var(--font-mono)' }}>部品在庫_{today()}.csv</div>
        </Card>
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="outline" disabled={!connected || list.length === 0} style={{ width: '100%', height: 54, fontSize: 'var(--text-md)' }} onClick={doExport}>
          📄 CSVをダウンロードする
        </Button>
      </div>

      <Toast show={!!toast}>{toast}</Toast>
    </div>
  );
}

window.CSVExportScreen = CSVExportScreen;
