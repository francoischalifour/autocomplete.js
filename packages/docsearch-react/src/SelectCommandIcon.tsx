import React from 'react';

export function SelectCommandIcon() {
  return (
    <svg viewBox="0 0 16 16">
      <defs>
        <path
          id="enter-a"
          d="M7,1.33333333 L7,3.66666667 C7,4.6 6.26564673,5.33333333 5.3310153,5.33333333 L2.12656467,5.33333333 L3.22809458,6.43333333 C3.36161335,6.56666667 3.36161335,6.76666667 3.22809458,6.9 C3.16133519,6.96666667 3.0945758,7 2.99443672,7 C2.89429764,7 2.82753825,6.96666667 2.76077886,6.9 L1.09179416,5.23333333 C1.05841446,5.2 1.02503477,5.16666667 1.02503477,5.13333333 C0.991655076,5.06666667 0.991655076,4.96666667 1.02503477,4.86666667 C1.05841446,4.83333333 1.05841446,4.8 1.09179416,4.76666667 L2.76077886,3.1 C2.89429764,2.96666667 3.0945758,2.96666667 3.22809458,3.1 C3.36161335,3.23333333 3.36161335,3.43333333 3.22809458,3.56666667 L2.12656467,4.66666667 L5.3310153,4.66666667 C5.8984701,4.66666667 6.33240612,4.23333333 6.33240612,3.66666667 L6.33240612,1.33333333 C6.33240612,1.13333333 6.4659249,1 6.66620306,1 C6.86648122,1 7,1.13333333 7,1.33333333 Z"
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
        <g transform="translate(4 4)">
          <mask id="enter-b" fill="currentColor">
            <use xlinkHref="#enter-a" />
          </mask>
          <use fill="currentColor" fillRule="nonzero" xlinkHref="#enter-a" />
          <g fill="currentColor" mask="url(#enter-b)">
            <rect width="8" height="8" />
          </g>
        </g>
      </g>
    </svg>
  );
}
