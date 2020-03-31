import React from 'react';

import { InternalDocSearchHit } from '../../types';

function isLocalStorageSupported() {
  const key = '__TEST_KEY__';

  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);

    return true;
  } catch (error) {
    return false;
  }
}

type RecentSearchOptions = {
  limit?: number;
};

export function makeRecentSearches(options: RecentSearchOptions = {}) {
  if (isLocalStorageSupported() === false) {
    return null;
  }

  const STORAGE_KEY = '__AUTOCOMPLETE_RECENT_SEARCHES__';
  const { limit = 3 } = options;

  function saveSearch(newSearch: InternalDocSearchHit) {
    console.group('saveSearch');
    console.log(newSearch.objectID);
    console.groupEnd();

    const nextSearches = getSearches();

    const isQueryAlreadySaved = nextSearches.findIndex(
      x => x.objectID === newSearch.objectID
    );

    if (isQueryAlreadySaved > -1) {
      nextSearches.splice(isQueryAlreadySaved, 1);
    }

    nextSearches.unshift(newSearch);

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextSearches.slice(0, limit))
    );
  }

  function deleteSearch(search: InternalDocSearchHit) {
    console.group('deleteSearch');
    console.log(search.objectID);
    console.groupEnd();

    const nextSsearches = getSearches().filter(
      x => x.objectID !== search.objectID
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSsearches));
  }

  function getSearches() {
    const storedSearches = window.localStorage.getItem(STORAGE_KEY);

    console.group('getSearches');
    console.log(
      storedSearches ? JSON.parse(storedSearches).map(x => x.objectID) : []
    );
    console.groupEnd();

    return storedSearches ? JSON.parse(storedSearches) : [];
  }

  return {
    saveSearch,
    deleteSearch,
    getSearches,
  };
}

type RecentSearchesPluginOptions = {
  limit?: number;
  onSelect(): void;
  onActionClick(): void;
};

export function createRecentSearches({
  onSelect,
  onActionClick,
  ...options
}: RecentSearchesPluginOptions) {
  const recentSearches = makeRecentSearches(options);

  return {
    onSelect({ suggestion }) {
      if (recentSearches) {
        const { _highlightResult, _snippetResult, ...search } = suggestion;

        recentSearches.saveSearch(search);
      }
    },

    getSource({ query }) {
      if (recentSearches === null) {
        return null;
      }

      return {
        onSelect({ suggestion }) {
          recentSearches.saveSearch(suggestion);
          onSelect();
        },
        getSuggestionUrl({ suggestion }) {
          return suggestion.url;
        },
        getSuggestions() {
          if (query) {
            return [];
          }

          return recentSearches.getSearches().map(item => ({
            ...item,
            // eslint-disable-next-line @typescript-eslint/camelcase
            __docsearch_source: 'recent-searches',
            // eslint-disable-next-line @typescript-eslint/camelcase
            __docsearch_title: 'Recent',
          }));
        },
      };
    },

    render(props) {
      if (recentSearches === null) {
        return null;
      }

      const { children, ...suggestion } = props;

      return (
        <div className="DocSearch-Hit-Container">
          <div className="DocSearch-Hit-icon">
            <svg width="20" height="20">
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                fillRule="evenodd"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
                <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
              </g>
            </svg>
          </div>

          {children}

          <div className="DocSearch-Hit-action">
            <button
              className="DocSearch-Hit-action-button"
              title="Delete this search"
              onClick={event => {
                event.preventDefault();
                event.stopPropagation();

                console.log('onActionClick', suggestion);
                recentSearches.deleteSearch(suggestion);

                onActionClick();
              }}
            >
              <svg width="20" height="20">
                <g
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path
                    d="M10,10 L15.0853291,4.91467086 L10,10 L15.0853291,15.0853291 L10,10 Z M10,10 L4.91467086,4.91467086 L10,10 L4.91467086,15.0853291 L10,10 Z"
                    transform="translate(10.000000, 10.000000) rotate(-360.000000) translate(-10.000000, -10.000000) "
                  ></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      );
    },
  };
}
