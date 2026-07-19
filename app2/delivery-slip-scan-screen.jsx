const { Header, Card, Button, Badge } = window.MelittaZaikoDesignSystem_3f29a9;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function extractJSON(text) {
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('解析結果が読み取れませんでした');
  return JSON.parse(match[0]);
}

function DeliverySlipScanScreen() {
  const [image, setImage] = React.useState(null);
  const [scanning, setScanning] = React.useState(false);
  const [items, setItems] = React.useState(null);
  const [error, setError] = React.useState('');
  const cameraInputRef = React.useRef(null);
  const libraryInputRef = React.useRef(null);

  async function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setError(''); setItems(null);
    const dataUrl = await fileToBase64(f);
    setImage(dataUrl);
    const apiKey = localStorage.getItem('anthropic_key');
    if (!apiKey && !(window.claude && window.claude.complete)) {
      setError('AI解析にはAnthropic API Keyが必要です。設定・管理 → Firebase設定でAPI Keyを登録してください。');
      return;
    }
    setScanning(true);
    try {
      const mimeType = dataUrl.substring(5, dataUrl.indexOf(';'));
      const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
      let res;
      if (apiKey) {
        const resp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 1024,
            system: 'あなたは日本語の納品書・仕入れ伝票の画像を解析するアシスタントです。画像に写っている品目名と数量を抽出し、必ずJSON配列のみを出力してください。説明文やマークダウンのコードフェンスは付けないでください。形式: [{"name":"部品名","qty":数量}]',
            messages: [{
              role: 'user',
              content: [
                { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
                { type: 'text', text: '添付の納品書画像から、品目名と数量の一覧をJSON配列で抽出してください。' },
              ],
            }],
          }),
        });
        if (!resp.ok) {
          const errBody = await resp.text();
          throw new Error(`API エラー (${resp.status}): ${errBody.slice(0, 200)}`);
        }
        const json = await resp.json();
        res = (json.content || []).map((c) => c.text || '').join('');
      } else {
        res = await window.claude.complete({
          system: 'あなたは日本語の納品書・仕入れ伝票の画像を解析するアシスタントです。画像に写っている品目名と数量を抽出し、必ずJSON配列のみを出力してください。説明文やマークダウンのコードフェンスは付けないでください。形式: [{"name":"部品名","qty":数量}]',
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
              { type: 'text', text: '添付の納品書画像から、品目名と数量の一覧をJSON配列で抽出してください。' },
            ],
          }],
          max_tokens: 1024,
        });
      }
      const parsed = extractJSON(res);
      setItems(parsed.map((p) => ({ name: String(p.name || '').trim(), qty: Number(p.qty) || 1 })).filter((p) => p.name));
      if (!parsed.length) setError('品目が検出されませんでした');
    } catch (err) {
      setError('解析に失敗しました: ' + err.message);
    } finally {
      setScanning(false);
    }
  }

  function updateQty(idx, qty) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, qty } : it)));
  }

  function proceed() {
    localStorage.setItem('deliverySlipItems', JSON.stringify(items));
    window.location.href = 'スキャン結果編集画面.html';
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="納品書スキャン" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: image ? 8 : 32,
          border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)',
          overflow: 'hidden',
        }}>
          {image ? (
            <img src={image} alt="納品書" style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 'var(--radius-md)', objectFit: 'contain' }} />
          ) : (
            <React.Fragment>
              <span style={{ fontSize: 32 }}>📷</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>納品書の写真を選択してください</span>
            </React.Fragment>
          )}
          <div style={{ display: 'flex', gap: 10, width: '100%' }}>
            <Button variant="outline" style={{ flex: 1, height: 44 }} onClick={() => cameraInputRef.current && cameraInputRef.current.click()}>📷 写真を撮る</Button>
            <Button variant="outline" style={{ flex: 1, height: 44 }} onClick={() => libraryInputRef.current && libraryInputRef.current.click()}>🖼 ファイルから選択</Button>
          </div>
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />
          <input ref={libraryInputRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>

        <button onClick={() => { window.location.href = '納品書スキャン履歴画面.html'; }} style={{
          alignSelf: 'flex-end', background: 'none', border: 'none', color: 'var(--color-text-muted)',
          fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: 0,
        }}>📋 過去のスキャン履歴</button>

        {scanning && (
          <Card>
            <div style={{ textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              📄 AIが納品書を解析しています…
            </div>
          </Card>
        )}

        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{error}</div>}

        {items && !scanning && (
          <React.Fragment>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              読み取った品目（{items.length}件）
            </div>
            <Card padding={0}>
              {items.map((it, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  borderBottom: i < items.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}>
                  <div style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                  <Badge kind="success">📥 入庫</Badge>
                  <input
                    type="number" value={it.qty} onChange={(e) => updateQty(i, Number(e.target.value))}
                    style={{
                      width: 56, height: 40, textAlign: 'center', fontSize: 'var(--text-md)', fontWeight: 700,
                      borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                      color: 'var(--color-text)', background: '#fff', fontFamily: 'var(--font-sans)', flexShrink: 0,
                    }}
                  />
                </div>
              ))}
            </Card>
          </React.Fragment>
        )}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
      }}>
        <Button
          variant="success" disabled={!items || !items.length || scanning}
          style={{ width: '100%', height: 56, fontSize: 'var(--text-md)', opacity: items && items.length ? 1 : 0.5 }}
          onClick={proceed}
        >
          この内容で入庫する
        </Button>
      </div>
    </div>
  );
}

window.DeliverySlipScanScreen = DeliverySlipScanScreen;
