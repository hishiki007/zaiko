const { Header, Button } = window.MelittaZaikoDesignSystem_3f29a9;

const DEFAULT_OPERATORS = ['シンワ倉庫', 'アラン', 'ゆーや', 'しゅん', 'たくや'];

function OperatorSelectScreen() {
  const [operators, setOperators] = React.useState(DEFAULT_OPERATORS);
  const [current, setCurrent] = React.useState(() => window.ZaikoDB.getOperator());
  const [renameIdx, setRenameIdx] = React.useState(null);
  const [renameVal, setRenameVal] = React.useState('');

  function select(name) {
    setCurrent(name);
    window.ZaikoDB.setOperator(name);
    setTimeout(() => { window.location.href = '在庫管理 ホーム画面.html'; }, 300);
  }

  function startRename(i) {
    setRenameIdx(i);
    setRenameVal(operators[i]);
  }

  function confirmRename() {
    const nn = renameVal.trim();
    if (nn) {
      setOperators((prev) => prev.map((o, i) => (i === renameIdx ? nn : o)));
      if (current === operators[renameIdx]) setCurrent(nn);
    }
    setRenameIdx(null);
  }

  return (
    <div style={{
      fontFamily: 'var(--font-sans)', background: 'var(--color-bg)', color: 'var(--color-text)',
      height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0, paddingTop: 47,
    }}>
      <Header connected title="作業者を選択" right={<div style={{ display: 'flex', gap: 6 }}><Button variant="ghost" size="sm" onClick={() => history.back()}>‹ 戻る</Button><Button variant="ghost" size="sm" onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>🏠</Button></div>} />

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          出庫・移動を記録した人として履歴に残ります。鉛筆アイコンで名前を編集できます。
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {operators.map((name, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              {renameIdx === i ? (
                <React.Fragment>
                  <input
                    autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') confirmRename(); }}
                    style={{
                      flex: 1, height: 56, fontSize: 'var(--text-md)', fontWeight: 700, textAlign: 'left',
                      borderRadius: 'var(--radius-lg)', border: '2px solid var(--color-primary)', padding: '0 16px',
                      fontFamily: 'var(--font-sans)', color: 'var(--color-text)', boxSizing: 'border-box',
                    }}
                  />
                  <button onClick={confirmRename} style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-lg)', border: 'none', flexShrink: 0,
                    background: 'var(--color-success)', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer',
                  }}>✓</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <button onClick={() => select(name)} style={{
                    flex: 1, height: 56, textAlign: 'left', padding: '0 16px', borderRadius: 'var(--radius-lg)',
                    border: `2px solid ${current === name ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: current === name ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: current === name ? '#fff' : 'var(--color-text)',
                    fontSize: 'var(--text-md)', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>{name}</button>
                  <button onClick={() => startRename(i)} style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', flexShrink: 0,
                    background: 'var(--color-surface)', fontSize: 18, cursor: 'pointer',
                  }}>✎</button>
                </React.Fragment>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        flex: '0 0 auto', padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
      }}>
        <Button variant="outline" style={{ width: '100%', height: 52 }} onClick={() => { window.location.href = '在庫管理 ホーム画面.html'; }}>閉じる</Button>
      </div>
    </div>
  );
}

window.OperatorSelectScreen = OperatorSelectScreen;
