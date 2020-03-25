import React from 'react';

interface NoResultsProps {
  query: string;
}

export function NoResults(props: NoResultsProps) {
  return <p>No results for “{props.query}“.</p>;
}
