import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Auth Layout' }];
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
}
