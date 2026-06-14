import { useEffect, useState } from 'react';

const messages = [
  'Loading modules...',
  'Initializing Three.js...',
  'Fetching projects...',
  'Almost ready...'
];

export default function Loader({ onComplete }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(prev => Math.min(prev + 1, messages.length - 1));
    }, 450);

    const timer = setTimeout(() => {
      clearInterval(interval);
      onComplete?.();
    }, 1900);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div id="loader">
      <div className="loader-name">Rakesh Mandal</div>
      <div className="loader-bar"><div className="loader-fill" /></div>
      <div className="loader-text">{messages[msgIdx]}</div>
    </div>
  );
}
