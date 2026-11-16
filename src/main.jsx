import { createRoot } from 'react-dom/client';
import '@fontsource-variable/sora';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import './styles/base.css';
import './styles/ui.css';
import './styles/scenes.css';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);
