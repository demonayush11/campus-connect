import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Hide the HTML splash screen once React is ready to paint
const hideSplash = () => {
    const splash = document.getElementById('cc-splash');
    if (splash) splash.classList.add('hidden');
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Give React one frame to paint, then fade out splash
requestAnimationFrame(() => {
    requestAnimationFrame(hideSplash);
});
