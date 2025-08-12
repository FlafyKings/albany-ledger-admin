"use client"

import { useMemo, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Send, Eye, ImageIcon, Bold, Italic, List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3, Strikethrough, Highlighter, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type EditorInitial = {
  title?: string
  subject?: string
  content?: string
  featuredImage?: string
  category?: string
  tags?: string[]
  scheduledDate?: string
  scheduledTime?: string
  isScheduled?: boolean
}

type EditorProps = {
  backHref: string
  headerTitle?: string
  saveLabel?: string
  submitLabel?: string
  initial?: EditorInitial
}

export default function NewsletterEditor({ backHref, headerTitle = "Create Newsletter", saveLabel = "Save Draft", submitLabel = "Send Newsletter", initial }: EditorProps) {
  const [title, setTitle] = useState(initial?.title ?? "")
  const [subject, setSubject] = useState(initial?.subject ?? "")
  const [content, setContent] = useState(initial?.content ?? "")
  const [previewMode, setPreviewMode] = useState(false)
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage ?? "")
  const [category, setCategory] = useState(initial?.category ?? "")
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [newTag, setNewTag] = useState("")
  const [scheduledDate, setScheduledDate] = useState(initial?.scheduledDate ?? "")
  const [scheduledTime, setScheduledTime] = useState(initial?.scheduledTime ?? "")
  const [isScheduled, setIsScheduled] = useState<boolean>(initial?.isScheduled ?? false)

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

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
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
      .replace(/\n/g, "<br>")
  }

  const wordCount = useMemo(() => content.split(/\s+/).filter((w) => w.length > 0).length, [content])
  const readingTime = useMemo(() => Math.ceil(wordCount / 200), [wordCount])

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={backHref}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{headerTitle}</h1>
            <p className="text-slate-600">Create and send newsletters to your subscribers</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            {saveLabel}
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Send className="mr-2 h-4 w-4" />
            {submitLabel}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Content</CardTitle>
              <CardDescription>Create your newsletter content with rich formatting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Newsletter Title</Label>
                <Input id="title" placeholder="Enter newsletter title..." value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject Line</Label>
                <Input id="subject" placeholder="Enter email subject..." value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>

              {featuredImage && (
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="relative">
                    <img src={featuredImage || "/placeholder.svg"} alt="Featured" className="w-full h-48 object-cover rounded-lg" />
                    <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setFeaturedImage("")}>
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
                  <div className="flex flex-wrap items-center gap-1 p-2 border rounded-lg bg-slate-50">
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h1", "Heading 1")} title="Heading 1">
                      <Heading1 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h2", "Heading 2")} title="Heading 2">
                      <Heading2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("h3", "Heading 3")} title="Heading 3">
                      <Heading3 className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("bold", "bold text")} title="Bold">
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("italic", "italic text")} title="Italic">
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("strikethrough", "strikethrough text")} title="Strikethrough">
                      <Strikethrough className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("highlight", "highlighted text")} title="Highlight">
                      <Highlighter className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("code", "code")} title="Code">
                      <Code className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("ul", "List item")} title="Bullet List">
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("ol", "List item")} title="Numbered List">
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => insertMarkdown("quote", "Quote text")} title="Quote">
                      <Quote className="h-4 w-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" title="Insert Link">
                          <ImageIcon className="h-4 w-4" />
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
                    <Textarea id="content-editor" placeholder="Write your newsletter content using Markdown formatting..." value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[400px] font-mono" />
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

        <div className="space-y-6">
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
                    <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                    <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers (1,250)</SelectItem>
                    <SelectItem value="weekly">Weekly Digest (890)</SelectItem>
                    <SelectItem value="alerts">Alert Subscribers (1,180)</SelectItem>
                    <SelectItem value="meetings">Meeting Updates (650)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Newsletter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Update</SelectItem>
                    <SelectItem value="meetings">Meeting Announcements</SelectItem>
                    <SelectItem value="emergency">Emergency Alerts</SelectItem>
                    <SelectItem value="events">Community Events</SelectItem>
                    <SelectItem value="budget">Budget & Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600 cursor-pointer">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input placeholder="Add tag..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addTag()} />
                  <Button onClick={addTag} size="sm">Add</Button>
                </div>
              </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Content Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm"><span>Word Count:</span><span className="font-medium">{wordCount}</span></div>
              <div className="flex justify-between text-sm"><span>Reading Time:</span><span className="font-medium">{readingTime} min</span></div>
              <div className="flex justify-between text-sm"><span>Characters:</span><span className="font-medium">{content.length}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


