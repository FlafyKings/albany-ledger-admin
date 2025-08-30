"use client"

import { useState, useRef } from "react"
import { Upload, X, Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { officialsApi } from "@/lib/officials-api"

interface ProfilePictureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  officialId: number
  currentImageUrl?: string
  officialName: string
  onImageUpdated: (newImageUrl: string | null, file?: File) => void
}

export default function ProfilePictureDialog({
  open,
  onOpenChange,
  officialId,
  currentImageUrl,
  officialName,
  onImageUpdated
}: ProfilePictureDialogProps) {
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        })
        return
      }

      // Store the selected file
      setSelectedFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    const file = selectedFile || fileInputRef.current?.files?.[0]
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select an image to upload",
        variant: "destructive"
      })
      return
    }

    // If officialId is 0, this is a new official being created
    if (officialId === 0) {
      // For new officials, we'll just store the file for later upload
      // when the official is actually created
      toast({
        title: "Info",
        description: "Profile picture will be uploaded after the official is created.",
      })
      onImageUpdated(URL.createObjectURL(file), file)
      onOpenChange(false)
      setPreviewUrl(null)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setUploading(true)
    try {
      const result = await officialsApi.uploadProfilePicture(officialId, file)
      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
        })
        onImageUpdated(result.data.image_url)
        onOpenChange(false)
        setPreviewUrl(null)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        throw new Error(result.error || 'Failed to upload profile picture')
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
      toast({
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentImageUrl) return

    setDeleting(true)
    try {
      const result = await officialsApi.deleteProfilePicture(officialId)
      if (result.success) {
        toast({
          title: "Success",
          description: "Profile picture deleted successfully",
        })
        onImageUpdated(null)
        onOpenChange(false)
      } else {
        throw new Error(result.error || 'Failed to delete profile picture')
      }
    } catch (error) {
      console.error('Failed to delete profile picture:', error)
      toast({
        title: "Error",
        description: "Failed to delete profile picture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleClose = () => {
    setPreviewUrl(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Picture</DialogTitle>
          <DialogDescription>
            Upload or manage profile picture for {officialName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Image Display */}
          {(currentImageUrl || previewUrl) && (
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={previewUrl || currentImageUrl}
                  alt={`${officialName}'s profile picture`}
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
                />
                {currentImageUrl && !previewUrl && !currentImageUrl.includes('/placeholder') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Upload Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload new image</label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Supported formats: JPEG, PNG. Max size: 5MB
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {previewUrl && selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="bg-[#d36530] hover:bg-[#d36530]/90"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
