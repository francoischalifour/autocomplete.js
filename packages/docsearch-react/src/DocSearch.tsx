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
import { SelectCommandIcon } from './SelectCommandIcon';
import { ArrowUpCommandIcon } from './ArrowUpCommandIcon';
import { ArrowDownCommandIcon } from './ArrowDownCommandIcon';
import { EscapeCommandIcon } from './EscapeCommandIcon';
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
                        hitsPerPage: 5,
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
                        <h1>{title}</h1>

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
                                  <div className={`DSV3-${item.type}`}>
                                    <span className="DSV3-icon">📄</span>

                                    {item.hierarchy[item.type] && (
                                      <div>
                                        {item.type === 'lvl1' && (
                                          <div className="DSV3-content-wrapper">
                                            <Highlight
                                              hit={item}
                                              attribute="hierarchy.lvl1"
                                              className="DSV3-title"
                                            />
                                            {item.content && (
                                              <Snippet
                                                hit={item}
                                                attribute="content"
                                                className="DSV3-text"
                                              />
                                            )}
                                          </div>
                                        )}

                                        {(item.type === 'lvl2' ||
                                          item.type === 'lvl3') && (
                                          <div className="DSV3-content-wrapper">
                                            <Highlight
                                              hit={item}
                                              attribute={
                                                'hierarchy.' + item.type
                                              }
                                              className="DSV3-title"
                                            />
                                            <span>
                                              <span className="DSV3-separator">
                                                —
                                              </span>
                                              <Highlight
                                                hit={item}
                                                attribute="hierarchy.lvl1"
                                                className="DSV3-text"
                                              />
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {item.type === 'content' && (
                                      <div className="DSV3-content-wrapper">
                                        <Snippet
                                          hit={item}
                                          attribute="content"
                                          className="DSV3-title"
                                        />
                                        <span className="DSV3-separator">
                                          ...
                                        </span>
                                        <br />
                                        <span>
                                          <span className="DSV3-separator">
                                            —
                                          </span>
                                          <Highlight
                                            hit={item}
                                            attribute="hierarchy.lvl1"
                                            className="DSV3-text"
                                          />
                                        </span>
                                      </div>
                                    )}
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
              <SelectCommandIcon />
              <span className="DocSearch-Commands-description">to select</span>
            </li>
            <li>
              <ArrowUpCommandIcon />
              <ArrowDownCommandIcon />
              <span className="DocSearch-Commands-description">
                to navigate
              </span>
            </li>
            <li>
              <EscapeCommandIcon />
              <span className="DocSearch-Commands-description">to close</span>
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
