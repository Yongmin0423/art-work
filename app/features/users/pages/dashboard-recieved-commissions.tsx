import type { Route } from './+types/dashboard-recieved-commissions';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'My Commissions | wemake' }];
};

export default function DashboardIdeasPage() {
  return (
    <div className="space-y-5 h-full">
      <h1 className="text-2xl font-semibold mb-6">Claimed Commissions</h1>
      <div className="grid grid-cols-4 gap-6"></div>
    </div>
  );
}
