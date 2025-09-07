"use client"

import { useState } from "react"
import type { CalendarEvent } from "@/types/calendar"
import { formatDate, formatTime } from "@/lib/calendar-utils"
import { calendarApi } from "@/lib/calendar-api"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, FileText, Edit3, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface EventDetailsModalProps {
  event: CalendarEvent | null
  eventTypeConfig: Record<string, { label: string; color: string; bgColor: string; colorHex: string }>
  isOpen: boolean
  onClose: () => void
  onEventDelete?: (eventId: string) => void
  onEventEdit?: (event: CalendarEvent) => void
}

export function EventDetailsModal({ event, eventTypeConfig, isOpen, onClose, onEventDelete, onEventEdit }: EventDetailsModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { toast } = useToast()

  if (!event) return null

  const config = eventTypeConfig[event.type] || { 
    label: event.type, 
    color: "text-gray-600", 
    bgColor: "bg-gray-200 hover:bg-gray-300",
    colorHex: "#6b7280"
  }

  const handleEdit = () => {
    onEventEdit?.(event)
    onClose()
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (isDeleting) return // Prevent multiple clicks
    
    setIsDeleting(true)
    try {
      const response = await calendarApi.deleteEvent(event.id)
      if (response.success) {
        onEventDelete?.(event.id)
        toast({
          title: "Success",
          description: "Event deleted successfully!",
        })
        onClose()
        setShowDeleteConfirm(false)
      } else {
        throw new Error(response.error || 'Failed to delete event')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: "Error",
        description: "Failed to delete event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {!event.allDay && (
                <span className="text-sm opacity-75 mr-2">
                  {new Date(event.startDate).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </span>
              )}
              {event.title}
              <Badge 
                className="border-0 text-black" 
                style={{
                  backgroundColor: `${config.colorHex}20`,
                  borderColor: `${config.colorHex}30`
                }}
              >
                {config.label}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(new Date(event.startDate))}</p>
              </div>
            </div>

            {!event.allDay && (
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(new Date(event.startDate))} - {formatTime(new Date(event.endDate))}
                  </p>
                </div>
              </div>
            )}

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{event.location}</p>
                </div>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Description</p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="cursor-pointer"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteClick}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Event"
        description={`Are you sure you want to delete "${event.title}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
