import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ReturneePageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';
import { convert24Hto12H } from '$lib';

export const columns: ColumnDef<ReturneePageTable, unknown>[] = [
  {
    accessorKey: 'teacher_id',
    id: 'teacher_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
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

      return renderSnippet(idSnippet, row.getValue('teacher_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'reference_id',
    id: 'reference_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
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
    accessorKey: 'date_borrowed',
    id: 'date_borrowed',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
        column,
        title: 'Date & Time Borrowed'
      });
    },
    cell: ({ row }) => {
      const whenSnippet = createRawSnippet<[string]>((getWhen) => {
        return {
          render: () => `<div class="w-full">${getWhen()}</div>`
        };
      });

      return renderSnippet(whenSnippet, row.getValue('date_borrowed'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'date_returned',
    id: 'date_returned',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
        column,
        title: 'Date & Time Returned'
      });
    },
    cell: ({ row }) => {
      const whenSnippet = createRawSnippet<[string]>((getDateReturned) => {
        return {
          render: () =>
            `<div class="w-full">${new Date(getDateReturned()).toLocaleDateString()} ${convert24Hto12H(getDateReturned())}</div>`
        };
      });

      return renderSnippet(whenSnippet, row.getValue('date_returned'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'remarks',
    id: 'remarks',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReturneePageTable, unknown>, {
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
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(TableRowActions<ReturneePageTable>, { row })
  }
];
