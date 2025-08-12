"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Edit,
  Share2,
  Eye,
  MessageSquare,
  Calendar,
  User,
  Tag,
  Star,
  ExternalLink,
  Copy,
  Trash2,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data - in real app this would come from API
const mockArticle = {
  id: 1,
  title: "New Community Center Opens in South End",
  excerpt:
    "The long-awaited South End Community Center officially opened its doors this week, featuring a gymnasium, meeting rooms, and after-school programs.",
  content: `# New Community Center Opens in South End

The long-awaited South End Community Center officially opened its doors this week, bringing much-needed recreational and educational facilities to the neighborhood.

## Facilities and Features

The new **15,000 square foot facility** includes:

- Full-size gymnasium with basketball and volleyball courts
- Multi-purpose meeting rooms for community events
- Computer lab with 20 workstations
- Children's play area and after-school program space
- Commercial kitchen for community events
- Outdoor playground and walking trail

### Programs and Services

The center will offer a variety of programs for all ages:

1. **Youth Programs**
   - After-school tutoring and homework help
   - Sports leagues and recreational activities
   - Summer camp programs

2. **Adult Programs**
   - Fitness classes and wellness programs
   - Job training and computer literacy courses
   - Senior citizen activities and social events

3. **Community Events**
   - Town halls and public meetings
   - Cultural celebrations and festivals
   - Educational workshops and seminars

> "This community center represents years of planning and collaboration between residents, city officials, and local organizations," said Mayor Sarah Johnson during the ribbon-cutting ceremony.

## Community Impact

The center is expected to serve over **2,000 residents** in the South End neighborhood and surrounding areas. The facility was funded through a combination of federal grants, city funding, and private donations totaling $3.2 million.

### Economic Benefits

The new center has already created:
- 15 full-time jobs
- 25 part-time positions
- Opportunities for local contractors and suppliers

## Grand Opening Events

The community is invited to celebrate with a week-long series of events:

**Monday, March 18**: Open house tours (10 AM - 6 PM)
**Tuesday, March 19**: Youth sports demonstrations
**Wednesday, March 20**: Senior citizen social hour
**Thursday, March 21**: Job fair and career workshops
**Friday, March 22**: Community dinner and entertainment

==Registration is free for all events==, but space is limited. Residents can sign up at the center or online at albanyny.gov/community-center.

For more information about programs and services, contact the South End Community Center at (518) 555-0199 or visit during regular hours: Monday-Friday 6 AM-10 PM, Saturday-Sunday 8 AM-8 PM.`,
  category: "Community",
  status: "Published",
  featured: true,
  author: "Sarah Johnson",
  publishDate: "2024-03-14T10:00:00",
  image: "/placeholder.svg?height=400&width=800",
  tags: ["Community", "Recreation", "South End", "Grand Opening"],
  views: 2341,
  comments: 15,
  lastModified: "2024-03-14T10:00:00",
}

export default function ViewArticle() {
  const params = useParams()
  const [article] = useState(mockArticle) // In real app, fetch by params.id

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderContent = () => {
    // Convert markdown to HTML for display
    let html = article.content
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mb-6 text-[#5e6461] border-b border-gray-200 pb-2">$1</h1>',
      )
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 mt-8 text-[#5e6461]">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 mt-6 text-[#5e6461]">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-[#5e6461]">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/~~(.*?)~~/gim, '<del class="line-through text-gray-500">$1</del>')
      .replace(/==(.*?)==/gim, '<mark class="bg-yellow-200 px-1 py-0.5 rounded">$1</mark>')
      .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-[#d36530]">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-1 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-1 list-decimal">$1</li>')
      .replace(
        /^> (.*$)/gim,
        '<blockquote class="border-l-4 border-[#d36530] pl-4 py-2 my-4 italic text-[#5e6461]/80 bg-gray-50 rounded-r">$1</blockquote>',
      )
      .replace(
        /!\[([^\]]*)\]$$([^)]+)$$/gim,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6 shadow-sm" />',
      )
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-[#d36530] hover:underline font-medium">$1</a>')
      .replace(/\n\n/gim, '</p><p class="mb-4 text-[#5e6461] leading-relaxed">')
      .replace(/\n/gim, "<br />")

    // Wrap in paragraph tags
    html = '<p class="mb-4 text-[#5e6461] leading-relaxed">' + html + "</p>"

    return { __html: html }
  }

  return (
    <div className="min-h-screen bg-[#f2f0e3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/content">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Content
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-[#5e6461]">View Article</h1>
              <p className="text-[#5e6461]/70">Article details and content</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Link href={`/content/articles/${article.id}/edit`}>
              <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Article
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Article
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  {article.featured ? "Remove from Featured" : "Add to Featured"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Article
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <Card className="border-gray-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{article.category}</Badge>
                  <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                  {article.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl font-bold text-[#5e6461] mb-4">{article.title}</h1>

                <div className="text-lg text-[#5e6461]/80 mb-6 italic border-l-4 border-[#d36530] pl-4 py-2 bg-gray-50 rounded-r">
                  {article.excerpt}
                </div>

                <div className="flex items-center gap-6 text-sm text-[#5e6461]/70 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>By {article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published {new Date(article.publishDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{article.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{article.comments} comments</span>
                  </div>
                </div>

                {article.image && (
                  <div className="mb-6">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-64 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-[#5e6461]/60" />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Content */}
            <Card className="border-gray-200">
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={renderContent()} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 p-6 bg-white border-l border-gray-200">
          <div className="space-y-6">
            {/* Article Stats */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-[#5e6461]">Article Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5e6461]/70">Views</span>
                  <span className="font-medium">{article.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5e6461]/70">Comments</span>
                  <span className="font-medium">{article.comments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5e6461]/70">Word Count</span>
                  <span className="font-medium">
                    {article.content.split(/\s+/).filter((word) => word.length > 0).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#5e6461]/70">Reading Time</span>
                  <span className="font-medium">
                    {Math.ceil(article.content.split(/\s+/).filter((word) => word.length > 0).length / 200)} min
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Article Details */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-[#5e6461]">Article Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="text-[#5e6461]/70">Status:</span>
                  <Badge className={`ml-2 ${getStatusColor(article.status)}`}>{article.status}</Badge>
                </div>
                <div className="text-sm">
                  <span className="text-[#5e6461]/70">Category:</span>
                  <Badge variant="secondary" className="ml-2">
                    {article.category}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-[#5e6461]/70">Author:</span>
                  <span className="ml-2 font-medium">{article.author}</span>
                </div>
                <div className="text-sm">
                  <span className="text-[#5e6461]/70">Published:</span>
                  <span className="ml-2">{new Date(article.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <span className="text-[#5e6461]/70">Last Modified:</span>
                  <span className="ml-2">{new Date(article.lastModified).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-sm text-[#5e6461]">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/content/articles/${article.id}/edit`}>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Article
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Article
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Article
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Article
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
