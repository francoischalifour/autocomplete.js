import { DocSearchHit } from './DocSearchHit';

export type RecentSearchHit = Exclude<
  DocSearchHit,
  '_highlightResult' | '_snippetResult'
>;
