import React from 'react';

export const DocSearch = ({ onClose }) => (
  <div
    className="docsearch-container"
    onClick={event => {
      if (event.target === event.currentTarget) {
        onClose && onClose();
      }
    }}
  >
    <div className="docsearch-popup">
      <div className="docsearch-searchbox">
        <label className="docsearch-magnifier-icon">
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
        <input
          type="search"
          className="docsearch-input"
          placeholder="Find anything..."
          autoFocus
        />
      </div>
    </div>
  </div>
);
