import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookmarkIcon, Calendar, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { isUnauthorizedError } from '@/lib/authUtils';
import { SolutionCard } from '@/components/solution-card';
import type { Doubt } from '@shared/schema';

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

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  // Fetch all doubts
  const { data: allDoubts, isLoading: doubtsLoading, error: doubtsError } = useQuery<(Doubt & { solution: ParsedSolution | null })[]>({
    queryKey: ['/api/doubts'],
    enabled: isAuthenticated,
  });

  // Fetch bookmarked doubts
  const { data: bookmarkedDoubts, isLoading: bookmarksLoading, error: bookmarksError } = useQuery<(Doubt & { solution: ParsedSolution | null })[]>({
    queryKey: ['/api/doubts/bookmarked'],
    enabled: isAuthenticated,
  });

  // Handle unauthorized errors
  useEffect(() => {
    if (doubtsError && isUnauthorizedError(doubtsError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [doubtsError, toast]);

  useEffect(() => {
    if (bookmarksError && isUnauthorizedError(bookmarksError)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [bookmarksError, toast]);

  const subjects = ['all', 'Physics', 'Chemistry', 'Maths', 'Biology'];

  const filterDoubts = (doubts: (Doubt & { solution: ParsedSolution | null })[]) => {
    if (!doubts) return [];
    
    return doubts.filter(doubt => {
      // Filter by search query
      if (searchQuery && !doubt.question.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by subject
      if (selectedSubject !== 'all' && doubt.subject !== selectedSubject) {
        return false;
      }
      
      return true;
    });
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredAllDoubts = filterDoubts(allDoubts || []);
  const filteredBookmarkedDoubts = filterDoubts(bookmarkedDoubts || []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Doubt History
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review your solved doubts and bookmarked solutions
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search your doubts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600"
                  data-testid="input-search-doubts"
                />
              </div>

              {/* Subject Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant={selectedSubject === subject ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSubject(subject)}
                      className={selectedSubject === subject 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                      }
                      data-testid={`button-filter-${subject.toLowerCase()}`}
                    >
                      {subject === 'all' ? 'All' : subject}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-all-doubts"
            >
              <Calendar className="h-4 w-4 mr-2" />
              All Doubts ({filteredAllDoubts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="bookmarked"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
              data-testid="tab-bookmarked"
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Bookmarked ({filteredBookmarkedDoubts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {doubtsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredAllDoubts.length === 0 ? (
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No doubts found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {searchQuery || selectedSubject !== 'all' 
                        ? 'Try adjusting your search filters'
                        : 'Start by submitting your first doubt!'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredAllDoubts.map((doubt) => (
                  <div key={doubt.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-primary border-primary">
                          {doubt.subject}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(doubt.createdAt)}
                        </span>
                      </div>
                      {doubt.isBookmarked && (
                        <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          <BookmarkIcon className="h-3 w-3 mr-1" />
                          Bookmarked
                        </Badge>
                      )}
                    </div>
                    <SolutionCard doubt={doubt} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bookmarked" className="space-y-6">
            {bookmarksLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredBookmarkedDoubts.length === 0 ? (
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <BookmarkIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No bookmarked doubts
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {searchQuery || selectedSubject !== 'all' 
                        ? 'Try adjusting your search filters'
                        : 'Bookmark important solutions for quick access during revision!'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredBookmarkedDoubts.map((doubt) => (
                  <div key={doubt.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-primary border-primary">
                          {doubt.subject}
                        </Badge>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(doubt.createdAt)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        <BookmarkIcon className="h-3 w-3 mr-1" />
                        Bookmarked
                      </Badge>
                    </div>
                    <SolutionCard doubt={doubt} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
