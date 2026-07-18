const { Header, Card, Badge, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const SLIP_HISTORY = [
  { thumb: '📄', vendor: '納品書_20260718.jpg', items: 3, checked: 3, operator: 'アラン', datetime: '2026-07-18 08:10' },
  { thumb: '📄', vendor: '納品書_20260715.jpg', items: 5, checked: 4, operator: 'たくや', datetime: '2026-07-15 10:22' },
  { thumb: '📄', vendor: '納品書_20260710.jpg', items: 2, checked: 2, operator: 'しゅん', datetime: '2026-07-10 09:05' },
  { thumb: '📄', vendor: '納品書_20260702.jpg', items: 4, checked: 3, operator: 'ゆーや', datetime: '2026-07-02 14:48' },
];

function DeliverySlipHistoryScreen() {
  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="納品書スキャン履歴" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SLIP_HISTORY.map((h, i) => (
          <Card key={i} padding={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44, height: 44, flexShrink: 0, borderRadius: 'var(--radius-md)', background: 'var(--color-bg)',
                border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{h.thumb}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.vendor}</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)' }}>👤 {h.operator}　{h.datetime}</div>
              </div>
              <Badge kind={h.checked === h.items ? 'success' : 'neutral'}>{h.checked}/{h.items}件 入庫</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

window.DeliverySlipHistoryScreen = DeliverySlipHistoryScreen;
