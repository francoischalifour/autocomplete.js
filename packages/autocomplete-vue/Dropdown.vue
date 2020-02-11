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
        v-for="({ source, items }, index) in suggestions"
        :key="'result-' + index"
        class="algolia-autocomplete-suggestions"
      >
        <ul v-if="items.length > 0" v-bind="getMenuProps()">
          <li
            v-for="(item, index) in items"
            :key="'item-' + index"
            class="algolia-autocomplete-suggestions-item"
            v-bind="getItemProps({ item, source, tabIndex: 0 })"
            @mousemove="getItemProps({ item, source, tabIndex: 0 }).onMouseMove"
            @mousedown="getItemProps({ item, source, tabIndex: 0 }).onMouseDown"
            @click="getItemProps({ item, source, tabIndex: 0 }).onClick"
          >
            <!-- TODO: improve the props above -->
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
  },
  methods: {
    reverseHighlightAlgoliaHit,
  },
};
</script>
