const { Header, Card, Field, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;
const MOCK_PARTS = [
  { key: null, no: 'M-6003', name: 'A600バルブユニット', locs: { 'シンワ倉庫': 8, 'アラン': 2, 'ゆーや': 0, 'しゅん': 1, 'たくや': 0 } },
  { key: null, no: 'P-1102', name: 'パッキン一式', locs: { 'シンワ倉庫': 20, 'アラン': 4, 'ゆーや': 3, 'しゅん': 0, 'たくや': 2 } },
  { key: null, no: 'D-4400', name: 'ドリップトレイ', locs: { 'シンワ倉庫': 6, 'アラン': 0, 'ゆーや': 1, 'しゅん': 0, 'たくや': 0 } },
  { key: null, no: 'F-2201', name: 'フィルターバスケット', locs: { 'シンワ倉庫': 12, 'アラン': 1, 'ゆーや': 2, 'しゅん': 2, 'たくや': 1 } },
  { key: null, no: 'T-3300', name: 'サーモスタットSET', locs: { 'シンワ倉庫': 12, 'アラン': 0, 'ゆーや': 0, 'しゅん': 0, 'たくや': 0 } },
  { key: null, no: '27313', name: 'カバーキャップ', locs: { 'シンワ倉庫': 103, 'アラン': 22, 'ゆーや': 5, 'しゅん': 3, 'たくや': 1 } },
];

function total(locs) { return LOCS.reduce((s, l) => s + (locs[l] || 0), 0); }

function loadFilter() {
  try { return JSON.parse(localStorage.getItem('partFilter')) || {}; } catch (e) { return {}; }
}

function PartListScreen() {
  const [query, setQuery] = React.useState('');
  const [tab, setTab] = React.useState('all');
  const [live, setLive] = React.useState(null);
  const [connected, setConnected] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeParts((data) => {
      setConnected(window.ZaikoDB.isReady());
      if (data) setLive(Object.entries(data).map(([key, p]) => ({ key, no: p.no || '', name: p.name, locs: p.locs || {}, photo: p.photo || null })));
    }).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  const PARTS = live !== null ? live : MOCK_PARTS;
  const filter = loadFilter();
  const activeFilterCount = (filter.locs && filter.locs.length ? 1 : 0) + (filter.stock && filter.stock !== 'all' ? 1 : 0) + (filter.sort && filter.sort !== 'name' ? 1 : 0);

  let filtered = PARTS.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !(p.no || '').toLowerCase().includes(q)) return false;
    if (tab !== 'all' && (p.locs[tab] || 0) === 0) return false;
    if (filter.locs && filter.locs.length && !filter.locs.some((l) => (p.locs[l] || 0) > 0)) return false;
    const t = total(p.locs);
    if (filter.stock === 'has' && t === 0) return false;
    if (filter.stock === 'zero' && t > 0) return false;
    return true;
  });

  if (filter.sort === 'total_desc') filtered = [...filtered].sort((a, b) => total(b.locs) - total(a.locs));
  else if (filter.sort === 'total_asc') filtered = [...filtered].sort((a, b) => total(a.locs) - total(b.locs));
  else filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'ja'));

  const tabCounts = { all: PARTS.length, ...Object.fromEntries(LOCS.map((l) => [l, PARTS.filter((p) => (p.locs[l] || 0) > 0).length])) };

  function openPart(p) {
    window.location.href = p.key ? `部品詳細画面.html?key=${encodeURIComponent(p.key)}` : '部品詳細画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="部品一覧" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ padding: '10px 16px 0' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="search" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 部品名・部品番号で検索…"
            style={{
              flex: 1, height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              padding: '0 14px', fontSize: 'var(--text-md)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)',
              boxSizing: 'border-box', background: 'var(--color-surface)',
            }}
          />
          <button onClick={() => { window.location.href = '部品検索フィルター画面.html'; }} style={{
            position: 'relative', flexShrink: 0, width: 44, height: 44, borderRadius: 'var(--radius-lg)',
            border: `1px solid ${activeFilterCount ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: 'var(--color-surface)', fontSize: 18, cursor: 'pointer',
          }}>⚙️{activeFilterCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
              background: 'var(--color-primary)', color: '#fff', fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{activeFilterCount}</span>
          )}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 16px', WebkitOverflowScrolling: 'touch' }}>
        {['all', ...LOCS].map((l) => (
          <button key={l} onClick={() => setTab(l)} style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 'var(--radius-pill)', border: `2px solid ${tab === l ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: tab === l ? 'var(--color-primary)' : 'var(--color-surface)',
            color: tab === l ? '#fff' : 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>
            {l === 'all' ? 'すべて' : l}
            <span style={{ fontSize: 'var(--text-2xs)', opacity: 0.85 }}>{tabCounts[l]}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🔧</div>
            部品が見つかりません
          </div>
        )}
        {filtered.map((p) => (
          <Card key={p.key || p.no} padding={12} style={{ cursor: tab === 'all' ? 'default' : 'pointer' }} onClick={tab === 'all' ? undefined : () => openPart(p)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden',
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }} onClick={() => openPart(p)}>
                {p.photo ? <img src={p.photo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 16, opacity: 0.4 }}>🔧</span>}
              </div>
              <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => openPart(p)}>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{p.no}</div>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
              </div>
              {tab !== 'all' && (
                <React.Fragment>
                  <span style={{
                    fontSize: 15, fontWeight: 700, flexShrink: 0,
                    color: (p.locs[tab] || 0) === 0 ? 'var(--color-text-faint)' : 'var(--color-text)',
                  }}>{p.locs[tab] || 0}</span>
                  <span style={{ color: 'var(--color-text-muted)', flexShrink: 0 }}>›</span>
                </React.Fragment>
              )}
              {tab === 'all' && (
                <span style={{ fontSize: 15, fontWeight: 700, flexShrink: 0, color: 'var(--color-text)' }}>{total(p.locs)}</span>
              )}
            </div>
            {tab === 'all' && (
              <div style={{ marginTop: 8, borderTop: '1px solid var(--color-border)', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {LOCS.map((l) => {
                  const isSel = selected && selected.key === (p.key || p.no) && selected.loc === l;
                  return (
                    <button key={l} onClick={(e) => { e.stopPropagation(); setSelected(isSel ? null : { key: p.key || p.no, loc: l, part: p }); }} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px',
                      borderRadius: 'var(--radius-md)', border: `1px solid ${isSel ? 'var(--color-primary)' : 'transparent'}`,
                      background: isSel ? '#eff6ff' : 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
                    }}>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: isSel ? 700 : 500, color: 'var(--color-text)' }}>{l}</span>
                      <span style={{
                        fontSize: 'var(--text-sm)', fontWeight: 700,
                        color: (p.locs[l] || 0) === 0 ? 'var(--color-text-faint)' : 'var(--color-text)',
                      }}>{p.locs[l] || 0}</span>
                    </button>
                  );
                })}
                {selected && selected.key === (p.key || p.no) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <Button variant="outline" size="sm" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); window.location.href = `在庫変更画面.html?key=${encodeURIComponent(selected.key)}&loc=${encodeURIComponent(selected.loc)}`; }}>在庫変更</Button>
                    <Button variant="warning" size="sm" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); window.location.href = `拠点間移動画面.html?key=${encodeURIComponent(selected.key)}&from=${encodeURIComponent(selected.loc)}`; }}>↔ 移動</Button>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

window.PartListScreen = PartListScreen;
