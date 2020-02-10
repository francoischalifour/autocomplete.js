import { stateReducer } from './stateReducer';
import { onInput } from './onInput';
import { onKeyDown } from './onKeyDown';
import { isSpecialClick } from './utils';

import {
  GetRootProps,
  GetInputProps,
  GetResetProps,
  GetItemProps,
  GetLabelProps,
  GetMenuProps,
} from './types';

export function getPropGetters({
  store,
  props,
  setHighlightedIndex,
  setQuery,
  setSuggestions,
  setIsOpen,
  setStatus,
  setContext,
}) {
  const getRootProps: GetRootProps = rest => {
    return {
      role: 'combobox',
      'aria-expanded': store.getState().isOpen,
      'aria-haspopup': 'listbox',
      'aria-owns': store.getState().isOpen ? `${props.id}-menu` : null,
      'aria-labelledby': `${props.id}-label`,
      ...rest,
    };
  };

  const getInputProps: GetInputProps = rest => {
    return {
      'aria-autocomplete': 'list',
      'aria-activedescendant':
        store.getState().isOpen && props.highlightedIndex >= 0
          ? `${props.id}-item-${store.getState().highlightedIndex}`
          : null,
      'aria-controls': store.getState().isOpen ? `${props.id}-menu` : null,
      'aria-labelledby': `${props.id}-label`,
      value: store.getState().query,
      id: `${props.id}-input`,
      autoComplete: 'off',
      autoCorrect: 'off',
      autoCapitalize: 'off',
      spellCheck: false,
      autofocus: props.autoFocus,
      placeholder: props.showCompletion ? '' : props.placeholder,
      // @TODO: see if this accessibility attribute is necessary
      // 'aria-expanded': store.getStore().isOpen,
      onInput: (event: InputEvent) => {
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
      onKeyDown: (event: KeyboardEvent) => {
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
      onFocus() {
        // We want to trigger a query when `minLength` is `0` because the
        // dropdown should open with the current query.
        if (props.minLength === 0) {
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

        store.setState(
          stateReducer(store.getState(), { type: 'focus', value: {} }, props)
        );
        props.onStateChange({ state: store.getState() });
      },
      onBlur() {
        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'blur',
              value: null,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      ...rest,
    };
  };

  const getResetProps: GetResetProps = rest => {
    return {
      onReset(event) {
        event.preventDefault();

        if (props.minLength === 0) {
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

        store.setState(
          stateReducer(store.getState(), { type: 'reset', value: {} }, props)
        );
        props.onStateChange({ state: store.getState() });
      },
      ...rest,
    };
  };

  const getItemProps: GetItemProps<any> = rest => {
    if (rest.item === undefined) {
      throw new Error('`getItemProps` expects an `item`.');
    }

    return {
      id: `${props.id}-item-${rest.item.__autocomplete_id}`,
      role: 'option',
      'aria-selected':
        store.getState().highlightedIndex === rest.item.__autocomplete_id,
      onMouseMove() {
        if (rest.item.__autocomplete_id === store.getState().highlightedIndex) {
          return;
        }

        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'mousemove',
              value: rest.item.__autocomplete_id,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      onMouseDown(event: MouseEvent) {
        // Prevents the `activeElement` from being changed to the item so it
        // can remain with the current `activeElement`.
        event.preventDefault();
      },
      onClick(event: MouseEvent) {
        // We ignore all modified clicks to support default browsers' behavior.
        if (isSpecialClick(event)) {
          return;
        }

        onInput({
          query: rest.source.getInputValue({
            suggestion: rest.item,
            state: store.getState(),
          }),
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
        });

        props.onStateChange({ state: store.getState() });
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
        store.setState(
          stateReducer(
            store.getState(),
            {
              type: 'mouseleave',
              value: null,
            },
            props
          )
        );
        props.onStateChange({ state: store.getState() });
      },
      ...rest,
    };
  };

  return {
    getRootProps,
    getInputProps,
    getResetProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
  };
}
