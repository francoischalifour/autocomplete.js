import React, { render } from 'preact/compat';

import { DocSearch } from '@docsearch/react';

export function docsearch(props) {
  render(<DocSearch {...props} />, props.container);
}
