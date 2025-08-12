"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, FileText, Home, MessageSquare, Users, AlertTriangle, Mail, BarChart3, MapPin, VoteIcon, Search, Send, TestTube2, Plus, MoreHorizontal, Edit, Loader2, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Header } from "@/components/Header"
import { issueApi, subscriberApi, statsApi, settingsApi, automationApi, type Issue, type Subscriber, type SubscriberSummary, type NewsletterStats } from "@/lib/newsletter-api"
// Sidebar is provided globally by the layout

// Use types from API client

export default function NewsletterAdminPage() {
  const { toast } = useToast()

  // Loading states
  const [loading, setLoading] = useState({
    issues: true,
    subscribers: true,
    subscribersList: false,
    stats: true,
    settings: true,
  })

  // Data state
  const [issues, setIssues] = useState<Issue[]>([])
  const [scheduledIssues, setScheduledIssues] = useState<Issue[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subscriberSummary, setSubscriberSummary] = useState<SubscriberSummary>({ pending: 0, active: 0, unsubscribed: 0 })
  const [stats, setStats] = useState<NewsletterStats>({ total_subscribers: 0, issues_created: 0, newsletters_sent: 0 })
  const [footerAddress, setFooterAddress] = useState<string>("")
  
  // Confirmation dialog state
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
  
  // Input dialog state for test emails
  const [testEmailDialog, setTestEmailDialog] = useState<{
    open: boolean
    issue: Issue | null
    email: string
  }>({
    open: false,
    issue: null,
    email: "",
  })

  // Load data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    await Promise.all([
      loadIssues(),
      loadScheduledIssues(),
      loadSubscriberSummary(),
      loadStats(),
      loadSettings(),
    ])
  }

  const loadIssues = async () => {
    setLoading(prev => ({ ...prev, issues: true }))
    const result = await issueApi.list()
    if (result.success && result.data) {
      setIssues(result.data)
    } else {
      toast({ title: "Error loading issues", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, issues: false }))
  }

  const loadScheduledIssues = async () => {
    const result = await issueApi.list("scheduled")
    if (result.success && result.data) {
      setScheduledIssues(result.data)
    } else {
      toast({ title: "Error loading scheduled issues", description: result.error, variant: "destructive" })
    }
  }

  const loadSubscriberSummary = async () => {
    setLoading(prev => ({ ...prev, subscribers: true }))
    const result = await subscriberApi.getSummary()
    if (result.success && result.data) {
      setSubscriberSummary(result.data)
    } else {
      toast({ title: "Error loading subscribers", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, subscribers: false }))
  }

  const loadSubscribersList = async (status?: string) => {
    setLoading(prev => ({ ...prev, subscribersList: true }))
    const result = await subscriberApi.list({ limit: 100, status })
    if (result.success && result.data) {
      setSubscribers(result.data)
    } else {
      toast({ title: "Error loading subscriber list", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, subscribersList: false }))
  }

  const loadStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }))
    const result = await statsApi.get()
    if (result.success && result.data) {
      setStats(result.data)
    } else {
      toast({ title: "Error loading stats", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, stats: false }))
  }

  const loadSettings = async () => {
    setLoading(prev => ({ ...prev, settings: true }))
    const result = await settingsApi.getFooterAddress()
    if (result.success && result.data) {
      setFooterAddress(result.data.footer_address || "")
    } else {
      toast({ title: "Error loading settings", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, settings: false }))
  }

  const saveFooterAddress = async () => {
    setLoading(prev => ({ ...prev, settings: true }))
    const result = await settingsApi.setFooterAddress(footerAddress)
    if (result.success) {
      toast({ title: "Settings saved", description: "Footer address has been updated." })
    } else {
      toast({ title: "Error saving settings", description: result.error, variant: "destructive" })
    }
    setLoading(prev => ({ ...prev, settings: false }))
  }

  // UI state
  const [issueSearch, setIssueSearch] = useState("")
  const [selectedIssueId, setSelectedIssueId] = useState<string>("")
  const [subscriberFilter, setSubscriberFilter] = useState<string>("all")

  // Update selected issue when issues load
  useEffect(() => {
    if (issues.length > 0 && !selectedIssueId) {
      setSelectedIssueId(issues[0].id)
    }
  }, [issues, selectedIssueId])

  // Load subscriber list when filter changes
  useEffect(() => {
    const status = subscriberFilter === "all" ? undefined : subscriberFilter
    loadSubscribersList(status)
  }, [subscriberFilter])

  const selectedIssue = useMemo(() => issues.find(i => i.id === selectedIssueId), [issues, selectedIssueId])

  // Frontend-only search filtering
  const filteredIssues = useMemo(() => {
    const term = issueSearch.trim().toLowerCase()
    return issues
      .filter(i => (!term ? true : i.subject.toLowerCase().includes(term) || i.markdown.toLowerCase().includes(term)))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Newest first
  }, [issues, issueSearch])

  // Action handlers
  const handleTestSend = (issue: Issue) => {
    setTestEmailDialog({
      open: true,
      issue,
      email: "",
    })
  }
  
  const sendTestEmail = async () => {
    if (!testEmailDialog.issue || !testEmailDialog.email.trim()) return
    
    const result = await issueApi.testSend(testEmailDialog.issue.id, testEmailDialog.email.trim())
    if (result.success) {
      toast({
        title: "Test email sent",
        description: `Test email sent to ${testEmailDialog.email.trim()}`,
      })
      setTestEmailDialog({ open: false, issue: null, email: "" })
    } else {
      toast({
        title: "Test send failed",
        description: result.error,
        variant: "destructive"
      })
    }
  }

  const handleSendAll = (issue: Issue) => {
    setConfirmDialog({
      open: true,
      title: "Send Newsletter",
      description: `Send newsletter "${issue.subject}" to all subscribers?`,
      onConfirm: async () => {
        const result = await issueApi.bulkSend(issue.id)
        if (result.success) {
          toast({
            title: "Newsletter sent",
            description: `Newsletter sent to all subscribers`,
          })
          // Reload issues to get updated sent status
          loadIssues()
          loadStats()
        } else {
          toast({
            title: "Send failed",
            description: result.error,
            variant: "destructive"
          })
        }
      }
    })
  }

  const handleCancelSchedule = (issue: Issue) => {
    setConfirmDialog({
      open: true,
      title: "Cancel Scheduled Sending",
      description: `Cancel scheduled sending for "${issue.subject}"?`,
      variant: "destructive",
      onConfirm: async () => {
        const result = await issueApi.cancelSchedule(issue.id)
        if (result.success) {
          toast({
            title: "Schedule canceled",
            description: `"${issue.subject}" has been moved back to draft status`,
          })
          // Reload data after canceling
          loadAllData()
        } else {
          toast({
            title: "Cancel failed",
            description: result.error,
            variant: "destructive"
          })
        }
      }
    })
  }

  const handleSendScheduledNow = (issue: Issue) => {
    setConfirmDialog({
      open: true,
      title: "Send Newsletter Now",
      description: `Send "${issue.subject}" to all subscribers immediately?`,
      onConfirm: async () => {
        const result = await issueApi.bulkSend(issue.id)
        if (result.success) {
          toast({
            title: "Newsletter sent",
            description: `"${issue.subject}" has been sent to all subscribers`,
          })
          // Reload data after sending
          loadAllData()
        } else {
          toast({
            title: "Send failed",
            description: result.error,
            variant: "destructive"
          })
        }
      }
    })
  }

  // no preview width control on this page

  return (
    <>
      <div className="flex-1 flex flex-col">
        <Header 
          title="Newsletter" 
          subtitle="Manage issues, subscribers, and settings"
        />
        
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            <Link href={`/newsletter/create`}>
              <Button className="bg-[#d36530] hover:bg-[#d36530]/90">
                <Plus className="mr-2 h-4 w-4" />
                Create New Issue
              </Button>
            </Link>
          </div>
        </div>

        <main className="flex-1 p-6">
          {/* Analytics */}
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Total Subscribers</CardTitle>
                {loading.stats ? <Loader2 className="h-4 w-4 animate-spin text-[#5e6461]" /> : <Users className="h-4 w-4 text-[#5e6461]" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">{stats.total_subscribers.toLocaleString()}</div>
                <CardDescription>All subscribers</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Issues Created</CardTitle>
                {loading.stats ? <Loader2 className="h-4 w-4 animate-spin text-[#5e6461]" /> : <FileText className="h-4 w-4 text-[#5e6461]" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">{stats.issues_created}</div>
                <CardDescription>Total issues</CardDescription>
              </CardContent>
            </Card>
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#5e6461]">Newsletters Sent</CardTitle>
                {loading.stats ? <Loader2 className="h-4 w-4 animate-spin text-[#5e6461]" /> : <Mail className="h-4 w-4 text-[#5e6461]" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#5e6461]">{stats.newsletters_sent}</div>
                <CardDescription>Total emails sent</CardDescription>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="newsletter" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            </TabsList>

            {/* Newsletter tab: Issues table */}
            <TabsContent value="newsletter" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#5e6461]">Issues</CardTitle>
                  <CardDescription>Drafts, scheduled and sent issues</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input value={issueSearch} onChange={e => setIssueSearch(e.target.value)} placeholder="Search issues..." className="pl-9" />
                  </div>
                  {loading.issues ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5e6461]" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Sent At</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredIssues.map(issue => (
                          <TableRow key={issue.id}>
                            <TableCell className="font-medium max-w-xs truncate">{issue.subject}</TableCell>
                            <TableCell>
                              <Badge variant={issue.status === "sent" ? "default" : issue.status === "scheduled" ? "secondary" : "outline"}>
                                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(issue.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{issue.sent_at ? new Date(issue.sent_at).toLocaleString() : "—"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" aria-label="More actions">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/newsletter/${issue.id}/edit`}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleTestSend(issue)}>
                                    <TestTube2 className="h-4 w-4 mr-2" />
                                    Test Send
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleSendAll(issue)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Send to All
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredIssues.length === 0 && !loading.issues && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-sm text-slate-600">
                              {issueSearch ? `No issues match "${issueSearch}".` : "No issues found."}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subscribers */}
            <TabsContent value="subscribers" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    {loading.subscribers ? (
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-green-600" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-green-600">{subscriberSummary.active}</div>
                        <div className="text-sm text-slate-600">Active</div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    {loading.subscribers ? (
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-orange-600" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-orange-600">{subscriberSummary.pending}</div>
                        <div className="text-sm text-slate-600">Pending</div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="border-gray-200">
                  <CardContent className="p-4 text-center">
                    {loading.subscribers ? (
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-600" />
                    ) : (
                      <>
                        <div className="text-2xl font-bold text-gray-600">{subscriberSummary.unsubscribed}</div>
                        <div className="text-sm text-slate-600">Unsubscribed</div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Subscribers Table */}
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#5e6461]">All Subscribers</CardTitle>
                  <CardDescription>List of all subscribers with their details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="status-filter">Filter by status:</Label>
                    <select
                      id="status-filter"
                      value={subscriberFilter}
                      onChange={(e) => setSubscriberFilter(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </div>
                  
                  {loading.subscribersList ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-[#5e6461]" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Subscribed</TableHead>
                          <TableHead>Confirmed At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map(subscriber => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{subscriber.name || "—"}</TableCell>
                            <TableCell>
                              <Badge variant={
                                subscriber.status === "active" ? "default" : 
                                subscriber.status === "pending" ? "secondary" : 
                                "outline"
                              }>
                                {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              {subscriber.confirmed_at ? new Date(subscriber.confirmed_at).toLocaleDateString() : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        {subscribers.length === 0 && !loading.subscribersList && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-sm text-slate-600">
                              {subscriberFilter === "all" ? "No subscribers found." : `No ${subscriberFilter} subscribers found.`}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#5e6461]">Newsletter Settings</CardTitle>
                  <CardDescription>Configure footer address for newsletters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="physicalAddress">Physical Address (Footer)</Label>
                    <Textarea
                      id="physicalAddress"
                      value={footerAddress}
                      onChange={e => setFooterAddress(e.target.value)}
                      placeholder="Street, City, State, ZIP"
                      disabled={loading.settings}
                    />
                    <div className="text-sm text-slate-600">
                      This address will appear in the footer of all newsletters.
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={saveFooterAddress} 
                      className="bg-amber-600 hover:bg-amber-700"
                      disabled={loading.settings}
                    >
                      {loading.settings ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Settings
                    </Button>
                    <Button variant="outline" onClick={loadSettings} disabled={loading.settings}>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scheduled */}
            <TabsContent value="scheduled" className="space-y-6">
              <Card className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[#5e6461]">Scheduled Newsletters</CardTitle>
                  <CardDescription>Manage newsletters scheduled for future sending</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scheduledIssues.length === 0 ? (
                    <div className="text-center py-8 text-slate-600">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                      <p>No newsletters are currently scheduled.</p>
                      <p className="text-sm mt-2">Create a newsletter and set a schedule date to see it here.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Scheduled For</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledIssues.map(issue => (
                          <TableRow key={issue.id}>
                            <TableCell className="font-medium max-w-xs truncate">{issue.subject}</TableCell>
                            <TableCell>
                              {issue.scheduled_at ? (
                                <div>
                                  <div>{new Date(issue.scheduled_at).toLocaleDateString()}</div>
                                  <div className="text-sm text-slate-600">{new Date(issue.scheduled_at).toLocaleTimeString()}</div>
                                </div>
                              ) : "—"}
                            </TableCell>
                            <TableCell>{new Date(issue.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSendScheduledNow(issue)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Send Now
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelSchedule(issue)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === "destructive" ? "Cancel" : "Send"}
        onConfirm={confirmDialog.onConfirm}
      />
      
      {/* Test Email Dialog */}
      <Dialog 
        open={testEmailDialog.open} 
        onOpenChange={(open) => {
          if (!open) {
            setTestEmailDialog({ open: false, issue: null, email: "" })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
            <DialogDescription>
              Send a test email for "{testEmailDialog.issue?.subject}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="email"
              placeholder="Enter test email address"
              value={testEmailDialog.email}
              onChange={(e) => setTestEmailDialog(prev => ({ ...prev, email: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  sendTestEmail()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestEmailDialog({ open: false, issue: null, email: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={sendTestEmail}
              disabled={!testEmailDialog.email.trim()}
              className="bg-[#d36530] hover:bg-[#d36530]/90"
            >
              Send Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
