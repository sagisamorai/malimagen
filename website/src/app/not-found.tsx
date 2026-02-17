import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background-secondary text-center px-4">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        העמוד לא נמצא
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        מצטערים, העמוד שחיפשת לא קיים. ייתכן שהקישור שגוי או שהעמוד הוסר.
      </p>
      <Link
        href="/"
        className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
      >
        חזרה לדף הבית
      </Link>
    </div>
  );
}
