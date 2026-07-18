const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const TYPE_LABELS = { move: '移動', add: '追加', edit: '編集', del: '削除', in: '入庫', out: '出庫', set: '直接指定' };
const TYPE_COLOR = { move: 'var(--color-warning)', add: 'var(--color-primary)', edit: 'var(--color-text-faint)', del: 'var(--slate-400)', in: 'var(--color-success)', out: 'var(--color-danger)', set: 'var(--color-accent-purple)' };

const FULL_HISTORY = [
  { type: 'in', name: 'A600バルブユニット', no: 'M-6003', detail: '入庫 シンワ倉庫: 6→8', operator: 'アラン', time: '10分前', datetime: '2026-07-18 08:12' },
  { type: 'move', name: 'パッキン一式', no: 'P-1102', detail: 'シンワ倉庫→アラン 2個移動', operator: 'たくや', time: '32分前', datetime: '2026-07-18 07:50' },
  { type: 'out', name: 'ドリップトレイ', no: 'D-4400', detail: '出庫 ゆーや: 2→1', operator: 'ゆーや', time: '1時間前', datetime: '2026-07-18 07:22' },
  { type: 'set', name: 'フィルターバスケット', no: 'F-2201', detail: '在庫数を直接指定 しゅん: 3→2', operator: 'しゅん', time: '2時間前', datetime: '2026-07-18 06:15' },
  { type: 'in', name: 'サーモスタットSET', no: 'T-3300', detail: '入庫 シンワ倉庫: 7→12', operator: 'シンワ倉庫', time: '3時間前', datetime: '2026-07-18 05:40' },
  { type: 'edit', name: 'A600バルブユニット', no: 'M-6003', detail: '型番を編集', operator: 'アラン', time: '5時間前', datetime: '2026-07-18 03:30' },
  { type: 'move', name: 'ドリップトレイ', no: 'D-4400', detail: 'ゆーや→しゅん 1個移動', operator: 'しゅん', time: '昨日', datetime: '2026-07-17 18:05' },
  { type: 'out', name: 'パッキン一式', no: 'P-1102', detail: '出庫 たくや: 5→2', operator: 'たくや', time: '昨日', datetime: '2026-07-17 15:48' },
];

function HistoryDetailScreen() {
  const params = new URLSearchParams(window.location.search);
  const idx = Math.max(0, Math.min(FULL_HISTORY.length - 1, Number(params.get('i') || 0)));
  const h = FULL_HISTORY[idx];

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="履歴詳細" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              display: 'inline-block', padding: '4px 10px', borderRadius: 'var(--radius-pill)',
              background: TYPE_COLOR[h.type], color: '#fff', fontSize: 'var(--text-xs)', fontWeight: 700,
            }}>{TYPE_LABELS[h.type] || h.type}</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{h.datetime}</span>
          </div>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{h.no}</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 6 }}>{h.name}</div>
          <div style={{ fontSize: 'var(--text-md)', color: 'var(--color-text)' }}>{h.detail}</div>
        </Card>

        <Card padding={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>操作者</span>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>👤 {h.operator}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>日時</span>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{h.datetime}</span>
          </div>
        </Card>

        <Button variant="outline" style={{ width: '100%', height: 52 }} onClick={() => { window.location.href = '部品詳細画面.html'; }}>
          この部品の詳細を見る
        </Button>
      </div>
    </div>
  );
}

window.HistoryDetailScreen = HistoryDetailScreen;
