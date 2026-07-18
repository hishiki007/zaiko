const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function AddPartScreen() {
  const [no, setNo] = React.useState('');
  const [name, setName] = React.useState('');
  const [qty, setQty] = React.useState(() => Object.fromEntries(LOCS.map((l) => [l, ''])));
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const connected = window.ZaikoDB.isReady();

  function updateQty(loc, val) {
    setQty((prev) => ({ ...prev, [loc]: val }));
  }

  async function save() {
    if (!name.trim()) { setError('部品名は必須です'); return; }
    setError(''); setSaving(true);
    const locs = Object.fromEntries(LOCS.map((l) => [l, Number(qty[l]) || 0]));
    try {
      if (connected) {
        await window.ZaikoDB.addPart({ no, name, locs });
      }
      window.location.href = '設定・管理画面.html';
    } catch (e) {
      setError('保存に失敗しました: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="部品を追加" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {!connected && (
          <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 'var(--text-xs)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '8px 12px', marginBottom: 8 }}>
            ⚠️ Firebase未接続のため、この保存は反映されません
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="部品番号" value={no} onChange={(e) => setNo(e.target.value)} placeholder="例: P-001" />
          <Field label="部品名 *" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: ボルト M6" />
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', margin: '8px 0 10px' }}>
          各保管場所の初期数量
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {LOCS.map((l) => (
            <Field key={l} label={l} type="number" value={qty[l]} onChange={(e) => updateQty(l, e.target.value)} placeholder="0" />
          ))}
        </div>

        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 4 }}>{error}</div>}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10,
      }}>
        <Button variant="outline" style={{ flex: 1, height: 54 }} onClick={() => { window.location.href = '設定・管理画面.html'; }}>キャンセル</Button>
        <Button variant="primary" disabled={saving} style={{ flex: 1, height: 54, fontSize: 'var(--text-md)' }} onClick={save}>{saving ? '保存中…' : '保存'}</Button>
      </div>
    </div>
  );
}

window.AddPartScreen = AddPartScreen;
