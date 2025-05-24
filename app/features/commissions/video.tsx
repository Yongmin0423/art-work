import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Video Commission' }];
};

export default function Video() {
  return null;
}
