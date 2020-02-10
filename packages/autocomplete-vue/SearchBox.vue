<template>
  <form
    action=""
    role="search"
    noValidate
    class="algolia-autocomplete-form"
    @submit="onSubmit"
  >
    <label
      :htmlFor="getInputProps().id"
      class="algolia-autocomplete-magnifierLabel"
    >
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

    <div class="algolia-autocomplete-loadingIndicator">
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

    <div class="algolia-autocomplete-searchbox">
      <span
        v-if="completion"
        class="algolia-autocomplete-completion"
        aria-live="assertive"
        :aria-suggest="
          'Press tab to select &quot;' + this.completion + '&quot;'
        "
      >
        {{ completion }}
      </span>

      <input
        ref="input"
        className="algolia-autocomplete-input"
        v-bind="
          getInputProps({
            type: 'search',
            maxLength: '512',
            // When the dropdown is closed and you click on the input while
            // the input is focused, the `onFocus` event is not triggered.
            // We mimic this event by catching the `onClick` event which
            // triggers the `onFocus` for the dropdown to open.
            // onClick: () => {
            //   if (!props.isOpen) {
            //     props.onFocus();
            //   }
            // },
          })
        "
      />
    </div>

    <button
      type="reset"
      title="Clear the query"
      class="algolia-autocomplete-reset"
      :hidden="!query"
      @click="onReset"
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
</template>

<script>
export default {
  props: {
    completion: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
    onReset: {
      type: Function,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    getInputProps: {
      type: Function,
      required: true,
    },
  },
  methods: {
    focus() {
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    },
  },
};
</script>

<style></style>
