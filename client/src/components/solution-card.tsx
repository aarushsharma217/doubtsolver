import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, MessageCircle, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Doubt } from '@shared/schema';

interface SolutionStep {
  step: number;
  title: string;
  content: string;
  formula?: string;
}

interface ParsedSolution {
  subject: string;
  steps: SolutionStep[];
  finalAnswer: string;
  alternativeMethods?: string[];
  relatedConcepts?: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface SolutionCardProps {
  doubt: Doubt & { solution: ParsedSolution | null };
}

export function SolutionCard({ doubt }: SolutionCardProps) {
  const [simplified, setSimplified] = useState<string | null>(null);
  const [showSimplified, setShowSimplified] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('PATCH', `/api/doubts/${doubt.id}`, {
        isBookmarked: !doubt.isBookmarked
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/doubts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/doubts/bookmarked'] });
      toast({
        title: doubt.isBookmarked ? "Bookmark removed" : "Bookmarked!",
        description: doubt.isBookmarked ? "Removed from your bookmarks" : "Added to your bookmarks for quick access",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  });

  const simplifyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/doubts/${doubt.id}/simplify`);
      return await response.json();
    },
    onSuccess: (data) => {
      setSimplified(data.simplifiedExplanation);
      setShowSimplified(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to simplify explanation",
        variant: "destructive",
      });
    }
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  if (!doubt.solution) {
    return (
      <Card className="glassmorphism border-gray-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Generating solution...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism border-gray-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
              AI Solution
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-primary border-primary" data-testid={`badge-subject-${doubt.solution.subject.toLowerCase()}`}>
                {doubt.solution.subject}
              </Badge>
              <Badge 
                className={getDifficultyColor(doubt.solution.difficulty)}
                data-testid={`badge-difficulty-${doubt.solution.difficulty.toLowerCase()}`}
              >
                {doubt.solution.difficulty}
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => bookmarkMutation.mutate()}
              disabled={bookmarkMutation.isPending}
              className="text-gray-600 dark:text-gray-300 hover:text-primary"
              data-testid="button-bookmark"
            >
              {doubt.isBookmarked ? (
                <BookmarkCheck className="h-4 w-4" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 dark:text-gray-300 hover:text-primary"
              data-testid="button-share"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Question:</h4>
          <p className="text-gray-700 dark:text-gray-300" data-testid="text-question">
            {doubt.question}
          </p>
        </div>

        {showSimplified && simplified ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Simplified Explanation:</h4>
            <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap" data-testid="text-simplified-explanation">
              {simplified}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSimplified(false)}
              className="mt-2 text-blue-600 dark:text-blue-400"
              data-testid="button-hide-simplified"
            >
              Show Original Solution
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {doubt.solution.steps.map((step) => (
              <div 
                key={step.step} 
                className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-lg border border-gray-200 dark:border-slate-600"
                data-testid={`solution-step-${step.step}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      {step.content}
                    </p>
                    {step.formula && (
                      <div className="bg-gray-100 dark:bg-slate-700 p-2 rounded font-mono text-sm">
                        {step.formula}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Final Answer</h4>
                  <p className="text-green-800 dark:text-green-200 font-medium" data-testid="text-final-answer">
                    {doubt.solution.finalAnswer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {doubt.solution.alternativeMethods && doubt.solution.alternativeMethods.length > 0 && (
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">Alternative Methods:</h4>
            <ul className="list-disc list-inside space-y-1 text-purple-800 dark:text-purple-200">
              {doubt.solution.alternativeMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>
        )}

        {doubt.solution.relatedConcepts && doubt.solution.relatedConcepts.length > 0 && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">Related Concepts:</h4>
            <div className="flex flex-wrap gap-2">
              {doubt.solution.relatedConcepts.map((concept, index) => (
                <Badge key={index} variant="outline" className="text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700">
                  {concept}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={() => simplifyMutation.mutate()}
            disabled={simplifyMutation.isPending}
            className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-0"
            data-testid="button-explain-simpler"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {simplifyMutation.isPending ? 'Simplifying...' : 'Explain Simpler'}
          </Button>
          <Button
            onClick={() => bookmarkMutation.mutate()}
            disabled={bookmarkMutation.isPending}
            className="flex-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 border-0"
            data-testid="button-save-solution"
          >
            {doubt.isBookmarked ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
            {bookmarkMutation.isPending ? 'Saving...' : (doubt.isBookmarked ? 'Saved' : 'Save Solution')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}