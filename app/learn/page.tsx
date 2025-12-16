import LearningMode from '@/components/LearningMode';

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
          Learn & Practice
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
          Practice your vocabulary at your own pace. Type the Spanish
          translation for each English word and get immediate feedback.
        </p>
      </div>

      <LearningMode />
    </div>
  );
}
