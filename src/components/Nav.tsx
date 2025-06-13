import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Vote
            </Link>
            <Link 
              href="/results" 
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Results
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}