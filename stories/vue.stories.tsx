import { storiesOf } from '@storybook/html';
import algoliasearch from 'algoliasearch/lite';

import { withPlayground } from '../.storybook/decorators';
import { render } from '../.storybook/vue-helper';

import Autocomplete from '../packages/autocomplete-vue/Autocomplete.vue';
import { getAlgoliaHits } from '../packages/autocomplete-presets';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

storiesOf('Core-Vue', module).add(
  'Default',
  withPlayground(({ container }) => {
    render({
      container,
      components: { Autocomplete },
      template: `
      <autocomplete
        placeholder="Search items…"
        :getSources="getSources"
      />
      `,
      methods: {
        getSources() {
          return [
            {
              getInputValue({ suggestion }) {
                return suggestion.query;
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
                });
              },
            },
          ];
        },
      },
    });

    return container;
  })
);
