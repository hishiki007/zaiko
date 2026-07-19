const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

function emptyRow() { return { no: '', name: '', qty: 1 }; }

function InspMasterScreen() {
  const [templates, setTemplates] = React.useState(window.InspData.loadTemplates);
  const [showForm, setShowForm] = React.useState(false);
  const [machine, setMachine] = React.useState('');
  const [inspType, setInspType] = React.useState('');
  const [rows, setRows] = React.useState([emptyRow()]);
  const [error, setError] = React.useState('');

  function openAdd() {
    setMachine(''); setInspType(''); setRows([emptyRow()]); setError(''); setShowForm(true);
  }

  function updateRow(i, patch) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() { setRows((prev) => [...prev, emptyRow()]); }
  function removeRow(i) { setRows((prev) => prev.filter((_, idx) => idx !== i)); }

  function save() {
    if (!machine.trim() || !inspType.trim()) { setError('機種名と点検種別を入力してください'); return; }
    const partsArr = rows.filter((r) => r.no.trim() || r.name.trim()).map((r) => ({ no: r.no.trim(), name: r.name.trim(), qty: Number(r.qty) || 1 }));
    if (partsArr.length === 0) { setError('部品を1つ以上追加してください'); return; }
    setTemplates((prev) => {
      const next = [...prev, { id: Date.now(), machine: machine.trim(), inspType: inspType.trim(), parts: partsArr }];
      window.InspData.persistTemplates(next);
      return next;
    });
    setShowForm(false);
  }

  function del(id) {
    setTemplates((prev) => {
      const next = prev.filter((t) => t.id !== id);
      window.InspData.persistTemplates(next);
      return next;
    });
  }

  function resetAll() {
    window.InspData.resetTemplates();
    setTemplates(window.InspData.loadTemplates());
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="点検マスタ編集" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" style={{ flex: 1, height: 48 }} onClick={openAdd}>＋ テンプレートを追加</Button>
          <Button variant="outline" style={{ height: 48 }} onClick={resetAll}>初期データに戻す</Button>
        </div>

        {showForm && (
          <Card style={{ background: 'var(--color-bg)' }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>新規テンプレート</div>
            <Field label="機種名" value={machine} onChange={(e) => setMachine(e.target.value)} placeholder="例: ブラック機" />
            <Field label="点検種別" value={inspType} onChange={(e) => setInspType(e.target.value)} placeholder="例: 2年半点検" />
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 6 }}>使用部品リスト（部品番号を推奨、名称のみでも可）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
              {rows.map((r, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <input placeholder="部品番号（例: 27313）" value={r.no} onChange={(e) => updateRow(i, { no: e.target.value })}
                    style={{ flex: 1, minWidth: 90, height: 38, fontSize: 'var(--text-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 8px', fontFamily: 'var(--font-mono)' }} />
                  <input placeholder="部品名（任意）" value={r.name} onChange={(e) => updateRow(i, { name: e.target.value })}
                    style={{ flex: 1, minWidth: 90, height: 38, fontSize: 'var(--text-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 8px', fontFamily: 'var(--font-sans)' }} />
                  <input placeholder="数量" type="number" value={r.qty} onChange={(e) => updateRow(i, { qty: e.target.value })}
                    style={{ width: 60, height: 38, fontSize: 'var(--text-sm)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 8px', fontFamily: 'var(--font-sans)' }} />
                  <button onClick={() => removeRow(i)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 16, cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" style={{ marginBottom: 10 }} onClick={addRow}>＋ 部品行を追加</Button>
            {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary" style={{ flex: 1 }} onClick={save}>保存</Button>
              <Button variant="outline" style={{ flex: 1 }} onClick={() => setShowForm(false)}>キャンセル</Button>
            </div>
          </Card>
        )}

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          テンプレート一覧
        </div>
        {templates.length === 0 && (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', padding: '10px 0' }}>テンプレートがまだありません</div>
        )}
        {templates.map((t) => (
          <Card key={t.id} padding={12}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontWeight: 700 }}>{t.machine} ／ {t.inspType}</div>
              <Button variant="outline" size="sm" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} onClick={() => del(t.id)}>削除</Button>
            </div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>
              {t.parts.map((p, i) => (
                <span key={i}>{p.no || p.name}×{p.qty}{p.altNo ? `（${p.altNo}と選択）` : ''}{i < t.parts.length - 1 ? '　' : ''}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

window.InspMasterScreen = InspMasterScreen;
