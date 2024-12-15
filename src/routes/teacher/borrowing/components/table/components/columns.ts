import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';
import type { BorrowedItemsPageTable } from '../data/schemas';
import { TableColumnHeader, TableRowActions } from './index.js';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/render-helpers.js';

export const columns: ColumnDef<BorrowedItemsPageTable, unknown>[] = [
	{
		accessorKey: 'reference_id',
		id: 'reference_id',
		header: ({ column }) => {
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
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
		accessorKey: 'item',
		id: 'item',
		header: ({ column }) => {
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
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
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
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
		accessorKey: 'room',
		id: 'room',
		header: ({ column }) => {
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
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
		accessorKey: 'returned_date',
		id: 'returned_date',
		header: ({ column }) => {
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
				column,
				title: 'Returned Date & Time'
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
			return renderComponent(TableColumnHeader<BorrowedItemsPageTable, unknown>, {
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
		cell: ({ row }) => renderComponent(TableRowActions<BorrowedItemsPageTable>, { row })
	}
];
