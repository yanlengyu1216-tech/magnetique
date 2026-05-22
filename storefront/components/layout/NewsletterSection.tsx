"use client"

import { useState } from "react"
import { Send, Check } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-brand-600 to-brand-800">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
            Stay Inspired
          </h2>
          <p className="text-brand-100 mt-3 text-lg">
            Subscribe for exclusive offers, new arrivals, and design inspiration
          </p>

          {subscribed ? (
            <div className="mt-8 flex items-center justify-center gap-3 text-white bg-white/10 rounded-xl p-4">
              <Check className="h-6 w-6 text-green-300" />
              <span className="font-medium">Thanks for subscribing! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-5 py-3.5 rounded-xl border-0 focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-brand-50 transition-colors shadow-lg"
              >
                <Send className="h-4 w-4" />
                Subscribe
              </button>
            </form>
          )}

          <p className="text-brand-200 text-sm mt-4">
            No spam. Unsubscribe anytime. 10% off your first order on signup.
          </p>
        </div>
      </div>
    </section>
  )
}
