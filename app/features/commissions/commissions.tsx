import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Commissions' }];
};

export default function Commissions() {
  return null;
}
