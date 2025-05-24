import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Character Commission' }];
};

export default function Character() {
  return <div>Character Commission</div>;
}
