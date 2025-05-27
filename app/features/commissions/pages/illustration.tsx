import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Illustration Commission' }];
};

export default function Illustration() {
  return null;
}
