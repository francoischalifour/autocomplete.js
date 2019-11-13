/** @jsx h */

import { h, Ref } from 'preact';
import { createPortal, forwardRef } from 'preact/compat';
import {
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
  StateUpdater,
} from 'preact/hooks';
import Downshift from 'downshift/preact';

import { Dropdown } from './Dropdown';
import { SearchBox } from './SearchBox';
import { flatten, noop } from './utils';
import {
  AutocompleteSetters,
  AutocompleteItem,
  AutocompleteSource,
  AutocompleteState,
  AutocompleteProps,
  Environment,
  PublicAutocompleteProps,
  Result,
  PublicAutocompleteSource,
  DropdownPosition,
} from './types';

export const defaultEnvironment: Environment =
  typeof window === 'undefined' ? ({} as Environment) : window;

let autocompleteIdCounter = 0;
let lastStallId: number | null = null;

/**
 * Generates a unique ID for an instance of an Autocomplete DownShift instance.
 */
function generateAutocompleteId(): string {
  return String(autocompleteIdCounter++);
}

function hasResults(results: Result[]): boolean {
  return results.some(result => result.suggestions.length > 0);
}

/**
 * Called by default to decide if the dropdown should open based on the autocompete state.
 */
const defaultShouldDropdownOpen: AutocompleteProps['shouldDropdownOpen'] = ({
  state,
}) => hasResults(state.results);

function defaultOnInput({
  query,
  getSources,
  environment,
  stallThreshold,
  state,
  setters,
  onError,
}: {
  query: string;
  getSources: AutocompleteProps['getSources'];
  environment: AutocompleteProps['environment'];
  stallThreshold: AutocompleteProps['stallThreshold'];
  state: AutocompleteState;
  setters: AutocompleteSetters;
  onError: AutocompleteProps['onError'];
}): ReturnType<AutocompleteProps['onInput']> {
  if (lastStallId) {
    clearTimeout(lastStallId);
    setters.setIsStalled(false);
  }

  setters.setError(null);
  setters.setQuery(query);
  setters.setIsLoading(true);

  lastStallId = environment.setTimeout(() => {
    setters.setIsStalled(true);
  }, stallThreshold);

  return getSources({
    query,
    state,
    ...setters,
  }).then(sources => {
    return Promise.all(
      sources.map(source => {
        return Promise.resolve(
          source.getSuggestions({
            query,
            state,
            ...setters,
          })
        ).then(suggestions => {
          return {
            source,
            suggestions,
          };
        });
      })
    )
      .then(results => {
        if (lastStallId) {
          clearTimeout(lastStallId);
          setters.setIsStalled(false);
        }

        setters.setIsLoading(false);
        setters.setIsOpen(true);
        setters.setResults(results);

        return { state };
      })
      .catch(error => {
        if (lastStallId) {
          clearTimeout(lastStallId);
          setters.setIsStalled(false);
        }

        setters.setIsLoading(false);
        setters.setError(error);

        onError({
          state,
          ...setters,
        });

        return { state };
      });
  });
}

const defaultOnClick: AutocompleteProps['onClick'] = (event, { setIsOpen }) => {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    (event as any).preventDownshiftDefault = true;
    setIsOpen(true);
  }
};

// We don't have access to the Autocomplete source when we call `onKeyDown`
// or `onClick` because those are native browser events.
// However, we can get the source from the suggestion index.
function getSourceFromSuggestionIndex({
  highlightedIndex,
  results,
}: {
  highlightedIndex: number;
  results: Result[];
}): AutocompleteSource | undefined {
  // Given 3 sources with respectively 1, 2 and 3 suggestions: [1, 2, 3]
  // We want to get the accumulated counts:
  // [1, 1 + 2, 1 + 2 + 3] = [1, 3, 3 + 3] = [1, 3, 6]
  const accumulatedSuggestionsCount = results
    .map(result => result.suggestions.length)
    .reduce<number[]>((acc, suggestionCount, index) => {
      const previousValue = acc[index - 1] || 0;
      const nextValue = previousValue + suggestionCount;

      acc.push(nextValue);

      return acc;
    }, []);

  // Based on the accumulated counts, we can infer the index of the result.
  const resultIndex = accumulatedSuggestionsCount.reduce((acc, current) => {
    if (current <= highlightedIndex) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const result: Result | undefined = results[resultIndex];

  return result ? normalizeSource(result.source) : undefined;
}

function getCompletion({
  highlightedIndex,
  showCompletion,
  results,
  query,
  state,
}: {
  highlightedIndex: number;
  showCompletion: boolean;
  results: Result[];
  query: string;
  state: AutocompleteState;
}): string {
  if (!showCompletion) {
    return '';
  }

  const suggestion = flatten(results.map(result => result.suggestions))[
    Math.max(0, highlightedIndex)
  ];
  const source = getSourceFromSuggestionIndex({
    highlightedIndex: Math.max(0, highlightedIndex),
    results,
  });

  if (!suggestion || !source) {
    return '';
  }

  const currentSuggestion = source.getInputValue({
    suggestion,
    state,
  });

  // The completion should appear only if the _first_ characters of the query
  // match with the suggestion.
  if (
    query &&
    currentSuggestion.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) ===
      0
  ) {
    // If the query typed has a different case than the suggestion, we want
    // to show the completion matching the case of the query. This makes both
    // strings overlap correctly.
    // Example:
    //  - query: 'Gui'
    //  - suggestion: 'guitar'
    //  => completion: 'Guitar'
    return query + currentSuggestion.slice(query.length);
  }

  return '';
}

function normalizeSource(source: PublicAutocompleteSource): AutocompleteSource {
  return {
    getInputValue({ state }) {
      return state.query;
    },
    getSuggestionUrl() {
      return undefined;
    },
    onSelect({ setIsOpen }) {
      setIsOpen(false);
    },
    classNames: {},
    ...source,
  };
}

function getNormalizedSources(
  getSources: PublicAutocompleteProps['getSources']
): AutocompleteProps['getSources'] {
  if (!getSources) {
    return () => Promise.resolve([]);
  }

  return options => {
    return Promise.resolve(getSources(options)).then(sources =>
      Promise.all(
        sources.map(source => {
          return Promise.resolve(normalizeSource(source));
        })
      )
    );
  };
}

function UncontrolledAutocomplete(
  props: PublicAutocompleteProps,
  ref: Ref<AutocompleteSetters>
) {
  if (!props.getSources && !props.onInput) {
    throw new Error(
      'The `getSources()` option is required when not using `onInput()`.'
    );
  }

  const defaultOnKeyDown: AutocompleteProps['onKeyDown'] = (
    event,
    { suggestionUrl, suggestion, state }
  ) => {
    if (!suggestionUrl) {
      return;
    }

    if (event.key === 'Enter') {
      if (event.metaKey || event.ctrlKey) {
        (event as any).preventDownshiftDefault = true;
        navigator.navigateNewTab({ suggestionUrl, suggestion, state });
      } else if (event.shiftKey) {
        (event as any).preventDownshiftDefault = true;
        navigator.navigateNewWindow({ suggestionUrl, suggestion, state });
      } else if (event.altKey) {
        // Keep native browser behavior
      } else {
        navigator.navigate({ suggestionUrl, suggestion, state });
      }
    }
  };

  const {
    container,
    placeholder = '',
    minLength = 1,
    showCompletion = false,
    autofocus = false,
    defaultHighlightedIndex = 0,
    stallThreshold = 300,
    keyboardShortcuts = [],
    getSources = getNormalizedSources(props.getSources),
    environment = defaultEnvironment,
    navigator = {
      navigate({ suggestionUrl }) {
        environment.location.assign(suggestionUrl);
      },
      navigateNewTab({ suggestionUrl }) {
        const windowReference = environment.open(
          suggestionUrl,
          '_blank',
          'noopener'
        );

        if (windowReference) {
          windowReference.focus();
        }
      },
      navigateNewWindow({ suggestionUrl }) {
        environment.open(suggestionUrl, '_blank', 'noopener');
      },
    },
    dropdownContainer = environment.document.body,
    dropdownAlignment = 'left',
    getDropdownPosition = ({ dropdownPosition }) => dropdownPosition,
    templates = {},
    initialState = {},
    transformResultsRender = (results: JSX.Element[]) => results,
    onFocus = noop,
    onClick = defaultOnClick,
    onKeyDown = defaultOnKeyDown,
    onError = ({ state }) => {
      throw state.error;
    },
    onInput = ({ query }) =>
      defaultOnInput({
        query,
        getSources: getNormalizedSources(props.getSources),
        environment,
        stallThreshold,
        state: getState(),
        setters: {
          setQuery,
          setResults,
          setIsOpen,
          setIsLoading,
          setIsStalled,
          setError,
          setContext,
        },
        onError,
      }),
    shouldDropdownOpen = defaultShouldDropdownOpen,
  } = props;

  const [query, setQuery] = useState<AutocompleteState['query']>(
    initialState.query || ''
  );
  const [results, internalSetResults] = useState<AutocompleteState['results']>(
    initialState.results || []
  );
  const [isOpen, setIsOpen] = useState<boolean>(initialState.isOpen || false);
  const [isLoading, setIsLoading] = useState<AutocompleteState['isLoading']>(
    initialState.isLoading || false
  );
  const [isStalled, setIsStalled] = useState<AutocompleteState['isStalled']>(
    initialState.isStalled || false
  );
  const [error, setError] = useState<AutocompleteState['error'] | null>(
    initialState.error || null
  );
  const [context, internalSetContext] = useState<AutocompleteState['context']>(
    initialState.context || {}
  );

  const setResults: StateUpdater<AutocompleteState['results']> = newResults => {
    const nextResults =
      typeof newResults === 'function' ? newResults(results) : newResults;

    internalSetResults(
      nextResults.map(result => {
        return {
          source: normalizeSource(result.source),
          suggestions: result.suggestions,
        };
      })
    );
  };

  const setContext: StateUpdater<AutocompleteState['context']> = newContext => {
    const nextContext =
      typeof newContext === 'function' ? newContext(context) : newContext;

    internalSetContext(previousContext => {
      return {
        ...previousContext,
        ...nextContext,
      };
    });
  };

  function getState(): AutocompleteState {
    return {
      query,
      results,
      isOpen,
      isLoading,
      isStalled,
      error,
      context,
    };
  }

  // Expose the component setters to the external API.
  useImperativeHandle(ref, () => {
    return {
      setQuery,
      setResults,
      setIsOpen,
      setIsLoading,
      setIsStalled,
      setError,
      setContext,
    };
  });

  return (
    <ControlledAutocomplete
      // Props.
      {...props}
      getSources={getNormalizedSources(getSources)}
      environment={environment}
      container={container}
      placeholder={placeholder}
      minLength={minLength}
      showCompletion={showCompletion}
      autofocus={autofocus}
      defaultHighlightedIndex={defaultHighlightedIndex}
      stallThreshold={stallThreshold}
      keyboardShortcuts={keyboardShortcuts}
      dropdownContainer={dropdownContainer}
      dropdownAlignment={dropdownAlignment}
      getDropdownPosition={getDropdownPosition}
      templates={templates}
      initialState={initialState}
      transformResultsRender={transformResultsRender}
      navigator={navigator}
      onFocus={onFocus}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onError={onError}
      onInput={onInput}
      shouldDropdownOpen={shouldDropdownOpen}
      // State.
      query={query}
      setQuery={setQuery}
      results={results}
      setResults={setResults}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      isStalled={isStalled}
      setIsStalled={setIsStalled}
      error={error}
      setError={setError}
      context={context}
      setContext={setContext}
      state={getState()}
      setters={{
        setQuery,
        setResults,
        setIsOpen,
        setIsLoading,
        setIsStalled,
        setError,
        setContext,
      }}
    />
  );
}

interface ControlledAutocompleteProps
  extends AutocompleteProps,
    AutocompleteState {
  query: string;
  results: Result[];
  setQuery: StateUpdater<AutocompleteState['query']>;
  setResults: StateUpdater<AutocompleteState['results']>;
  setIsOpen: StateUpdater<AutocompleteState['isOpen']>;
  setIsLoading: StateUpdater<AutocompleteState['isLoading']>;
  setIsStalled: StateUpdater<AutocompleteState['isStalled']>;
  setError: StateUpdater<AutocompleteState['error']>;
  setContext: StateUpdater<AutocompleteState['context']>;
}

function ControlledAutocomplete(props: ControlledAutocompleteProps) {
  const {
    // Props.
    container,
    placeholder,
    minLength,
    showCompletion,
    autofocus,
    defaultHighlightedIndex,
    keyboardShortcuts,
    environment,
    dropdownContainer,
    dropdownAlignment,
    getDropdownPosition,
    templates,
    transformResultsRender,
    onFocus,
    onClick,
    onKeyDown,
    onInput,
    shouldDropdownOpen,
    // State.
    state,
    setters,
    query,
    setQuery,
    results,
    setResults,
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    isStalled,
    setIsStalled,
    error,
    setError,
    context,
  } = props;

  const [dropdownRect, setDropdownRect] = useState<
    DropdownPosition | undefined
  >(undefined);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    function onGlobalKeyDown(event: KeyboardEvent): void {
      if (!inputRef.current) {
        return;
      }

      const element = event.target as HTMLElement;
      const tagName = element.tagName;

      // Do not trigger the focus if we're already editing text.
      if (
        element.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'SELECT' ||
        tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Do not trigger the focus if the shortcut is not correct.
      if (keyboardShortcuts.indexOf(event.key) === -1) {
        return;
      }

      inputRef.current.focus();

      event.stopPropagation();
      event.preventDefault();
    }

    if (keyboardShortcuts.length > 0) {
      environment.addEventListener('keydown', onGlobalKeyDown);
    }

    return () => {
      if (keyboardShortcuts.length > 0) {
        environment.removeEventListener('keydown', onGlobalKeyDown);
      }
    };
  }, [environment, keyboardShortcuts]);

  useEffect(() => {
    environment.addEventListener('resize', onResize);

    return () => {
      environment.removeEventListener('resize', onResize);
    };
  }, [environment]);

  useEffect(() => {
    // We need to track the container position because the dropdown position is
    // computed based on the container position.
    onResize();
  }, [container, dropdownContainer]);

  function onResize(): void {
    const containerRect = container.getBoundingClientRect();
    const dropdownPosition = {
      top: containerRect.top + containerRect.height,
      left: dropdownAlignment === 'left' ? containerRect.left : undefined,
      right:
        dropdownAlignment === 'right'
          ? environment.document.documentElement.clientWidth -
            (containerRect.left + containerRect.width)
          : undefined,
    };

    setDropdownRect(
      getDropdownPosition({
        containerRect,
        dropdownPosition,
      })
    );
  }

  const isQueryLongEnough = query.length >= minLength;
  const shouldOpen =
    isOpen && isQueryLongEnough && shouldDropdownOpen({ state });

  return (
    <Downshift
      id={`autocomplete-${generateAutocompleteId()}`}
      environment={environment}
      defaultHighlightedIndex={defaultHighlightedIndex}
      itemToString={(item: AutocompleteItem) => {
        return item ? item.suggestionValue : '';
      }}
      onSelect={(item: AutocompleteItem) => {
        if (!item) {
          return;
        }

        const { suggestion, suggestionValue, suggestionUrl, source } = item;

        Promise.resolve(
          onInput({
            query: suggestionValue,
            state,
            ...setters,
          })
        ).then(() => {
          source.onSelect({
            suggestion,
            suggestionValue,
            suggestionUrl,
            source,
            state,
            ...setters,
          });
        });
      }}
      onOuterClick={() => {
        setIsOpen(false);
      }}
      scrollIntoView={(itemNode: HTMLElement) => {
        if (itemNode) {
          itemNode.scrollIntoView(false);
        }
      }}
    >
      {({
        highlightedIndex,
        setHighlightedIndex,
        getInputProps,
        getItemProps,
        getMenuProps,
      }) => {
        return (
          <div
            className={[
              'algolia-autocomplete',
              isStalled && 'algolia-autocomplete--stalled',
              error && 'algolia-autocomplete--errored',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <SearchBox
              placeholder={placeholder}
              autofocus={autofocus}
              completion={getCompletion({
                highlightedIndex,
                showCompletion,
                query,
                results,
                state,
              })}
              templates={templates}
              internalState={state}
              setters={setters}
              onInputRef={inputRef}
              getInputProps={getInputProps}
              onFocus={() => {
                if (isQueryLongEnough) {
                  setIsOpen(true);

                  // If `minLength` is set to 0, and no queries have been
                  // performed yet, you still want to show the results when
                  // you focus the input.
                  if (minLength === 0 && !hasResults(results)) {
                    onInput({
                      query,
                      state,
                      ...setters,
                    });
                  }
                }

                onFocus({
                  state,
                  ...setters,
                });
              }}
              onKeyDown={event => {
                const suggestion = flatten(
                  results.map(result => result.suggestions)
                )[Math.max(0, highlightedIndex)];
                const source = getSourceFromSuggestionIndex({
                  highlightedIndex: Math.max(0, highlightedIndex),
                  results,
                });

                if (suggestion && source) {
                  onKeyDown(event, {
                    suggestion,
                    suggestionValue: source.getInputValue({
                      suggestion,
                      state,
                    }),
                    suggestionUrl: source.getSuggestionUrl({
                      suggestion,
                      state,
                    }),
                    source,
                    state,
                    ...setters,
                  });
                } else {
                  onKeyDown(event, { state, ...setters });
                }

                if (event.key === 'Escape') {
                  setIsOpen(false);

                  if (!shouldOpen) {
                    onInput({
                      query: '',
                      state,
                      ...setters,
                    });
                  }
                } else if (
                  event.key === 'Tab' ||
                  // When the user hits the right arrow and is at the end of
                  // the typed query only, we want to validate the completion.
                  (event.key === 'ArrowRight' &&
                    (event.target as HTMLInputElement).selectionStart ===
                      query.length)
                ) {
                  if (shouldOpen && suggestion && source) {
                    event.preventDefault();

                    const nextQuery = source.getInputValue({
                      suggestion,
                      state,
                    });

                    if (query !== nextQuery) {
                      onInput({
                        query: nextQuery,
                        state,
                        ...setters,
                      });

                      setHighlightedIndex(defaultHighlightedIndex);
                    }
                  }
                }
              }}
              onInput={(event: InputEvent) => {
                const query = (event.target as HTMLInputElement).value;

                if (query.length >= minLength) {
                  setIsOpen(true);

                  onInput({
                    query,
                    state,
                    ...setters,
                  });
                } else {
                  if (lastStallId) {
                    clearTimeout(lastStallId);
                    setIsStalled(false);
                  }

                  setError(null);
                  setQuery(query);
                  setIsLoading(false);
                  setIsOpen(false);
                  setResults(
                    results.map(result => ({
                      ...result,
                      suggestions: [],
                    }))
                  );
                }
              }}
              onReset={(event: Event) => {
                event.preventDefault();

                if (inputRef.current) {
                  inputRef.current.focus();
                }

                onInput({
                  query: '',
                  state,
                  ...setters,
                });
              }}
              onSubmit={(event: Event) => {
                event.preventDefault();
                setIsOpen(false);

                if (inputRef.current) {
                  inputRef.current.blur();
                }
              }}
            />

            {createPortal(
              <Dropdown
                position={dropdownRect}
                hidden={!shouldOpen}
                isOpen={isOpen}
                isStalled={isStalled}
                isLoading={isLoading}
                query={query}
                error={error}
                context={context}
                results={results}
                templates={templates}
                transformResultsRender={transformResultsRender}
                setters={setters}
                onClick={onClick}
                getMenuProps={getMenuProps}
                getItemProps={getItemProps}
              />,
              dropdownContainer
            )}
          </div>
        );
      }}
    </Downshift>
  );
}

export const Autocomplete = forwardRef(UncontrolledAutocomplete);
