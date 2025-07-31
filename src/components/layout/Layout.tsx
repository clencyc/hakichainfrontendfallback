import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
    </div>
  );
};