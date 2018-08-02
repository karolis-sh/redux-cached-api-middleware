import React from 'react';

function Footer() {
  return (
    <footer className="bg-grey-light">
      <div className="container mx-auto text-grey-darker py-4 px-5 sm:py-8">
        Copyright ©{' '}
        <a
          href="https://karolis.sh/"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Karolis Šarapnickis
        </a>, {new Date().getFullYear()}. MIT Licensed.
      </div>
    </footer>
  );
}

export default Footer;
