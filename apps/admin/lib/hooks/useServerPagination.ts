import { useState } from 'react';

export interface ServerPaginationState {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRows: number;
}

export function useServerPagination(initialPageSize: number = 10) {
  const [paginationState, setPaginationState] = useState<ServerPaginationState>({
    page: 0,
    pageSize: initialPageSize,
    totalPages: 0,
    totalRows: 0,
  });

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPaginationState((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
  };

  const setTotalRows = (totalRows: number) => {
    const totalPages = Math.ceil(totalRows / paginationState.pageSize);
    setPaginationState((prev) => ({
      ...prev,
      totalRows,
      totalPages,
    }));
  };

  return {
    paginationState,
    handlePaginationChange,
    setTotalRows,
  };
}
