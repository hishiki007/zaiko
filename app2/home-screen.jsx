const { Header, Card, Button, Field, Modal, HistoryItem } =
  window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];

function ActionButton({ icon, label, onClick, span, color }) {
  const COLORS = {
    green: { bg: '#f0fdf4', border: 'var(--color-success)', fg: 'var(--color-success)' },
    orange: { bg: '#fff7ed', border: 'var(--color-warning)', fg: 'var(--color-warning)' },
    purple: { bg: '#f5f3ff', border: 'var(--color-accent-purple)', fg: 'var(--color-accent-purple)' },
    blue: { bg: '#eff6ff', border: 'var(--color-primary)', fg: 'var(--color-primary)' },
  };
  const c = color && COLORS[color];
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 6, height: 84, borderRadius: 'var(--radius-xl)', border: `1px solid ${c ? c.border : 'var(--color-border)'}`,
        background: c ? c.bg : 'var(--color-surface)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        boxShadow: 'var(--shadow-card)', gridColumn: span ? '1 / -1' : undefined,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <span style={{ fontSize: 26 }}>{icon}</span>
      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: c ? c.fg : 'var(--color-text)' }}>{label}</span>
    </button>
  );
}

function HomeScreen() {
  const [curLoc, setCurLoc] = React.useState(() => window.ZaikoDB.getOperator());
  const [locOpen, setLocOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState([]);
  const [connected, setConnected] = React.useState(false);
  const [fullHistory, setFullHistory] = React.useState([]);
  const [fullHistoryOpen, setFullHistoryOpen] = React.useState(false);

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeHistory((all) => {
      setConnected(window.ZaikoDB.isReady());
      if (all.length) setRecent(all.slice(0, 20).map((h) => ({ ...h, time: new Date(h.time).toLocaleString('ja-JP') })));
    }, 20).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (!fullHistoryOpen) return;
    let unsub = () => {};
    window.ZaikoDB.subscribeHistory((all) => {
      setFullHistory(all.map((h) => ({ ...h, time: new Date(h.time).toLocaleString('ja-JP') })));
    }, 300).then((u) => { unsub = u; });
    return () => unsub();
  }, [fullHistoryOpen]);

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="部品在庫管理" right={<div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" onClick={() => setFullHistoryOpen(true)}>📋 全履歴</Button>
        <Button variant="ghost" size="sm" onClick={() => { window.location.href = '設定・管理画面.html'; }}>⚙️</Button>
      </div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 16px 20px' }}>
        {/* Location switcher */}
        <button
          onClick={() => { window.location.href = '操作者選択画面.html'; }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', marginBottom: 10, borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)', background: 'var(--color-surface)',
            fontFamily: 'var(--font-sans)', cursor: 'pointer', boxShadow: 'var(--shadow-card)',
            color: 'var(--color-text)',
          }}
        >
          <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text)', whiteSpace: 'nowrap', flexShrink: 0 }}>👤 {curLoc}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 1, overflow: 'hidden', textOverflow: 'ellipsis', marginLeft: 8 }}>作業者を切り替える ▾</span>
        </button>

        {/* Search bar */}
        <div style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => { window.location.href = '部品一覧画面.html'; }}>
          <Field
            type="search"
            placeholder="🔍 部品名・型番で検索してください"
            value={query}
            onChange={() => {}}
          />
        </div>

        {/* Main actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <ActionButton icon="📱" label="QRスキャン" color="green" onClick={() => { window.location.href = 'QRスキャン画面.html'; }} />
          <ActionButton icon="📷" label="納品書スキャン" color="green" onClick={() => { window.location.href = '納品書スキャン画面.html'; }} />
          <ActionButton icon="🔧" label="点検" color="purple" onClick={() => { window.location.href = '点検画面.html'; }} />
          <ActionButton icon="＋" label="部品追加" color="blue" onClick={() => { window.location.href = '部品追加画面.html'; }} />
        </div>

        {/* Recent activity */}
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)', marginBottom: 8 }}>
          最近の操作
        </div>
        {['in', 'out', 'move'].map((t) => {
          const list = recent.filter((h) => h.type === t);
          if (!list.length) return null;
          const label = t === 'in' ? '📥 入庫' : t === 'out' ? '📤 出庫' : '↔ 移動';
          return (
            <div key={t} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</div>
              <Card padding={8}>
                {list.map((h, i) => <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />)}
              </Card>
            </div>
          );
        })}
        {recent.filter((h) => h.type !== 'in' && h.type !== 'out' && h.type !== 'move').length > 0 && (
          <Card padding={8}>
            {recent.filter((h) => h.type !== 'in' && h.type !== 'out' && h.type !== 'move').map((h, i) => <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />)}
          </Card>
        )}
      </div>

      {/* Location picker modal */}
      <Modal
        open={locOpen}
        onClose={() => setLocOpen(false)}
        title="拠点を選択してください"
        footer={<Button variant="outline" onClick={() => setLocOpen(false)}>閉じる</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {LOCS.map((name) => (
            <Button
              key={name}
              variant={curLoc === name ? 'primary' : 'outline'}
              style={{ textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => { setCurLoc(name); setLocOpen(false); }}
            >
              {name}
            </Button>
          ))}
        </div>
      </Modal>

      <Modal
        open={fullHistoryOpen}
        onClose={() => setFullHistoryOpen(false)}
        title="全履歴"
        footer={<Button variant="outline" onClick={() => setFullHistoryOpen(false)}>閉じる</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {fullHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>履歴がありません</div>
          ) : fullHistory.map((h, i) => (
            <HistoryItem key={i} type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />
          ))}
        </div>
      </Modal>
    </div>
  );
}

window.HomeScreen = HomeScreen;
