import type { Route } from './+types/commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Join as Artist' }];
};

export default function JoinArtist() {
  return null;
}
