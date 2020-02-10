import Vue from 'vue';
import { compileToFunctions } from 'vue-template-compiler';

type RenderParams = {
  container: HTMLElement;
  components?: { [name: string]: any };
  template: string;
  data?: Function;
  methods?: { [name: string]: Function };
};

export function render({
  container,
  components,
  template,
  data = () => ({}),
  methods,
}: RenderParams) {
  // eslint-disable-next-line no-new
  new Vue({
    el: container,
    components,
    render: compileToFunctions(template).render,
    data,
    methods,
  });
}
