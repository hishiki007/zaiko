const { Header, Card, Button, Toast } = window.MelittaZaikoDesignSystem_3f29a9;

function loadScanItems() {
  try {
    const saved = JSON.parse(localStorage.getItem('deliverySlipItems'));
    return saved && saved.length ? saved : [
      { no: '', name: 'A600バルブユニット', qty: 3 },
      { no: '', name: 'パッキン一式', qty: 10 },
      { no: '', name: 'クリーニングタブレット', qty: 2 },
    ];
  } catch (e) {
    return [];
  }
}

function ScanResultEditScreen() {
  const [rawItems] = React.useState(loadScanItems);
  const [allParts, setAllParts] = React.useState([]);
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());
  const [items, setItems] = React.useState(null);
  const [toast, setToast] = React.useState('');
  const [applying, setApplying] = React.useState(false);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      const list = data ? Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name })) : [];
      setAllParts(list);
      setItems(rawItems.map((it, idx) => {
        const match = (it.no && list.find((p) => p.no === it.no)) || list.find((p) => p.name === it.name);
        return { id: idx, name: it.name, no: match ? match.no : (it.no || ''), qty: it.qty, matched: !!match, key: match ? match.key : null, checked: true };
      }));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  if (!items) return null;

  function toggle(id) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it)));
  }
  function updateQty(id, qty) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, qty } : it)));
  }
  function updateName(id, name) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, name } : it)));
  }

  const checkedCount = items.filter((i) => i.checked).length;

  async function apply() {
    setApplying(true);
    if (connected) {
      for (const it of items) {
        if (!it.checked || it.qty <= 0) continue;
        if (it.matched && it.key) {
          await window.ZaikoDB.adjustStock(it.key, it.name, 'シンワ倉庫', 'in', it.qty);
        } else {
          await window.ZaikoDB.addPart({ no: '', name: it.name, locs: { 'シンワ倉庫': it.qty } });
        }
      }
    }
    localStorage.removeItem('deliverySlipItems');
    setApplying(false);
    setToast(`✅ ${checkedCount}件を入庫しました`);
    setTimeout(() => { window.location.href = '在庫管理 ホーム画面.html'; }, 900);
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="スキャン結果を編集" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          緑＝既存部品と一致、赤＝未登録の部品です。取り込む項目にチェックを入れてください。
        </div>
        {!connected && (
          <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 'var(--text-xs)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
            ⚠️ Firebase未接続のため入庫は反映されません
          </div>
        )}

        {items.map((it) => (
          <Card key={it.id} padding={12} style={{
            border: `1px solid ${it.matched ? '#86efac' : '#fca5a5'}`,
            background: it.matched ? '#f0fdf4' : '#fef2f2',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" checked={it.checked} onChange={() => toggle(it.id)} style={{ width: 20, height: 20, flexShrink: 0, cursor: 'pointer' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                {it.matched ? (
                  <React.Fragment>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{it.name}</div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{it.no}</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <input value={it.name} onChange={(e) => updateName(it.id, e.target.value)} style={{
                      width: '100%', height: 34, fontSize: 'var(--text-sm)', fontWeight: 700, border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)', padding: '0 8px', fontFamily: 'var(--font-sans)', background: '#fff', color: 'var(--color-text)', boxSizing: 'border-box',
                    }} />
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-danger)', fontWeight: 700, marginTop: 3 }}>⚠️ 未登録・新規部品として追加</div>
                  </React.Fragment>
                )}
              </div>
              <input
                type="number" value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value))}
                style={{
                  width: 56, height: 40, textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700,
                  borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-success)',
                  fontFamily: 'var(--font-sans)', background: '#fff', flexShrink: 0,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="success" disabled={checkedCount === 0 || applying} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: checkedCount ? 1 : 0.5 }} onClick={apply}>
          {applying ? '処理中…' : `チェックした${checkedCount}件を入庫する`}
        </Button>
      </div>

      <Toast show={!!toast}>{toast}</Toast>
    </div>
  );
}

window.ScanResultEditScreen = ScanResultEditScreen;
