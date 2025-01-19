import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { DisposePageTable } from '../data/schemas';
import { TableColumnHeader } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<DisposePageTable, unknown>[] = [
  {
    accessorKey: 'user_id',
    id: 'user_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Teacher ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getTeacherID) => {
        return {
          render: () => `<div class="w-full">${getTeacherID()}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('user_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Reference ID'
      });
    },
    cell: ({ row }) => {
      const referenceIdSnippet = createRawSnippet<[string]>((getReferenceId) => {
        return {
          render: () => `<div class="w-full">${getReferenceId()}</div>`
        };
      });

      return renderSnippet(referenceIdSnippet, row.getValue('reference_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'fullname',
    id: 'fullname',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Fullname'
      });
    },
    cell: ({ row }) => {
      const fullnameSnippet = createRawSnippet<[string]>((getFullname) => {
        return {
          render: () => `<div class="w-full">${getFullname()}</div>`
        };
      });

      return renderSnippet(fullnameSnippet, row.getValue('fullname'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'item_name',
    id: 'item_name',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Item'
      });
    },
    cell: ({ row }) => {
      const itemSnippet = createRawSnippet<[string]>((getItem) => {
        return {
          render: () => `<div class="w-full">${getItem()}</div>`
        };
      });

      return renderSnippet(itemSnippet, row.getValue('item_name'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'quantity',
    id: 'quantity',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Quantity'
      });
    },
    cell: ({ row }) => {
      const quantitySnippet = createRawSnippet<[number]>((getQuantity) => {
        return {
          render: () => `<div class="w-full">${getQuantity()}</div>`
        };
      });

      return renderSnippet(quantitySnippet, row.getValue('quantity'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'borrowed_date',
    id: 'borrowed_date',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Date & Time Borrowed'
      });
    },
    cell: ({ row }) => {
      const borrowedDateSnippet = createRawSnippet<[string]>((getBorrowedDate) => {
        return {
          render: () =>
            `<div class="w-full">${new Date(getBorrowedDate()).toLocaleDateString()}, ${new Date(getBorrowedDate()).toLocaleTimeString()}</div>`
        };
      });

      return renderSnippet(borrowedDateSnippet, row.getValue('borrowed_date'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Date & Time Disposed'
      });
    },
    cell: ({ row }) => {
      const createdAtSnippet = createRawSnippet<[string]>((getCreatedAt) => {
        return {
          render: () =>
            `<div class="w-full">${new Date(getCreatedAt()).toLocaleDateString()}, ${new Date(getCreatedAt()).toLocaleTimeString()}</div>`
        };
      });

      return renderSnippet(createdAtSnippet, row.getValue('created_at'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'remarks',
    id: 'remarks',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<DisposePageTable, unknown>, {
        column,
        title: 'Remarks'
      });
    },
    cell: ({ row }) => {
      const remarksSnippet = createRawSnippet<[string]>((getRemarks) => {
        return {
          render: () => `<div class="w-full">${getRemarks()}</div>`
        };
      });

      return renderSnippet(remarksSnippet, row.getValue('remarks'));
    },
    enableSorting: true,
    enableHiding: true
  }
];
