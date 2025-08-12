"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Send,
  ImageIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Strikethrough,
  Highlighter,
  Upload,
  X,
  LinkIcon,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { issueApi } from "@/lib/newsletter-api"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export interface NewsletterFormData {
  id?: string
  subject: string
  preheader?: string
  markdown: string
  status?: string
  scheduled_at?: string
}

interface NewsletterFormProps {
  mode: 'create' | 'edit'
  initialData?: NewsletterFormData
  onSubmit?: (data: NewsletterFormData) => void
}

export default function NewsletterForm({ mode, initialData, onSubmit }: NewsletterFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  // Form state
  const [subject, setSubject] = useState(initialData?.subject || "")
  const [content, setContent] = useState(initialData?.markdown || "")
  const [preheader, setPreheader] = useState(initialData?.preheader || "")
  const [featuredImage, setFeaturedImage] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  
  // Loading states
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  
  // Confirmation dialog state
  const [showSendConfirmation, setShowSendConfirmation] = useState(false)

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject || "")
      setContent(initialData.markdown || "")
      setPreheader(initialData.preheader || "")
      
      // Parse scheduled_at if it exists
      if (initialData.scheduled_at) {
        const scheduledDate = new Date(initialData.scheduled_at)
        setScheduledDate(scheduledDate.toISOString().split('T')[0])
        setScheduledTime(scheduledDate.toTimeString().slice(0, 5))
        setIsScheduled(true)
      }
    }
  }, [initialData])

  // API functions
  const handleSave = async (status: 'draft' | 'scheduled' = 'draft') => {
    if (!subject.trim()) {
      toast({ title: "Subject required", description: "Please enter a subject for your newsletter.", variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      let scheduledAt: string | undefined
      if (status === 'scheduled' && isScheduled && scheduledDate && scheduledTime) {
        scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      }

      const formData: NewsletterFormData = {
        subject: subject.trim(),
        preheader: preheader.trim() || undefined,
        markdown: content,
        status,
        scheduled_at: scheduledAt,
      }

      let result
      if (mode === 'edit' && initialData?.id) {
        // Update existing issue
        result = await issueApi.update(initialData.id, {
          subject: formData.subject,
          preheader: formData.preheader,
          markdown: formData.markdown,
          status: formData.status,
          scheduled_at: formData.scheduled_at,
        })
      } else {
        // Create new issue
        result = await issueApi.create({
          subject: formData.subject,
          preheader: formData.preheader,
          markdown: formData.markdown,
          status: formData.status,
          scheduled_at: formData.scheduled_at,
        })
      }

      if (result.success) {
        const actionText = mode === 'edit' ? 'updated' : (status === 'scheduled' ? 'scheduled' : 'saved')
        toast({ 
          title: `Newsletter ${actionText}`, 
          description: status === 'scheduled' 
            ? `Newsletter will be sent at ${scheduledDate} ${scheduledTime}` 
            : `Your newsletter has been ${actionText}.`
        })
        
        if (onSubmit) {
          onSubmit({ ...formData, id: result.data?.id })
        } else {
          router.push('/newsletter')
        }
      } else {
        toast({ title: "Save failed", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Save failed", description: "An unexpected error occurred.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleSend = () => {
    if (!subject.trim()) {
      toast({ title: "Subject required", description: "Please enter a subject for your newsletter.", variant: "destructive" })
      return
    }

    setShowSendConfirmation(true)
  }
  
  const confirmSendNow = async () => {

    setSending(true)
    try {
      let issueId = initialData?.id

      if (mode === 'create') {
        // First create the issue
        const createResult = await issueApi.create({
          subject: subject.trim(),
          preheader: preheader.trim() || undefined,
          markdown: content,
          status: 'draft', // We'll update this after sending
        })

        if (!createResult.success || !createResult.data) {
          toast({ title: "Failed to create issue", description: createResult.error, variant: "destructive" })
          return
        }
        issueId = createResult.data.id
      }

      if (!issueId) {
        toast({ title: "No issue ID", description: "Cannot send newsletter without an issue ID.", variant: "destructive" })
        return
      }

      // Then attempt to send it
      const sendResult = await issueApi.bulkSend(issueId)
      
      if (sendResult.success) {
        toast({ title: "Newsletter sent!", description: "Your newsletter has been sent to all subscribers." })
        if (onSubmit) {
          onSubmit({ subject, preheader, markdown: content, id: issueId })
        } else {
          router.push('/newsletter')
        }
      } else {
        toast({ 
          title: "Send failed", 
          description: sendResult.error || "The newsletter was created but failed to send. You can try sending it from the newsletter list.",
          variant: "destructive" 
        })
        router.push('/newsletter')
      }
    } catch (error) {
      toast({ title: "Send failed", description: "An unexpected error occurred.", variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const insertMarkdown = (syntax: string, placeholder = "") => {
    const textarea = document.getElementById("content-editor") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const replacement = selectedText || placeholder

    let newText = ""
    switch (syntax) {
      case "h1":
        newText = `# ${replacement}`
        break
      case "h2":
        newText = `## ${replacement}`
        break
      case "h3":
        newText = `### ${replacement}`
        break
      case "bold":
        newText = `**${replacement}**`
        break
      case "italic":
        newText = `*${replacement}*`
        break
      case "strikethrough":
        newText = `~~${replacement}~~`
        break
      case "highlight":
        newText = `==${replacement}==`
        break
      case "code":
        newText = `\`${replacement}\``
        break
      case "quote":
        newText = `> ${replacement}`
        break
      case "ul":
        newText = `- ${replacement}`
        break
      case "ol":
        newText = `1. ${replacement}`
        break
      case "link":
        newText = `[${replacement || "link text"}](url)`
        break
      case "image":
        newText = `![${replacement || "alt text"}](image-url)`
        break
      default:
        newText = replacement
    }

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const renderMarkdown = (text: string) => {
    return text
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/==(.*?)==/g, '<mark class="bg-yellow-200">$1</mark>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gm, "<li>$1</li>")
      .replace(/^1\. (.*$)/gm, "<li>$1</li>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto my-4" />')
      .replace(/\n/g, "<br>")
  }

  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <>
    <div className="flex-1 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/newsletter" className="text-sm text-[#5e6461]/70 hover:text-[#d36530] inline-flex items-center gap-2 cursor-pointer">
              <span aria-hidden>←</span>
              Newsletter
            </Link>
            <h1 className="text-2xl font-bold text-[#5e6461] mt-1">
              {mode === 'edit' ? 'Edit Newsletter' : 'Create Newsletter'}
            </h1>
            <p className="text-[#5e6461]/70">
              {mode === 'edit' ? 'Make changes to your newsletter content' : 'Create and send newsletters to your subscribers'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleSave(isScheduled ? 'scheduled' : 'draft')}
              disabled={saving || sending}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isScheduled ? "Schedule" : (mode === 'edit' ? "Save Changes" : "Save Draft")}
            </Button>
            <Button 
              className="bg-amber-600 hover:bg-amber-700"
              onClick={handleSend}
              disabled={saving || sending}
            >
              {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {mode === 'edit' ? "Update & Send" : "Send Now"}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-4">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Content</CardTitle>
              <CardDescription>
                {mode === 'edit' ? 'Edit your newsletter content with rich formatting' : 'Create your newsletter content with rich formatting'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preheader">Preheader (Optional)</Label>
                <Input
                  id="preheader"
                  placeholder="Brief preview text that appears after the subject..."
                  value={preheader}
                  onChange={(e) => setPreheader(e.target.value)}
                />
                <p className="text-xs text-slate-600">
                  This text appears in email previews after the subject line
                </p>
              </div>

              {featuredImage && (
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="relative">
                    <img
                      src={featuredImage || "/placeholder.svg"}
                      alt="Featured"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setFeaturedImage("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-4">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-slate-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("h1", "Heading 1")}
                      title="Heading 1"
                    >
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("h2", "Heading 2")}
                      title="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("h3", "Heading 3")}
                      title="Heading 3"
                    >
                      <Heading3 className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("bold", "bold text")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("italic", "italic text")}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("strikethrough", "strikethrough text")}
                      title="Strikethrough"
                    >
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("highlight", "highlighted text")}
                      title="Highlight"
                    >
                      <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("code", "code")} title="Code">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("ul", "List item")}
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("ol", "List item")}
                      title="Numbered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => insertMarkdown("quote", "Quote text")}
                      title="Quote"
                    >
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" title="Insert Link">
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Insert Link</DialogTitle>
                          <DialogDescription>Add a link to your newsletter</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Link Text</Label>
                            <Input placeholder="Enter link text..." />
                          </div>
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input placeholder="https://..." />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => insertMarkdown("link")}>Insert Link</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" title="Insert Image">
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Insert Image</DialogTitle>
                          <DialogDescription>Add an image to your newsletter</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Alt Text</Label>
                            <Input placeholder="Describe the image..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input placeholder="https://..." />
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-slate-600 mb-2">Or upload an image</p>
                            <Button variant="outline">
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Image
                            </Button>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => insertMarkdown("image")}>Insert Image</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-editor">Newsletter Content</Label>
                    <Textarea
                      id="content-editor"
                      placeholder="Write your newsletter content using Markdown formatting..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] font-mono"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="space-y-4">
                  <div className="border rounded-lg p-6 bg-white min-h-[400px]">
                    {content ? (
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                    ) : (
                      <p className="text-slate-500 italic">Start writing to see preview...</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
                  <Label htmlFor="schedule">Schedule for later</Label>
                </div>
              </div>

              {isScheduled && (
                <div className="space-y-2">
                  <Label>Schedule Date & Time</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date" 
                      value={scheduledDate} 
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <Input 
                      type="time" 
                      value={scheduledTime} 
                      onChange={(e) => setScheduledTime(e.target.value)} 
                    />
                  </div>
                  <p className="text-xs text-slate-600">
                    Newsletter will be sent automatically at the scheduled time
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Newsletter Details (categories/tags removed) */}
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!featuredImage && (
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Featured Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Word Count:</span>
                <span className="font-medium">{wordCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Reading Time:</span>
                <span className="font-medium">{readingTime} min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Characters:</span>
                <span className="font-medium">{content.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* End sidebar */}
      </div>
      {/* End grid container */}
      </main>
    </div>
    
    {/* Confirmation Dialog for Send */}
    <ConfirmationDialog
      open={showSendConfirmation}
      onOpenChange={setShowSendConfirmation}
      title="Send Newsletter"
      description="Send this newsletter to all subscribers immediately?"
      confirmText="Send Now"
      onConfirm={confirmSendNow}
    />
    </>
  )
}


