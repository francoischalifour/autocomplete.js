export const noop = () => {};

export function groupBy(values, predicate) {
  return values.reduce(function(obj, item) {
    const key = predicate(item);
    if (!obj.hasOwnProperty(key)) {
      obj[key] = [];
    }
    obj[key].push(item);
    return obj;
  }, {});
}
