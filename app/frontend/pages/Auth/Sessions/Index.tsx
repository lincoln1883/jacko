import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '../../../components/ui/button';
import type { SessionsIndexProps, Session } from '../../../types/auth';

const SessionsIndex: React.FC<SessionsIndexProps> = ({ sessions }) => {
  const { delete: destroy, processing } = useForm();

  const handleLogout = (sessionId: string) => {
    if (confirm('Are you sure you want to log out this session?')) {
      destroy(`/sessions/${sessionId}`);
    }
  };

  const formatUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Unknown device';

    // Simple user agent parsing - in a real app you might want a proper library
    if (userAgent.includes('Chrome')) return 'Chrome Browser';
    if (userAgent.includes('Firefox')) return 'Firefox Browser';
    if (userAgent.includes('Safari')) return 'Safari Browser';
    if (userAgent.includes('Mobile')) return 'Mobile Device';

    return 'Unknown Browser';
  };

  return (
    <>
      <Head title="Active Sessions" />
      <div className="min-h-screen bg-background py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card shadow-lg border sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Active Sessions
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your active login sessions across different devices.
                  </p>
                </div>
                <Link
                  href="/"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  ← Back to Home
                </Link>
              </div>

              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No active sessions found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session: Session, index: number) => (
                    <div
                      key={session.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <svg
                                  className="h-5 w-5 text-primary"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 01-1.414-1.414L13.586 5H12z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-foreground">
                                {formatUserAgent(session.user_agent)}
                                {index === 0 && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    Current
                                  </span>
                                )}
                              </h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>
                                  IP Address: {session.ip_address || 'Unknown'}
                                </p>
                                <p>Started: {session.created_at}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleLogout(session.id)}
                            loading={processing}
                            disabled={processing}
                          >
                            Log Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Security tip:</strong> If you see any sessions you
                  don't recognize, log them out immediately and consider
                  changing your password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionsIndex;
