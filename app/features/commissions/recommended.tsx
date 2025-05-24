import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Recommended Commission' }];
};

export default function Recommended() {
  return null;
}
