export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Quiz</h1>
      <p className="text-gray-500">Coming soon. (Document ID: {params.id})</p>
    </main>
  );
}