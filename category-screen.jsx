const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

const INIT_CATEGORIES = [
  { id: 1, name: 'バルブ・弁類', count: 4 },
  { id: 2, name: 'パッキン・シール', count: 6 },
  { id: 3, name: 'フィルター部品', count: 3 },
  { id: 4, name: '電装・センサー', count: 2 },
];

function CategoryScreen() {
  const [categories, setCategories] = React.useState(INIT_CATEGORIES);
  const [adding, setAdding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [editId, setEditId] = React.useState(null);
  const [editName, setEditName] = React.useState('');

  function add() {
    if (!name.trim()) return;
    setCategories((prev) => [...prev, { id: Date.now(), name: name.trim(), count: 0 }]);
    setName(''); setAdding(false);
  }

  function startEdit(c) { setEditId(c.id); setEditName(c.name); }
  function saveEdit() {
    setCategories((prev) => prev.map((c) => (c.id === editId ? { ...c, name: editName.trim() || c.name } : c)));
    setEditId(null);
  }

  function del(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="部品カテゴリ管理" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Button variant="primary" style={{ height: 48 }} onClick={() => setAdding((v) => !v)}>＋ カテゴリを追加</Button>

        {adding && (
          <Card style={{ background: 'var(--color-bg)' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="例: ホース・チューブ" style={{
                flex: 1, height: 44, border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                padding: '0 10px', fontSize: 'var(--text-md)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff',
              }} />
              <Button variant="primary" onClick={add}>追加</Button>
            </div>
          </Card>
        )}

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          カテゴリ一覧
        </div>
        <Card padding={0}>
          {categories.map((c, i) => (
            <div key={c.id} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
              borderBottom: i < categories.length - 1 ? '1px solid var(--color-border)' : 'none',
            }}>
              {editId === c.id ? (
                <React.Fragment>
                  <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); }} style={{
                    flex: 1, height: 38, border: '2px solid var(--color-primary)', borderRadius: 'var(--radius-md)',
                    padding: '0 8px', fontSize: 'var(--text-md)', fontWeight: 700, fontFamily: 'var(--font-sans)', color: 'var(--color-text)',
                  }} />
                  <button onClick={saveEdit} style={{
                    width: 38, height: 38, borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-success)',
                    color: '#fff', fontWeight: 700, cursor: 'pointer',
                  }}>✓</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>{c.count}件の部品</div>
                  </div>
                  <button onClick={() => startEdit(c)} style={{
                    width: 38, height: 38, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                    background: '#fff', color: 'var(--color-text)', fontSize: 15, cursor: 'pointer',
                  }}>✎</button>
                  <button onClick={() => del(c.id)} style={{
                    width: 38, height: 38, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                    background: '#fff', color: 'var(--color-danger)', fontSize: 15, cursor: 'pointer',
                  }}>✕</button>
                </React.Fragment>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

window.CategoryScreen = CategoryScreen;
