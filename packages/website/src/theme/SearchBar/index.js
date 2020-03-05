/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import SearchButton from './SearchButton';

let DocSearchComp = null;

export default function SearchBar() {
  const [isLoaded, setLoaded] = useState(false);
  const [isShowing, setShowing] = useState(false);
  const { siteConfig = {} } = useDocusaurusContext();

  useEffect(() => {
    function onKeyDown(event) {
      if (
        (event.key === 'Escape' && isShowing) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();
        if (isShowing) {
          setShowing(!isShowing);
        } else {
          open();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isShowing]);

  const {
    themeConfig: { algolia },
  } = siteConfig;

  const load = () => {
    if (isLoaded) {
      return;
    }
    Promise.all([
      import('docsearch-react'),
      import('docsearch-react/dist/esm/style.css'),
    ]).then(([{ DocSearch }]) => {
      DocSearchComp = DocSearch;
      setLoaded(true);
    });
  };

  function open() {
    load();
    setShowing(true);
  }

  return (
    <div>
      <SearchButton
        onClick={() => {
          open();
        }}
      />
      {isLoaded && isShowing && (
        <DocSearchComp onClose={() => setShowing(false)} />
      )}
    </div>
  );
}
