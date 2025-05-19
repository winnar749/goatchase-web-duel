
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sidebar container
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  isOpen?: boolean
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, collapsed = false, isOpen = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-background transition-width duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        !isOpen && "-translate-x-full",
        className
      )}
      {...props}
    />
  )
)
Sidebar.displayName = "Sidebar"

// Sidebar header
const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 items-center border-b px-4", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

// Sidebar footer
const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto flex items-center border-t p-4", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

// Sidebar content
const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex grow flex-col gap-4 overflow-y-auto overflow-x-hidden py-4",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const sidebarItemVariants = cva(
  "flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium text-muted-foreground hover:text-foreground",
  {
    variants: {
      variant: {
        default: "hover:bg-accent",
        ghost: "",
      },
      active: {
        true: "bg-accent text-foreground",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
        false: "",
      },
      collapse: {
        true: "justify-center",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      active: false,
      disabled: false,
      collapse: false,
    },
  }
)

export interface SidebarItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarItemVariants> {
  icon?: React.ReactNode
  children: React.ReactNode
  tooltip?: string
  collapse?: boolean
}

// Sidebar item
const SidebarItem = React.forwardRef<HTMLButtonElement, SidebarItemProps>(
  (
    {
      className,
      variant,
      active,
      disabled,
      collapse,
      children,
      icon,
      tooltip,
      ...props
    },
    ref
  ) => {
    if (tooltip && collapse) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                ref={ref}
                className={cn(
                  sidebarItemVariants({
                    variant,
                    active,
                    disabled,
                    collapse,
                    className,
                  })
                )}
                disabled={disabled}
                {...props}
              >
                {icon}
                {!collapse && <span>{children}</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <button
        ref={ref}
        className={cn(
          sidebarItemVariants({ variant, active, disabled, collapse, className })
        )}
        disabled={disabled}
        {...props}
      >
        {icon}
        {!collapse && <span>{children}</span>}
      </button>
    )
  }
)
SidebarItem.displayName = "SidebarItem"

export {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarItem,
  sidebarItemVariants,
}
