import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { ItemsPageTable } from '../data/schemas';
import { TableColumnHeader, TableDescriptionRow, TableRowActions } from './index.js';
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
    accessorKey: 'department',
    id: 'department',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Department'
      });
    },
    cell: ({ row }) => {
      const departmentSnippet = createRawSnippet<[string]>((getDepartment) => {
        return {
          render: () => `<div class="w-full">${getDepartment()}</div>`
        };
      });

      return renderSnippet(departmentSnippet, row.getValue('department'));
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
          render: () => `<div class="w-full">${getStatus()}</div>`
        };
      });

      return renderSnippet(statusSnippet, row.getValue('status'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'brand',
    id: 'brand',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Brand'
      });
    },
    cell: ({ row }) => {
      const brandSnippet = createRawSnippet<[string]>((getBrand) => {
        return {
          render: () => `<div class="w-full">${getBrand()}</div>`
        };
      });

      return renderSnippet(brandSnippet, row.getValue('brand'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'quantity',
    id: 'quantity',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Quantity'
      });
    },
    cell: ({ row }) => {
      const quantitySnippet = createRawSnippet<[number]>((getQuantity) => {
        return {
          render: () => `<div class="w-full">${getQuantity().toLocaleString()}</div>`
        };
      });

      return renderSnippet(quantitySnippet, row.getValue('quantity'));
    },
    enableSorting: true,
    enableHiding: true
  },

  {
    accessorKey: 'description',
    id: 'description',
    header: ({ column }) => {
      return renderComponent(TableColumnHeader<ItemsPageTable, unknown>, {
        column,
        title: 'Description'
      });
    },
    cell: ({ row }) => renderComponent(TableDescriptionRow, { row }),
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
