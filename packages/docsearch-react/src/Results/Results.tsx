import React from 'react';
import { Snippet } from '@francoischalifour/autocomplete-react';
import {
  GetMenuProps,
  GetItemProps,
  AutocompleteSuggestion,
} from '@francoischalifour/autocomplete-core';

import { SourceIcon } from './SourceIcon';
import { SelectIcon } from './ActionIcon';
import { InternalDocSearchHit } from '../types';

interface ResultsProps {
  suggestions: Array<AutocompleteSuggestion<InternalDocSearchHit>>;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<InternalDocSearchHit, React.MouseEvent>;
}

export function Results(props: ResultsProps) {
  return (
    <div className="DocSearch-Dropdown-Container">
      {props.suggestions.map(({ source, items }) => {
        const title = items[0].hierarchy.lvl0;

        return (
          <section key={title} className="DocSearch-Hits">
            <div className="DocSearch-Hit-source">{title}</div>

            <ul {...props.getMenuProps()}>
              {items.map((item, index) => {
                return (
                  <li
                    key={item.objectID}
                    className={[
                      'DocSearch-Hit',
                      item.__docsearch_parent && 'DocSearch-Hit--Child',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...props.getItemProps({
                      item,
                      source,
                    })}
                  >
                    {item.__docsearch_parent && (
                      <svg className="DocSearch-Hit-Tree">
                        <g
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {item.__docsearch_parent !==
                          items[index + 1]?.__docsearch_parent ? (
                            <path d="M8 8v22M26.5 30H8.3" />
                          ) : (
                            <path d="M8 8v44M26.5 30H8.3" />
                          )}
                        </g>
                      </svg>
                    )}

                    <a href={item.url}>
                      <div className="DocSearch-Hit-Container">
                        <div className="DocSearch-Hit-icon">
                          <SourceIcon type={item.type} />
                        </div>

                        {item.hierarchy[item.type] && item.type === 'lvl1' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              hit={item}
                              attribute="hierarchy.lvl1"
                              className="DocSearch-Hit-title"
                            />
                            {item.content && (
                              <Snippet
                                hit={item}
                                attribute="content"
                                className="DocSearch-Hit-path"
                              />
                            )}
                          </div>
                        )}

                        {item.hierarchy[item.type] &&
                          (item.type === 'lvl2' ||
                            item.type === 'lvl3' ||
                            item.type === 'lvl4' ||
                            item.type === 'lvl5' ||
                            item.type === 'lvl6') && (
                            <div className="DocSearch-Hit-content-wrapper">
                              <Snippet
                                hit={item}
                                attribute={`hierarchy.${item.type}`}
                                className="DocSearch-Hit-title"
                              />
                              <Snippet
                                hit={item}
                                attribute="hierarchy.lvl1"
                                className="DocSearch-Hit-path"
                              />
                            </div>
                          )}

                        {item.type === 'content' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              hit={item}
                              attribute="content"
                              className="DocSearch-Hit-title"
                            />
                            <Snippet
                              hit={item}
                              attribute="hierarchy.lvl1"
                              className="DocSearch-Hit-path"
                            />
                          </div>
                        )}

                        <div className="DocSearch-Hit-action">
                          <SelectIcon />
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
