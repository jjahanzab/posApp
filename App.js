import React from 'react';
// context cms //
import { InstallProvider } from  './context/InstallContext';
import { PosProvider } from './context/PosContext';

// redux cms //
import { Provider } from 'react-redux';
import { Store } from './redux/store';

import FrontendFramework from './components/FrontendFramework';

export default function App() {
  return (
    <Provider store={Store}>
      <InstallProvider>
        <PosProvider>

          <FrontendFramework />
          
        </PosProvider>
      </InstallProvider>
    </Provider>
  );
}