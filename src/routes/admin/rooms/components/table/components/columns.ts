import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { RoomsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<RoomsPageTable, unknown>[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<RoomsPageTable, unknown>, {
        column,
        title: 'Room Name'
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
    accessorKey: 'number',
    id: 'number',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<RoomsPageTable, unknown>, {
        column,
        title: 'Room Number'
      });
    },
    cell: ({ row }) => {
      const numberSnippet = createRawSnippet<[string]>((getNumber) => {
        return {
          render: () => `<div class="w-full">${getNumber()}</div>`
        };
      });

      return renderSnippet(numberSnippet, row.getValue('number'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<RoomsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<RoomsPageTable>, { row })
  }
];
