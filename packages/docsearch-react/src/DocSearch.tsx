import React from 'react';
import algoliasearch from 'algoliasearch/dist/algoliasearch-lite.esm.browser';
import {
  createAutocomplete,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';
import { getAlgoliaHits } from '@francoischalifour/autocomplete-react';

import { noop, groupBy } from './utils';
import { SearchBox } from './SearchBox';
import { Results } from './Results';
import { Footer } from './Footer';
import { DocSearchHit, InternalDocSearchHit } from './types';

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
  const [state, setState] = React.useState<
    AutocompleteState<InternalDocSearchHit>
  >({
    query: '',
    suggestions: [],
  } as any);

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
        InternalDocSearchHit,
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
        getSources({ query }) {
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
                  distinct: 3,
                  ...searchParameters,
                },
              },
            ],
          }).then((hits: DocSearchHit[]) => {
            const formattedHits = hits.map(hit => {
              const url = new URL(hit.url);
              return {
                ...hit,
                url: hit.url
                  // @TODO: temporary convenience for development.
                  .replace(url.origin, '')
                  .replace('#__docusaurus', ''),
              };
            });
            const sources = groupBy(formattedHits, hit => hit.hierarchy.lvl0);

            return Object.values<DocSearchHit[]>(sources).map(items => {
              return {
                onSelect() {
                  onClose();
                },
                getSuggestionUrl({ suggestion }) {
                  return suggestion.url;
                },
                getSuggestions() {
                  return Object.values(
                    groupBy(items, item => item.hierarchy.lvl1)
                  )
                    .map(hits =>
                      hits.map(item => {
                        return {
                          ...item,
                          // eslint-disable-next-line @typescript-eslint/camelcase
                          __docsearch_parent:
                            item.type !== 'lvl1' &&
                            hits.find(
                              siblingItem =>
                                siblingItem.type === 'lvl1' &&
                                siblingItem.hierarchy.lvl1 ===
                                  item.hierarchy.lvl1
                            ),
                        };
                      })
                    )
                    .flat();
                },
              };
            });
          });
        },
      }),
    [indexName, searchParameters, searchClient, onClose]
  );

  return (
    <div
      className={[
        'DocSearch-Container',
        state.status === 'stalled' && 'DocSearch-Container--Stalled',
        state.status === 'error' && 'DocSearch-Container--Errored',
      ]
        .filter(Boolean)
        .join(' ')}
      {...getRootProps({
        onClick(event: React.MouseEvent) {
          if (event.target === event.currentTarget) {
            onClose();
          }
        },
      })}
    >
      <div className="DocSearch-Modal">
        <header className="DocSearch-SearchBar">
          <SearchBox
            query={state.query}
            getFormProps={getFormProps}
            getLabelProps={getLabelProps}
            getInputProps={getInputProps}
          />
        </header>

        <div className="DocSearch-Dropdown">
          <Results
            suggestions={state.suggestions}
            getMenuProps={getMenuProps}
            getItemProps={getItemProps}
          />
        </div>

        <footer className="DocSearch-Footer">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
