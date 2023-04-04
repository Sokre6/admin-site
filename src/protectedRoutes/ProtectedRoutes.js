import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ userRoles, redirectPath = "/", children }) => {
  const grantedUser = useSelector((state) => state.roles.userRoles);

  if (userRoles.length === 0 || undefined) {
    return <Navigate to={redirectPath} replace />;
  } else {
    return userRoles.some((role) => grantedUser?.includes(role)) ? (
      <Outlet />
    ) : (
      <Navigate to={redirectPath} replace />
    );
  }
};

export default ProtectedRoutes;
