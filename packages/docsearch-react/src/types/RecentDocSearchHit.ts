import { DocSearchHit } from './DocSearchHit';

export type RecentDocSearchHit = Exclude<
  DocSearchHit,
  '_highlightResult' | '_snippetResult'
>;
