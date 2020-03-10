import React from 'react';
import algoliasearch from 'algoliasearch/lite';

import { createAutocomplete } from '@francoischalifour/autocomplete-core';
import {
  Highlight,
  getAlgoliaHits,
} from '@francoischalifour/autocomplete-react';

import { AlgoliaLogo } from './AlgoliaLogo';

const noop = () => { };

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
            <li>
              <svg viewBox="0 0 16 16">
                <defs>
                  <path
                    id="enter-a"
                    d="M7,1.33333333 L7,3.66666667 C7,4.6 6.26564673,5.33333333 5.3310153,5.33333333 L2.12656467,5.33333333 L3.22809458,6.43333333 C3.36161335,6.56666667 3.36161335,6.76666667 3.22809458,6.9 C3.16133519,6.96666667 3.0945758,7 2.99443672,7 C2.89429764,7 2.82753825,6.96666667 2.76077886,6.9 L1.09179416,5.23333333 C1.05841446,5.2 1.02503477,5.16666667 1.02503477,5.13333333 C0.991655076,5.06666667 0.991655076,4.96666667 1.02503477,4.86666667 C1.05841446,4.83333333 1.05841446,4.8 1.09179416,4.76666667 L2.76077886,3.1 C2.89429764,2.96666667 3.0945758,2.96666667 3.22809458,3.1 C3.36161335,3.23333333 3.36161335,3.43333333 3.22809458,3.56666667 L2.12656467,4.66666667 L5.3310153,4.66666667 C5.8984701,4.66666667 6.33240612,4.23333333 6.33240612,3.66666667 L6.33240612,1.33333333 C6.33240612,1.13333333 6.4659249,1 6.66620306,1 C6.86648122,1 7,1.13333333 7,1.33333333 Z"
                  />
                </defs>
                <g fill="none" fillRule="evenodd">
                  <rect
                    width="15"
                    height="15"
                    x=".5"
                    y=".5"
                    stroke="currentColor"
                    rx="2"
                    className="algolia-autocomplete-commands-border"
                  />
                  <g transform="translate(4 4)">
                    <mask id="enter-b" fill="currentColor">
                      <use xlinkHref="#enter-a" />
                    </mask>
                    <use
                      fill="currentColor"
                      fillRule="nonzero"
                      xlinkHref="#enter-a"
                    />
                    <g fill="currentColor" mask="url(#enter-b)">
                      <rect width="8" height="8" />
                    </g>
                  </g>
                </g>
              </svg>
              <span className="algolia-autocomplete-commands-description">
                to select
              </span>
            </li>
            <li>
              <svg viewBox="0 0 16 16">
                <defs>
                  <path
                    id="a"
                    d="M3.67 2.47L1.9 4.24a.33.33 0 0 1-.47-.48l2.33-2.33a.33.33 0 0 1 .48 0l2.33 2.33a.33.33 0 1 1-.47.48L4.33 2.47v3.86a.33.33 0 1 1-.66 0V2.47z"
                  />
                </defs>
                <g fill="none" fillRule="evenodd">
                  <rect
                    width="15"
                    height="15"
                    x=".5"
                    y=".5"
                    stroke="currentColor"
                    rx="2"
                    className="algolia-autocomplete-commands-border"
                  />
                  <g transform="translate(4 4)">
                    <mask id="b" fill="currentColor">
                      <use xlinkHref="#a" />
                    </mask>
                    <use
                      fill="currentColor"
                      fillRule="nonzero"
                      xlinkHref="#a"
                    />
                    <g fill="currentColor" mask="url(#b)">
                      <path d="M0 0h8v8H0z" />
                    </g>
                  </g>
                </g>
              </svg>
              <svg viewBox="0 0 16 16">
                <defs>
                  <path
                    id="a"
                    d="M3.67 2.47L1.9 4.24a.33.33 0 0 1-.47-.48l2.33-2.33a.33.33 0 0 1 .48 0l2.33 2.33a.33.33 0 1 1-.47.48L4.33 2.47v3.86a.33.33 0 1 1-.66 0V2.47z"
                  />
                </defs>
                <g fill="none" fillRule="evenodd">
                  <rect
                    width="15"
                    height="15"
                    x=".5"
                    y=".5"
                    stroke="currentColor"
                    rx="2"
                    className="algolia-autocomplete-commands-border"
                  />
                  <g transform="matrix(1 0 0 -1 4 12)">
                    <mask id="b" fill="currentColor">
                      <use xlinkHref="#a" />
                    </mask>
                    <use
                      fill="currentColor"
                      fillRule="nonzero"
                      xlinkHref="#a"
                    />
                    <g fill="currentColor" mask="url(#b)">
                      <path d="M0 0h8v8H0z" />
                    </g>
                  </g>
                </g>
              </svg>
              <span className="algolia-autocomplete-commands-description">
                to navigate
              </span>
            </li>
            <li>
              <svg viewBox="0 0 16 16">
                <g fill="none" fillRule="evenodd">
                  <path
                    fill="currentColor"
                    fillRule="nonzero"
                    d="M4.16 10.07c-1.07 0-1.73-.76-1.73-1.93v-.46c0-1.08.62-1.85 1.7-1.85 1.07 0 1.69.77 1.69 1.9v.38H3.1v.08c0 .78.4 1.31 1.06 1.31.48 0 .8-.23.92-.62h.67c-.15.68-.7 1.19-1.6 1.19zM3.1 7.57h2.03v-.01c0-.65-.4-1.17-1.01-1.17-.63 0-1.02.52-1.02 1.17v.01zm3.55-.5c0-.87.73-1.24 1.52-1.24.97 0 1.46.55 1.46 1.23h-.62c-.02-.31-.22-.68-.86-.68-.49 0-.84.21-.84.62 0 .46.54.56 1.01.64.77.14 1.42.35 1.42 1.15 0 .82-.66 1.28-1.63 1.28-.9 0-1.53-.44-1.53-1.18h.66c.06.38.38.63.93.63.62 0 .91-.3.91-.65 0-.46-.46-.55-1.03-.67-.77-.15-1.4-.39-1.4-1.13zm3.88 1.06v-.4c0-1.1.64-1.9 1.7-1.9.96 0 1.53.63 1.57 1.26h-.66a.89.89 0 0 0-.86-.67c-.68 0-1.08.5-1.08 1.33v.39c0 .8.43 1.33 1.08 1.33.51 0 .82-.27.89-.6h.66c-.14.7-.65 1.2-1.6 1.2-1.08 0-1.7-.84-1.7-1.94z"
                  />
                  <rect
                    width="15"
                    height="15"
                    x=".5"
                    y=".5"
                    stroke="currentColor"
                    rx="2"
                    className="algolia-autocomplete-commands-border"
                  />
                </g>
              </svg>
              <span className="algolia-autocomplete-commands-description">
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
