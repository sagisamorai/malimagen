"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-secondary text-center px-4">
      <h1 className="text-4xl font-bold text-primary mb-4">שגיאה</h1>
      <p className="text-gray-500 mb-8">
        משהו השתבש. אנא נסו שוב מאוחר יותר.
      </p>
      <button
        onClick={reset}
        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
      >
        נסה שוב
      </button>
    </div>
  );
}
