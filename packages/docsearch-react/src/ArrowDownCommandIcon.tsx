import React from 'react';

export function ArrowDownCommandIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <defs>
        <path
          id="a"
          d="M3.67 2.47L1.9 4.24a.33.33 0 0 1-.47-.48l2.33-2.33a.33.33 0 0 1 .48 0l2.33 2.33a.33.33 0 1 1-.47.48L4.33 2.47v3.86a.33.33 0 1 1-.66 0V2.47z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <rect
          width="15"
          height="15"
          x=".5"
          y=".5"
          stroke="currentColor"
          rx="2"
          className="DocSearch-Commands-border"
        />
        <g transform="matrix(1 0 0 -1 4 12)">
          <mask id="b" fill="currentColor">
            <use xlinkHref="#a" />
          </mask>
          <use fill="currentColor" fillRule="nonzero" xlinkHref="#a" />
          <g fill="currentColor" mask="url(#b)">
            <path d="M0 0h8v8H0z" />
          </g>
        </g>
      </g>
    </svg>
  );
}
