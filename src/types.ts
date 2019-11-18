import { Template } from './Template';
import { StateUpdater } from 'preact/hooks';

export type Suggestion = any;

export interface Result {
  source: AutocompleteSource;
  suggestions: Suggestion[];
}

export interface Environment {
  [prop: string]: unknown;
  addEventListener: Window['addEventListener'];
  removeEventListener: Window['removeEventListener'];
  setTimeout: Window['setTimeout'];
  document: Window['document'];
  location: {
    assign: Location['assign'];
  };
  open: Window['open'];
}

export interface DropdownPosition {
  top: number;
  left?: number;
  right?: number;
}

/**
 * Custom class names appended to the template after the source.
 */
interface ClassNames {
  /**
   * The class name appended to the global wrapper.
   */
  root?: string;
  /**
   * The class name appended to the list wrapper.
   */
  list?: string;
  /**
   * The class name appended to the empty element.
   */
  empty?: string;
  /**
   * The class name appended to every suggestion item.
   */
  suggestion?: string;
  /**
   * The class name appended to the header.
   */
  header?: string;
  /**
   * The class name appended to the footer.
   */
  footer?: string;
}

/**
 * Global Autocomplete templates.
 */
interface AutocompleteTemplates {
  /**
   * The template to display before all sources.
   */
  header?: Template;
  /**
   * The template to display after all sources.
   */
  footer?: Template;
  /**
   * The template for the submit icon.
   */
  submitIcon?: Template;
  /**
   * The template for the reset icon.
   */
  resetIcon?: Template;
  /**
   * The template for the loading icon.
   */
  loadingIcon?: Template;
}

interface AutocompleteSourceTemplates {
  /**
   * The template to display before all sources.
   */
  header?: Template;
  /**
   * The template for each suggestion.
   */
  suggestion: Template<{ suggestion: Suggestion }>;
  /**
   * The template to display after all sources.
   */
  footer?: Template;
  /**
   * The template to display when there are no suggestions.
   */
  empty?: Template;
}

export interface AutocompleteState {
  query: string;
  results: Result[];
  isOpen: boolean;
  isLoading: boolean;
  isStalled: boolean;
  error: Error | null;
  context: { [key: string]: any };
}

export interface SuggestionsOptions extends AutocompleteSetters {
  query: string;
  state: AutocompleteState;
}

export interface PublicAutocompleteSource {
  /**
   * Get the string value of the suggestion. The value is used to fill the search box.
   */
  getInputValue?({
    suggestion,
    state,
  }: {
    suggestion: Suggestion;
    state: AutocompleteState;
  }): string;
  /**
   * Get the URL of a suggestion. The value is used to create default navigation features for
   * `onClick` and `onKeyDown`.
   */
  getSuggestionUrl?({
    suggestion,
    state,
  }: {
    suggestion: Suggestion;
    state: AutocompleteState;
  }): string | undefined;
  /**
   * Function called when the input changes. You can use this function to filter/search the items based on the query.
   */
  getSuggestions(
    options: SuggestionsOptions
  ): Suggestion[] | Promise<Suggestion[]>;
  /**
   * Templates to use for the source.
   */
  templates: AutocompleteSourceTemplates;
  /**
   * Called when an item is selected.
   */
  onSelect?: (options: ItemEventHandlerOptions) => void;
  /**
   * CSS classes applied to the template of the source
   */
  classNames?: ClassNames;
}

export type AutocompleteSource = {
  [PParam in keyof PublicAutocompleteSource]-?: PublicAutocompleteSource[PParam];
};

export interface AutocompleteItem {
  suggestion: Suggestion;
  suggestionValue: ReturnType<AutocompleteSource['getInputValue']>;
  suggestionUrl: ReturnType<AutocompleteSource['getSuggestionUrl']>;
  source: AutocompleteSource;
}

export interface EventHandlerOptions extends AutocompleteSetters {
  state: AutocompleteState;
}

export interface ItemEventHandlerOptions extends EventHandlerOptions {
  suggestion: Suggestion;
  suggestionValue: ReturnType<AutocompleteSource['getInputValue']>;
  suggestionUrl: ReturnType<AutocompleteSource['getSuggestionUrl']>;
  source: AutocompleteSource;
}

export interface PublicAutocompleteProps {
  /**
   * The container for the autocomplete search box.
   */
  container: HTMLElement;
  /**
   * The container for the autocomplete dropdown.
   *
   * @default environment.document.body
   */
  dropdownContainer: HTMLElement;
  /**
   * The dropdown position related to the container.
   * Possible values are `"left"` and `"right"`.
   *
   * @default "left"
   */
  dropdownAlignment?: 'left' | 'right';
  /**
   * Called to compute the position of the dropdown.
   */
  getDropdownPosition?(options: {
    /**
     * The size and the position of the container computed with
     * `getBoundingClientRect()`.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     */
    containerRect: ClientRect | DOMRect;
    /**
     * The next dropdown position computed based on `dropdownAlignment` and
     * `containerRect`.
     */
    dropdownPosition: DropdownPosition;
  }): DropdownPosition;
  /**
   * The text that appears in the search box input when there is no query.
   */
  placeholder?: string;
  /**
   * Whether to show the highlighted suggestion as completion in the input.
   *
   * @default false
   */
  showCompletion?: boolean;
  /**
   * The minimum number of characters long the autocomplete opens.
   *
   * @default 1
   */
  minLength?: number;
  /**
   * Whether to focus the search box when the page is loaded.
   *
   * @default false
   */
  autofocus?: boolean;
  /**
   * The keyboard shortcuts keys to focus the input.
   */
  keyboardShortcuts?: string[];
  /**
   * The default item index to pre-select.
   *
   * @default 0
   */
  defaultHighlightedIndex?: number;
  /**
   * The number of milliseconds that must elapse before the autocomplete
   * experience is stalled.
   *
   * @default 300
   */
  stallThreshold?: number;
  /**
   * The initial state to apply when the page is loaded.
   */
  initialState?: Partial<AutocompleteState>;
  /**
   *
   */
  templates?: AutocompleteTemplates;
  /**
   * The sources to get the suggestions from.
   */
  getSources?(
    options: SuggestionsOptions
  ): PublicAutocompleteSource[] | Promise<PublicAutocompleteSource[]>;
  /**
   * Called before rendering the results.
   * Useful to wrap results in containers to organize the display.
   */
  transformResultsRender?(results: JSX.Element[]): JSX.Element | JSX.Element[];
  /**
   * The environment from where your JavaScript is running.
   * Useful if you're using Autocomplete.js in a different context than
   * `window`.
   *
   * @default window
   */
  environment?: Environment;
  /**
   * Navigator's API to redirect the user when a link should be open.
   */
  navigator?: {
    /**
     * Called when a URL should be open in the current page.
     */
    navigate: ({
      suggestionUrl: string,
      suggestion: Suggestion,
      state: AutocompleteState,
    }) => void;
    /**
     * Called when a URL should be open in a new tab.
     */
    navigateNewTab: ({
      suggestionUrl: string,
      suggestion: Suggestion,
      state: AutocompleteState,
    }) => void;
    /**
     * Called when a URL should be open in a new window.
     */
    navigateNewWindow: ({
      suggestionUrl: string,
      suggestion: Suggestion,
      state: AutocompleteState,
    }) => void;
  };
  /**
   * Called when the input is focused.
   */
  onFocus?: (options: EventHandlerOptions) => void;
  /**
   * Called when a `click` event is fired on an item.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event
   */
  onClick?: (event: MouseEvent, options: ItemEventHandlerOptions) => void;
  /**
   * Called when a `keydown` event is fired.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event
   */
  onKeyDown?: (
    event: KeyboardEvent,
    options: EventHandlerOptions & Partial<ItemEventHandlerOptions>
  ) => void;
  /**
   * Called when an error is thrown while getting the suggestions.
   */
  onError?: (options: EventHandlerOptions) => void;
  /**
   * Called when the input changes.
   */
  onInput?: (
    options: EventHandlerOptions & {
      query: string;
    }
  ) => void | Promise<void | { state: AutocompleteState }>;
  /**
   * Called to check whether the dropdown should open based on the Autocomplete state.
   */
  shouldDropdownOpen?(options: { state: AutocompleteState }): boolean;
}

export interface AutocompleteOptions
  extends Omit<PublicAutocompleteProps, 'container' | 'dropdownContainer'> {
  /**
   * The container for the autocomplete search box.
   */
  container: string | HTMLElement;
  /**
   * The container for the autocomplete dropdown.
   *
   * @default environment.document.body
   */
  dropdownContainer?: string | HTMLElement;
}

export interface AutocompleteProps extends Required<PublicAutocompleteProps> {
  getSources(options: SuggestionsOptions): Promise<AutocompleteSource[]>;
  state: AutocompleteState;
  setters: AutocompleteSetters;
}

export interface AutocompleteSetters {
  setQuery: StateUpdater<AutocompleteState['query']>;
  setResults: StateUpdater<AutocompleteState['results']>;
  setIsOpen: StateUpdater<AutocompleteState['isOpen']>;
  setIsLoading: StateUpdater<AutocompleteState['isLoading']>;
  setIsStalled: StateUpdater<AutocompleteState['isStalled']>;
  setError: StateUpdater<AutocompleteState['error']>;
  setContext: StateUpdater<AutocompleteState['context']>;
}

export type AutocompleteApi = AutocompleteSetters;
