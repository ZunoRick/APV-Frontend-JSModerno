import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <div className="py-12 flex items-center">
        <main className="container mx-auto md:grid md:grid-cols-2 gap-12 mt-10 p-5 items-center md:align-middle">
          <Outlet />
        </main>
      </div>
    </>
  )
}

export default AuthLayout;
