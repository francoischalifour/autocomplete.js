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

  const onOpen = React.useCallback(
    function onOpen() {
      load();
      setIsShowing(true);
      document.body.classList.add('DocSearch--active');
    },
    [load, setIsShowing]
  );

  const onClose = React.useCallback(
    function onClose() {
      setIsShowing(false);
      document.body.classList.remove('DocSearch--active');
    },
    [setIsShowing]
  );

  useEffect(() => {
    function onKeyDown(event) {
      if (
        (event.key === 'Escape' && isShowing) ||
        (event.key === 'k' && (event.metaKey || event.ctrlKey))
      ) {
        event.preventDefault();

        if (isShowing) {
          onClose();
        } else {
          onOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isShowing, onOpen, onClose]);

  return (
    <div>
      <SearchButton onClick={onOpen} />

      {isLoaded && isShowing && (
        <DocSearch
          appId={appId}
          apiKey={apiKey}
          indexName={indexName}
          searchParameters={searchParameters}
          onClose={onClose}
        />
      )}
    </div>
  );
}
