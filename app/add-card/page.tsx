import AddCardForm from '@/components/AddCardForm';
import Card from '@/components/ui/Card';

export default function AddCardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Add New Flashcard
          </h1>
          <p className="text-lg text-gray-600">
            Create a new vocabulary card to add to your learning collection
          </p>
        </div>

        <Card variant="elevated">
          <AddCardForm />
        </Card>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Tips for creating effective flashcards:
          </h3>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Keep translations simple and clear</li>
            <li>Add context in notes to help remember the word</li>
            <li>Include example sentences when helpful</li>
            <li>Focus on commonly used words first</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
