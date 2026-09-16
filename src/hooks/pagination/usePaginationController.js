import { useCallback, useEffect, useState } from "react";
import { paginationStorage } from "@/utils/pagination/paginationStorage";

export const usePaginationController = ({
  featureKey,
  restorePage = false,
  isLoading = false,
  isSearching = false,
  hasNextPage = false,
  hasPreviousPage = false,
  firstId,
  lastId,
  onFetch,
}) => {
  const [currentPage, setCurrentPage] = useState(() =>
    restorePage ? (paginationStorage.getPage(featureKey) ?? 1) : 1,
  );

  useEffect(() => {
    if (!restorePage) return;
    paginationStorage.savePage(featureKey, currentPage);
  }, [restorePage, featureKey, currentPage]);

  const canGoNext = hasNextPage && !isLoading && !isSearching;
  const canGoPrevious =
    hasPreviousPage && currentPage > 1 && !isLoading && !isSearching;

  const handleNext = useCallback(() => {
    if (!canGoNext) return;
    onFetch?.({ direction: "next", cursorId: lastId });
    setCurrentPage((page) => page + 1);
  }, [canGoNext, lastId, onFetch]);

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious) return;
    onFetch?.({ direction: "previous", cursorId: firstId });
    setCurrentPage((page) => Math.max(1, page - 1));
  }, [canGoPrevious, firstId, onFetch]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
    paginationStorage.clearPage(featureKey);
  }, [featureKey]);

  return {
    currentPage,
    canGoNext,
    canGoPrevious,
    handleNext,
    handlePrevious,
    resetToFirstPage,
  };
};
