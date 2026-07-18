function historyName(h) {
  if (!h.no) return h.name;
  return React.createElement(React.Fragment, null, h.name, React.createElement('span', {
    style: { fontWeight: 400, fontSize: 'var(--text-2xs)', color: 'var(--color-text-muted)', marginLeft: 6, fontFamily: 'var(--font-mono)' },
  }, h.no));
}
window.historyName = historyName;
