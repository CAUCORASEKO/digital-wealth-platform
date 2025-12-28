// apps/web/src/components/transactions/TransactionsTable.tsx

import { useState, useMemo } from 'react';
import { useTransactionData, TransactionItem } from '@web3-ai-copilot/data-hooks';
import {
  CardContainer,
  Typography,
} from '@e-burgos/tucu-ui';
import { Skeleton } from '../common/Skeleton';
import { DataTable } from '@e-burgos/tucutable';
import { PaginationState } from '@tanstack/react-table';
import useTransactionTableColumns from '../../hooks/useTransactionTableColumns';

/* =========================================================
   PRIVATE BANKING STYLES
   ========================================================= */
const surface = 'bg-[#141a22]';
const border = 'border border-[#1f2630]';
const textMuted = 'text-[#8a94a6]';

export function TransactionsTable() {
  const { columns } = useTransactionTableColumns();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 12,
  });

  const { data, isLoading, isFetching, isError } = useTransactionData({
    pageSize: pagination.pageSize,
    pageIndex: pagination.pageIndex,
  });

  const tableId = 'transactions-ledger';

  const transactions = useMemo<TransactionItem[]>(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];
    return data.data;
  }, [data]);

  const totalCount = useMemo(() => {
    return data?.pagination?.totalCount ?? 0;
  }, [data?.pagination?.totalCount]);

  /* =========================================================
     LOADING
     ========================================================= */
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-14 rounded-md" />
        ))}
      </div>
    );
  }

  /* =========================================================
     ERROR
     ========================================================= */
  if (isError) {
    return (
      <CardContainer className={`${surface} ${border} rounded-xl p-10 text-center`}>
        <Typography className={textMuted}>
          Unable to load transaction ledger
        </Typography>
      </CardContainer>
    );
  }

  /* =========================================================
     LEDGER TABLE
     ========================================================= */
  return (
    <CardContainer
      className={`${surface} ${border} rounded-xl p-0 overflow-hidden`}
    >
      {/* HEADER */}
      <div className="px-10 py-5 border-b border-[#1f2630]">
        <Typography
          tag="h3"
          className="text-sm font-semibold uppercase tracking-wide text-[#8a94a6]"
        >
          Transaction Ledger
        </Typography>
      </div>

      {/* TABLE */}
      <DataTable
        tableId={tableId}
        data={transactions}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        border={false}
        pagination={{
          showPagination: true,
          hideRecordsSelector: true,
          rowsInfo: true,
          serverPagination: {
            totalCount,
            pagination,
            setPagination,
          },
        }}
        headerOptions={{
          headerContainer: (
            <div className="px-10 py-3 text-xs text-[#8a94a6]">
              Chronological record of all account activity
            </div>
          ),
        }}
        stateMessage={{
          noData: 'No transactions recorded',
          noDataDescription:
            'Your account activity will appear here once available.',
        }}
      />
    </CardContainer>
  );
}