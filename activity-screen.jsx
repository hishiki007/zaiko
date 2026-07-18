const { Header, Card, HistoryItem, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const OPERATORS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];

const ACTIVITY = {
  'アラン': { in: 12, out: 4, move: 3, edit: 2, recent: [
    { type: 'in', name: 'A600バルブユニット', detail: '入庫 2件', operator: 'アラン', time: '10分前' },
    { type: 'edit', name: 'A600バルブユニット', detail: '型番を編集', operator: 'アラン', time: '5時間前' },
  ] },
  'たくや': { in: 3, out: 6, move: 8, edit: 0, recent: [
    { type: 'move', name: 'パッキン一式', detail: 'シンワ倉庫→アラン 2個移動', operator: 'たくや', time: '32分前' },
    { type: 'out', name: 'パッキン一式', detail: '出庫 3件', operator: 'たくや', time: '昨日' },
  ] },
  'ゆーや': { in: 1, out: 5, move: 1, edit: 0, recent: [
    { type: 'out', name: 'ドリップトレイ', detail: '出庫 1件', operator: 'ゆーや', time: '1時間前' },
  ] },
  'しゅん': { in: 0, out: 2, move: 1, edit: 1, recent: [
    { type: 'set', name: 'フィルターバスケット', detail: '在庫数を直接指定', operator: 'しゅん', time: '2時間前' },
  ] },
  'シンワ倉庫': { in: 20, out: 0, move: 0, edit: 0, recent: [
    { type: 'in', name: 'サーモスタットSET', detail: '入庫 5件', operator: 'シンワ倉庫', time: '3時間前' },
  ] },
};

function ActivityScreen() {
  const [op, setOp] = React.useState('アラン');
  const a = ACTIVITY[op];

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="作業者別アクティビティ" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '12px 16px', WebkitOverflowScrolling: 'touch' }}>
        {OPERATORS.map((o) => (
          <button key={o} onClick={() => setOp(o)} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: 'var(--radius-pill)',
            border: `2px solid ${op === o ? 'var(--color-primary)' : 'var(--color-border)'}`,
            background: op === o ? 'var(--color-primary)' : 'var(--color-surface)',
            color: op === o ? '#fff' : 'var(--color-text)', fontSize: 'var(--text-sm)', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>{o}</button>
        ))}
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
          {[
            ['📥 入庫', a.in, 'var(--color-success)'],
            ['📤 出庫', a.out, 'var(--color-danger)'],
            ['↔ 移動', a.move, 'var(--color-warning)'],
            ['✏️ 編集', a.edit, 'var(--color-text-muted)'],
          ].map(([label, val, color]) => (
            <Card key={label} padding={10} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color }}>{val}</div>
            </Card>
          ))}
        </div>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          {op} の最近の操作
        </div>
        <Card padding={8}>
          {a.recent.length > 0 ? a.recent.map((h, i) => <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />) : (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>操作履歴がありません</div>
          )}
        </Card>
      </div>
    </div>
  );
}

window.ActivityScreen = ActivityScreen;
