import TestMode from '@/components/TestMode';

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Test Your Knowledge
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Challenge yourself with a randomized test of 15 flashcards.
          Score at least 12/15 to pass!
        </p>
      </div>

      <TestMode />
    </div>
  );
}
