"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  loading?: boolean
  emptyMessage?: string
  showColumnsToggle?: boolean
  showPagination?: boolean
  manualPagination?: boolean
  pageCount?: number
  pageIndex?: number
  pageSize?: number
  onPageChange?: (pageIndex: number) => void
  onRowClick?: (data: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  loading = false,
  emptyMessage = "No results found.",
  showColumnsToggle = true,
  showPagination = true,
  manualPagination = false,
  pageCount,
  pageIndex,
  pageSize = 10,
  onPageChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: manualPagination ? undefined : getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: manualPagination,
    pageCount: pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      ...(manualPagination && pageIndex !== undefined
        ? {
            pagination: {
              pageIndex,
              pageSize,
            },
          }
        : {}),
    },
  })

  const currentPage = manualPagination && pageIndex !== undefined ? pageIndex : table.getState().pagination.pageIndex
  const totalPages = manualPagination && pageCount !== undefined ? pageCount : table.getPageCount()

  const showHeaderToolbar = searchKey || showColumnsToggle

  return (
    <div className="space-y-4 w-full">
      {/* Search Filter and Column Visibility Controls */}
      {showHeaderToolbar && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="max-w-sm h-8"
            />
          )}
          {showColumnsToggle && (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="ml-auto h-8 gap-1.5 flex items-center">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-[180px] bg-white border border-border mt-1">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize text-xs cursor-pointer"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-md border border-border bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/75 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-xs font-semibold text-slate-500 py-3 px-4">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading Skeleton State
              Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index} className="hover:bg-transparent">
                  {columns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="py-4 px-4">
                      <Skeleton className="h-4 w-full animate-pulse bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              // Data Rows
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-slate-50/50" : "hover:bg-slate-50/50"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 px-4 text-xs text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty State
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-xs text-muted-foreground py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs text-muted-foreground font-medium">
            Page {currentPage + 1} of {totalPages || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(currentPage - 1)
                } else {
                  table.previousPage()
                }
              }}
              disabled={manualPagination ? currentPage === 0 : !table.getCanPreviousPage()}
              className="h-8"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (manualPagination && onPageChange) {
                  onPageChange(currentPage + 1)
                } else {
                  table.nextPage()
                }
              }}
              disabled={manualPagination ? currentPage >= totalPages - 1 : !table.getCanNextPage()}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
