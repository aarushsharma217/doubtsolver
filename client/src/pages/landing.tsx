import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Brain, ListIcon, Lightbulb, Bookmark, Upload, Clock, TrendingUp, Play } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' fill-rule='evenodd'><g fill='%23000000' fill-opacity='0.1'><circle cx='7' cy='7' r='1'/><circle cx='27' cy='7' r='1'/><circle cx='47' cy='7' r='1'/><circle cx='7' cy='27' r='1'/><circle cx='27' cy='27' r='1'/><circle cx='47' cy='27' r='1'/><circle cx='7' cy='47' r='1'/><circle cx='27' cy='47' r='1'/><circle cx='47' cy='47' r='1'/></g></svg>")`
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Your 24×7 Personal
                <span className="text-primary block">JEE/NEET</span>
                Mentor
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Get instant, step-by-step solutions to your Physics, Chemistry, Mathematics, and Biology doubts. 
                AI-powered explanations that help you understand concepts like never before.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button 
                  size="lg"
                  onClick={() => window.location.href = '/api/login'}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg shadow-lg"
                  data-testid="button-start-solving"
                >
                  Start Solving Doubts Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-8 py-4 text-lg"
                  data-testid="button-watch-demo"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Quick Doubt Solver Preview */}
              <Card className="glassmorphism max-w-md mx-auto lg:mx-0 border-white/20 dark:border-slate-700/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Try it now - Type your doubt:</h3>
                  <textarea 
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-colors" 
                    rows={3}
                    placeholder="e.g., Solve for x: 2x² + 5x - 3 = 0"
                    data-testid="textarea-quick-doubt"
                  />
                  <Button 
                    className="w-full mt-3 bg-primary hover:bg-primary/90 text-white"
                    onClick={() => window.location.href = '/api/login'}
                    data-testid="button-solve-instantly"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Solve Doubt Instantly
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">AI-Powered Learning Platform</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Stats */}
              <div className="absolute -top-4 -left-4 glassmorphism p-4 rounded-xl border-white/20 dark:border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid="text-doubts-solved">2M+ Doubts Solved</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 glassmorphism p-4 rounded-xl border-white/20 dark:border-slate-700/50">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white" data-testid="text-rating">4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Students Choose AI Doubt Solver
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Advanced AI technology meets educational expertise to deliver personalized learning experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <ListIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Step-by-Step Solutions</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get detailed, exam-oriented solutions with clear reasoning and formula explanations for every doubt.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center mb-6">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Concept Simplifier</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complex topics explained in simple terms with real-world examples and visual aids.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-6">
                  <Bookmark className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Bookmark & Revise</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Save important doubts and solutions for quick revision before exams.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Multi-Format Input</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Upload images, PDFs, or type questions directly. Our AI understands all formats.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">24/7 Availability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Get instant help anytime, anywhere. No waiting for tutors or scheduled sessions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Progress Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monitor your learning progress with detailed analytics and performance insights.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50 dark:bg-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Learning Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start free and upgrade when you need unlimited access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-colors">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free Trial</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">₹0</div>
                  <p className="text-gray-600 dark:text-gray-300">Perfect for trying out</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">5 doubts per day</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Basic step-by-step solutions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">All subjects covered</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-get-started-free"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-primary text-white relative transform scale-105 border-primary">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white border-orange-500">Most Popular</Badge>
              </div>
              
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Pro Plan</h3>
                  <div className="text-4xl font-bold mb-2">₹199</div>
                  <p className="text-blue-100">per month</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span>Unlimited doubts</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span>Detailed explanations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span>Doubt history & bookmarks</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-300 flex-shrink-0" />
                    <span>Priority AI processing</span>
                  </li>
                </ul>
                
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-primary hover:bg-gray-100"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-start-pro-trial"
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-colors">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">₹299</div>
                  <p className="text-gray-600 dark:text-gray-300">For serious aspirants</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Everything in Pro</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Live doubt sessions</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Practice question generator</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">Progress analytics</span>
                  </li>
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-go-premium"
                >
                  Go Premium
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-32 h-24 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center">
            <Brain className="h-12 w-12 text-white" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Ace Your JEE/NEET?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of successful students and start solving your doubts with AI today
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg"
              data-testid="button-start-free-trial"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
              data-testid="button-view-pricing"
            >
              View Pricing
            </Button>
          </div>
          
          <p className="text-blue-100 mt-6 text-sm">
            No credit card required • Cancel anytime • Join 50,000+ students
          </p>
        </div>
      </section>
    </div>
  );
}
