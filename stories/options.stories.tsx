/** @jsx h */

import { h } from 'preact';
import { storiesOf } from '@storybook/html';
import * as algoliasearch from 'algoliasearch';
import RecentSearches from 'recent-searches';

import { withPlayground } from '../.storybook/decorators';
import autocomplete, {
  highlightAlgoliaHit,
  reverseHighlightAlgoliaHit,
  snippetAlgoliaHit,
  getAlgoliaHits,
  getAlgoliaResults,
} from '../src';
import { states, fruits, artists } from './data';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const querySuggestionsSource = {
  getInputValue: ({ suggestion }) => suggestion.query + ' ',
  getSuggestions({ query }) {
    return getAlgoliaHits({
      searchClient,
      query,
      searchParameters: [
        {
          indexName: 'instant_search_demo_query_suggestions',
          params: {
            hitsPerPage: 4,
          },
        },
      ],
    }).then(hits => {
      return hits
        .filter(
          suggestion =>
            suggestion.query !== query.toLocaleLowerCase() &&
            `${suggestion.query} ` !== query.toLocaleLowerCase()
        )
        .slice(0, 3);
    });
  },
  onSelect({ setIsOpen }) {
    setIsOpen(true);
  },
  templates: {
    suggestion({ suggestion }) {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 28 }}>
              <svg
                viewBox="0 0 18 18"
                width={16}
                style={{
                  color: 'rgba(0, 0, 0, 0.3)',
                }}
              >
                <path
                  d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                  stroke="currentColor"
                  strokeWidth="1.78"
                  fill="none"
                  fillRule="evenodd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>

            <div
              dangerouslySetInnerHTML={{
                __html: reverseHighlightAlgoliaHit({
                  hit: suggestion,
                  attribute: 'query',
                }),
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: 28,
            }}
          >
            <svg
              height="13"
              viewBox="0 0 13 13"
              width="13"
              style={{
                color: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <path
                d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      );
    },
  },
};

const createSource = (items: any[], { templates = {}, limit = 10 } = {}) => ({
  getSuggestions({ query }) {
    return items
      .filter(item =>
        item.value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      )
      .slice(0, limit);
  },
  getInputValue: ({ suggestion }) => suggestion.value,
  templates: {
    suggestion: ({ suggestion }) => (
      <div style={{ display: 'flex' }}>
        {suggestion.icon && (
          <div
            style={{ width: 24 }}
            dangerouslySetInnerHTML={{ __html: suggestion.icon }}
          />
        )}
        <span>{suggestion.value}</span>
      </div>
    ),
    ...templates,
  },
});

storiesOf('Options', module)
  .add(
    'Static values',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search for U.S. states… (e.g. "Carolina")',
        getSources() {
          return [createSource(states)];
        },
      });

      return container;
    })
  )
  .add(
    'Initial state',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search for U.S. states… (e.g. "Carolina")',
        initialState: {
          query: 'Carolina',
        },
        getSources() {
          return [createSource(states)];
        },
      });

      return container;
    })
  )
  .add(
    'Multiple sources',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder:
          'Search for states, fruits, artists… (e.g. "Carolina", "Apple", "John")',
        minLength: 0,
        getSources({ query }) {
          if (!query) {
            return [
              createSource(fruits, {
                limit: 5,
                templates: {
                  header: ({ state }) =>
                    state.results[0].length === 0
                      ? ''
                      : '<h5 class="suggestions-header">Fruits</h5>',
                },
              }),
            ];
          }

          return [
            createSource(fruits, {
              limit: 5,
              templates: {
                header: ({ state }) =>
                  state.results[0].length === 0
                    ? ''
                    : '<h5 class="suggestions-header">Fruits</h5>',
              },
            }),
            createSource(artists, {
              limit: 5,
              templates: {
                header: ({ state }) =>
                  state.results[1].length === 0
                    ? ''
                    : '<h5 class="suggestions-header">Artists</h5>',
              },
            }),
            createSource(states, {
              limit: 5,
              templates: {
                header: ({ state }) =>
                  state.results[2].length === 0
                    ? ''
                    : '<h5 class="suggestions-header">States</h5>',
              },
            }),
          ];
        },
      });

      return container;
    })
  )
  .add(
    'Minimal query length to 3',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search for fruits (e.g. "apple")',
        minLength: 3,
        getSources() {
          return [createSource(fruits)];
        },
      });

      return container;
    })
  )
  .add(
    'Menu opening on focus',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search for fruits (e.g. "banana")',
        minLength: 0,
        getSources() {
          return [createSource(fruits)];
        },
      });

      return container;
    })
  )
  .add(
    'Keyboard shortcuts',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search… (focus the inner window and type "/" or "a")',
        keyboardShortcuts: ['/', 'a'],
        getSources() {
          return [createSource(fruits)];
        },
      });

      return container;
    })
  )
  .add(
    'No default selection',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search… (first item is not selected by default)',
        defaultHighlightedIndex: -1,
        getSources() {
          return [createSource(fruits)];
        },
      });

      return container;
    })
  )
  .add(
    'Deferred values',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        showCompletion: true,
        getSources() {
          return [
            {
              getSuggestions({ query }) {
                return new Promise(resolve => {
                  const wait = setTimeout(() => {
                    clearTimeout(wait);

                    resolve(
                      fruits.filter(fruit =>
                        fruit.value
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase())
                      )
                    );
                  }, 400);
                });
              },
              getInputValue: ({ suggestion }) => suggestion.value,
              templates: {
                header: () => '<h5 class="suggestions-header">Fruits</h5> ',
                suggestion: ({ suggestion }) => suggestion.value,
                empty: ({ state }) => `No fruits found for "${state.query}".`,
              },
            },
            {
              getSuggestions({ query }) {
                return new Promise(resolve => {
                  const wait = setTimeout(() => {
                    clearTimeout(wait);
                    resolve(
                      artists.filter(artist =>
                        artist.value
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase())
                      )
                    );
                  }, 600);
                });
              },
              getInputValue: ({ suggestion }) => suggestion.value,
              templates: {
                header: () => '<h5 class="suggestions-header">artists</h5>',
                suggestion: ({ suggestion }) => suggestion.value,
                empty: ({ state }) => `No artists found for "${state.query}".`,
              },
            },
          ];
        },
      });

      return container;
    })
  )
  .add(
    'Deferred values without stall threshold',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search (the loader spins right away)',
        stallThreshold: 0,
        getSources() {
          return [
            {
              getSuggestions({ query }) {
                return new Promise(resolve => {
                  const wait = setTimeout(() => {
                    clearTimeout(wait);
                    resolve(
                      fruits.filter(fruit =>
                        fruit.value
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase())
                      )
                    );
                  }, 400);
                });
              },
              getInputValue: ({ suggestion }) => suggestion.value,
              templates: {
                header: () => '<h5 class="suggestions-header">Fruits</h5>',
                suggestion: ({ suggestion }) => suggestion.value,
                empty: ({ state }) => `No fruits found for "${state.query}".`,
              },
            },
            {
              getSuggestions({ query }) {
                return new Promise(resolve => {
                  const wait = setTimeout(() => {
                    clearTimeout(wait);
                    resolve(
                      artists.filter(artist =>
                        artist.value
                          .toLocaleLowerCase()
                          .includes(query.toLocaleLowerCase())
                      )
                    );
                  }, 600);
                });
              },
              getInputValue: ({ suggestion }) => suggestion.value,
              templates: {
                header: () => '<h5 class="suggestions-header">artists</h5>',
                suggestion: ({ suggestion }) => suggestion.value,
                empty: ({ state }) => `No artists found for "${state.query}".`,
              },
            },
          ];
        },
      });

      return container;
    })
  )
  .add(
    'Completion',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        showCompletion: true,
        getSources() {
          return [querySuggestionsSource];
        },
      });

      return container;
    })
  )
  .add(
    'RTL',
    withPlayground(({ container, dropdownContainer }) => {
      container.dir = 'rtl';

      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        getSources() {
          return [querySuggestionsSource];
        },
      });

      return container;
    })
  )
  .add(
    'Recent searches',
    withPlayground(({ container, dropdownContainer }) => {
      const recentSearches = new RecentSearches({
        limit: 3,
      });

      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        showCompletion: true,
        minLength: 0,
        getSources() {
          return [
            {
              getInputValue: ({ suggestion }) => suggestion.query + ' ',
              getSuggestions({ query }) {
                if (query) {
                  return [];
                }

                // Also inject some fake searches for the demo
                return [
                  ...recentSearches.getRecentSearches(),
                  { query: 'guitar' },
                  { query: 'amazon' },
                ].slice(0, 3);
              },
              templates: {
                suggestion({ suggestion }) {
                  return (
                    <div style={{ display: 'flex' }}>
                      <div style={{ width: 28 }}>
                        <img
                          src="https://image.flaticon.com/icons/svg/61/61122.svg"
                          width="16"
                          height="16"
                          style={{
                            opacity: 0.3,
                          }}
                        />
                      </div>

                      {suggestion.query}
                    </div>
                  );
                },
              },
            },
            querySuggestionsSource,
          ];
        },
      });

      return container;
    })
  )
  .add(
    'Templating with columns',
    withPlayground(({ container, dropdownContainer }) => {
      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        minLength: 0,
        showCompletion: true,
        defaultHighlightedIndex: -1,
        transformResultsRender(results) {
          const [querySuggestions, products, articles] = results;

          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div>{querySuggestions}</div>

              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>{products}</div>
                <div style={{ flex: 1 }}>{articles}</div>
              </div>
            </div>
          );
        },
        getSources({ query, setContext }) {
          return getAlgoliaResults({
            searchClient,
            query,
            searchParameters: [
              {
                indexName: 'instant_search_demo_query_suggestions',
                params: {
                  hitsPerPage: 3,
                },
              },
              {
                indexName: 'instant_search',
                params: {
                  attributesToSnippet: ['description'],
                },
              },
              {
                indexName: 'instant_search_media',
                params: {
                  attributesToSnippet: ['description'],
                },
              },
            ],
          }).then(results => {
            const [
              querySuggestionsResults,
              productsResults,
              articlesResults,
            ] = results;
            const querySuggestionsHits = querySuggestionsResults.hits;
            const productsHits = productsResults.hits;
            const articlesHits = articlesResults.hits;

            setContext({
              nbProductsHits: productsResults.nbHits,
              nbArticlesHits: articlesResults.nbHits,
            });

            return [
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions() {
                  return querySuggestionsHits;
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: 28 }}>
                            <svg
                              viewBox="0 0 18 18"
                              width={16}
                              style={{
                                color: 'rgba(0, 0, 0, 0.3)',
                              }}
                            >
                              <path
                                d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                                stroke="currentColor"
                                strokeWidth="1.78"
                                fill="none"
                                fillRule="evenodd"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: reverseHighlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'query',
                              }),
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: 28,
                          }}
                        >
                          <svg
                            height="13"
                            viewBox="0 0 13 13"
                            width="13"
                            style={{
                              color: 'rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <path
                              d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                              transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  },
                },
              },
              {
                getSuggestions() {
                  return productsHits;
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                templates: {
                  header: ({ state }) => (
                    <h5 className="suggestions-header">
                      Products ({state.context.nbProductsHits})
                    </h5>
                  ),
                  suggestion({ suggestion }) {
                    return (
                      <a
                        href={suggestion.url}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <h2
                          style={{ fontSize: 'inherit', margin: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: highlightAlgoliaHit({
                              hit: suggestion,
                              attribute: 'name',
                            }),
                          }}
                        />
                      </a>
                    );
                  },
                },
              },
              {
                getSuggestions() {
                  return articlesHits;
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                templates: {
                  header: ({ state }) => (
                    <h5 className="suggestions-header">
                      Articles ({state.context.nbArticlesHits})
                    </h5>
                  ),
                  suggestion({ suggestion }) {
                    return (
                      <a
                        href={suggestion.url}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <h2
                          style={{ fontSize: 'inherit', margin: 0 }}
                          dangerouslySetInnerHTML={{
                            __html: highlightAlgoliaHit({
                              hit: suggestion,
                              attribute: 'title',
                            }),
                          }}
                        />
                      </a>
                    );
                  },
                },
              },
            ];
          });
        },
      });

      return container;
    })
  )
  .add(
    'Hits',
    withPlayground(({ container, dropdownContainer }) => {
      const recentSearches = new RecentSearches({
        limit: 3,
      });

      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search…',
        minLength: 0,
        showCompletion: true,
        defaultHighlightedIndex: -1,
        getSources({ query, setContext }) {
          return getAlgoliaResults({
            searchClient,
            query,
            searchParameters: [
              {
                indexName: 'instant_search',
                params: {
                  attributesToSnippet: ['description'],
                },
              },
              {
                indexName: 'instant_search_demo_query_suggestions',
                params: {
                  hitsPerPage: 3,
                },
              },
            ],
          }).then(results => {
            const [productsResults, querySuggestionsResults] = results;
            const productsHits = productsResults.hits;
            const querySuggestionsHits = querySuggestionsResults.hits;

            setContext({
              nbProductsHits: productsResults.nbHits,
            });

            return [
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions({ query }) {
                  if (query) {
                    return [];
                  }

                  // Also inject some fake searches for the demo
                  return [
                    ...recentSearches.getRecentSearches(),
                    { query: 'guitar' },
                    { query: 'amazon' },
                  ].slice(0, 3);
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: 28 }}>
                          <img
                            src="https://image.flaticon.com/icons/svg/61/61122.svg"
                            width="16"
                            height="16"
                            style={{
                              opacity: 0.3,
                            }}
                          />
                        </div>

                        {suggestion.query}
                      </div>
                    );
                  },
                },
              },
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions() {
                  return querySuggestionsHits;
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: 28 }}>
                            <svg
                              viewBox="0 0 18 18"
                              width={16}
                              style={{
                                color: 'rgba(0, 0, 0, 0.3)',
                              }}
                            >
                              <path
                                d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                                stroke="currentColor"
                                strokeWidth="1.78"
                                fill="none"
                                fillRule="evenodd"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </div>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: reverseHighlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'query',
                              }),
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: 28,
                          }}
                        >
                          <svg
                            height="13"
                            viewBox="0 0 13 13"
                            width="13"
                            style={{
                              color: 'rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <path
                              d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                              transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  },
                },
              },
              {
                getSuggestions() {
                  return productsHits;
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                onSelect({ state }) {
                  const query = state.query;

                  if (query.length >= 3) {
                    recentSearches.setRecentSearch(query);
                  }
                },
                templates: {
                  header: ({ state }) => (
                    <h5 className="suggestions-header">
                      Products ({state.context.nbProductsHits})
                    </h5>
                  ),
                  suggestion({ suggestion }) {
                    return (
                      <a
                        href={suggestion.url}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            flex: 1,
                            maxWidth: 70,
                            maxHeight: 70,
                            paddingRight: '1rem',
                          }}
                        >
                          <img
                            src={suggestion.image}
                            alt={suggestion.name}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        </div>

                        <div style={{ flex: 3 }}>
                          <h2
                            style={{ fontSize: 'inherit', margin: 0 }}
                            dangerouslySetInnerHTML={{
                              __html: highlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'name',
                              }),
                            }}
                          />

                          <p
                            style={{
                              margin: '.5rem 0 0 0',
                              color: 'rgba(0, 0, 0, 0.5)',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: snippetAlgoliaHit({
                                hit: suggestion,
                                attribute: 'description',
                              }),
                            }}
                          />
                        </div>
                      </a>
                    );
                  },
                },
              },
            ];
          });
        },
      });

      return container;
    })
  )
  .add(
    'Inject classNames on sources',
    withPlayground(({ container, dropdownContainer }) => {
      const recentSearches = new RecentSearches({
        limit: 3,
      });

      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search… with injected class',
        minLength: 0,
        showCompletion: true,
        defaultHighlightedIndex: -1,
        getSources({ query, setContext }) {
          return getAlgoliaResults({
            searchClient,
            query,
            searchParameters: [
              {
                indexName: 'instant_search',
                params: {
                  attributesToSnippet: ['description'],
                },
              },
              {
                indexName: 'instant_search_demo_query_suggestions',
                params: {
                  hitsPerPage: 3,
                },
              },
            ],
          }).then(results => {
            const [productsResults, querySuggestionsResults] = results;
            const productsHits = productsResults.hits;
            const querySuggestionsHits = querySuggestionsResults.hits;

            setContext({
              nbProductsHits: productsResults.nbHits,
            });

            return [
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions({ query }) {
                  if (query) {
                    return [];
                  }

                  // Also inject some fake searches for the demo
                  return [
                    ...recentSearches.getRecentSearches(),
                    { query: 'guitar' },
                    { query: 'amazon' },
                  ].slice(0, 3);
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: 28 }}>
                          <img
                            src="https://image.flaticon.com/icons/svg/61/61122.svg"
                            width="16"
                            height="16"
                            style={{
                              opacity: 0.3,
                            }}
                          />
                        </div>

                        {suggestion.query}
                      </div>
                    );
                  },
                },
                classNames: {
                  classNames: {
                    footer: 'extra-bgc-nebula',
                  },
                },
              },
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions() {
                  return querySuggestionsHits;
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: 28 }}>
                            <svg
                              viewBox="0 0 18 18"
                              width={16}
                              style={{
                                color: 'rgba(0, 0, 0, 0.3)',
                              }}
                            >
                              <path
                                d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                                stroke="currentColor"
                                strokeWidth="1.78"
                                fill="none"
                                fillRule="evenodd"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </div>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: reverseHighlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'query',
                              }),
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: 28,
                          }}
                        >
                          <svg
                            height="13"
                            viewBox="0 0 13 13"
                            width="13"
                            style={{
                              color: 'rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <path
                              d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                              transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  },
                },
                classNames: {
                  empty: 'extra-bgc-nebula extra-color-mars-1',
                  suggestion: 'extra-bgc-nebula',
                },
              },
              {
                getSuggestions() {
                  return productsHits;
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                onSelect({ state }) {
                  const query = state.query;

                  if (query.length >= 3) {
                    recentSearches.setRecentSearch(query);
                  }
                },
                templates: {
                  header: ({ state }) => (
                    <h5 className="suggestions-header">
                      Products ({state.context.nbProductsHits})
                    </h5>
                  ),
                  suggestion({ suggestion }) {
                    return (
                      <a
                        href={suggestion.url}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            flex: 1,
                            maxWidth: 70,
                            maxHeight: 70,
                            paddingRight: '1rem',
                          }}
                        >
                          <img
                            src={suggestion.image}
                            alt={suggestion.name}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        </div>

                        <div style={{ flex: 3 }}>
                          <h2
                            style={{ fontSize: 'inherit', margin: 0 }}
                            dangerouslySetInnerHTML={{
                              __html: highlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'name',
                              }),
                            }}
                          />

                          <p
                            style={{
                              margin: '.5rem 0 0 0',
                              color: 'rgba(0, 0, 0, 0.5)',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: snippetAlgoliaHit({
                                hit: suggestion,
                                attribute: 'description',
                              }),
                            }}
                          />
                        </div>
                      </a>
                    );
                  },
                },
                classNames: {
                  root: 'extra-bgc-nebula extra-color-mars-1',
                },
              },
            ];
          });
        },
      });

      return container;
    })
  )
  .add(
    'shouldDropdownOpen=()=>true and minLength=4',
    withPlayground(({ container, dropdownContainer }) => {
      const recentSearches = new RecentSearches({
        limit: 3,
      });

      autocomplete({
        container,
        dropdownContainer,
        placeholder: 'Search on 2 srcs...',
        minLength: 4,
        showCompletion: true,
        defaultHighlightedIndex: -1,
        shouldDropdownOpen: () => true,
        getSources({ query, setContext }) {
          return getAlgoliaResults({
            searchClient,
            query,
            searchParameters: [
              {
                indexName: 'instant_search',
                params: {
                  attributesToSnippet: ['description'],
                },
              },
              {
                indexName: 'instant_search_demo_query_suggestions',
                params: {
                  hitsPerPage: 3,
                },
              },
            ],
          }).then(results => {
            const [productsResults, querySuggestionsResults] = results;
            const productsHits = productsResults.hits;
            const querySuggestionsHits = querySuggestionsResults.hits;

            setContext({
              nbProductsHits: productsResults.nbHits,
            });

            return [
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions({ query }) {
                  if (query) {
                    return [];
                  }

                  // Also inject some fake searches for the demo
                  return [
                    ...recentSearches.getRecentSearches(),
                    { query: 'guitar' },
                    { query: 'amazon' },
                  ].slice(0, 3);
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div style={{ display: 'flex' }}>
                        <div style={{ width: 28 }}>
                          <img
                            src="https://image.flaticon.com/icons/svg/61/61122.svg"
                            width="16"
                            height="16"
                            style={{
                              opacity: 0.3,
                            }}
                          />
                        </div>

                        {suggestion.query}
                      </div>
                    );
                  },
                },
              },
              {
                getInputValue: ({ suggestion }) => suggestion.query + ' ',
                getSuggestions() {
                  return querySuggestionsHits;
                },
                onSelect({ setIsOpen }) {
                  setIsOpen(true);
                },
                templates: {
                  suggestion({ suggestion }) {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          <div style={{ width: 28 }}>
                            <svg
                              viewBox="0 0 18 18"
                              width={16}
                              style={{
                                color: 'rgba(0, 0, 0, 0.3)',
                              }}
                            >
                              <path
                                d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
                                stroke="currentColor"
                                strokeWidth="1.78"
                                fill="none"
                                fillRule="evenodd"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              ></path>
                            </svg>
                          </div>

                          <div
                            dangerouslySetInnerHTML={{
                              __html: reverseHighlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'query',
                              }),
                            }}
                          />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            width: 70,
                          }}
                        >
                          <svg
                            height="13"
                            viewBox="0 0 13 13"
                            width="13"
                            style={{
                              color: 'rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <path
                              d="m16 7h-12.17l5.59-5.59-1.42-1.41-8 8 8 8 1.41-1.41-5.58-5.59h12.17z"
                              transform="matrix(.70710678 .70710678 -.70710678 .70710678 6 -5.313708)"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  },
                  empty: ({ state }) =>
                    `<h1>Good try, empty template is here to help. You have typed: "${state.query}"<h1>`,
                },
              },
              {
                getSuggestions() {
                  return productsHits;
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                onSelect({ state }) {
                  const query = state.query;

                  if (query.length >= 3) {
                    recentSearches.setRecentSearch(query);
                  }
                },
                templates: {
                  header: ({ state }) =>
                    state.results &&
                    state.results.some(
                      result => result.suggestions.length > 0
                    ) && (
                      <h5 className="suggestions-header">
                        Products ({state.context.nbProductsHits})
                      </h5>
                    ),

                  suggestion({ suggestion }) {
                    return (
                      <a
                        href={suggestion.url}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <div
                          style={{
                            flex: 1,
                            maxWidth: 70,
                            maxHeight: 70,
                            paddingRight: '1rem',
                          }}
                        >
                          <img
                            src={suggestion.image}
                            alt={suggestion.name}
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                          />
                        </div>

                        <div style={{ flex: 3 }}>
                          <h2
                            style={{ fontSize: 'inherit', margin: 0 }}
                            dangerouslySetInnerHTML={{
                              __html: highlightAlgoliaHit({
                                hit: suggestion,
                                attribute: 'name',
                              }),
                            }}
                          />

                          <p
                            style={{
                              margin: '.5rem 0 0 0',
                              color: 'rgba(0, 0, 0, 0.5)',
                            }}
                            dangerouslySetInnerHTML={{
                              __html: snippetAlgoliaHit({
                                hit: suggestion,
                                attribute: 'description',
                              }),
                            }}
                          />
                        </div>
                      </a>
                    );
                  },
                  empty: ({ state }) => `<h6>Product template empty</h6>`,
                },
              },
            ];
          });
        },
      });
      return container;
    })
  );
