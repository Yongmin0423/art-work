import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Social Start' }];
};

export default function SocialStartPage() {
  return <div>Social Start Page</div>;
}
