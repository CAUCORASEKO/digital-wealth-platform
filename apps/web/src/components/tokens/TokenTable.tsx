// apps/web/src/components/tokens/TokenTable.tsx

// apps/web/src/components/tokens/TokenTable.tsx
// JP MORGAN–STYLE · SOBER · BANKING HOLDINGS TABLE

import { useState, useMemo } from 'react';
import { TokenItem, useAllTokenData } from '@web3-ai-copilot/data-hooks';
import { LucideIcons, Typography } from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { DataTable, TanstackTable } from '@e-burgos/tucutable';
import TableSearcher from '../common/TableSearcher';
import useTokenTableColumns from '../../hooks/useTokenTableColumns';

/* =========================================================
   BANKING TOKENS
   ========================================================= */
const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMain = 'text-[#e6ebf2]';
const textMuted = 'text-[#8a94a6]';

export function TokenTable() {
  const { columns } = useTokenTableColumns();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] =
    useState<TanstackTable.PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const { data, isLoading, isFetching, isError } = useAllTokenData();

  const tokensData = useMemo<TokenItem[]>(() => {
    return Array.isArray(data?.data) ? data.data : [];
  }, [data]);

  const filteredTokens = useMemo(() => {
    if (!search) return tokensData;
    const q = search.toLowerCase();
    return tokensData.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.symbol?.toLowerCase().includes(q)
    );
  }, [tokensData, search]);

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredTokens.slice(start, start + pagination.pageSize);
  }, [filteredTokens, pagination]);

  /* =========================================================
     LOADING
     ========================================================= */
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" className="h-14" />
        ))}
      </div>
    );
  }

  /* =========================================================
     EMPTY
     ========================================================= */
  if (tokensData.length === 0) {
    return (
      <div
        className={`${surface} ${border} rounded-xl p-10 text-center`}
      >
        <LucideIcons.Coins className="mx-auto mb-4 h-10 w-10 text-[#8a94a6]" />
        <Typography className={textMuted}>
          No asset holdings detected
        </Typography>
      </div>
    );
  }

  /* =========================================================
     TABLE
     ========================================================= */
  return (
    <section className={`${surface} ${border} rounded-xl`}>
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-[#1f2630] px-6 py-4">
        <div>
          <Typography className={`text-sm font-semibold ${textMain}`}>
            Asset Holdings
          </Typography>
          <Typography className={`text-xs ${textMuted}`}>
            Overview of all digital assets
          </Typography>
        </div>

        <TableSearcher
          placeholder="Search asset"
          search={search}
          setSearch={setSearch}
          onClear={() => setSearch('')}
        />
      </div>

      {/* TABLE */}
      <DataTable
        tableId="tokens-table"
        data={paginatedData}
        columns={columns}
        isError={isError}
        isFetching={isFetching}
        pagination={{
          showPagination: true,
          hideRecordsSelector: true,
          rowsInfo: true,
          manualPagination: {
            enabled: true,
            rowCount: filteredTokens.length,
            pagination,
            setPagination,
          },
        }}
        stateMessage={{
          noData: 'NO ASSETS FOUND',
          noDataDescription: 'This account holds no tokens.',
        }}
      />
    </section>
  );
}