<template>
  <div
    v-if="state"
    :class="{
      'algolia-autocomplete': true,
      'algolia-autocomplete--stalled': state.status === 'stalled',
      'algolia-autocomplete--errored': state.status === 'error',
    }"
    v-bind="autocomplete.getRootProps()"
  >
    <search-box
      ref="searchBox"
      :completion="autocomplete.getCompletion()"
      :query="state.query"
      :isOpen="state.isOpen"
      :status="state.status"
      :getInputProps="autocomplete.getInputProps"
      :onReset="onReset"
      :onSubmit="() => {}"
    />

    <dropdown
      :suggestions="state.suggestions"
      :isOpen="state.isOpen"
      :status="state.status"
      :getItemProps="autocomplete.getItemProps"
      :getMenuProps="autocomplete.getMenuProps"
    />
  </div>
</template>

<script>
import { createAutocomplete } from '../autocomplete-core';
import { getDefaultProps } from '../autocomplete-core/defaultProps';
import {
  AutocompleteState,
  AutocompleteOptions,
} from '../autocomplete-core/types';
import SearchBox from './SearchBox.vue';
import Dropdown from './Dropdown.vue';

export default {
  props: {
    /**
     * The Autocomplete ID to create accessible attributes.
     *
     * @default "autocomplete-0"
     */
    id: {
      type: String,
    },
    /**
     * Function called when the internal state changes.
     */
    onStateChange: {
      type: Function,
    },
    /**
     * The text that appears in the search box input when there is no query.
     */
    placeholder: {
      type: String,
    },
    /**
     * Whether to show the highlighted suggestion as completion in the input.
     *
     * @default false
     */
    showCompletion: {
      type: Boolean,
    },
    /**
     * The minimum number of characters long the autocomplete opens.
     *
     * @default 1
     */
    minLength: {
      type: Number,
    },
    /**
     * The number of milliseconds that must elapse before the autocomplete
     * experience is stalled.
     *
     * @default 300
     */
    stallThreshold: { type: Number },
    /**
     * The initial state to apply when the page is loaded.
     */
    initialState: { type: Object },
    /**
     * The sources to get the suggestions from.
     */
    getSources: { type: Function },
    /**
     * The environment from where your JavaScript is running.
     * Useful if you're using Autocomplete.js in a different context than
     * `window`.
     *
     * @default window
     */
    environment: { type: Object },
    /**
     * Navigator's API to redirect the user when a link should be open.
     */
    navigator: { type: Object },
    /**
     * The function called to determine whether the dropdown should open.
     */
    shouldDropdownOpen: { type: Function },
  },
  components: { SearchBox, Dropdown },
  data() {
    return {
      state: undefined,
      autocomplete: undefined,
    };
  },
  computed: {
    providedProps() {
      return Object.keys(this.$props)
        .filter(key => this.$props[key] !== undefined)
        .reduce((acc, key) => {
          acc[key] = this.$props[key];
          return acc;
        }, {});
    },
  },
  methods: {
    onReset(event) {
      const { onReset } = this.autocomplete.getResetProps();
      onReset(event);
      if (this.$refs.searchBox) {
        this.$refs.searchBox.focus();
      }
    },
  },
  watch: {
    providedProps: {
      immediate: true,
      handler() {
        this.state = getDefaultProps(this.providedProps).initialState;
        this.autocomplete = createAutocomplete({
          ...this.providedProps,
          onStateChange: ({ state }) => {
            this.state = state;
            if (this.onStateChange) {
              this.onStateChange({ state });
            }
          },
        });
      },
    },
    state() {
      console.log('### state changed', this.state);
    },
  },
};
</script>

<style></style>
