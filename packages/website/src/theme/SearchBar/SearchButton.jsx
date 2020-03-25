import React from 'react';

export default function SearchButton({ onClick }) {
  return (
    <button type="button" className="DocSearch-SearchButton" onClick={onClick}>
      <svg className="DocSearch-SearchButton-Icon" width="18px" viewBox="0 0 18 18">
        <path
          d="M13.14 13.14L17 17l-3.86-3.86A7.11 7.11 0 1 1 3.08 3.08a7.11 7.11 0 0 1 10.06 10.06z"
          stroke="currentColor"
          strokeWidth="1.78"
          fill="none"
          fillRule="evenodd"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      <span className="DocSearch-SearchButton-Placeholder">Search...</span>
      <span className="DocSearch-SearchButton-Key">⌘</span>
      <span className="DocSearch-SearchButton-KeySeparator">+</span>
      <span className="DocSearch-SearchButton-Key">K</span>
    </button>
  );
}
