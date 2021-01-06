import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<BrowserRouter basename="https://unblocktechie.github.io/quotefactory/">
                <App />
                </BrowserRouter>, 
                document.getElementById('root'));

serviceWorker.unregister();