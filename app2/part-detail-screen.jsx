const { Header, Card, Button, Badge, HistoryItem, Modal } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function PartDetailScreen() {
  const key = new URLSearchParams(window.location.search).get('key');
  const [part, setPart] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (!key) return;
    let unsub1 = () => {}, unsub2 = () => {};
    window.ZaikoDB.subscribePart(key, (p) => { setConnected(window.ZaikoDB.isReady()); if (p) setPart({ ...p, locs: p.locs || {} }); }).then((u) => { unsub1 = u; });
    window.ZaikoDB.subscribeHistory((all) => setHistory(all.filter((h) => h.key === key).slice(0, 10))).then((u) => { unsub2 = u; });
    return () => { unsub1(); unsub2(); };
  }, [key]);

  if (!part) {
    return (
      <div style={{
        fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
        height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
      }}>
        <Header connected={connected} title="部品詳細" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          <window.PartSearch onSelect={(p) => { window.location.href = `部品詳細画面.html?key=${encodeURIComponent(p.key)}`; }} />
        </div>
      </div>
    );
  }
  const total = LOCS.reduce((s, l) => s + (part.locs[l] || 0), 0);

  async function del() {
    setConfirmOpen(false);
    if (key) { await window.ZaikoDB.deletePart(key, part.name); }
    window.location.href = '部品一覧画面.html';
  }

  const qs = key ? `?key=${encodeURIComponent(key)}` : '';

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="部品詳細" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 72, height: 72, flexShrink: 0, borderRadius: 'var(--radius-lg)',
            border: part.photo ? 'none' : '2px dashed var(--color-border)', background: 'var(--color-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
          }} onClick={() => { window.location.href = `写真アップロード画面.html${qs}`; }}>
            {part.photo ? <img src={part.photo} alt={part.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 24 }}>📷</span>}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{part.no}</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{part.name}</div>
            <div style={{ marginTop: 4, fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-muted)' }}>合計 {total}個</div>
          </div>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          拠点別の在庫
        </div>
        <Card padding={0}>
          {LOCS.map((l, i) => (
            <div key={l} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px',
              borderBottom: i < LOCS.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{l}</span>
              <span style={{
                fontSize: 15, fontWeight: 700,
                color: (part.locs[l] || 0) === 0 ? 'var(--color-text-faint)' : 'var(--color-text)',
              }}>{part.locs[l] || 0}</span>
            </div>
          ))}
        </Card>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" style={{ flex: 1, height: 52 }} onClick={() => { window.location.href = `在庫変更画面.html${qs}`; }}>在庫変更</Button>
          <Button variant="warning" style={{ flex: 1, height: 52 }} onClick={() => { window.location.href = `拠点間移動画面.html${qs}`; }}>↔ 移動</Button>
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          この部品の履歴
        </div>
        <Card padding={8}>
          {history.length > 0 ? history.map((h, i) => <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />) : (
            <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>履歴はありません</div>
          )}
        </Card>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" style={{ flex: 1, height: 48 }} onClick={() => { window.location.href = `部品編集画面.html${qs}`; }}>編集</Button>
          <Button style={{
            flex: 1, height: 48, border: '1px solid var(--color-border)', background: '#fff',
            color: 'var(--color-danger)', borderRadius: 'var(--radius-lg)', fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: 'pointer',
          }} onClick={() => setConfirmOpen(true)}>削除</Button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="部品を削除しますか？"
        footer={<React.Fragment>
          <Button variant="outline" onClick={() => setConfirmOpen(false)}>キャンセル</Button>
          <Button style={{
            border: 'none', background: 'var(--color-danger)', color: '#fff', borderRadius: 'var(--radius-lg)',
            fontFamily: 'var(--font-sans)', fontWeight: 700, cursor: 'pointer', padding: '0 20px', height: 44,
          }} onClick={del}>削除する</Button>
        </React.Fragment>}
      >
        <div style={{ fontSize: 'var(--text-md)' }}>
          「{part.name}」を削除しますか？<br />この操作は取り消せません。
        </div>
      </Modal>
    </div>
  );
}

window.PartDetailScreen = PartDetailScreen;
