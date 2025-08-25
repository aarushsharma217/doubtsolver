import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Crown, Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  // Fetch user stats to show current plan
  const { data: stats } = useQuery({
    queryKey: ['/api/user/stats'],
    enabled: isAuthenticated,
  });

  const plans = [
    {
      name: 'Free Trial',
      price: '₹0',
      period: '',
      description: 'Perfect for trying out',
      features: [
        { text: '5 doubts per day', included: true },
        { text: 'Basic step-by-step solutions', included: true },
        { text: 'All subjects covered', included: true },
        { text: 'Doubt history', included: false },
        { text: 'Bookmarks', included: false },
        { text: 'Priority support', included: false },
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
      current: stats?.subscription === 'free',
    },
    {
      name: 'Pro Plan',
      price: '₹199',
      period: 'per month',
      description: 'Most popular choice',
      featured: true,
      features: [
        { text: 'Unlimited doubts', included: true },
        { text: 'Detailed explanations', included: true },
        { text: 'Doubt history & bookmarks', included: true },
        { text: 'Priority AI processing', included: true },
        { text: 'Alternative solution methods', included: true },
        { text: 'Email support', included: true },
      ],
      buttonText: 'Start Pro Trial',
      buttonVariant: 'default' as const,
      current: stats?.subscription === 'pro',
    },
    {
      name: 'Premium',
      price: '₹299',
      period: 'per month',
      description: 'For serious aspirants',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Live doubt sessions', included: true },
        { text: 'Practice question generator', included: true },
        { text: 'Progress analytics', included: true },
        { text: 'Exam preparation mode', included: true },
        { text: 'Priority phone support', included: true },
      ],
      buttonText: 'Go Premium',
      buttonVariant: 'outline' as const,
      current: stats?.subscription === 'premium',
    },
  ];

  const handlePlanSelect = (planName: string) => {
    if (!isAuthenticated) {
      window.location.href = '/api/login';
      return;
    }

    // For demo purposes, we'll just show an alert
    // In a real app, this would integrate with Razorpay/Stripe
    alert(`${planName} subscription selected! Payment integration would happen here.`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary-500/5 dark:from-primary/10 dark:to-secondary-500/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start free and upgrade when you need unlimited access. All plans include our core AI-powered doubt solving.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.name}
                className={`relative transition-all hover:shadow-lg ${
                  plan.featured 
                    ? 'bg-primary text-white border-primary scale-105 shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700'
                } ${plan.current ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}`}
              >
                {/* Popular Badge */}
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white border-orange-500 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.current && (
                  <div className="absolute -top-4 right-4">
                    <Badge className="bg-green-500 text-white border-green-500 px-3 py-1">
                      <Crown className="h-3 w-3 mr-1" />
                      Current Plan
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mb-2">
                    <span className={`text-4xl font-bold ${plan.featured ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className={`text-sm ml-1 ${plan.featured ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={plan.featured ? 'text-blue-100' : 'text-gray-600 dark:text-gray-300'}>
                    {plan.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        {feature.included ? (
                          <CheckCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            plan.featured ? 'text-green-300' : 'text-green-500'
                          }`} />
                        ) : (
                          <X className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                            plan.featured ? 'text-red-300' : 'text-red-500'
                          }`} />
                        )}
                        <span className={`text-sm ${
                          feature.included 
                            ? (plan.featured ? 'text-white' : 'text-gray-700 dark:text-gray-300')
                            : (plan.featured ? 'text-gray-300' : 'text-gray-400 dark:text-gray-500')
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePlanSelect(plan.name)}
                    disabled={plan.current}
                    variant={plan.featured ? 'secondary' : plan.buttonVariant}
                    className={`w-full py-3 font-semibold ${
                      plan.featured 
                        ? 'bg-white text-primary hover:bg-gray-100' 
                        : plan.current
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                    data-testid={`button-select-${plan.name.toLowerCase().replace(' ', '-')}`}
                  >
                    {plan.current ? (
                      <>
                        <Crown className="h-4 w-4 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        {plan.featured && <Zap className="h-4 w-4 mr-2" />}
                        {plan.buttonText}
                      </>
                    )}
                  </Button>

                  {/* Additional Info */}
                  {index === 1 && (
                    <p className="text-xs text-center text-blue-100">
                      7-day free trial included
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Can I change my plan anytime?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    We accept all major credit cards, debit cards, UPI, and net banking through Razorpay.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Is there a refund policy?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Yes, we offer a 7-day money-back guarantee. If you're not satisfied, we'll refund your payment.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Do you offer student discounts?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Yes! Students can get up to 20% off on annual plans. Contact support with your student ID.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Card className="bg-gradient-to-br from-primary to-secondary-500 border-0 text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Supercharge Your JEE/NEET Preparation?
                </h2>
                <p className="text-xl mb-8 text-blue-100">
                  Join thousands of successful students and start solving doubts with AI today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg"
                    onClick={() => handlePlanSelect('Pro Plan')}
                    className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg"
                    data-testid="button-cta-start-trial"
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
                    data-testid="button-cta-contact-sales"
                  >
                    Contact Sales
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
