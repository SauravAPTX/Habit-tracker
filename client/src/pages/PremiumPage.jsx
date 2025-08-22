import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const PremiumPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      price: 9.99,
      period: "month",
      savings: null,
      popular: false,
    },
    yearly: {
      price: 79.99,
      period: "year",
      savings: "Save 33%",
      popular: true,
    },
  };

  const features = [
    {
      icon: "🚀",
      title: "Unlimited Habits",
      description: "Create as many habits as you want",
      free: "5 habits max",
      premium: "∞ Unlimited",
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Detailed insights and progress tracking",
      free: "Basic stats",
      premium: "Full analytics",
    },
    {
      icon: "🎯",
      title: "Custom Categories",
      description: "Create your own habit categories",
      free: "6 preset categories",
      premium: "Custom categories",
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description: "AI-powered reminder optimization",
      free: "Basic reminders",
      premium: "Smart reminders",
    },
    {
      icon: "📱",
      title: "Mobile App",
      description: "Native iOS and Android apps",
      free: "Web only",
      premium: "Full mobile access",
    },
    {
      icon: "🏆",
      title: "Challenges & Leaderboards",
      description: "Compete with friends and join challenges",
      free: "View only",
      premium: "Full participation",
    },
    {
      icon: "☁️",
      title: "Cloud Sync",
      description: "Sync across all your devices",
      free: "Local storage",
      premium: "Cloud sync",
    },
    {
      icon: "🎨",
      title: "Custom Themes",
      description: "Personalize your experience",
      free: "Default theme",
      premium: "Custom themes",
    },
    {
      icon: "📈",
      title: "Export Data",
      description: "Download your habit data anytime",
      free: "❌",
      premium: "✅ Full export",
    },
    {
      icon: "💬",
      title: "Priority Support",
      description: "24/7 customer support",
      free: "Community support",
      premium: "Priority support",
    },
  ];

  const handleUpgrade = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    try {
      // In a real app, this would integrate with Stripe
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful upgrade
      alert("🎉 Welcome to Premium! Your account has been upgraded.");
      navigate("/dashboard");
    } catch (error) {
      alert("❌ Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (user?.subscriptionTier === "premium") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="card">
            <div className="text-6xl mb-4">👑</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're Already Premium!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for supporting HabitTracker. You have access to all
              premium features.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn-primary w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Upgrade to Premium and supercharge your habit-building journey with
            advanced features and unlimited possibilities.
          </p>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-sm">
            <span className="mr-2">🎉</span>
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-gray-600">
              Start your premium journey today with our flexible pricing options
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`relative card cursor-pointer transition-all hover:shadow-lg ${
                  selectedPlan === key
                    ? "border-primary-500 shadow-lg"
                    : "border-gray-200"
                } ${plan.popular ? "transform scale-105" : ""}`}
                onClick={() => setSelectedPlan(key)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">
                      {key} Plan
                    </h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      ${plan.price}
                      <span className="text-lg font-normal text-gray-600">
                        /{plan.period}
                      </span>
                    </div>
                    {plan.savings && (
                      <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">
                        All Premium Features
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">Priority Support</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">30-Day Money Back</span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">Cancel Anytime</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div
                      className={`w-6 h-6 mx-auto rounded-full border-2 ${
                        selectedPlan === key
                          ? "border-primary-500 bg-primary-500"
                          : "border-gray-300"
                      } flex items-center justify-center`}
                    >
                      {selectedPlan === key && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="btn-primary text-lg px-8 py-4"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                `Upgrade to Premium - $${plans[selectedPlan].price}/${plans[selectedPlan].period}`
              )}
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free vs Premium Features
            </h2>
            <p className="text-gray-600">
              See exactly what you get with Premium
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 bg-primary-50">
                      Premium
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {features.map((feature, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{feature.icon}</span>
                          <div>
                            <div className="font-medium text-gray-900">
                              {feature.title}
                            </div>
                            <div className="text-sm text-gray-600">
                              {feature.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {feature.free}
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-medium text-primary-600 bg-primary-50">
                        {feature.premium}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Premium Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">👩‍💻</div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Product Manager</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The analytics dashboard completely changed how I understand my
                habits. I can now optimize my routine based on real data!"
              </p>
              <div className="flex text-yellow-400">{"★".repeat(5)}</div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">👨‍🎓</div>
                <div>
                  <div className="font-semibold">Mike Chen</div>
                  <div className="text-sm text-gray-600">Student</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Unlimited habits means I can track everything! From study
                sessions to exercise, it's all in one place."
              </p>
              <div className="flex text-yellow-400">{"★".repeat(5)}</div>
            </div>

            <div className="card">
              <div className="flex items-center mb-4">
                <div className="text-3xl mr-3">👩‍🎨</div>
                <div>
                  <div className="font-semibold">Alex Rivera</div>
                  <div className="text-sm text-gray-600">Designer</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "The smart reminders are a game-changer. They adapt to my
                schedule and help me stay consistent."
              </p>
              <div className="flex text-yellow-400">{"★".repeat(5)}</div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time. Your premium
                features will remain active until the end of your billing
                period.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                What's the 30-day money-back guarantee?
              </h3>
              <p className="text-gray-600">
                If you're not satisfied with Premium within the first 30 days,
                contact us for a full refund. No questions asked.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Do I keep my data if I downgrade?
              </h3>
              <p className="text-gray-600">
                Yes, all your habit data is preserved. If you have more than 5
                habits, you'll need to archive some to fit the free plan limit.
              </p>
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a mobile app?
              </h3>
              <p className="text-gray-600">
                Premium users get access to our native iOS and Android apps with
                offline sync and push notifications.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl text-white p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Transform Your Habits?
            </h3>
            <p className="mb-6 text-primary-100">
              Join thousands of users who have already upgraded their
              habit-building journey with Premium.
            </p>
            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="bg-white text-primary-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Your Premium Journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
