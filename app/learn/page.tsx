import LearningMode from '@/components/LearningMode';

export default function LearnPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Learn & Practice
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Practice your vocabulary at your own pace. Type the Spanish
          translation for each English word and get immediate feedback.
        </p>
      </div>

      <LearningMode />
    </div>
  );
}
