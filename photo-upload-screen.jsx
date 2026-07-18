const { Header, Card, Button, PhotoDrop, Toast } = window.MelittaZaikoDesignSystem_3f29a9;

function PhotoUploadScreen() {
  const key = new URLSearchParams(window.location.search).get('key');
  const [part, setPart] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [preview, setPreview] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [toast, setToast] = React.useState('');
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef(null);
  const connected = window.ZaikoDB.isReady();

  React.useEffect(() => {
    if (!key) return;
    let unsub = () => {};
    window.ZaikoDB.subscribePart(key, (p) => { if (p) setPart(p); }).then((u) => { unsub = u; });
    return () => unsub();
  }, [key]);

  function pick() {
    fileInputRef.current && fileInputRef.current.click();
  }

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setError('');
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  async function save() {
    if (!file || !key) return;
    setUploading(true); setError('');
    try {
      const url = await window.SupaPhoto.uploadPhoto(key, file);
      await window.ZaikoDB.setPhoto(key, url);
      setToast('✅ 写真を保存しました');
      setTimeout(() => { window.location.href = `部品詳細画面.html?key=${encodeURIComponent(key)}`; }, 900);
    } catch (e) {
      setError(e.message);
      setUploading(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="写真を追加" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {part && (
          <Card padding={12}>
            <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{part.no}</div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>{part.name}</div>
          </Card>
        )}
        {!key && (
          <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            部品が指定されていません。部品詳細画面から開いてください。
          </div>
        )}

        <div style={{ height: 260 }}>
          <PhotoDrop image={preview} hint="部品の写真を選択してください" icon="📷" onClick={pick} />
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />

        {preview && (
          <Button variant="outline" style={{ height: 44 }} onClick={() => { setPreview(null); setFile(null); }}>写真を削除してやり直す</Button>
        )}
        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{error}</div>}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button variant="primary" disabled={!file || !key || uploading} style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: file && key ? 1 : 0.5 }} onClick={save}>
          {uploading ? 'アップロード中…' : 'この写真を保存する'}
        </Button>
      </div>

      <Toast show={!!toast}>{toast}</Toast>
    </div>
  );
}

window.PhotoUploadScreen = PhotoUploadScreen;
