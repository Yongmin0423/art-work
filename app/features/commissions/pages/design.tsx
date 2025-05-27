import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Design Commission' }];
};

export default function Design() {
  return null;
}
