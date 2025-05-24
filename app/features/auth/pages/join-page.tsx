import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Join' }];
};

export default function JoinPage() {
  return <div>Join Page</div>;
}
