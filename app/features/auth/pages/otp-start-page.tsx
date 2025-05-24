import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'OTP Start' }];
};

export default function OtpStartPage() {
  return <div>OTP Start Page</div>;
}
