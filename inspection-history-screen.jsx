const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const INSPECTION_LOG = [
  { machine: 'XTフル', inspType: '3ヶ月点検', operator: 'アラン', datetime: '2026-07-18 08:12', parts: [{ name: 'フィルターバスケット', qty: 1 }, { name: 'パッキン一式', qty: 2 }] },
  { machine: 'LNGフル', inspType: '半年点検', operator: 'たくや', datetime: '2026-07-17 15:40', parts: [{ name: 'A600バルブユニット', qty: 1 }, { name: 'パッキン一式', qty: 3 }] },
  { machine: 'XTブラック', inspType: '3ヶ月点検', operator: 'しゅん', datetime: '2026-07-16 11:05', parts: [{ name: 'フィルターバスケット', qty: 1 }, { name: 'パッキン一式', qty: 2 }] },
  { machine: 'LNGブラック', inspType: '半年点検', operator: 'ゆーや', datetime: '2026-07-14 09:30', parts: [{ name: 'A600バルブユニット', qty: 1 }, { name: 'パッキン一式', qty: 2 }] },
  { machine: 'XTフル', inspType: '1年点検', operator: 'アラン', datetime: '2026-07-10 14:20', parts: [{ name: 'フィルターバスケット', qty: 1 }, { name: 'パッキン一式', qty: 2 }, { name: 'サーモスタットSET', qty: 1 }] },
];

function InspectionHistoryScreen() {
  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="点検履歴" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {INSPECTION_LOG.map((h, i) => (
          <Card key={i} padding={12}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{h.machine} ／ {h.inspType}</div>
              <span style={{
                fontSize: 'var(--text-2xs)', fontWeight: 700, padding: '3px 9px', borderRadius: 'var(--radius-pill)',
                background: 'var(--color-accent-purple)', color: '#fff',
              }}>🔧 点検出庫</span>
            </div>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginBottom: 6 }}>
              👤 {h.operator}　{h.datetime}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)' }}>
              {h.parts.map((p, j) => (
                <span key={j}>{p.name}×{p.qty}{j < h.parts.length - 1 ? '　' : ''}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

window.InspectionHistoryScreen = InspectionHistoryScreen;
