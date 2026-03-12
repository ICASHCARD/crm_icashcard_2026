
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { AppProvider } from './store/providers/AppProvider';
import { AppRoutes } from './router/routes';

const App: React.FC = () => (
  <AppProvider>
    <Router>
      <AppRoutes />
    </Router>
  </AppProvider>
);

export default App;
