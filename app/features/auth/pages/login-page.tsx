import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Login' }];
};

export default function LoginPage() {
  return <div>Login Page</div>;
}
