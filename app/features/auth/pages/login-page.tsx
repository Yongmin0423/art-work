import { Form, Link } from 'react-router';
import type { Route } from './+types/login-page';
import InputPair from '~/components/input-pair';
import { Button } from '~/components/ui/button';
import AuthButtons from '../components/auth-buttons';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Login' }];
};

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative h-full">
      <Button
        variant="ghost"
        asChild
        className="absolute -top-18 -right-18 text-xs p-2"
      >
        <Link to="/auth/join">회원가입</Link>
      </Button>
      <div className="mb-5">
        <h2 className="text-3xl font-bold">Welcome to Artwork</h2>
        <h1 className="text-sm text-muted-foreground">
          Log in to your account
        </h1>
      </div>
      <Form className="w-full space-y-5">
        <InputPair
          label="Email"
          description="이메일을 입력해주세요."
          type="email"
          name="email"
          required
          id="email"
          placeholder="i.e artwork@gmail.com"
        />
        <InputPair
          label="Password"
          description="비밀번호를 입력해주세요."
          type="password"
          name="password"
          required
          placeholder="8글자 이상 입력해주세요."
        />
        <Button
          type="submit"
          className="w-full"
        >
          로그인
        </Button>
      </Form>
      <AuthButtons />
    </div>
  );
}
