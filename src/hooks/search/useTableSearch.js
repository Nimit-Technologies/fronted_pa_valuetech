import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "debounce";
import FuzzySearch from "fuzzy-search";

// Narrows a loaded table page by a search term: a fuzzy match over the rows
// already in hand first, and only then the optional server search for rows that
// are not on this page.
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

  // Only the newest search may write state. A slow response for "ab" landing
  // after "abc" used to overwrite the newer match, and filteredData then saw a
  // query that no longer matched the input and fell back to the whole page, so
  // the user's results vanished.
  const requestId = useRef(0);

  // Server results per query, so returning to a term already searched for does
  // not ask the API again. Deliberately not in the list's redux slice: that
  // holds one page plus the cursor it was fetched with, and search rows carry
  // no cursor of their own, so merging them would corrupt paging. The cache
  // dies with the screen, which is as long as the rows can be trusted.
  const serverCache = useRef(new Map());

  // Built in an effect rather than while rendering: it owns a timer, it reads
  // the two refs above, and neither belongs in the render path.
  //
  // It depends on nothing but the delay, so it keeps one identity for the life
  // of the component. Depending on `data` — which changes on every list
  // fetch — rebuilt it mid-typing, and the cleanup cleared the pending timer
  // along with it, silently dropping the search. Everything that changes per
  // render is handed over as the second argument instead: debounce keeps the
  // arguments of the last call, which are the newest by definition.
  const debouncedSearch = useRef(null);

  useEffect(() => {
    const run = debounce(async (value, context) => {
      const { fuzzy, rows, search, minLength } = context;
      const query = value.trim();
      const id = ++requestId.current;

      if (query.length < minLength) {
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // 1. Local fuzzy match over the loaded page.
      const local = fuzzy.search(query);
      if (local.length > 0) {
        if (id !== requestId.current) return;
        setMatch({ source: rows, query, rows: local });
        setIsSearching(false);
        return;
      }

      // 2. A term searched for before, answered without a second request.
      if (serverCache.current.has(query)) {
        if (id !== requestId.current) return;
        setMatch({ source: rows, query, rows: serverCache.current.get(query) });
        setIsSearching(false);
        return;
      }

      // 3. Server fallback for rows that are not on this page.
      let found = [];
      if (search) {
        try {
          found = (await search(query)) ?? [];
          serverCache.current.set(query, found);
        } catch {
          // The caller surfaces the reason; an empty result reads as "no
          // match" rather than leaving the table on stale rows. Not cached, so
          // a retry can still reach the server.
          found = [];
        }
      }

      if (id !== requestId.current) return;
      setMatch({ source: rows, query, rows: found });
      setIsSearching(false);
    }, debounceTime);

    debouncedSearch.current = run;
    return () => run.clear();
  }, [debounceTime]);

  const onSearchChange = (value) => {
    setSearchTerm(value);
    debouncedSearch.current?.(value, {
      fuzzy: searcher,
      rows: data,
      search: serverSearch,
      minLength: minMatchCharLength,
    });
  };

  // True once the term is long enough to narrow the table. The rows on screen
  // are then a match set rather than the loaded page, which is what lets a
  // caller stand down paging controls that would page something else.
  const isFiltered = searchTerm.trim().length >= minMatchCharLength;

  const filteredData = useMemo(() => {
    const query = searchTerm.trim();
    if (query.length < minMatchCharLength) return data;
    if (match.source === data && match.query === query) return match.rows;
    return data;
  }, [data, searchTerm, minMatchCharLength, match]);

  return { searchTerm, filteredData, onSearchChange, isSearching, isFiltered };
};
