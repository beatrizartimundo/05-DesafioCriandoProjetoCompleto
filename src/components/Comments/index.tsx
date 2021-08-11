import { useEffect } from 'react';

export default function Comments() {
  useEffect(() => {
    const script = document.createElement('script');
    const anchor = document.getElementById('inject-comments-for-uterances');
    script.setAttribute('src', 'https://utteranc.es/client.js');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.setAttribute(
      'repo',
      'beatrizartimundo/05-DesafioCriandoProjetoCompleto'
    );
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'dark-blue');
    anchor.appendChild(script);
  }, []);

  return (
    <div id="inject-comments-for-uterances" style={{ marginBottom: '4rem' }} />
  );
}
