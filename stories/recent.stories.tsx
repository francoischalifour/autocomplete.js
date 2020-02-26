/** @jsx h */

import { h, render } from 'preact';
import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';
import RecentSearches from 'recent-searches';

import { Autocomplete } from '@francoischalifour/autocomplete-react';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-preset-algolia';
import { withPlayground } from '../.storybook/decorators';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

storiesOf('Recent', module).add(
  'Local storage',
  withPlayground(({ container, dropdownContainer }) => {
    const recentSearches = new RecentSearches();

    render(
      <Autocomplete
        placeholder="Search items…"
        minLength={0}
        showCompletion={true}
        dropdownContainer={dropdownContainer}
        defaultHighlightedIndex={null}
        onSubmit={({ state }) => {
          recentSearches.setRecentSearch(state.query, { query: state.query });
        }}
        getSources={() => {
          return [
            {
              getInputValue({ suggestion }) {
                return suggestion.query;
              },
              getSuggestions({ query }) {
                return recentSearches.getRecentSearches(query);
              },
            },
            {
              getInputValue({ suggestion }) {
                return suggestion.query;
              },
              onSelect({ suggestion, suggestionValue }) {
                recentSearches.setRecentSearch(suggestionValue, suggestion);
              },
              getSuggestions({ query }) {
                return getAlgoliaHits({
                  searchClient,
                  queries: [
                    {
                      indexName: 'instant_search_demo_query_suggestions',
                      query,
                      params: {
                        hitsPerPage: 4,
                      },
                    },
                  ],
                }).then(hits => {
                  const recentHits = recentSearches.getRecentSearches(query);

                  // Remove duplicates from the Algolia received results.
                  return hits.filter(
                    hit =>
                      recentHits.map(x => x.query).indexOf(hit.query) === -1
                  );
                });
              },
            },
          ];
        }}
      />,
      container
    );

    return container;
  })
);
