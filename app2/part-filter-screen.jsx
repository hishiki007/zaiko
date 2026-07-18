const { Header, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];
const STOCK_OPTS = [
  { key: 'all', label: 'すべて' },
  { key: 'has', label: '在庫あり' },
  { key: 'zero', label: '在庫ゼロ' },
];
const SORT_OPTS = [
  { key: 'name', label: '部品名順' },
  { key: 'total_desc', label: '在庫数が多い順' },
  { key: 'total_asc', label: '在庫数が少ない順' },
];

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 16px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--text-sm)', fontWeight: 700,
      cursor: 'pointer', fontFamily: 'var(--font-sans)',
      border: `2px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
      background: active ? 'var(--color-primary)' : '#fff',
      color: active ? '#fff' : 'var(--color-text)',
    }}>{children}</button>
  );
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem('partFilter')) || {}; } catch (e) { return {}; }
}

function PartFilterScreen() {
  const saved = loadSaved();
  const [locs, setLocs] = React.useState(saved.locs || []);
  const [stock, setStock] = React.useState(saved.stock || 'all');
  const [sort, setSort] = React.useState(saved.sort || 'name');

  function apply() {
    localStorage.setItem('partFilter', JSON.stringify({ locs, stock, sort }));
    window.location.href = '部品一覧画面.html';
  }

  function toggleLoc(l) {
    setLocs((prev) => prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]);
  }
  function reset() {
    setLocs([]); setStock('all'); setSort('name');
    localStorage.removeItem('partFilter');
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="絞り込み" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)', marginBottom: 10 }}>
            保管場所（複数選択可）
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {LOCS.map((l) => <Chip key={l} active={locs.includes(l)} onClick={() => toggleLoc(l)}>{l}</Chip>)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)', marginBottom: 10 }}>
            在庫状況
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STOCK_OPTS.map((o) => <Chip key={o.key} active={stock === o.key} onClick={() => setStock(o.key)}>{o.label}</Chip>)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)', marginBottom: 10 }}>
            並び順
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SORT_OPTS.map((o) => <Chip key={o.key} active={sort === o.key} onClick={() => setSort(o.key)}>{o.label}</Chip>)}
          </div>
        </div>

        <button onClick={reset} style={{
          alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
        }}>条件をリセット</button>
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="primary" style={{ width: '100%', height: 56, fontSize: 'var(--text-md)' }} onClick={apply}>
          この条件で絞り込む
        </Button>
      </div>
    </div>
  );
}

window.PartFilterScreen = PartFilterScreen;
