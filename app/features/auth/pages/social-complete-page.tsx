import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Social Complete' }];
};

export default function SocialCompletePage() {
  return <div>Social Complete Page</div>;
}
