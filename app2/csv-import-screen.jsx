const { Header, Card, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const LOCS = window.ZaikoDB.LOCS;

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const rows = lines.map((line) => {
    const cells = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQuotes) {
        if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; } }
        else cur += c;
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { cells.push(cur); cur = ''; }
        else cur += c;
      }
    }
    cells.push(cur);
    return cells;
  });
  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

function CSVImportScreen() {
  const [fileName, setFileName] = React.useState(null);
  const [rows, setRows] = React.useState(null);
  const [importing, setImporting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [error, setError] = React.useState('');
  const [connected, setConnected] = React.useState(window.ZaikoDB.isReady());

  React.useEffect(() => {
    window.ZaikoDB.init().then((db) => setConnected(!!db));
  }, []);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCSV(String(reader.result));
        if (!parsed.length || !('部品名' in parsed[0])) { setError('「部品名」列が見つかりません'); return; }
        setFileName(f.name);
        setRows(parsed);
        setDone(false);
      } catch (err) {
        setError('CSVの読み込みに失敗しました: ' + err.message);
      }
    };
    reader.readAsText(f, 'utf-8');
  }

  async function runImport() {
    setImporting(true); setError('');
    try {
      if (connected) {
        for (const row of rows) {
          const locs = Object.fromEntries(LOCS.map((l) => [l, Number(row[l]) || 0]));
          await window.ZaikoDB.addPart({ no: row['部品番号'] || '', name: row['部品名'], locs });
        }
      }
      setDone(true);
    } catch (e) {
      setError('インポートに失敗しました: ' + e.message + '（Firebaseのセキュリティルールで書き込みが拒否されている可能性があります）');
    } finally {
      setImporting(false);
    }
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected={connected} title="CSVインポート" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {!connected && (
          <div style={{ background: '#fef3c7', color: '#92400e', fontSize: 'var(--text-xs)', fontWeight: 700, borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
            ⚠️ Firebase未接続のためインポートは反映されません
          </div>
        )}
        {!fileName && (
          <label style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: 32,
            border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', background: 'var(--color-surface)',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 32 }}>📥</span>
            <span style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>CSVファイルを選択してください</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>列: 部品名, 部品番号, {LOCS.join(', ')}</span>
            <input type="file" accept=".csv" onChange={handleFile} style={{ display: 'none' }} />
          </label>
        )}

        {error && <div style={{ color: 'var(--color-danger)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{error}</div>}

        {fileName && rows && !done && (
          <React.Fragment>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--letter-spacing-label)' }}>
              CSVインポート確認
            </div>
            <Card>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: 6 }}>{fileName}</div>
              <div style={{ fontSize: 'var(--text-md)' }}>
                <strong>インポート内容：</strong><br />
                部品種類: <strong>{rows.length} 種</strong><br />
                対象保管場所: {LOCS.join('・')}
              </div>
            </Card>
            <div style={{
              background: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 'var(--radius-md)',
              padding: 12, fontSize: 'var(--text-sm)', color: '#92400e',
            }}>
              ⚠️ 常に新規部品として追加されます。既存部品の更新は「部品編集」から行ってください。
            </div>
          </React.Fragment>
        )}

        {done && (
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700 }}>{rows.length}件インポートしました</div>
          </Card>
        )}
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 10,
      }}>
        {!done ? (
          <React.Fragment>
            <Button variant="outline" style={{ flex: 1, height: 54 }} onClick={() => { window.location.href = '設定・管理画面.html'; }}>キャンセル</Button>
            <Button variant="primary" disabled={!fileName || importing} style={{ flex: 1, height: 54, fontSize: 'var(--text-md)', opacity: fileName ? 1 : 0.5 }} onClick={runImport}>
              {importing ? 'インポート中…' : 'インポート実行'}
            </Button>
          </React.Fragment>
        ) : (
          <Button variant="primary" style={{ width: '100%', height: 54, fontSize: 'var(--text-md)' }} onClick={() => { window.location.href = '設定・管理画面.html'; }}>
            設定に戻る
          </Button>
        )}
      </div>
    </div>
  );
}

window.CSVImportScreen = CSVImportScreen;
