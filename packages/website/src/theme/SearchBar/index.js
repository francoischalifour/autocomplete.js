/* eslint-disable import/no-unresolved */

import React, { useState, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import SearchButton from './SearchButton';

let DocSearch = null;

export default function SearchBar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const { siteConfig = {} } = useDocusaurusContext();

  const {
    indexName,
    appId,
    apiKey,
    searchParameters,
  } = siteConfig.themeConfig.algolia;

  const load = React.useCallback(
    function load() {
      if (isLoaded) {
        return;
      }
      Promise.all([
        import('docsearch-react'),
        import('docsearch-react/dist/esm/style.css'),
      ]).then(([{ DocSearch: DocSearchComp }]) => {
        DocSearch = DocSearchComp;
        setIsLoaded(true);
      });
    },
    [isLoaded, setIsLoaded]
  );

  const open = React.useCallback(
    function open() {
      load();
      setIsShowing(true);
    },
    [load, setIsShowing]
  );

  useEffect(() => {
    function onKeyDown(event) {
      if (
        (event.key === 'Escape' && isShowing) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();

        if (isShowing) {
          setIsShowing(!isShowing);
        } else {
          open();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isShowing, open]);

  return (
    <div>
      <SearchButton
        onClick={() => {
          open();
        }}
      />

      {isLoaded && isShowing && (
        <DocSearch
          appId={appId}
          apiKey={apiKey}
          indexName={indexName}
          searchParameters={searchParameters}
          onClose={() => setIsShowing(false)}
        />
      )}
    </div>
  );
}
