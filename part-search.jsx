function PartSearch({ onSelect }) {
  const { Card } = window.MelittaZaikoDesignSystem_3f29a9;
  const [q, setQ] = React.useState('');
  const [allParts, setAllParts] = React.useState([]);
  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      if (data) setAllParts(Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name, locs: p.locs || {} })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);
  const results = q.trim() ? allParts.filter((p) => p.name.includes(q) || p.no.includes(q)).slice(0, 30) : [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        value={q} onChange={(e) => setQ(e.target.value)} placeholder="部品名・型番で検索"
        style={{
          height: 48, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
          padding: '0 14px', fontSize: 'var(--text-md)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff',
        }}
      />
      {q.trim() && (
        <Card padding={0}>
          {results.length === 0 && <div style={{ padding: 14, fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>一致する部品がありません</div>}
          {results.map((p, i) => (
            <button key={p.key} onClick={() => onSelect(p)} style={{
              width: '100%', textAlign: 'left', display: 'block', padding: '12px 14px', background: 'none', border: 'none',
              borderBottom: i < results.length - 1 ? '1px solid var(--color-border)' : 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
            }}>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{p.no}</div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text)' }}>{p.name}</div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}

window.PartSearch = PartSearch;
