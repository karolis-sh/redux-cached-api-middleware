import React from 'react';

function Header() {
  return (
    <header className="bg-indigo-darker">
      <div className="container mx-auto p-5">
        <div className="inline-flex items-center justify-between w-full">
          <span className="text-white font-mono text-sm pr-4 sm:text-lg">
            redux-cached-api-middleware
          </span>

          <a
            className="github-button"
            href="https://github.com/buz-zard/redux-cached-api-middleware"
            data-icon="octicon-star"
            data-show-count="true"
            aria-label="Star buz-zard/redux-cached-api-middleware on GitHub"
          >
            Star
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;
