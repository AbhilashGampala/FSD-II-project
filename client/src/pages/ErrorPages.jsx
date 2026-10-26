import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ShieldX, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full text-center p-8 space-y-4 shadow-lg">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 mx-auto flex items-center justify-center text-2xl font-bold">
          404
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The requested page does not exist or may have been moved.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" className="gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <Card className="max-w-md w-full text-center p-8 space-y-4 shadow-lg border-red-200 dark:border-red-900/50">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 mx-auto flex items-center justify-center">
          <ShieldX className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied (403)</h1>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You do not have the required permissions to view this portal. Role-based access control is strictly enforced on both server and client.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
