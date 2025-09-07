"use client"

import type { EventType } from "@/types/calendar"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface EventFiltersProps {
  selectedTypes: EventType[]
  eventTypeConfig: Record<string, { label: string; color: string; bgColor: string; colorHex: string }>
  onTypeToggle: (type: EventType) => void
  onClearAll: () => void
}

export function EventFilters({ selectedTypes, eventTypeConfig, onTypeToggle, onClearAll }: EventFiltersProps) {
  // Get all available event types from the config
  const allTypes: EventType[] = Object.keys(eventTypeConfig).length > 0 
    ? Object.keys(eventTypeConfig) as EventType[]
    : [] // No fallback - wait for event types to load

  // Generate filter colors dynamically from event type config
  const getFilterColors = (type: EventType) => {
    const config = eventTypeConfig[type]
    
    // If no config available (event types not loaded yet), use default transparent styling
    if (!config) {
      return {
        selected: {
          className: "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300",
          style: {}
        },
        unselected: {
          className: "bg-transparent hover:bg-gray-50 text-gray-500 border-gray-200",
          style: {}
        }
      }
    }
    
    // Use the raw hex color directly from the config with inline styles
    const colorHex = config.colorHex
    
    return {
      selected: {
        className: "border text-black",
        style: {
          backgroundColor: `${colorHex}20`, // 20% opacity
          borderColor: `${colorHex}30`, // 30% opacity
        }
      },
      unselected: {
        className: "bg-transparent border text-black",
        style: {
          borderColor: `${colorHex}20`, // 20% opacity
        }
      }
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-[#5e6461]">Filter by type:</span>
      {allTypes.map((type) => {
        const config = eventTypeConfig[type]
        const filterColors = getFilterColors(type)
        const isSelected = selectedTypes.includes(type)

        return (
          <Button
            key={type}
            variant="ghost"
            size="sm"
            onClick={() => onTypeToggle(type)}
            className={`cursor-pointer transition-all duration-200 ${
              isSelected 
                ? filterColors.selected.className
                : filterColors.unselected.className
            }`}
            style={isSelected ? filterColors.selected.style : filterColors.unselected.style}
          >
            {config?.label || type}
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
