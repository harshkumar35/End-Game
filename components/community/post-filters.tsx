"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface PostFiltersProps {
  onFilterChange: (filters: {
    role?: string
    tag?: string
    sort?: string
  }) => void
}

const roles = [
  { label: "All Roles", value: "" },
  { label: "Lawyers", value: "lawyer" },
  { label: "Clients", value: "client" },
]

const tags = [
  { label: "All Tags", value: "" },
  { label: "Legal Advice", value: "legal-advice" },
  { label: "Case Study", value: "case-study" },
  { label: "Question", value: "question" },
  { label: "Experience", value: "experience" },
  { label: "News", value: "news" },
]

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Liked", value: "likes" },
]

export function PostFilters({ onFilterChange }: PostFiltersProps) {
  const [role, setRole] = useState("")
  const [tag, setTag] = useState("")
  const [sort, setSort] = useState("recent")
  const [openRole, setOpenRole] = useState(false)
  const [openTag, setOpenTag] = useState(false)
  const [openSort, setOpenSort] = useState(false)

  const handleRoleChange = (value: string) => {
    setRole(value)
    onFilterChange({ role: value, tag, sort })
  }

  const handleTagChange = (value: string) => {
    setTag(value)
    onFilterChange({ role, tag: value, sort })
  }

  const handleSortChange = (value: string) => {
    setSort(value)
    onFilterChange({ role, tag, sort: value })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Popover open={openRole} onOpenChange={setOpenRole}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openRole}
              className="justify-between min-w-[150px]"
            >
              {role ? roles.find((r) => r.value === role)?.label : "All Roles"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search roles..." />
              <CommandList>
                <CommandEmpty>No role found.</CommandEmpty>
                <CommandGroup>
                  {roles.map((r) => (
                    <CommandItem
                      key={r.value}
                      value={r.value}
                      onSelect={(currentValue) => {
                        handleRoleChange(currentValue === role ? "" : currentValue)
                        setOpenRole(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", role === r.value ? "opacity-100" : "opacity-0")} />
                      {r.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover open={openTag} onOpenChange={setOpenTag}>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" aria-expanded={openTag} className="justify-between min-w-[150px]">
              {tag ? tags.find((t) => t.value === tag)?.label : "All Tags"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tag found.</CommandEmpty>
                <CommandGroup>
                  {tags.map((t) => (
                    <CommandItem
                      key={t.value}
                      value={t.value}
                      onSelect={(currentValue) => {
                        handleTagChange(currentValue === tag ? "" : currentValue)
                        setOpenTag(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", tag === t.value ? "opacity-100" : "opacity-0")} />
                      {t.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        <Popover open={openSort} onOpenChange={setOpenSort}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openSort}
              className="justify-between min-w-[150px]"
            >
              {sortOptions.find((s) => s.value === sort)?.label}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search sort options..." />
              <CommandList>
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {sortOptions.map((s) => (
                    <CommandItem
                      key={s.value}
                      value={s.value}
                      onSelect={(currentValue) => {
                        handleSortChange(currentValue)
                        setOpenSort(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", sort === s.value ? "opacity-100" : "opacity-0")} />
                      {s.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
