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

  return {
    saveSearch(newSearch: TItem) {
      const nextSearches = this.getSearches();

      const isQueryAlreadySaved = nextSearches.findIndex(
        x => x.objectID === newSearch.objectID
      );

      if (isQueryAlreadySaved > -1) {
        nextSearches.splice(isQueryAlreadySaved, 1);
      }

      nextSearches.unshift(newSearch);

      storage.setItem(nextSearches.slice(0, 3));
    },
    deleteSearch(search: TItem) {
      const nextSearches = this.getSearches().filter(
        x => x.objectID !== search.objectID
      );

      storage.setItem(nextSearches);
    },
    getSearches() {
      return storage.getItem();
    },
  };
}
