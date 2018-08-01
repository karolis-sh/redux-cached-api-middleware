import React from 'react';

function HardRefresher() {
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          localStorage.clear();
          window.location.reload(true);
        }}
      >
        Hard re-load page
      </button>
      <div style={{ fontSize: '.7rem', marginTop: 3 }}>
        * will clear localStorage
      </div>
    </div>
  );
}

export default HardRefresher;
