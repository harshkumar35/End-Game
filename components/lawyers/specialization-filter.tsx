"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, X, Filter } from "lucide-react"

interface SpecializationFilterProps {
  specializations: string[]
  selectedSpecializations: string[]
  onSpecializationChange: (specializations: string[]) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  locationFilter: string
  onLocationChange: (location: string) => void
  experienceFilter: number
  onExperienceChange: (years: number) => void
  availableOnly: boolean
  onAvailableOnlyChange: (available: boolean) => void
}

const COMMON_SPECIALIZATIONS = [
  "Criminal Law",
  "Civil Law",
  "Corporate Law",
  "Family Law",
  "Property Law",
  "Labor Law",
  "Tax Law",
  "Immigration Law",
  "Intellectual Property",
  "Environmental Law",
  "Constitutional Law",
  "Consumer Protection",
]

const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: 0 },
  { label: "1+ Years", value: 1 },
  { label: "3+ Years", value: 3 },
  { label: "5+ Years", value: 5 },
  { label: "10+ Years", value: 10 },
]

export function SpecializationFilter({
  specializations,
  selectedSpecializations,
  onSpecializationChange,
  searchQuery,
  onSearchChange,
  locationFilter,
  onLocationChange,
  experienceFilter,
  onExperienceChange,
  availableOnly,
  onAvailableOnlyChange,
}: SpecializationFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSpecializationToggle = (specialization: string) => {
    if (selectedSpecializations.includes(specialization)) {
      onSpecializationChange(selectedSpecializations.filter((s) => s !== specialization))
    } else {
      onSpecializationChange([...selectedSpecializations, specialization])
    }
  }

  const clearAllFilters = () => {
    onSpecializationChange([])
    onSearchChange("")
    onLocationChange("")
    onExperienceChange(0)
    onAvailableOnlyChange(false)
  }

  const hasActiveFilters =
    selectedSpecializations.length > 0 ||
    searchQuery.length > 0 ||
    locationFilter.length > 0 ||
    experienceFilter > 0 ||
    availableOnly

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Lawyers
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lawyers by name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <Input
            placeholder="Enter city or state..."
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>

        {/* Experience Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Experience</label>
          <div className="grid grid-cols-2 gap-2">
            {EXPERIENCE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={experienceFilter === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onExperienceChange(option.value)}
                className="justify-start"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="available-only"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="available-only" className="text-sm font-medium">
            Show only available lawyers
          </label>
        </div>

        {/* Specializations */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Specializations</label>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Show Less" : "Show More"}
            </Button>
          </div>

          <div className="space-y-2">
            {/* Selected Specializations */}
            {selectedSpecializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSpecializations.map((spec) => (
                  <Badge
                    key={spec}
                    variant="default"
                    className="cursor-pointer"
                    onClick={() => handleSpecializationToggle(spec)}
                  >
                    {spec}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Available Specializations */}
            <div className="flex flex-wrap gap-2">
              {(isExpanded ? COMMON_SPECIALIZATIONS : COMMON_SPECIALIZATIONS.slice(0, 6))
                .filter((spec) => !selectedSpecializations.includes(spec))
                .map((spec) => (
                  <Badge
                    key={spec}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => handleSpecializationToggle(spec)}
                  >
                    {spec}
                  </Badge>
                ))}
            </div>

            {/* Custom specializations from database */}
            {specializations
              .filter((spec) => !COMMON_SPECIALIZATIONS.includes(spec) && !selectedSpecializations.includes(spec))
              .slice(0, isExpanded ? undefined : 3)
              .map((spec) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleSpecializationToggle(spec)}
                >
                  {spec}
                </Badge>
              ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedSpecializations.length > 0 && (
                <span>{selectedSpecializations.length} specialization(s) selected</span>
              )}
              {searchQuery && (
                <span>
                  {selectedSpecializations.length > 0 ? ", " : ""}searching for "{searchQuery}"
                </span>
              )}
              {locationFilter && (
                <span>
                  {selectedSpecializations.length > 0 || searchQuery ? ", " : ""}in {locationFilter}
                </span>
              )}
              {experienceFilter > 0 && (
                <span>
                  {selectedSpecializations.length > 0 || searchQuery || locationFilter ? ", " : ""}
                  {experienceFilter}+ years experience
                </span>
              )}
              {availableOnly && (
                <span>
                  {selectedSpecializations.length > 0 || searchQuery || locationFilter || experienceFilter > 0
                    ? ", "
                    : ""}
                  available only
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
