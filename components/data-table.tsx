"use client"

import React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  className?: string
  rowClassName?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T extends { id?: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data available",
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("overflow-x-auto rounded-xl border border-border bg-card", className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-semibold text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-border/50 last:border-0">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-4 py-3">
                    <div className="h-5 w-24 animate-pulse rounded bg-muted" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn("overflow-x-auto rounded-xl border border-border bg-card", className)}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-sm font-semibold text-muted-foreground",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border bg-card scrollbar-thin", className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  "px-4 py-3 text-left text-sm font-semibold text-muted-foreground",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id ?? index}
              className={cn(
                "border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30",
                onRowClick && "cursor-pointer",
                rowClassName
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={cn("px-4 py-3 text-sm", column.className)}
                >
                  {column.render
                    ? column.render(item)
                    : String(item[column.key as keyof T] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Helper component for truncated addresses/hashes with links
interface TruncatedLinkProps {
  href: string
  value: string
  maxLength?: number
  className?: string
}

export function TruncatedLink({ href, value, maxLength = 16, className }: TruncatedLinkProps) {
  const truncated =
    value.length > maxLength
      ? `${value.slice(0, maxLength / 2)}...${value.slice(-maxLength / 2)}`
      : value

  return (
    <Link
      href={href}
      className={cn(
        "font-mono text-primary transition-colors hover:text-primary/80 hover:underline",
        className
      )}
      title={value}
    >
      {truncated}
    </Link>
  )
}

// Status badge component
interface StatusBadgeProps {
  status: "success" | "failed" | "pending"
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        status === "success" && "bg-[#00ff88]/10 text-[#00ff88]",
        status === "failed" && "bg-destructive/10 text-destructive",
        status === "pending" && "bg-warning/10 text-[#ffd93d]",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "success" && "bg-[#00ff88] animate-pulse-glow",
          status === "failed" && "bg-destructive",
          status === "pending" && "bg-[#ffd93d] animate-pulse"
        )}
      />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Live indicator
export function LiveIndicator({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-[#00ff88]",
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse-glow" />
      Live
    </span>
  )
}
