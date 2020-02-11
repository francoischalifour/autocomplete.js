<template>
  <div
    :hidden="!isOpen"
    :class="{
      'algolia-autocomplete-dropdown': true,
      'algolia-autocomplete-dropdown--stalled': status === 'stalled',
      'algolia-autocomplete-dropdown--errored': status === 'error',
    }"
  >
    <div class="algolia-autocomplete-dropdown-container">
      <section
        v-for="({ source, items }, suggestionIndex) in suggestionsWithItemProps"
        :key="'result-' + suggestionIndex"
        class="algolia-autocomplete-suggestions"
      >
        <ul v-if="items.length > 0" v-bind="getMenuProps()">
          <li
            v-for="({ item, onMouseMove, onMouseDown, onClick, props },
            itemIndex) in items"
            :key="'item-' + itemIndex"
            class="algolia-autocomplete-suggestions-item"
            v-bind="props"
            @mousemove="onMouseMove"
            @mousedown="onMouseDown"
            @click="onClick"
          >
            <div
              v-html="
                reverseHighlightAlgoliaHit({
                  hit: item,
                  attribute: 'query',
                })
              "
            />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import { reverseHighlightAlgoliaHit } from '../autocomplete-presets';

export default {
  props: {
    isOpen: { type: Boolean, required: true },
    suggestions: { type: Array, required: true },
    status: { type: String, required: true },
    getItemProps: { type: Function },
    getMenuProps: { type: Function },
    highlightedIndex: { type: Number },
  },
  data() {
    return {
      suggestionsWithItemProps: [],
      // The reason why `suggestionsWithItemProps` isn't a computed property is,
      // it needs to be re-evaluated whenever `state` changes at `Autocomplete.vue`.
      // `getItemProps` refers to many properties but it cannot be tracked automatically here.
    };
  },
  methods: {
    setSuggestionsWithItemProps() {
      this.suggestionsWithItemProps = this.suggestions.map(
        ({ source, items }) => ({
          source,
          items: items.map(item => this.wrapItemWithProps(item)),
        })
      );
    },
    wrapItemWithProps(item, source) {
      const { onMouseMove, onMouseDown, onClick, ...props } = this.getItemProps(
        {
          item,
          source,
          tabIndex: 0,
        }
      );
      return {
        item,
        onMouseMove,
        onMouseDown,
        onClick,
        props,
      };
    },
    reverseHighlightAlgoliaHit,
  },
  watch: {
    suggestions: {
      immediate: true,
      handler() {
        this.setSuggestionsWithItemProps();
      },
    },
  },
};
</script>
