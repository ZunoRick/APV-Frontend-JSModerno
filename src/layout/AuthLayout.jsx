import { Outlet, Navigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const AuthLayout = () => {
  const { auth } = useAuth();

  return (
    <>
      <div className="py-12 flex items-center">
        <main className="container mx-auto md:grid md:grid-cols-2 gap-12 mt-10 p-5 items-center md:align-middle">
          {auth._id ? 
            <Navigate to='/admin' /> : 
            <Outlet />
          }
        </main>
      </div>
    </>
  )
}

export default AuthLayout;
