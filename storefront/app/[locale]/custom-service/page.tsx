"use client"

import { useState } from "react"
import { Upload, Palette, Heart, Camera, ArrowRight, Check } from "lucide-react"
import { Link } from "@/lib/i18n/navigation"

const steps = [
  { icon: Camera, title: "Upload Your Image", description: "Choose a photo, design, or idea you'd like to turn into a magnet." },
  { icon: Palette, title: "Choose Your Style", description: "Pick the size, material, and finish that best suits your vision." },
  { icon: Heart, title: "We Craft It", description: "Our artisans handcraft your custom magnet with premium materials." },
  { icon: Check, title: "Receive & Enjoy", description: "Get your unique magnet delivered to your doorstep." },
]

const materials = [
  { name: "Ceramic", price: "From $19.99", description: "Classic glazed finish, vibrant colors", popular: true },
  { name: "Resin", price: "From $24.99", description: "3D sculpted, detailed texture", popular: false },
  { name: "Wood", price: "From $16.99", description: "Natural, rustic charm", popular: false },
  { name: "Metal", price: "From $22.99", description: "Durable, vintage look", popular: false },
]

export default function CustomServicePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-brand-50 py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
            Custom Service
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900">
            Turn Your Memories Into Magnets
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            Upload any photo, artwork, or design and our skilled artisans will transform it into a 
            beautiful handcrafted refrigerator magnet. Perfect for gifts, weddings, businesses, and more.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-7 w-7 text-brand-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upload & preview */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-8">
              Start Your Custom Order
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Upload area */}
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-brand-400 transition-colors">
                {preview ? (
                  <div className="space-y-4">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl" />
                    <button
                      onClick={() => { setSelectedFile(null); setPreview(null) }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove & upload different
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium mb-1">Click to upload your image</p>
                    <p className="text-sm text-gray-400">PNG, JPG, JPEG up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Order form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Material</label>
                    <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500">
                      {materials.map((m) => (
                        <option key={m.name} value={m.name}>{m.name} ({m.price})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Size</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Small (4×4\")", "Medium (6×4\")", "Large (6×6\")", "XL (8×6\")"].map((size) => (
                        <label key={size} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-brand-300 transition-colors">
                          <input type="radio" name="size" className="text-brand-600 focus:ring-brand-500" />
                          <span className="text-sm text-gray-700">{size}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
                    <input type="number" min={1} defaultValue={1} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
                    <textarea rows={3} placeholder="Any special requests or instructions..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none" />
                  </div>
                  <button className="w-full bg-brand-600 text-white py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-gray-900 text-center mb-4">Choose Your Material</h2>
          <p className="text-gray-500 text-center mb-12 max-w-lg mx-auto">Each material offers a unique look and feel for your custom magnet.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {materials.map((mat, i) => (
              <div key={i} className={`bg-white rounded-2xl border-2 p-6 relative ${mat.popular ? "border-brand-600 shadow-lg" : "border-gray-200"}`}>
                {mat.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-display font-bold text-gray-900 mt-2">{mat.name}</h3>
                <p className="text-2xl font-bold text-brand-600 mt-2">{mat.price}</p>
                <p className="text-sm text-gray-500 mt-2">{mat.description}</p>
                <button className={`w-full mt-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  mat.popular ? "bg-brand-600 text-white hover:bg-brand-700" : "border border-gray-300 text-gray-700 hover:border-brand-600 hover:text-brand-600"
                }`}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
