import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Brain, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { isUnauthorizedError } from '@/lib/authUtils';
import { SolutionCard } from '@/components/solution-card';
import type { Doubt } from '@shared/schema';

const subjects = ['Physics', 'Chemistry', 'Maths', 'Biology'];

interface ParsedSolution {
  subject: string;
  steps: Array<{
    step: number;
    title: string;
    content: string;
    formula?: string;
  }>;
  finalAnswer: string;
  alternativeMethods?: string[];
  relatedConcepts?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export default function Dashboard() {
  const [selectedSubject, setSelectedSubject] = useState('Physics');
  const [question, setQuestion] = useState('');
  const [currentSolution, setCurrentSolution] = useState<(Doubt & { solution: ParsedSolution | null }) | null>(null);
  
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user stats
  const { data: stats } = useQuery<{
    totalDoubts: number;
    bookmarkedDoubts: number;
    doubtsUsedToday: number;
    subscription: string;
    doubtsRemaining: number | null;
  }>({
    queryKey: ['/api/user/stats'],
    enabled: isAuthenticated,
  });

  const solveMutation = useMutation({
    mutationFn: async (data: { question: string; subject: string }) => {
      const response = await apiRequest('POST', '/api/doubts', data);
      return await response.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: "AI Error",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Doubt Solved!",
          description: "Your step-by-step solution is ready.",
        });
      }
      
      setCurrentSolution({
        ...data.doubt,
        solution: data.solution || null
      });
      
      // Clear the form
      setQuestion('');
      
      // Refresh stats
      queryClient.invalidateQueries({ queryKey: ['/api/user/stats'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter your question",
        variant: "destructive",
      });
      return;
    }

    solveMutation.mutate({
      question: question.trim(),
      subject: selectedSubject
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Doubt Solver Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Submit your questions and get instant AI-powered solutions
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Doubts</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-total-doubts">
                      {stats.totalDoubts}
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Bookmarked</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-bookmarked-doubts">
                      {stats.bookmarkedDoubts}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">★</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Usage</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-todays-usage">
                      {stats.doubtsUsedToday}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">📝</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Plan</p>
                    <Badge 
                      variant={stats.subscription === 'free' ? 'outline' : 'default'}
                      className="mt-1 capitalize"
                      data-testid={`badge-subscription-${stats.subscription}`}
                    >
                      {stats.subscription}
                    </Badge>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Limit Warning */}
        {stats && stats.subscription === 'free' && stats.doubtsRemaining !== null && stats.doubtsRemaining <= 2 && (
          <Alert className="mb-6 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              You have {stats.doubtsRemaining} doubts remaining today. 
              <a href="/pricing" className="ml-1 underline font-medium">Upgrade to Pro</a> for unlimited access.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Submit Your Doubt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Subject
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={selectedSubject === subject ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedSubject(subject)}
                        className={selectedSubject === subject 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                        }
                        data-testid={`button-subject-${subject.toLowerCase()}`}
                      >
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">Drop your question image here or</p>
                  <Button variant="outline" size="sm" data-testid="button-browse-files">
                    browse files
                  </Button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Supports PNG, JPG, PDF files
                  </p>
                </div>

                {/* Text Input */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Or type your question here
                    </label>
                    <Textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g., A ball is thrown vertically upward with initial velocity 20 m/s. Find the maximum height reached."
                      rows={6}
                      className="w-full bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      data-testid="textarea-question"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={solveMutation.isPending || !question.trim()}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
                    data-testid="button-solve-doubt"
                  >
                    {solveMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Solving Your Doubt...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-5 w-5" />
                        Solve My Doubt
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Solution Section */}
          <div>
            {currentSolution ? (
              <SolutionCard doubt={currentSolution} />
            ) : (
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No solution yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Submit a question to see your AI-powered solution here
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
