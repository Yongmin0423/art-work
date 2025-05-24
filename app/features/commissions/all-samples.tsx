import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'All Samples' }];
};

export default function AllSamples() {
  return null;
}
