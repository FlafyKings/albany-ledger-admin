"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, MoreHorizontal, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { calendarApi, type EventTypeAPI } from "@/lib/calendar-api"
import { useToast } from "@/hooks/use-toast"

interface EventTypesManagerProps {
  eventTypes: EventTypeAPI[]
  isLoading: boolean
  onEventTypesChange: (eventTypes: EventTypeAPI[]) => void
  onReload: () => void
}

export function EventTypesManager({ 
  eventTypes, 
  isLoading, 
  onEventTypesChange, 
  onReload 
}: EventTypesManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedEventType, setSelectedEventType] = useState<EventTypeAPI | null>(null)
  const [editingEventType, setEditingEventType] = useState<EventTypeAPI | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
    variant?: "default" | "destructive"
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  })

  const [newEventTypeData, setNewEventTypeData] = useState({
    name: '',
    display_name: '',
    color_hex: '#d36530'
  })

  const { toast } = useToast()

  const handleCreateEventType = async () => {
    if (!newEventTypeData.name || !newEventTypeData.display_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await calendarApi.createEventType(newEventTypeData)
      if (response.success && response.data) {
        onEventTypesChange([...eventTypes, response.data])
        setShowCreateDialog(false)
        setNewEventTypeData({
          name: '',
          display_name: '',
          color_hex: '#d36530'
        })
        toast({
          title: "Success",
          description: "Event type created successfully!",
        })
      } else {
        throw new Error(response.error || 'Failed to create event type')
      }
    } catch (error) {
      console.error('Error creating event type:', error)
      toast({
        title: "Error",
        description: "Failed to create event type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleUpdateEventType = async () => {
    if (!editingEventType || !newEventTypeData.name || !newEventTypeData.display_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)
    try {
      const response = await calendarApi.updateEventType(editingEventType.id, newEventTypeData)
      if (response.success && response.data) {
        onEventTypesChange(eventTypes.map(et => 
          et.id === editingEventType.id ? response.data! : et
        ))
        setShowEditDialog(false)
        setEditingEventType(null)
        setNewEventTypeData({
          name: '',
          display_name: '',
          color_hex: '#d36530'
        })
        toast({
          title: "Success",
          description: "Event type updated successfully!",
        })
      } else {
        throw new Error(response.error || 'Failed to update event type')
      }
    } catch (error) {
      console.error('Error updating event type:', error)
      toast({
        title: "Error",
        description: "Failed to update event type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteEventType = (eventType: EventTypeAPI) => {
    setConfirmDialog({
      open: true,
      title: "Delete Event Type",
      description: `Are you sure you want to delete "${eventType.display_name}"? This action cannot be undone.`,
      variant: "destructive",
      onConfirm: async () => {
        try {
          const response = await calendarApi.deleteEventType(eventType.id)
          if (response.success) {
            onEventTypesChange(eventTypes.filter(et => et.id !== eventType.id))
            toast({
              title: "Success",
              description: "Event type deleted successfully!",
            })
          } else {
            throw new Error(response.error || 'Failed to delete event type')
          }
        } catch (error) {
          console.error('Error deleting event type:', error)
          toast({
            title: "Error",
            description: "Failed to delete event type. Please try again.",
            variant: "destructive",
          })
        }
      }
    })
  }

  const handleEditEventType = (eventType: EventTypeAPI) => {
    setEditingEventType(eventType)
    setNewEventTypeData({
      name: eventType.name,
      display_name: eventType.display_name,
      color_hex: eventType.color_hex
    })
    setShowEditDialog(true)
  }

  const handleViewEventType = (eventType: EventTypeAPI) => {
    setSelectedEventType(eventType)
    setShowDetailsDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false)
    setNewEventTypeData({
      name: '',
      display_name: '',
      color_hex: '#d36530'
    })
  }

  const handleCloseEditDialog = () => {
    setShowEditDialog(false)
    setEditingEventType(null)
    setNewEventTypeData({
      name: '',
      display_name: '',
      color_hex: '#d36530'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-[#5e6461]">Event Types</CardTitle>
            <CardDescription>Manage event type categories and their display settings</CardDescription>
          </div>
          <Button 
            className="bg-[#d36530] hover:bg-[#d36530]/90"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event Type
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d36530]"></div>
              <span className="ml-2 text-[#5e6461]">Loading event types...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!eventTypes || eventTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-[#5e6461]/60">
                      No event types found. Click "Add Event Type" to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  eventTypes.map((eventType) => (
                    <TableRow key={eventType.id}>
                      <TableCell className="font-medium">{eventType.name}</TableCell>
                      <TableCell>{eventType.display_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: eventType.color_hex }}
                          />
                          <span className="text-sm font-mono">{eventType.color_hex}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(eventType.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewEventType(eventType)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEventType(eventType)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteEventType(eventType)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Event Type Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Event Type</DialogTitle>
            <DialogDescription>
              Create a new event type for categorizing calendar events.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                placeholder="e.g., commission"
                value={newEventTypeData.name}
                onChange={(e) => setNewEventTypeData({...newEventTypeData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input 
                id="display_name" 
                placeholder="e.g., Commission Meeting"
                value={newEventTypeData.display_name}
                onChange={(e) => setNewEventTypeData({...newEventTypeData, display_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color_hex">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="color_hex" 
                  type="color"
                  className="w-16 h-10 p-1"
                  value={newEventTypeData.color_hex}
                  onChange={(e) => setNewEventTypeData({...newEventTypeData, color_hex: e.target.value})}
                />
                <Input 
                  placeholder="#d36530"
                  value={newEventTypeData.color_hex}
                  onChange={(e) => setNewEventTypeData({...newEventTypeData, color_hex: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreateDialog}>
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleCreateEventType}
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create Event Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Event Type Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Event Type</DialogTitle>
            <DialogDescription>
              Update the event type information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input 
                id="edit-name" 
                placeholder="e.g., commission"
                value={newEventTypeData.name}
                onChange={(e) => setNewEventTypeData({...newEventTypeData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-display_name">Display Name</Label>
              <Input 
                id="edit-display_name" 
                placeholder="e.g., Commission Meeting"
                value={newEventTypeData.display_name}
                onChange={(e) => setNewEventTypeData({...newEventTypeData, display_name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-color_hex">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="edit-color_hex" 
                  type="color"
                  className="w-16 h-10 p-1"
                  value={newEventTypeData.color_hex}
                  onChange={(e) => setNewEventTypeData({...newEventTypeData, color_hex: e.target.value})}
                />
                <Input 
                  placeholder="#d36530"
                  value={newEventTypeData.color_hex}
                  onChange={(e) => setNewEventTypeData({...newEventTypeData, color_hex: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleUpdateEventType}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Event Type"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Type Details Dialog */}
      {selectedEventType && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedEventType.color_hex }}
                />
                {selectedEventType.display_name}
              </DialogTitle>
              <DialogDescription>Event type details and information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-[#5e6461]">Name</Label>
                <p className="mt-1 font-mono text-sm">{selectedEventType.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-[#5e6461]">Display Name</Label>
                <p className="mt-1 text-sm">{selectedEventType.display_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-[#5e6461]">Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: selectedEventType.color_hex }}
                  />
                  <span className="font-mono text-sm">{selectedEventType.color_hex}</span>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-[#5e6461]">Created</Label>
                <p className="mt-1 text-sm">{formatDate(selectedEventType.created_at)}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
              <Button 
                className="bg-[#d36530] hover:bg-[#d36530]/90"
                onClick={() => {
                  setShowDetailsDialog(false)
                  handleEditEventType(selectedEventType)
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Event Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === "destructive" ? "Delete" : "Confirm"}
        onConfirm={confirmDialog.onConfirm}
      />
    </>
  )
}
