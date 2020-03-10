import React from 'react';
import algoliasearch from 'algoliasearch/lite';

import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import {
  Highlight,
  getAlgoliaHits,
} from '@francoischalifour/autocomplete-react';

import { AlgoliaLogo } from './AlgoliaLogo';

const noop = () => {};

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
              <svg viewBox="0 0 18 18">
                <path
                  d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                  stroke="currentColor"
                  strokeWidth="1.78"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </label>

            <div className="DocSearch-LoadingIndicator">
              <svg viewBox="0 0 38 38" stroke="currentColor" strokeOpacity=".5">
                <g fill="none" fillRule="evenodd">
                  <g transform="translate(1 1)" strokeWidth="2">
                    <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                    <path d="M36 18c0-9.94-8.06-18-18-18">
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 18 18"
                        to="360 18 18"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                </g>
              </svg>
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
              <svg viewBox="0 0 10 10">
                <path
                  d="M5 4.12L8.93.18a.62.62 0 1 1 .89.89L5.88 5l3.94 3.93a.62.62 0 1 1-.89.89L5 5.88 1.07 9.82a.62.62 0 1 1-.89-.89L4.12 5 .18 1.07a.62.62 0 1 1 .89-.89L5 4.12z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          </form>
        </header>

        <div className="DocSearch-Dropdown">
          <div className="DocSearch-Dropdown-Container">
            {state.suggestions.map((suggestion, index) => {
              const { source, items } = suggestion;

              return (
                <section key={`result-${index}`} className="DocSearch-Hits">
                  <ul {...getMenuProps()}>
                    {items.map((item, index) => {
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
                            <h1 className="DocSearch-Lvl0">
                              <Highlight
                                hit={item}
                                attribute="hierarchy.lvl0"
                              />
                            </h1>
                            <h2 className="DocSearch-Lvl1">
                              <Highlight
                                hit={item}
                                attribute="hierarchy.lvl1"
                              />
                            </h2>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

        <div className="DocSearch-Footer">
          <ul className="DocSearch-Commands">
            <li>Navigate</li>
            <li>Select</li>
          </ul>

          <div className="DocSearch-Logo">
            <AlgoliaLogo />
          </div>
        </div>
      </div>
    </div>
  );
}
