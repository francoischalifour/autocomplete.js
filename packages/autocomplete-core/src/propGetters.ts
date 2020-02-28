import { onInput } from './onInput';
import { onKeyDown } from './onKeyDown';
import { isSpecialClick, getHighlightedItem, isOrContainsNode } from './utils';

import {
  GetEnvironmentProps,
  GetRootProps,
  GetFormProps,
  GetInputProps,
  GetItemProps,
  GetLabelProps,
  GetMenuProps,
  AutocompleteStore,
  AutocompleteOptions,
  AutocompleteSetters,
} from './types';

interface GetPropGettersOptions<TItem> extends AutocompleteSetters<TItem> {
  store: AutocompleteStore<TItem>;
  props: AutocompleteOptions<TItem>;
}

export function getPropGetters<TItem>({
  store,
  props,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
}: GetPropGettersOptions<TItem>) {
  const isTouchDevice = 'ontouchstart' in props.environment;

  const getEnvironmentProps: GetEnvironmentProps = getterProps => {
    return {
      // On touch devices, we do not rely on the native `blur` event of the
      // input to close the dropdown, but rather on a custom `touchstart` event
      // outside of the autocomplete elements.
      // This ensures a working experience on mobile because we blur the input
      // on touch devices when the user starts scrolling (`touchmove`).
      onTouchStart(event) {
        if (store.getState().isOpen === false) {
          return;
        }

        const isTargetWithinAutocomplete = [
          getterProps.searchBoxElement,
          getterProps.dropdownElement,
        ].some(contextNode => {
          return (
            contextNode &&
            (isOrContainsNode(contextNode, event.target as Node) ||
              isOrContainsNode(
                contextNode,
                props.environment.document.activeElement!
              ))
          );
        });

        if (isTargetWithinAutocomplete === false) {
          store.send('blur', null);
        }
      },
      // When scrolling on touch devices (mobiles, tablets, etc.), we want to
      // mimic the native platform behavior where the input is blurred to
      // hide the virtual keyboard. This gives more vertical space to
      // discover all the suggestions showing up in the dropdown.
      onTouchMove() {
        if (
          store.getState().isOpen === false ||
          getterProps.inputElement !== props.environment.document.activeElement
        ) {
          return;
        }

        getterProps.inputElement.blur();
      },
    };
  };

  const getRootProps: GetRootProps = rest => {
    return {
      role: 'combobox',
      'aria-expanded': store.getState().isOpen,
      'aria-haspopup': 'listbox',
      'aria-owns': store.getState().isOpen ? `${props.id}-menu` : undefined,
      'aria-labelledby': `${props.id}-label`,
      ...rest,
    };
  };

  const getFormProps: GetFormProps = providedProps => {
    const { inputElement, ...rest } = providedProps;

    return {
      onSubmit: event => {
        event.preventDefault();

        props.onSubmit({
          state: store.getState(),
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          event,
        });

        store.send('submit', null);

        if (providedProps.inputElement) {
          providedProps.inputElement.blur();
        }
      },
      onReset: event => {
        event.preventDefault();

        if (props.openOnFocus) {
          onInput({
            query: '',
            store,
            props,
            setHighlightedIndex,
            setQuery,
            setSuggestions,
            setIsOpen,
            setStatus,
            setContext,
          });
        }
        store.send('reset', null);

        if (providedProps.inputElement) {
          providedProps.inputElement.focus();
        }
      },
      ...rest,
    };
  };

  const getInputProps: GetInputProps = providedProps => {
    function onFocus() {
      // We want to trigger a query when `openOnFocus` is true
      // because the dropdown should open with the current query.
      if (props.openOnFocus || store.getState().query.length > 0) {
        onInput({
          query: store.getState().query,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
        });
      }

      store.send('focus', null);
    }

    const { inputElement, ...rest } = providedProps;

    return {
      'aria-autocomplete': props.showCompletion ? 'both' : 'list',
      'aria-activedescendant':
        store.getState().isOpen && store.getState().highlightedIndex !== null
          ? `${props.id}-item-${store.getState().highlightedIndex}`
          : undefined,
      'aria-controls': store.getState().isOpen ? `${props.id}-menu` : undefined,
      'aria-labelledby': `${props.id}-label`,
      value: store.getState().query,
      id: `${props.id}-input`,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false,
      autoFocus: props.autoFocus,
      placeholder: props.placeholder,
      // @TODO: see if this accessibility attribute is necessary
      // 'aria-expanded': store.getStore().isOpen,
      onChange: event => {
        onInput({
          query: (event.currentTarget as HTMLInputElement).value,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
        });
      },
      onKeyDown: event => {
        onKeyDown({
          event,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
        });
      },
      onFocus,
      onBlur: () => {
        // We do rely on the `blur` event on touch devices.
        // See explanation in `onTouchStart`.
        if (!isTouchDevice) {
          store.send('blur', null);
        }
      },
      onClick: () => {
        // When the dropdown is closed and you click on the input while
        // the input is focused, the `onFocus` event is not triggered
        // (default browser behavior).
        // In an autocomplete context, it makes sense to open the menu in this
        // case.
        // We mimic this event by catching the `onClick` event which
        // triggers the `onFocus` for the dropdown to open.
        if (
          providedProps.inputElement ===
            props.environment.document.activeElement &&
          !store.getState().isOpen
        ) {
          onFocus();
        }
      },
      ...rest,
    };
  };

  const getItemProps: GetItemProps<any> = providedProps => {
    const { item, source, ...rest } = providedProps;

    return {
      id: `${props.id}-item-${item.__autocomplete_id}`,
      role: 'option',
      'aria-selected':
        store.getState().highlightedIndex === item.__autocomplete_id,
      onMouseMove(event) {
        if (item.__autocomplete_id === store.getState().highlightedIndex) {
          return;
        }

        store.send('mousemove', item.__autocomplete_id);

        if (store.getState().highlightedIndex !== null) {
          const { item, itemValue, itemUrl, source } = getHighlightedItem({
            state: store.getState(),
          });

          source.onHighlight({
            suggestion: item,
            suggestionValue: itemValue,
            suggestionUrl: itemUrl,
            source,
            state: store.getState(),
            setHighlightedIndex,
            setQuery,
            setSuggestions,
            setIsOpen,
            setStatus,
            setContext,
            event,
          });
        }
      },
      onMouseDown(event) {
        // Prevents the `activeElement` from being changed to the item so it
        // can remain with the current `activeElement`.
        event.preventDefault();
      },
      onClick(event) {
        // We ignore all modified clicks to support default browsers' behavior.
        if (isSpecialClick(event)) {
          return;
        }

        const inputValue = source.getInputValue({
          suggestion: item,
          state: store.getState(),
        });

        onInput({
          query: inputValue,
          store,
          props,
          setHighlightedIndex,
          setQuery,
          setSuggestions,
          setIsOpen,
          setStatus,
          setContext,
          nextState: {
            isOpen: false,
          },
        }).then(() => {
          source.onSelect({
            suggestion: item,
            suggestionValue: inputValue,
            suggestionUrl: source.getSuggestionUrl({
              suggestion: item,
              state: store.getState(),
            }),
            source,
            state: store.getState(),
            setHighlightedIndex,
            setQuery,
            setSuggestions,
            setIsOpen,
            setStatus,
            setContext,
            event,
          });
        });
      },
      ...rest,
    };
  };

  const getLabelProps: GetLabelProps = rest => {
    return {
      htmlFor: `${props.id}-input`,
      id: `${props.id}-label`,
      ...rest,
    };
  };

  const getMenuProps: GetMenuProps = rest => {
    return {
      role: 'listbox',
      'aria-labelledby': `${props.id}-label`,
      id: `${props.id}-menu`,
      onMouseLeave() {
        store.send('mouseleave', null);
      },
      ...rest,
    };
  };

  return {
    getEnvironmentProps,
    getRootProps,
    getFormProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  };
}
