import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowRight, Menu, X } from 'lucide-react'

function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroImages = [
    '/Wide_hero_illustration_showing_multiple_cute_store-1765435552999.png',
    '/Realistic_wide_shot_of_a_lively_urban_shopping_str-1765437617879.png',
    '/Realistic_scene_of_a_group_of_friends_sitting_at_a-1765437737453.png',
    '/Close-up_cinematic_shot_of_a_hand_holding_a_modern-1765437950473.png',
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/RateMyStore-logo.png"
                alt="RateMyStore Logo"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <span className="text-xl sm:text-2xl font-bold text-slate-900">RateMyStore</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Testimonials
              </button>
              <Link
                to="/login"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-3"
            >
              <button
                onClick={() => scrollToSection('features')}
                className="block w-full text-left text-sm font-medium text-slate-700 hover:text-indigo-600 py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="block w-full text-left text-sm font-medium text-slate-700 hover:text-indigo-600 py-2"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left text-sm font-medium text-slate-700 hover:text-indigo-600 py-2"
              >
                Testimonials
              </button>
              <Link
                to="/login"
                className="block w-full rounded-lg bg-indigo-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section with Image Slider */}
      <section className="relative mt-20 min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.05,
              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <img
                src={img}
                alt={`Hero slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover, Rate, and Improve
              <br />
              <span className="text-indigo-200">Stores Near You</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-8 max-w-3xl mx-auto drop-shadow-md">
              A smart platform to review stores, find trusted businesses, and help local shops grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/login"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-xl transition hover:bg-indigo-50 hover:scale-105"
              >
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/app/stores"
                className="inline-flex items-center rounded-lg border-2 border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/20 hover:border-white/60"
              >
                Explore Stores
              </Link>
            </div>
          </motion.div>

          <div className="mt-12 flex justify-center gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="h-8 w-8 rounded-full border-2 border-white/50 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Powerful Features for Everyone
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to discover great stores, manage your business, and build trust in your community.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
            {[
              {
                icon: '/SearchStore-icon.png',
                title: 'Search Stores Easily',
                description: 'Find stores near you with our powerful search and filter system. Discover new businesses and explore your local community.',
                bgColor: 'bg-blue-50',
              },
              {
                icon: '/FiveStarRating-icon.png',
                title: 'Rate Stores',
                description: 'Share your honest opinions with 1-5 star ratings. Help others make informed decisions and support great local businesses.',
                bgColor: 'bg-yellow-50',
              },
              {
                icon: '/TotalUser-icon.png',
                title: 'Trusted by Many Users',
                description: 'Join thousands of active users who rely on RateMyStore for honest reviews and reliable business information.',
                bgColor: 'bg-indigo-50',
              },
              {
                icon: '/TotalStore-icon.png',
                title: 'Thousands of Stores Available',
                description: 'Access a vast database of stores across different categories. From restaurants to retail, find what you need.',
                bgColor: 'bg-green-50',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-2xl bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-xl hover:-translate-y-2"
              >
                <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6`}>
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                    onError={(e) => {
                      e.target.src = '/NoRatings-icon.png'
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Illustrative Section */}
      <section id="about" className="py-20 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Main Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 p-8 aspect-square flex items-center justify-center">
                <img
                  src="/A_friendly_character_giving_a_thumbs_up_in_front_o-1765434637044.png"
                  alt="Friendly character giving thumbs up"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              {/* Supporting Character Images */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl overflow-hidden bg-slate-100 aspect-square"
                >
                  <img
                    src="/YoungPersonStanding.png"
                    alt="Young person"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-xl overflow-hidden bg-slate-100 aspect-square"
                >
                  <img
                    src="/SmallBusinessStoreOwner_standing.png"
                    alt="Store owner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-xl overflow-hidden bg-slate-100 aspect-square"
                >
                  <img
                    src="/store_owner_standing_proudly_in_front.png"
                    alt="Store owner standing proudly"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                A Smart Rating Platform for Everyone
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                RateMyStore connects customers, store owners, and administrators in a seamless ecosystem designed to foster trust and growth. Whether you're looking for the perfect restaurant, managing your business reputation, or overseeing the platform, we've got you covered.
              </p>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl">👥</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">For Customers</h3>
                    <p className="text-slate-600 text-sm">Discover trusted businesses, share your experiences, and help others make informed decisions.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">For Store Owners</h3>
                    <p className="text-slate-600 text-sm">Track your ratings, understand customer feedback, and improve your business based on real insights.</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className="shrink-0">
                    <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl">🛡️</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">For Administrators</h3>
                    <p className="text-slate-600 text-sm">Manage the platform, ensure quality reviews, and maintain a fair and transparent rating system.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 sm:py-24 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Join thousands of users who trust RateMyStore for honest reviews and reliable business information.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Regular Customer',
                rating: 5,
                text: 'RateMyStore has helped me discover amazing local businesses I never knew existed. The ratings are honest and reliable!',
              },
              {
                name: 'Michael Chen',
                role: 'Store Owner',
                rating: 5,
                text: 'As a business owner, the feedback I receive through RateMyStore is invaluable. It helps me understand what customers really want.',
              },
              {
                name: 'Emily Rodriguez',
                role: 'Community Member',
                rating: 5,
                text: 'I love how easy it is to rate stores and see what others think. This platform has become essential for my shopping decisions.',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-600">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description - Enlarged Logo */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src="/RateMyStore-logo.png"
                  alt="RateMyStore Logo"
                  className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
                <span className="text-2xl sm:text-3xl font-bold text-white">RateMyStore</span>
              </div>
              <p className="text-slate-400 text-sm max-w-md">
                Connecting customers, store owners, and communities through honest ratings and trusted reviews.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="hover:text-white transition-colors"
                  >
                    About
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection('testimonials')}
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} RateMyStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage


