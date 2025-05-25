import { Button } from '~/components/ui/button';
import type { Route } from './+types/join-page';
import { Form, Link } from 'react-router';
import InputPair from '~/components/input-pair';
import AuthButtons from '../components/auth-buttons';

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Join' }];
};

export default function JoinPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center relative h-full">
      <Button
        variant="ghost"
        asChild
        className="absolute -top-18 -right-18 text-xs p-2"
      >
        <Link to="/auth/login">로그인</Link>
      </Button>
      <div className="mb-5">
        <h2 className="text-3xl font-bold">Welcome to Artwork</h2>
        <h1 className="text-sm text-muted-foreground">Create your account</h1>
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
          label="Username"
          description="닉네임을 입력해주세요."
          type="text"
          name="username"
          required
          id="username"
          placeholder="i.e artwork"
        />
        <InputPair
          label="Password"
          description="비밀번호를 입력해주세요."
          type="password"
          name="password"
          required
          placeholder="8글자 이상 입력해주세요."
        />
        <InputPair
          id="confirm_password"
          label="Confirm Password"
          description="비밀번호를 다시 입력해주세요."
          name="confirm_password"
          required
          type="password"
          placeholder="8글자 이상 다시 입력해주세요."
        />
        <Button
          type="submit"
          className="w-full"
        >
          회원가입
        </Button>
      </Form>
      <AuthButtons />
    </div>
  );
}
