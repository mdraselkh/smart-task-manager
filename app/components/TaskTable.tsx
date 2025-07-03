"use client";

import {
  ColumnDef,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AccessibilityIcon,
  Delete,
  DeleteIcon,
  Edit,
  LucideDelete,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Task } from "../lib/types";
import TaskForm from "./TaskForm";

interface Props {
  data: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSuggest: (task: Task) => void;
  onAdd: (task: Task) => void;
  loading: string | null;
}

export function TaskTable({
  data,
  onEdit,
  onDelete,
  onSuggest,
  onAdd,
  loading,
}: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);

  const table = useReactTable({
    data,
    columns: [
      // {
      //   accessorKey: "id",
      //   header: "Id",
      // },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="font-medium max-w-[150px] truncate break-words md:max-w-none">{row.getValue("title")}</div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate break-words md:max-w-none">
            {row.getValue("description")}
          </div>
        ),
      },
      {
        accessorKey: "subtasks",
        header: "Subtasks",
        cell: ({ row }) => {
          const task = row.original;
          const subtasks = row.getValue("subtasks") as string[];

          if (loading === task.id) {
            return (
              <span className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <Sparkles className="h-4 w-4 animate-spin text-green-500" />
                <Sparkles className="h-4 w-4 animate-spin text-green-500" />
                Generating...
              </span>
            );
          }

          if (!subtasks || subtasks.length === 0) {
            return (
              <span className="text-muted-foreground italic">No subtasks</span>
            );
          }

          return (
            <ul className="list-disc pl-5 space-y-1">
              {subtasks?.map((subtask, index) => (
                <li key={index}>{subtask}</li>
              ))}
            </ul>
          );
        },
      },

      {
        accessorKey: "dueDate",
        header: "Due Date",
      },
      {
        accessorKey: "status",
        header: "Status",
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const task = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onEdit(task)}
                  className="group flex items-center text-blue-700 hover:bg-blue-100 cursor-pointer"
                >
                  <Edit className="mr-2 h-4 w-4 group-hover:text-blue-900 transition-colors" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className="group flex items-center text-red-700 hover:bg-red-100 cursor-pointer"
                >
                  <LucideDelete className="mr-2 h-4 w-4 group-hover:text-red-900 transition-colors" />
                  Delete
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onSuggest(task)}
                  className="group flex items-center text-green-600 hover:bg-green-100 cursor-pointer"
                >
                  <Sparkles className="mr-2 h-4 w-4 group-hover:text-green-900 transition-colors" />
                  Suggest Subtasks
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnFilters,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    manualPagination: false,
  });

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4  mt-4 md:mt-0 py-2">
        <Input
          placeholder="Search title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center justify-between md:justify-end w-full md:w-auto  gap-4">
          <Select
            onValueChange={(value) =>
              table.getColumn("status")?.setFilterValue(value)
            }
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
          >
            <SelectTrigger className="w-[180px] ">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            Add Task
          </Button>
        </div>
      </div>
      <div className="rounded-md border mt-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" && " 🔼"}
                        {header.column.getIsSorted() === "desc" && " 🔽"}
                      </>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="text-center"
                >
                  No tasks available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center py-3 text-sm md:text-base">
          <p>Rows Per Page:</p>
          <Select
            defaultValue="5"
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[70px] md:w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white text-black">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-end space-x-2 px-4 py-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <TaskForm onSubmit={onAdd} onCancel={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
