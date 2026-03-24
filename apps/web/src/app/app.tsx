import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Button } from '@ui';

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
        Welcome to Web App
      </h2>
      <p className="text-lg text-gray-400 max-w-md text-center">
        Built with <span className="text-blue-400 font-semibold">React</span> +{' '}
        <span className="text-yellow-400 font-semibold">Vite</span> +{' '}
        <span className="text-cyan-400 font-semibold">Tailwind CSS</span> on{' '}
        <span className="text-green-400 font-semibold">Nx</span>
      </p>
      <div className="flex gap-3">
        <Button variant="primary" size="lg" onClick={() => navigate('/page-2')}>
          Go to Page 2
        </Button>
        <Button variant="secondary" size="lg">
          Secondary
        </Button>
        <Button variant="ghost" size="lg">
          Ghost
        </Button>
      </div>
    </div>
  );
}

function Page2() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h2 className="text-4xl font-bold text-purple-400">Page 2</h2>
      <p className="text-gray-400">This is the second page.</p>
      <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </div>
  );
}

export function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <span className="text-xl font-bold tracking-tight">Web</span>
          <div className="flex gap-4 text-sm">
            <Link to="/" className="text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/page-2" className="text-gray-400 hover:text-white transition-colors">
              Page 2
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center p-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page-2" element={<Page2 />} />
        </Routes>
      </main>

      <footer className="border-t border-gray-800 px-6 py-4 text-center text-sm text-gray-600">
        Nx + Vite + Tailwind CSS
      </footer>
    </div>
  );
}

export default App;

