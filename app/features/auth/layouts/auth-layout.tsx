import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="flex flex-col max-w-1/2 p-20 mx-auto border-md shadow-2xl rounded-md">
        <Outlet />
      </div>
    </div>
  );
}
