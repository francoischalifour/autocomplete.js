import React from 'react';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';
import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import {
  Highlight,
  Snippet,
  getAlgoliaHits,
} from '@francoischalifour/autocomplete-react';

import { DocSearchHit } from './types';
import { noop, groupBy } from './utils';
import { AlgoliaLogo } from './AlgoliaLogo';
import { SearchIcon } from './SearchIcon';
import { LoadingIcon } from './LoadingIcon';
import { ResetIcon } from './ResetIcon';

interface DocSearchProps {
  appId?: string;
  apiKey: string;
  indexName: string;
  searchParameters: any;
  onClose(): void;
}

function IconSource(props) {
  switch (props.icon) {
    case 'lvl1':
      return (
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 6h-4-1V1l5 5v11l-1 2H4l-1-1V2l1-1h8l5 5z" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinejoin="round" />
        </svg>
      )
    case 'content':
      return (
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 5H3h14zm0 5H3h14zm0 6H3h14z" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinejoin="round" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 13h4-4V8H7v5h6v4-4H7V8H3h4V3v5h6V3v5h4-4v5zm-6 0v4-4H3h4z" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

function IconAction(props) {
  switch (props.icon) {
    case 'goto-external':
      return (
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 6v9h9v-3a1 1 0 112 0v4l-1 1H4l-1-1V5l1-1h4a1 1 0 110 2H5zm5 5a1 1 0 11-1-1l5-6h-3a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 11-2 0V6l-6 5z" fill="currentColor" fillRule="nonzero" />
        </svg>
      )
    default:
      return (
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 2v5c0 2-1 4-4 4H4" />
            <path d="M8 16l-5-5 5-4" />
          </g>
        </svg>
      )
  }
}

function IconKey(props) {
  switch (props.icon) {
    case 'arrow-down':
      return (
        <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
            <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
          </g>
        </svg>
      )
    case 'arrow-up': return (
      <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
          <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
        </g>
      </svg>)
    case 'enter':
      return (
        <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
          <g stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
            <path d="M12 3.53088v3c0 1-1 2-2 2H4" />
            <path d="M7 11.53088l-3-3 3-3" />
          </g>
        </svg>
      )
    case 'escape':
      return (
        <svg width="15" height="15" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" stroke="currentColor" fill="none" />
        </svg>
      )
  }
}

export function DocSearch({
  appId = 'BH4D9OD16A',
  apiKey,
  indexName,
  searchParameters,
  onClose = noop,
}: DocSearchProps) {
  const [state, setState] = React.useState<any>({ query: '', suggestions: [] });

  const searchClient = React.useMemo(() => algoliasearch(appId, apiKey), [
    appId,
    apiKey,
  ]);

  const {
    // getEnvironmentProps,
    getRootProps,
    getFormProps,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = React.useMemo(
    () =>
      createAutocomplete<
        any,
        React.FormEvent<HTMLFormElement>,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        defaultHighlightedIndex: 0,
        autoFocus: true,
        placeholder: 'Search docs...',
        openOnFocus: true,
        onStateChange({ state }) {
          setState(state as any);
        },
        getSources() {
          return [
            {
              getSuggestionUrl({ suggestion }) {
                return suggestion.url;
              },
              getSuggestions({ query }) {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName,
                      query,
                      params: {
                        highlightPreTag: '<mark>',
                        highlightPostTag: '</mark>',
                        hitsPerPage: 10,
                        ...searchParameters,
                      },
                    },
                  ],
                });
              },
            },
          ];
        },
      }),
    [indexName, searchParameters, searchClient]
  );

  function groupBy(values, predicate) {
    return values.reduce(function (obj, item) {
      const key = predicate(item);
      if (!obj.hasOwnProperty(key)) {
        obj[key] = [];
      }
      obj[key].push(item);
      return obj;
    }, {});
  }

  function getLvl1(searchClient, treeLvl1) {
    return searchClient
      .search([
        {
          indexName: 'autocomplete',
          query: '',
          params: {
            facetFilters: ['type:lvl1'],
            hitsPerPage: 1000,
            attributesToRetrieve: '*',
            attributesToSnippet: '*',
            highlightPreTag: '<mark>',
            highlightPostTag: '</mark>',
          },
        },
      ])
      .then(results => {
        const lvl1Hits = results.results[0].hits;
        return lvl1Hits.filter(hit => !!treeLvl1.includes(hit.hierarchy.lvl1));
      });
  }

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { onSubmit, onReset } = getFormProps({
    inputElement: inputRef.current,
  });

  return (
    <div
      className={[
        'DocSearch-Container',
        state.status === 'stalled' && 'DocSearch-Container--Stalled',
        state.status === 'error' && 'DocSearch-Container--Errored',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={event => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      {...getRootProps()}
    >
      <div className="DocSearch-Modal">
        <header className="DocSearch-SearchBar">
          <form
            action=""
            role="search"
            noValidate
            className="DocSearch-Form"
            onSubmit={onSubmit}
            onReset={onReset}
          >
            <label className="DocSearch-MagnifierLabel" {...getLabelProps()}>
              <SearchIcon />
            </label>

            <div className="DocSearch-LoadingIndicator">
              <LoadingIcon />
            </div>

            {/*
                // @ts-ignore */}
            <input
              className="DocSearch-Input"
              ref={inputRef}
              {...getInputProps({
                inputElement: inputRef.current!,
                type: 'search',
                maxLength: '512',
              })}
            />

            <button
              type="reset"
              title="Clear the query"
              className="DocSearch-Reset"
              hidden={!state.query}
              // @ts-ignore
              onClick={onReset}
            >
              <ResetIcon />
            </button>
          </form>
        </header>

        <div className="DocSearch-Dropdown">
          <div className="DocSearch-Dropdown-Container">
            {state.suggestions.map((suggestion, index) => {
              const { source, items } = suggestion;

              const itemsGroupedByLevel = groupBy(
                items,
                item => item.hierarchy.lvl0
              );

              return (
                <section key={`result-${index}`} className="DocSearch-Hits">
                  {Object.entries<DocSearchHit[]>(itemsGroupedByLevel).map(
                    ([title, hits]) => (
                      <div key={title}>
                        <div className="DSV3-source">{title}</div>

                        <ul {...getMenuProps()}>
                          {hits.map((item, index) => {
                            return (
                              <li
                                key={`item-${index}`}
                                className="DocSearch-Hit"
                                {...getItemProps({
                                  item,
                                  source,
                                })}
                              >
                                <a href={item.url}>
                                  <div
                                    className={
                                      `DSV3-${item.type}` +
                                      ' ' +
                                      (item.lastLvl1 || '') +
                                      ' ' +
                                      (item.lastLvl0 || '') +
                                      ' ' +
                                      (item._show || '')
                                    }
                                  >
                                    <div className="DSV3-icon">
                                      <IconSource icon={item.type} />
                                    </div>
                                    {item.hierarchy[item.type] && item.type === 'lvl1' && (
                                      <div className="DSV3-content-wrapper">
                                        <Highlight
                                          hit={item}
                                          attribute="hierarchy.lvl1"
                                          className="DSV3-title"
                                        />
                                        <br />
                                        {item.content && (
                                          <Snippet
                                            hit={item}
                                            attribute="content"
                                            className="DSV3-path"
                                          />
                                        )}
                                      </div>
                                    )}
                                    {item.hierarchy[item.type] && (item.type === 'lvl2' ||
                                      item.type === 'lvl3') && (
                                        <div className="DSV3-content-wrapper">
                                          <Highlight
                                            hit={item}
                                            attribute={'hierarchy.' + item.type}
                                            className="DSV3-title"
                                          />
                                          <br />
                                          <span>
                                            <Highlight
                                              hit={item}
                                              attribute="hierarchy.lvl1"
                                              className="DSV3-path"
                                            />
                                          </span>
                                        </div>
                                      )}
                                    {item.type === 'content' && (
                                      <div className="DSV3-content-wrapper">
                                        <Snippet
                                          hit={item}
                                          attribute="content"
                                          className="DSV3-title"
                                        />
                                        <span className="DSV3-separator">...</span>
                                        <br />
                                        <span>
                                          <Highlight
                                            hit={item}
                                            attribute="hierarchy.lvl1"
                                            className="DSV3-path"
                                          />
                                        </span>
                                      </div>
                                    )}
                                    <div className="DSV3-action"><IconAction icon="goto" /></div>
                                  </div>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )
                  )}

                </section>
              );
            })}
          </div>
        </div>

        <div className="DocSearch-Footer">
          <ul className="DocSearch-Commands">
            <li>
              <span className="DocSearch-Commands-key">
                <IconKey icon="enter" />
              </span>
              <span className="DocSearch-Hint">
                to select
              </span>
            </li>
            <li>
              {/* <ArrowDownCommandIcon /> */}
              <span className="DocSearch-Commands-key">
                <IconKey icon="arrow-down" />
              </span>
              <span className="DocSearch-Commands-key">
                <IconKey icon="arrow-up" />
              </span>
              <span className="DocSearch-Hint">
                to navigate
              </span>
            </li>
            <li>
              <span className="DocSearch-Commands-key">
                <IconKey icon="escape" />
              </span>
              <span className="DocSearch-Hint">
                to close
              </span>
            </li>
          </ul>
          <div className="DocSearch-Logo">
            <AlgoliaLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
