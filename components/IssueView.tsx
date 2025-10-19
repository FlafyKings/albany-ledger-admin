"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Calendar, Eye, MessageSquare, Camera, User, Mail, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { issuesApi, type Issue, type IssueUpdate, type IssuePhoto } from "@/lib/issues-api"

interface IssueViewProps {
  issue: Issue
  showBackButton?: boolean
  onBackClick?: () => void
  onIssueUpdate?: (issue: Issue) => void
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'submitted': return 'bg-blue-100 text-blue-800'
    case 'under_review': return 'bg-yellow-100 text-yellow-800'
    case 'in_progress': return 'bg-purple-100 text-purple-800'
    case 'resolved': return 'bg-green-100 text-green-800'
    case 'closed': return 'bg-gray-100 text-gray-800'
    case 'on_hold': return 'bg-orange-100 text-orange-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'submitted': return <AlertCircle className="h-4 w-4" />
    case 'under_review': return <Eye className="h-4 w-4" />
    case 'in_progress': return <Clock className="h-4 w-4" />
    case 'resolved': return <CheckCircle className="h-4 w-4" />
    case 'closed': return <XCircle className="h-4 w-4" />
    case 'on_hold': return <Clock className="h-4 w-4" />
    default: return <AlertCircle className="h-4 w-4" />
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatStatusName(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

export default function IssueView({ 
  issue, 
  showBackButton = true, 
  onBackClick,
  onIssueUpdate
}: IssueViewProps) {
  const { toast } = useToast()
  const [updates, setUpdates] = useState<IssueUpdate[]>([])
  const [photos, setPhotos] = useState<IssuePhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isAddingMessage, setIsAddingMessage] = useState(false)
  
  // Dialog states
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  
  // Form states
  const [newStatus, setNewStatus] = useState(issue.status)
  const [statusDescription, setStatusDescription] = useState('')
  const [messageTitle, setMessageTitle] = useState('')
  const [messageDescription, setMessageDescription] = useState('')

  useEffect(() => {
    loadIssueDetails()
  }, [issue.short_id])

  const loadIssueDetails = async () => {
    setLoading(true)
    try {
      const [updatesResult, photosResult] = await Promise.all([
        issuesApi.shortId.getIssueUpdates(issue.short_id),
        issuesApi.shortId.getIssuePhotos(issue.short_id)
      ])

      if (updatesResult.success && updatesResult.data) {
        setUpdates(updatesResult.data.updates)
      }

      if (photosResult.success && photosResult.data) {
        setPhotos(photosResult.data.photos)
      }
    } catch (error) {
      console.error('Failed to load issue details:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (newStatus === issue.status) {
      setIsStatusDialogOpen(false)
      return
    }

    try {
      setIsUpdatingStatus(true)
      const result = await issuesApi.shortId.updateIssueStatus(issue.short_id, {
        status: newStatus,
        description: statusDescription
      })

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Issue status updated successfully"
        })
        
        // Update the issue object
        const updatedIssue = { ...issue, status: newStatus }
        onIssueUpdate?.(updatedIssue)
        
        // Reload updates
        loadIssueDetails()
        
        setIsStatusDialogOpen(false)
        setStatusDescription('')
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleAddMessage = async () => {
    if (!messageDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Message is required",
        variant: "destructive"
      })
      return
    }

    try {
      setIsAddingMessage(true)
      const result = await issuesApi.shortId.createIssueUpdate(issue.short_id, {
        update_type: 'message',
        title: messageTitle.trim() || undefined,
        description: messageDescription,
        is_public: true
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Message added successfully"
        })
        
        // Reload updates
        loadIssueDetails()
        
        setIsMessageDialogOpen(false)
        setMessageTitle('')
        setMessageDescription('')
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add message",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add message",
        variant: "destructive"
      })
    } finally {
      setIsAddingMessage(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" onClick={onBackClick}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-[#5e6461]">
                {issue.title}
              </h2>
              <p className="text-[#5e6461]/70">
                Issue #{issue.short_id}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(issue.status)}>
            {getStatusIcon(issue.status)}
            <span className="ml-1">{formatStatusName(issue.status)}</span>
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{issue.description}</p>
                </div>
                
                {issue.location_address && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </h3>
                    <p className="text-gray-600">{issue.location_address}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            {photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#5e6461] flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Photos ({photos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative">
                        <img
                          src={photo.file_url}
                          alt={photo.file_name}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#5e6461] flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Updates & Messages ({updates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                ) : updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => (
                      <div key={update.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {update.title && (
                              <h4 className="font-medium text-gray-900">{update.title}</h4>
                            )}
                            <p className="text-sm text-gray-500">
                              {formatStatusName(update.update_type)} by {update.created_by}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {formatDate(update.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-600 whitespace-pre-wrap">{update.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No updates yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <div className="mt-1">
                    <Badge className={`${getStatusColor(issue.status)} inline-flex items-center whitespace-nowrap`}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-1">{formatStatusName(issue.status)}</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <p className="text-sm text-gray-900">{issue.category_name}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Reporter</span>
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {issue.reporter_name}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {issue.reporter_email}
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Created</span>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(issue.created_at)}
                  </div>
                </div>
                
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full bg-[#d36530] hover:bg-[#d36530]/90"
                  onClick={() => setIsStatusDialogOpen(true)}
                >
                  Change Status
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsMessageDialogOpen(true)}
                >
                  Add Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Issue Status</DialogTitle>
            <DialogDescription>
              Update the status of this issue and provide an optional description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-description">Description (Optional)</Label>
              <Textarea
                id="status-description"
                value={statusDescription}
                onChange={(e) => setStatusDescription(e.target.value)}
                placeholder="Explain the reason for this status change..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={isUpdatingStatus}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleStatusChange}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Message</DialogTitle>
            <DialogDescription>
              Add a message or update to this issue.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-title">Title (Optional)</Label>
              <Input
                id="message-title"
                value={messageTitle}
                onChange={(e) => setMessageTitle(e.target.value)}
                placeholder="Brief title for this message..."
              />
            </div>
            <div>
              <Label htmlFor="message-description">Message</Label>
              <Textarea
                id="message-description"
                value={messageDescription}
                onChange={(e) => setMessageDescription(e.target.value)}
                placeholder="Write your message..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsMessageDialogOpen(false)}
              disabled={isAddingMessage}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleAddMessage}
              disabled={!messageDescription.trim() || isAddingMessage}
            >
              {isAddingMessage ? "Adding..." : "Add Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
