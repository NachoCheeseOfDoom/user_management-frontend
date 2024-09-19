import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="text-center" style={{ marginTop: "100px" }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/" className="btn btn-primary mt-3">
        Go Home
      </Link>
    </div>
  );
};
