import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button.jsx';

export function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-extrabold text-gradient">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-ink-500">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="primary">Back to home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
