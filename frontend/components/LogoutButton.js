import { useContext } from "react";
import AuthContext from "@/hooks/Auth";

const LogoutButton = () => {
  const { logoutUser } = useContext(AuthContext);

  const handleLogout = () => {
    logoutUser();
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
