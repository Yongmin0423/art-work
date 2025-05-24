import type { Route } from './+types/auth';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'OTP Complete' }];
};

export default function OtpCompletePage() {
  return <div>OTP Complete Page</div>;
}
