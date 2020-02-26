/** @jsx h */

import { h } from 'preact';
import { Ref } from 'preact/compat';

import { reverseHighlightAlgoliaHit } from '@francoischalifour/autocomplete-preset-algolia';

import {
  AutocompleteSuggestion,
  GetItemProps,
  GetMenuProps,
} from '@francoischalifour/autocomplete-core';

interface DropdownProps {
  isOpen: boolean;
  status: string;
  suggestions: Array<AutocompleteSuggestion<any>>;
  getItemProps: GetItemProps<any>;
  getMenuProps: GetMenuProps;
  dropdownRef: Ref<HTMLDivElement | null>;
}

export const Dropdown = (props: DropdownProps) => {
  return (
    <div
      className={[
        'algolia-autocomplete-dropdown',
        status === 'stalled' && 'algolia-autocomplete-dropdown--stalled',
        status === 'error' && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={props.dropdownRef}
      hidden={!props.isOpen}
    >
      {props.isOpen && (
        <div className="algolia-autocomplete-dropdown-container">
          {props.suggestions.map((suggestion, index) => {
            const { source, items } = suggestion;

            return (
              <section
                key={`result-${index}`}
                className="algolia-autocomplete-suggestions"
              >
                {items.length > 0 && (
                  <ul {...props.getMenuProps()}>
                    {items.map((item, index) => {
                      return (
                        <li
                          key={`item-${index}`}
                          className="algolia-autocomplete-suggestions-item"
                          {...props.getItemProps({
                            item,
                            source,
                            tabIndex: 0,
                          })}
                        >
                          {/* The templating API is hardcoded for now */}
                          {item._highlightResult ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: reverseHighlightAlgoliaHit({
                                  hit: item,
                                  attribute: 'query',
                                }),
                              }}
                            />
                          ) : (
                            item.query
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
