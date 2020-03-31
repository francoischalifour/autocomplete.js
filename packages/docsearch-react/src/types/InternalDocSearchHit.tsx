import { DocSearchHit } from './DocSearchHit';

type DocSearchPlugin = any;

export type InternalDocSearchHit = DocSearchHit & {
  __docsearch_title: string;
  __docsearch_parent: null | DocSearchHit;
  __docsearch_source: string;
  __docsearch_plugin: DocSearchPlugin;
};
