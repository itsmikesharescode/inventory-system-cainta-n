import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ReservationsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<ReservationsPageTable, unknown>[] = [
  {
    accessorKey: 'teacher_id',
    id: 'teacher_id',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Reference ID'
      });
    },
    cell: ({ row }) => {
      const idSnippet = createRawSnippet<[string]>((getReferenceID) => {
        return {
          render: () => `<div class="w-full">${getReferenceID()}</div>`
        };
      });

      return renderSnippet(idSnippet, row.getValue('reference_id'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'fullname',
    id: 'fullname',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
    accessorKey: 'item',
    id: 'item',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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

      return renderSnippet(itemSnippet, row.getValue('item'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'quantity',
    id: 'quantity',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Quantity'
      });
    },
    cell: ({ row }) => {
      const quantitySnippet = createRawSnippet<[string]>((getQuantity) => {
        return {
          render: () => `<div class="w-full truncate">${getQuantity()}</div>`
        };
      });

      return renderSnippet(quantitySnippet, row.getValue('quantity'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'room',
    id: 'room',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Room'
      });
    },
    cell: ({ row }) => {
      const roomSnippet = createRawSnippet<[string]>((getRoom) => {
        return {
          render: () => `<div class="w-full">${getRoom()}</div>`
        };
      });

      return renderSnippet(roomSnippet, row.getValue('room'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'when',
    id: 'when',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Date & Time'
      });
    },
    cell: ({ row }) => {
      const whenSnippet = createRawSnippet<[string]>((getWhen) => {
        return {
          render: () => `<div class="w-full">${getWhen()}</div>`
        };
      });

      return renderSnippet(whenSnippet, row.getValue('when'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'created_at',
    id: 'created_at',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
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
    accessorKey: 'status',
    id: 'status',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ReservationsPageTable, unknown>, {
        column,
        title: 'Status'
      });
    },
    cell: ({ row }) => {
      const statusSnippet = createRawSnippet<[string]>((getStatus) => {
        const checkBgColor = () => {
          if (getStatus() === 'pending') {
            return 'bg-yellow-500';
          } else if (getStatus() === 'rejected') {
            return 'bg-red-500';
          }
          return 'bg-green-500';
        };

        return {
          render: () =>
            `<div class="w-full ${checkBgColor()} rounded-md px-2 py-1 flex items-center justify-center text-white">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnippet, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    id: 'actions',
    cell: ({ row }) => renderComponent(TableRowActions<ReservationsPageTable>, { row })
  }
];
