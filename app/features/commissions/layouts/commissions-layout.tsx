import { Outlet } from 'react-router';

export default function CommissionsLayout() {
  return (
    <div>
      <div></div>
      <div className="grid grid-cols-6">
        <div className="col-span-2 sticky top-0">
          <div></div>
        </div>
        <div className="col-span-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
