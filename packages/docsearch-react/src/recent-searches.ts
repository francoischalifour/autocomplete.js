function isLocalStorageSupported() {
  const key = '__TEST_KEY__';

  try {
    localStorage.setItem(key, '');
    localStorage.removeItem(key);

    return true;
  } catch (error) {
    return false;
  }
}

function createStorage<TItem>() {
  if (isLocalStorageSupported() === false) {
    return {
      setItem() {},
      getItem() {
        return [];
      },
    };
  }

  const STORAGE_KEY = '__AUTOCOMPLETE_RECENT_SEARCHES__';

  return {
    setItem(item: TItem[]) {
      return window.localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    },
    getItem(): TItem[] {
      const item = window.localStorage.getItem(STORAGE_KEY);

      return item ? JSON.parse(item) : [];
    },
  };
}

export function createRecentSearches<TItem extends { objectID: string }>() {
  const storage = createStorage<TItem>();
  let items = storage.getItem();

  return {
    saveSearch(item: TItem) {
      const isQueryAlreadySaved = items.findIndex(
        x => x.objectID === item.objectID
      );

      if (isQueryAlreadySaved > -1) {
        items.splice(isQueryAlreadySaved, 1);
      }

      items.unshift(item);
      items = items.slice(0, 5);

      storage.setItem(items);
    },
    deleteSearch(item: TItem) {
      items = items.filter(x => x.objectID !== item.objectID);

      storage.setItem(items);
    },
    getSearches() {
      return items;
    },
  };
}
