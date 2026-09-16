import { useEffect, useMemo, useState } from "react";
import debounce from "debounce";
import FuzzySearch from "fuzzy-search";

export const useTableSearch = ({
  data = [],
  keys = [],
  debounceTime = 300,
  minMatchCharLength = 2,
  serverSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState({ source: null, query: "", rows: [] });

  const keysKey = keys.join("|");
  const searcher = useMemo(
    () =>
      new FuzzySearch(data, keysKey ? keysKey.split("|") : [], {
        caseSensitive: false,
        sort: true,
      }),
    [data, keysKey],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        const query = value.trim();
        if (query.length < minMatchCharLength) {
          setIsSearching(false);
          return;
        }

        setIsSearching(true);

        // 1. Local fuzzy match over the loaded page.
        const local = searcher.search(query);
        if (local.length > 0) {
          setMatch({ source: data, query, rows: local });
          setIsSearching(false);
          return;
        }

        // 2. Optional server fallback for rows not on this page.
        let rows = [];
        if (serverSearch) {
          try {
            rows = (await serverSearch(query)) ?? [];
          } catch {
            rows = [];
          }
        }
        setMatch({ source: data, query, rows });
        setIsSearching(false);
      }, debounceTime),
    [data, searcher, serverSearch, debounceTime, minMatchCharLength],
  );

  useEffect(() => () => debouncedSearch.clear(), [debouncedSearch]);

  const onSearchChange = (value) => {
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const filteredData = useMemo(() => {
    const query = searchTerm.trim();
    if (query.length < minMatchCharLength) return data;
    if (match.source === data && match.query === query) return match.rows;
    return data;
  }, [data, searchTerm, minMatchCharLength, match]);

  return { searchTerm, filteredData, onSearchChange, isSearching };
};
