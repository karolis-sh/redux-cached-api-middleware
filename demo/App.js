import React from 'react';

import Header from './Header';
import Information from './Information';
import CryptoPrices from './CryptoPrices';
import Footer from './Footer';

function App() {
  return (
    <div className="flex flex-col h-full overflow-hidden overflow-y-auto">
      <Header />
      <div className="container mx-auto flex-1">
        <Information />
        <CryptoPrices />
      </div>
      <Footer />
    </div>
  );
}

export default App;
