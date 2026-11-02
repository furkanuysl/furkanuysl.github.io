import './classic.css';
import { createRoot } from 'react-dom/client';
import ClassicApp from './ClassicApp';

export function mountClassic(el: HTMLElement, onBack: () => void) {
  const root = createRoot(el);
  root.render(<ClassicApp onBack={onBack} />);
  return root;
}
