import React, { useRef } from 'react';
import {
  GetFormProps,
  GetLabelProps,
  GetInputProps,
} from '@francoischalifour/autocomplete-core';

import { SearchIcon } from './SearchIcon';
import { ResetIcon } from './ResetIcon';
import { LoadingIcon } from './LoadingIcon';

interface SearchBoxProps {
  query: string;
  getFormProps: GetFormProps<React.FormEvent>;
  getLabelProps: GetLabelProps;
  getInputProps: GetInputProps<
    React.ChangeEvent,
    React.MouseEvent,
    React.KeyboardEvent
  >;
}

export function SearchBox(props: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { onSubmit, onReset } = props.getFormProps({
    inputElement: inputRef.current,
  });

  return (
    <form
      action=""
      role="search"
      noValidate
      className="DocSearch-Form"
      onSubmit={onSubmit}
      onReset={onReset}
    >
      <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
        <SearchIcon />
      </label>

      <div className="DocSearch-LoadingIndicator">
        <LoadingIcon />
      </div>

      <input
        className="DocSearch-Input"
        ref={inputRef}
        {...props.getInputProps({
          inputElement: inputRef.current!,
          type: 'search',
          maxLength: '512',
        })}
      />

      <button
        type="reset"
        title="Clear the query"
        className="DocSearch-Reset"
        hidden={!props.query}
        onClick={onReset}
      >
        <ResetIcon />
      </button>
    </form>
  );
}
