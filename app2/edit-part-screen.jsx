const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function EditPartScreen() {
  const key = new URLSearchParams(window.location.search).get('key');
  const [part, setPart] = React.useState(null);
  const [no, setNo] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const connected = window.ZaikoDB.isReady();

  React.useEffect(() => {
    if (!key) return;
    let unsub = () => {};
    window.ZaikoDB.subscribePart(key, (p) => { if (p) { setPart(p); setNo(p.no || ''); setName(p.name); } }).then((u) => { unsub = u; });
    return () => unsub();
  }, [key]);

  if (!part) {
    return (
      <div style={{
        fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
        height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
      }}>
        <Header connected={connected} title="部品を編集" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16 }}>
          <window.PartSearch onSelect={(p) => { window.location.href = `部品編集画面.html?key=${encodeURIComponent(p.key)}`; }} />
        </div>
      </div>
    );
  }

  async function save() {
    if (!name.trim()) { setError('部品名は必須です'); return; }
    setError('');
    if (key && connected) { await window.ZaikoDB.updatePart(key, { no, name }); }
    window.location.href = key ? `部品詳細画面.html?key=${encodeURIComponent(key)}` : '部品詳細画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="部品を編集" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="部品番号" value={no} onChange={(e) => setNo(e.target.value)} placeholder="例: P-001" />
          <Field label="部品名 *" value={name} onChange={(e) => setName(e.target.value)} placeholder="例: ボルト M6" />
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', margin: '8px 0 10px' }}>
          ※ 在庫数の変更は「在庫変更」ボタンから
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {LOCS.map((l) => (
            <div key={l}>
              <label style={{ display: 'block', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{l}</label>
              <input
                type="number" value={part.locs[l] || 0} disabled
                style={{
                  width: '100%', height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                  background: 'var(--color-surface-sunken)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-md)', textAlign: 'center', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600, marginTop: 4 }}>{error}</div>}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10,
      }}>
        <Button variant="outline" style={{ flex: 1, height: 54 }} onClick={() => { window.location.href = '部品詳細画面.html'; }}>キャンセル</Button>
        <Button variant="primary" style={{ flex: 1, height: 54, fontSize: 'var(--text-md)' }} onClick={save}>保存</Button>
      </div>
    </div>
  );
}

window.EditPartScreen = EditPartScreen;
