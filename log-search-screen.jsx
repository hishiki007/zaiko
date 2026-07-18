const { Header, Card, HistoryItem, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const OPERATORS = ['すべて', 'シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];
const TYPES = { all: 'すべて', in: '入庫', out: '出庫', move: '移動', set: '直接指定', edit: '編集', add: '追加', del: '削除' };

const LOG = [
  { type: 'in', name: 'A600バルブユニット', detail: '入庫 シンワ倉庫: 6→8', operator: 'アラン', time: '10分前' },
  { type: 'move', name: 'パッキン一式', detail: 'シンワ倉庫→アラン 2個移動', operator: 'たくや', time: '32分前' },
  { type: 'out', name: 'ドリップトレイ', detail: '出庫 ゆーや: 2→1', operator: 'ゆーや', time: '1時間前' },
  { type: 'set', name: 'フィルターバスケット', detail: '在庫数を直接指定 しゅん: 3→2', operator: 'しゅん', time: '2時間前' },
  { type: 'in', name: 'サーモスタットSET', detail: '入庫 シンワ倉庫: 7→12', operator: 'シンワ倉庫', time: '3時間前' },
  { type: 'edit', name: 'A600バルブユニット', detail: '型番を編集', operator: 'アラン', time: '5時間前' },
  { type: 'move', name: 'ドリップトレイ', detail: 'ゆーや→しゅん 1個移動', operator: 'しゅん', time: '昨日' },
  { type: 'out', name: 'パッキン一式', detail: '出庫 たくや: 5→2', operator: 'たくや', time: '昨日' },
];

function LogSearchScreen() {
  const [query, setQuery] = React.useState('');
  const [operator, setOperator] = React.useState('すべて');
  const [type, setType] = React.useState('all');

  const results = LOG.filter((h) => {
    const q = query.trim().toLowerCase();
    if (q && !h.name.toLowerCase().includes(q) && !h.detail.toLowerCase().includes(q)) return false;
    if (operator !== 'すべて' && h.operator !== operator) return false;
    if (type !== 'all' && h.type !== type) return false;
    return true;
  });

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="使用ログ検索" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ padding: '10px 16px 0' }}>
        <input
          type="search" value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 部品名・内容で検索…"
          style={{
            width: '100%', height: 44, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
            padding: '0 14px', fontSize: 'var(--text-md)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)',
            boxSizing: 'border-box', background: 'var(--color-surface)',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '10px 16px' }}>
        <select value={operator} onChange={(e) => setOperator(e.target.value)} style={{
          flex: 1, height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
          fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
        }}>
          {OPERATORS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} style={{
          flex: 1, height: 40, borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
          fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', color: 'var(--color-text)', background: '#fff', padding: '0 8px',
        }}>
          {Object.entries(TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 20px' }}>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 6 }}>{results.length}件</div>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-text-muted)' }}>
            <div style={{ fontSize: 34, marginBottom: 8 }}>🔍</div>
            該当するログがありません
          </div>
        ) : (
          <Card padding={8}>
            {results.map((h, i) => <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />)}
          </Card>
        )}
      </div>
    </div>
  );
}

window.LogSearchScreen = LogSearchScreen;
