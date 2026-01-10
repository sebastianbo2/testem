import { Link } from "react-router-dom";

export default function Onboarding() {
  return (
    <>
      <div>Onboarding</div>
      <div className="flex flex-col gap-5">
        <Link to="/signup">Sign up</Link>
        <Link to="/login">Login</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </>
  );
}
