import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Trophy } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Master English Vocabulary
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
            Learn and practice English words with interactive flashcards.
            Create custom cards, practice at your own pace, and test your knowledge.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 md:mb-10">
          <Link
            href="/add-card"
            className="group bg-white rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500"
          >
            <div className="bg-primary-100 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 group-hover:bg-primary-200 transition-colors">
              <BookOpen className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Add Cards</h2>
            <p className="text-gray-600 mb-3">
              Create custom flashcards with English words and Spanish translations
            </p>
            <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </Link>

          <Link
            href="/learn"
            className="group bg-white rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500"
          >
            <div className="bg-green-100 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
              <Brain className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Learn & Practice</h2>
            <p className="text-gray-600 mb-3">
              Practice your vocabulary with interactive flashcards at your own pace
            </p>
            <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
              Start Learning <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </Link>

          <Link
            href="/test"
            className="group bg-white rounded-2xl p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-500"
          >
            <div className="bg-purple-100 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">Take a Test</h2>
            <p className="text-gray-600 mb-3">
              Challenge yourself with a randomized test of 15 flashcards
            </p>
            <div className="flex items-center text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
              Start Test <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </Link>
        </div>

        {/* Stats or CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-5 md:p-6 lg:p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Ready to expand your vocabulary?</h3>
          <p className="text-primary-100 mb-4 md:mb-5 text-base md:text-lg">
            Start creating flashcards and track your progress today
          </p>
          <Link
            href="/add-card"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Create Your First Card
          </Link>
        </div>
      </div>
    </div>
  );
}
