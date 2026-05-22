"use client"

import { Award, Heart, Globe, Shield, Truck, Palette } from "lucide-react"
import Link from "next/link"

const values = [
  { icon: Heart, title: "Handcrafted with Love", description: "Every magnet is individually crafted by skilled artisans who pour their heart into each piece." },
  { icon: Globe, title: "Worldwide Inspiration", description: "Our designs draw inspiration from cultures, landmarks, and natural beauty across the globe." },
  { icon: Award, title: "Premium Quality", description: "We use only the finest materials — ceramic, resin, enamel, and metal — for lasting beauty." },
  { icon: Shield, title: "Sustainable Practices", description: "We're committed to eco-friendly packaging and responsible sourcing of materials." },
  { icon: Truck, title: "Global Shipping", description: "Fast, tracked shipping to over 100 countries with careful packaging to ensure safe delivery." },
  { icon: Palette, title: "Custom Design", description: "Turn your memories into unique magnets with our custom design service." },
]

const team = [
  { name: "Emma Chen", role: "Founder & Creative Director", avatar: "EC", color: "bg-brand-600" },
  { name: "Marcus Weber", role: "Head of Design", avatar: "MW", color: "bg-blue-600" },
  { name: "Sofia Laurent", role: "Artisan Relations", avatar: "SL", color: "bg-green-600" },
  { name: "Kenji Tanaka", role: "Supply Chain", avatar: "KT", color: "bg-purple-600" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 via-white to-amber-50 py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-6 leading-relaxed">
            Magnetique was born from a simple idea: that the best souvenirs aren't just things you buy — 
            they're pieces of a story you carry home. Every magnet in our collection is designed to 
            capture a moment, a place, or a feeling that matters.
          </p>
          <p className="text-gray-500 mt-4">
            Founded in 2020, we've grown from a small workshop to a global community of magnet lovers 
            across 50+ countries.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <v.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Happy Customers" },
              { value: "500+", label: "Unique Designs" },
              { value: "50+", label: "Countries Served" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold text-brand-400">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-4">
            Meet the Team
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">
            A passionate team dedicated to bringing beautiful magnets to fridges around the world.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center">
                <div className={`w-24 h-24 ${member.color} rounded-full mx-auto flex items-center justify-center text-2xl font-bold text-white mb-4`}>
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to Start Your Collection?
          </h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">
            Browse our collection of handcrafted magnets and find the perfect piece for your fridge.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-brand-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-brand-50 transition-colors shadow-xl"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
