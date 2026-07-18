const { Header, Card, Button, Field } = window.MelittaZaikoDesignSystem_3f29a9;

function FirebaseSetupScreen() {
  const saved = window.ZaikoDB.getConfig() || {};
  const [v, setV] = React.useState({ key: saved.apiKey || '', auth: saved.authDomain || '', db: saved.databaseURL || '', pid: saved.projectId || '', anthropic: '', sbUrl: '', sbKey: '' });
  const [error, setError] = React.useState('');
  const [testing, setTesting] = React.useState(false);
  const [status, setStatus] = React.useState(window.ZaikoDB.isReady() ? 'ok' : (saved.apiKey ? 'saved' : ''));

  function set(field) {
    return (e) => setV((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function connect() {
    if (!v.key || !v.auth || !v.db || !v.pid) { setError('必須項目を入力してください'); return; }
    setError(''); setTesting(true);
    window.ZaikoDB.saveConfig({ apiKey: v.key, authDomain: v.auth, databaseURL: v.db, projectId: v.pid });
    try {
      await window.ZaikoDB.init();
      setStatus('ok');
      setTimeout(() => { window.location.href = '設定・管理画面.html'; }, 500);
    } catch (e) {
      setError('接続に失敗しました: ' + e.message);
      setStatus('');
    } finally {
      setTesting(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={status === 'ok'} title="Firebase 設定" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Card>
          <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, marginBottom: 6 }}>🔥 Firebase 設定</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 14 }}>
            接続情報を入力してください。5人で同じ情報を使えばリアルタイム共有できます。
          </div>
          {status === 'ok' && (
            <div style={{ background: '#dcfce7', color: 'var(--color-success)', fontSize: 'var(--text-sm)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '8px 12px', marginBottom: 10 }}>
              ✅ 接続済みです
            </div>
          )}
          <Field label="API Key" value={v.key} onChange={set('key')} placeholder="AIzaSy..." />
          <Field label="Auth Domain" value={v.auth} onChange={set('auth')} placeholder="xxx.firebaseapp.com" />
          <Field label="Database URL" value={v.db} onChange={set('db')} placeholder="https://xxx.firebasedatabase.app" />
          <Field label="Project ID" value={v.pid} onChange={set('pid')} placeholder="your-project-id" />
          <Field label="Anthropic API Key（納品書スキャン用・任意）" type="password" value={v.anthropic} onChange={set('anthropic')} placeholder="sk-ant-api03-..." />
          <Field label="Supabase URL（写真保存用・任意）" value={v.sbUrl} onChange={set('sbUrl')} placeholder="https://xxxx.supabase.co" />
          <Field label="Supabase Anon Key（写真保存用・任意）" type="password" value={v.sbKey} onChange={set('sbKey')} placeholder="eyJ..." />
          {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
          <Button variant="primary" style={{ width: '100%', height: 48, fontSize: 'var(--text-md)' }} disabled={testing} onClick={connect}>
            {testing ? '接続中…' : '接続して開始 →'}
          </Button>
        </Card>
      </div>
    </div>
  );
}

window.FirebaseSetupScreen = FirebaseSetupScreen;
