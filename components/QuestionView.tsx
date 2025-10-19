"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MessageSquare, User, Mail, Calendar, CheckCircle, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { questionsApi, type Question } from "@/lib/questions-api"

interface QuestionViewProps {
  question: Question
  showBackButton?: boolean
  onBackClick?: () => void
  onQuestionUpdate?: (question: Question) => void
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800'
    case 'answered': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />
    case 'answered': return <CheckCircle className="h-4 w-4" />
    default: return <MessageSquare className="h-4 w-4" />
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

export default function QuestionView({ 
  question, 
  showBackButton = true, 
  onBackClick,
  onQuestionUpdate
}: QuestionViewProps) {
  const { toast } = useToast()
  const [isAnswering, setIsAnswering] = useState(false)
  const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false)
  const [answer, setAnswer] = useState(question.answer || '')

  const handleAnswerQuestion = async () => {
    if (!answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Answer is required",
        variant: "destructive"
      })
      return
    }

    try {
      setIsAnswering(true)
      const result = await questionsApi.answerQuestion(question.id, {
        answer: answer.trim()
      })

      if (result.success && result.data) {
        toast({
          title: "Success",
          description: "Question answered successfully"
        })
        
        // Update the question object
        const updatedQuestion = { 
          ...question, 
          status: 'answered' as const,
          answer: answer.trim(),
          answered_at: new Date().toISOString()
        }
        onQuestionUpdate?.(updatedQuestion)
        
        setIsAnswerDialogOpen(false)
        setAnswer('')
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to answer question",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to answer question",
        variant: "destructive"
      })
    } finally {
      setIsAnswering(false)
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
                Question #{question.short_id}
              </h2>
              <p className="text-[#5e6461]/70">
                {question.category_name}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(question.status)}>
            {getStatusIcon(question.status)}
            <span className="ml-1">{formatStatusName(question.status)}</span>
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#5e6461]">Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-gray-600 whitespace-pre-wrap">{question.question}</p>
                </div>
              </CardContent>
            </Card>

            {/* Answer */}
            {question.status === 'answered' && question.answer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#5e6461] flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-800 whitespace-pre-wrap">{question.answer}</p>
                    {question.answered_at && (
                      <p className="text-sm text-gray-500 mt-2">
                        Answered on {formatDate(question.answered_at)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
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
                    <Badge className={`${getStatusColor(question.status)} inline-flex items-center whitespace-nowrap`}>
                      {getStatusIcon(question.status)}
                      <span className="ml-1">{formatStatusName(question.status)}</span>
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Category</span>
                  <p className="text-sm text-gray-900">{question.category_name}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Submitter</span>
                  <div className="text-sm text-gray-900">
                    {question.is_anonymous ? (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        Anonymous
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {question.submitter_name || 'Unknown'}
                        </div>
                        {question.submitter_email && (
                          <div className="flex items-center mt-1">
                            <Mail className="h-4 w-4 mr-1" />
                            {question.submitter_email}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-500">Submitted</span>
                  <div className="text-sm text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(question.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {question.status === 'pending' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#5e6461]">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-[#d36530] hover:bg-[#d36530]/90"
                    onClick={() => setIsAnswerDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Answer Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Answer Dialog */}
      <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Answer Question</DialogTitle>
            <DialogDescription>
              Provide an answer to this question. The question will be marked as answered.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="question-text" className="text-sm font-medium text-gray-500">Question</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{question.question}</p>
              </div>
            </div>
            <div>
              <Label htmlFor="answer-content">Answer</Label>
              <Textarea
                id="answer-content"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                rows={6}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAnswerDialogOpen(false)}
              disabled={isAnswering}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#d36530] hover:bg-[#d36530]/90"
              onClick={handleAnswerQuestion}
              disabled={!answer.trim() || isAnswering}
            >
              {isAnswering ? "Answering..." : "Answer Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
