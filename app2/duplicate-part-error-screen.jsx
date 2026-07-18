const { Header, Card, Button, Badge } = window.MelittaZaikoDesignSystem_3f29a9;

const EXISTING = { no: 'M-6003', name: 'A600バルブユニット', locs: { 'シンワ倉庫': 8, 'アラン': 2, 'ゆーや': 0, 'しゅん': 1, 'たくや': 0 } };
const SCANNED_NO = 'M-6003';

function DuplicatePartErrorScreen() {
  const total = Object.values(EXISTING.locs).reduce((s, n) => s + n, 0);

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="QRスキャン" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Card style={{ border: '2px solid var(--color-danger)', background: '#fef2f2', textAlign: 'center' }} padding={20}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-danger)', marginBottom: 4 }}>この部品番号は既に登録済みです</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{SCANNED_NO}</div>
        </Card>

        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
          既存の登録内容
        </div>
        <Card padding={14}>
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{EXISTING.no}</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 6 }}>{EXISTING.name}</div>
          <Badge kind="neutral">合計 {total}個</Badge>
        </Card>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          同じ部品として在庫を追加しますか？それとも別の部品番号を付け直して新規登録しますか？
        </div>
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <Button variant="primary" style={{ width: '100%', height: 54, fontSize: 'var(--text-md)' }} onClick={() => { window.location.href = '在庫変更画面.html'; }}>
          この部品として在庫を変更する
        </Button>
        <Button variant="outline" style={{ width: '100%', height: 48 }} onClick={() => { window.location.href = '部品追加画面.html'; }}>
          番号を付け直して新規登録
        </Button>
      </div>
    </div>
  );
}

window.DuplicatePartErrorScreen = DuplicatePartErrorScreen;
