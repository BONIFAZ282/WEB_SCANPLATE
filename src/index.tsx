import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';


import { ThemeProvider as ThemeProviderCustom } from './Components/ThemeContext';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ThemeProviderCustom>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProviderCustom>

);
reportWebVitals();
