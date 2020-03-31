import React from 'react';
import {
  GetMenuProps,
  GetItemProps,
  AutocompleteSuggestion,
} from '@francoischalifour/autocomplete-core';

import { Snippet } from '../Snippet';
import { SourceIcon } from './SourceIcon';
import { SelectIcon } from './ActionIcon';
import { InternalDocSearchHit } from '../types';

interface ResultsProps {
  suggestions: Array<AutocompleteSuggestion<InternalDocSearchHit>>;
  getMenuProps: GetMenuProps;
  getItemProps: GetItemProps<InternalDocSearchHit, React.MouseEvent>;
  plugins: any[];
}

export function Results(props: ResultsProps) {
  return (
    <div className="DocSearch-Dropdown-Container">
      {props.suggestions.map(({ source, items }) => {
        if (items.length === 0) {
          return null;
        }

        const title = items[0].__docsearch_title;

        return (
          <section key={title} className="DocSearch-Hits">
            <div className="DocSearch-Hit-source">{title}</div>

            <ul {...props.getMenuProps()}>
              {items.map((item, index) => {
                return (
                  <li
                    key={[title, item.objectID].join(':')}
                    className={[
                      'DocSearch-Hit',
                      !item.__docsearch_source &&
                        item.__docsearch_parent &&
                        'DocSearch-Hit--Child',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    {...props.getItemProps({
                      item,
                      source,
                    })}
                  >
                    {!item.__docsearch_source && item.__docsearch_parent && (
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
                      <SourceItem {...item}>
                        {item.hierarchy[item.type] && item.type === 'lvl1' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              className="DocSearch-Hit-title"
                              hit={item}
                              attribute="hierarchy.lvl1"
                            />
                            {item.content && (
                              <Snippet
                                className="DocSearch-Hit-path"
                                hit={item}
                                attribute="content"
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
                                className="DocSearch-Hit-title"
                                hit={item}
                                attribute={`hierarchy[${item.type}]`}
                              />
                              <Snippet
                                className="DocSearch-Hit-path"
                                hit={item}
                                attribute="hierarchy.lvl1"
                              />
                            </div>
                          )}

                        {item.type === 'content' && (
                          <div className="DocSearch-Hit-content-wrapper">
                            <Snippet
                              className="DocSearch-Hit-title"
                              hit={item}
                              attribute="content"
                            />
                            <Snippet
                              className="DocSearch-Hit-path"
                              hit={item}
                              attribute="hierarchy.lvl1"
                            />
                          </div>
                        )}
                      </SourceItem>
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

function SourceItem(props: InternalDocSearchHit) {
  if (props.__docsearch_source === 'recent-searches') {
    return <RecentSearchItem {...props} />;
  } else {
    return <DocumentationItem {...props} />;
  }
}

function RecentSearchItem(props) {
  const { children, ...suggestion } = props;

  return (
    <div className="DocSearch-Hit-Container">
      <div className="DocSearch-Hit-icon">
        <svg width="20" height="20">
          <g
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3.18 6.6a8.23 8.23 0 1112.93 9.94h0a8.23 8.23 0 01-11.63 0" />
            <path d="M6.44 7.25H2.55V3.36M10.45 6v5.6M10.45 11.6L13 13" />
          </g>
        </svg>
      </div>

      {children}

      <div className="DocSearch-Hit-action">
        <button
          className="DocSearch-Hit-action-button"
          title="Delete this search"
          onClick={event => {
            console.log('onActionClick', props);

            event.preventDefault();
            event.stopPropagation();

            props.__docsearch_action(suggestion);
          }}
        >
          <svg width="20" height="20">
            <g
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path
                d="M10,10 L15.0853291,4.91467086 L10,10 L15.0853291,15.0853291 L10,10 Z M10,10 L4.91467086,4.91467086 L10,10 L4.91467086,15.0853291 L10,10 Z"
                transform="translate(10.000000, 10.000000) rotate(-360.000000) translate(-10.000000, -10.000000) "
              ></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  );
}

function DocumentationItem(props) {
  return (
    <div className="DocSearch-Hit-Container">
      <div className="DocSearch-Hit-icon">
        <SourceIcon type={props.type} />
      </div>

      {props.children}

      <div className="DocSearch-Hit-action">
        <SelectIcon />
      </div>
    </div>
  );
}
