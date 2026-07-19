const { Header, Card, Button, Modal, HistoryItem, Toast } =
  window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];

const FULL_HISTORY = [
  { type: 'in', name: 'A600バルブユニット', detail: '入庫 2件', operator: 'アラン', time: '10分前' },
  { type: 'move', name: 'パッキン一式', detail: 'シンワ倉庫→アラン 2個移動', operator: 'たくや', time: '32分前' },
  { type: 'out', name: 'ドリップトレイ', detail: '出庫 1件', operator: 'ゆーや', time: '1時間前' },
  { type: 'set', name: 'フィルターバスケット', detail: '在庫数を直接指定', operator: 'しゅん', time: '2時間前' },
  { type: 'in', name: 'サーモスタットSET', detail: '入庫 5件', operator: 'シンワ倉庫', time: '3時間前' },
  { type: 'edit', name: 'A600バルブユニット', detail: '型番を編集', operator: 'アラン', time: '5時間前' },
  { type: 'move', name: 'ドリップトレイ', detail: 'ゆーや→しゅん 1個移動', operator: 'しゅん', time: '昨日' },
  { type: 'out', name: 'パッキン一式', detail: '出庫 3件', operator: 'たくや', time: '昨日' },
];

function MenuRow({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--color-border)',
        cursor: 'pointer', fontFamily: 'var(--font-sans)', textAlign: 'left',
      }}
    >
      <span style={{ fontSize: 20, width: 24, textAlign: 'center' }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text)' }}>{label}</span>
      <span style={{ color: 'var(--color-text-muted)' }}>›</span>
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)', margin: '18px 2px 8px' }}>
      {children}
    </div>
  );
}

function SettingsScreen() {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [toast, setToast] = React.useState('');
  const [history, setHistory] = React.useState(FULL_HISTORY);
  const [connected, setConnected] = React.useState(false);
  const [deduping, setDeduping] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [clearing, setClearing] = React.useState(false);

  async function runClearHistory() {
    if (!window.confirm('全履歴を削除します。この操作は取り消せません。よろしいですか？')) return;
    setClearing(true);
    try {
      await window.ZaikoDB.clearAllHistory();
      showToast('✅ 履歴を全件削除しました');
    } catch (e) {
      showToast('失敗しました: ' + e.message);
    } finally {
      setClearing(false);
    }
  }

  async function runPhotoSync() {
    setSyncing(true);
    try {
      const { total, matched } = await window.SupaPhoto.syncPhotosByPartNo();
      showToast(`✅ ${matched}/${total}件の写真を部品に紐付けました`);
    } catch (e) {
      showToast('失敗しました: ' + e.message);
    } finally {
      setSyncing(false);
    }
  }

  async function runDedupe() {
    setDeduping(true);
    try {
      const n = await window.ZaikoDB.dedupeParts();
      showToast(n > 0 ? `✅ 重複${n}件を削除しました` : '重複はありませんでした');
    } catch (e) {
      showToast('失敗しました: ' + e.message);
    } finally {
      setDeduping(false);
    }
  }

  async function runResetInspTemplates() {
    if (!window.confirm('点検マスタ(機種・点検種別・部品構成)を初期データに戻します。追加・削除・並べ替えした内容は失われます。よろしいですか？')) return;
    window.InspData.resetTemplates();
    showToast('✅ 点検マスタを初期データに戻しました');
  }

  React.useEffect(() => {
    let unsub = () => {};
    window.ZaikoDB.subscribeHistory((all) => {
      setConnected(window.ZaikoDB.isReady());
      if (all.length) setHistory(all.map((h) => ({ ...h, time: new Date(h.time).toLocaleString('ja-JP') })));
    }, 50).then((u) => { unsub = u; });
    return () => unsub();
  }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="設定・管理" right={<div style={{ display: 'flex', gap: 6 }}>
        <Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button>
        <Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button>
      </div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '4px 16px 20px' }}>
        <SectionLabel>部品</SectionLabel>
        <Card padding={0}>
          <MenuRow icon="＋" label="部品追加" onClick={() => { window.location.href = '部品追加画面.html'; }} />
          <MenuRow icon="🗂" label="カテゴリ管理" onClick={() => { window.location.href = '部品カテゴリ管理画面.html'; }} />
          <MenuRow icon="📋" label="棚卸し" onClick={() => { window.location.href = '棚卸し画面.html'; }} />
          <MenuRow icon="🧹" label={deduping ? '重複を確認中…' : '重複部品を統合'} onClick={runDedupe} />
          <MenuRow icon="📷" label={syncing ? '写真を紐付け中…' : '写真を部品番号で一括紐付け'} onClick={runPhotoSync} />
          <MenuRow icon="🔧" label="点検マスタを初期データに戻す" onClick={runResetInspTemplates} />
        </Card>

        <SectionLabel>履歴</SectionLabel>
        <Card padding={0}>
          <MenuRow icon="📋" label="全履歴を見る" onClick={() => setHistoryOpen(true)} />
          <MenuRow icon="🔍" label="使用ログ検索" onClick={() => { window.location.href = '使用ログ検索画面.html'; }} />
          <MenuRow icon="👤" label="作業者別アクティビティ" onClick={() => { window.location.href = '作業者別アクティビティ画面.html'; }} />
          <MenuRow icon="🗑" label={clearing ? '削除中…' : '履歴を全件削除'} onClick={runClearHistory} />
        </Card>

        <SectionLabel>データ出力</SectionLabel>
        <Card padding={0}>
          <MenuRow icon="📥" label="CSVインポート" onClick={() => { window.location.href = 'CSVインポート画面.html'; }} />
          <MenuRow icon="📄" label="CSVエクスポート" onClick={() => { window.location.href = 'CSVエクスポート画面.html'; }} />
          <MenuRow icon="📊" label="Excelエクスポート" onClick={() => { window.location.href = 'Excelエクスポート画面.html'; }} />
        </Card>

        <SectionLabel>拠点・接続</SectionLabel>
        <Card padding={0}>
          <MenuRow icon="📍" label="拠点の管理" onClick={() => { window.location.href = '拠点一覧画面.html'; }} />
          <MenuRow icon="🔥" label="Firebase 設定" onClick={() => { window.location.href = 'Firebase設定画面.html'; }} />
        </Card>
      </div>

      {/* Full history modal */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="全履歴"
        footer={<Button variant="outline" onClick={() => setHistoryOpen(false)}>閉じる</Button>}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {history.map((h, i) => (
            <div key={i} onClick={() => { window.location.href = `履歴詳細画面.html?i=${i}`; }} style={{ cursor: 'pointer' }}>
              <HistoryItem type={h.type} time={h.time} operator={h.operator} detail={h.detail} name={window.historyName(h)} />
            </div>
          ))}
        </div>
      </Modal>

      <Toast show={!!toast}>{toast}</Toast>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
