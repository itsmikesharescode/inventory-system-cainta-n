import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ItemsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions, TableInterestRow } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<ItemsPageTable, unknown>[] = [
  {
    accessorKey: 'device_id',
    id: 'device_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Device ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getDeviceID) => {
        return {
          render: () => `<div class="w-full">${getDeviceID()}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('device_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'model',
    id: 'model',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Model'
      });
    },
    cell: ({ row }) => {
      const modelSnippet = createRawSnippet<[string]>((getModel) => {
        return {
          render: () => `<div class="w-full">${getModel()}</div>`
        };
      });

      return renderSnippet(modelSnippet, row.getValue('model'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'category',
    id: 'category',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Category'
      });
    },
    cell: ({ row }) => {
      const categorySnippet = createRawSnippet<[string]>((getCategory) => {
        return {
          render: () => `<div class="w-full">${getCategory()}</div>`
        };
      });

      return renderSnippet(categorySnippet, row.getValue('category'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'type',
    id: 'type',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Type'
      });
    },
    cell: ({ row }) => {
      const typeSnippet = createRawSnippet<[string]>((getType) => {
        return {
          render: () => `<div class="w-full truncate">${getType()}</div>`
        };
      });

      return renderSnippet(typeSnippet, row.getValue('type'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Status'
      });
    },
    cell: ({ row }) => {
      const statusSnippet = createRawSnippet<[boolean]>((getStatus) => {
        return {
          render: () => `<div class="w-full">${getStatus() ? 'Active' : 'Inactive'}</div>`
        };
      });

      return renderSnippet(statusSnippet, row.getValue('approved'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'mr',
    id: 'mr',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'MR'
      });
    },
    cell: ({ row }) => {
      const mrSnippet = createRawSnippet<[boolean]>((getMR) => {
        return {
          render: () => `<div class="w-full">${getMR()}</div>`
        };
      });

      return renderSnippet(mrSnippet, row.getValue('mr'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
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
    cell: ({ row }) => renderComponent(TableRowActions<ItemsPageTable>, { row })
  }
];
