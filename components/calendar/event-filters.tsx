"use client"

import type { EventType } from "@/types/calendar"
import { EVENT_TYPE_CONFIG } from "@/lib/calendar-utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface EventFiltersProps {
  selectedTypes: EventType[]
  onTypeToggle: (type: EventType) => void
  onClearAll: () => void
}

// Filter-specific color variations that are very muted and calm
const FILTER_COLORS: Record<EventType, { 
  selected: string; 
  unselected: string; 
  text: string;
}> = {
  commission: {
    selected: "bg-[#d36530]/20 hover:bg-[#d36530]/30",
    unselected: "bg-[#d36530]/3 border-[#d36530]/8 text-[#d36530]/40 hover:bg-[#d36530]/6",
    text: "text-[#d36530]"
  },
  county: {
    selected: "bg-[#059669]/20 hover:bg-[#059669]/30",
    unselected: "bg-[#059669]/3 border-[#059669]/8 text-[#059669]/40 hover:bg-[#059669]/6",
    text: "text-[#059669]"
  },
  "school-board": {
    selected: "bg-[#7c3aed]/20 hover:bg-[#7c3aed]/30",
    unselected: "bg-[#7c3aed]/3 border-[#7c3aed]/8 text-[#7c3aed]/40 hover:bg-[#7c3aed]/6",
    text: "text-[#7c3aed]"
  },
  election: {
    selected: "bg-[#dc2626]/20 hover:bg-[#dc2626]/30",
    unselected: "bg-[#dc2626]/3 border-[#dc2626]/8 text-[#dc2626]/40 hover:bg-[#dc2626]/6",
    text: "text-[#dc2626]"
  }
}

export function EventFilters({ selectedTypes, onTypeToggle, onClearAll }: EventFiltersProps) {
  const allTypes: EventType[] = ["commission", "county", "school-board", "election"]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-[#5e6461]">Filter by type:</span>
      {allTypes.map((type) => {
        const config = EVENT_TYPE_CONFIG[type]
        const filterColors = FILTER_COLORS[type]
        const isSelected = selectedTypes.includes(type)

        return (
          <Button
            key={type}
            variant="outline"
            size="sm"
            onClick={() => onTypeToggle(type)}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected 
                ? `${filterColors.selected} ${filterColors.text} border-transparent` 
                : filterColors.unselected
            }`}
          >
            {config.label}
            {isSelected && <X className="ml-1 h-3 w-3" />}
          </Button>
        )
      })}
      {selectedTypes.length > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll} 
          className="cursor-pointer text-[#5e6461] hover:bg-[#d36530]/10 hover:text-[#d36530] transition-colors duration-200"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
