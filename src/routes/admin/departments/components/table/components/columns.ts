import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DepartmentsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<DepartmentsPageTable, unknown>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DepartmentsPageTable, unknown>, {
        column,
        title: 'Department Name'
      });
    },
    cell: ({ row }) => {
      const nameSnippet = createRawSnippet<[string]>((getName) => {
        return {
          render: () => `<div class="w-full">${getName()}</div>`
        };
      });

      return renderSnippet(nameSnippet, row.getValue('name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'code',
    id: 'code',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DepartmentsPageTable, unknown>, {
        column,
        title: 'Department Code'
      });
    },
    cell: ({ row }) => {
      const codeSnippet = createRawSnippet<[string]>((getCode) => {
        return {
          render: () => `<div class="w-full">${getCode()}</div>`
        };
      });

      return renderSnippet(codeSnippet, row.getValue('code'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DepartmentsPageTable, unknown>, {
        column,
        title: 'Created At'
      });
    },
    cell: ({ row }) => {
      const createdAtSnippet = createRawSnippet<[string]>((getCreatedAt) => {
        return {
          render: () => `<div class="w-full">${new Date(getCreatedAt()).toLocaleDateString()}</div>`
        };
      });

      return renderSnippet(createdAtSnippet, row.getValue('created_at'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(TableRowActions<DepartmentsPageTable>, { row })
  }
];
