import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastBgColor, setToastBgColor] = useState("#ffffff");
  const [toastTxtColor, setToastTxtColor] = useState("#222222");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", user.name);
        navigate("/dashboard");
      } else {
        showToastNotification("Incorrect credentials.", "#fff", "#CC3300");
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        showToastNotification("User is blocked", "#CC3300", "#ffffff");
        console.error(error.response);
      } else {
        showToastNotification("Incorrect credentials.", "#fff", "#CC3300");
      }
    }
  };

  const showToastNotification = (
    message,
    bgColor = "#ffffff",
    txtColor = "#222222"
  ) => {
    setToastMessage(message);
    setToastBgColor(bgColor);
    setToastTxtColor(txtColor);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-2-strong"
              style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center ">
                <h3 className="mb-3">Sign in</h3>

                <form onSubmit={handleLogin}>
                  <div className="mb-4 text-start">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="user@email.com"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 text-start">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="********"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg " type="submit">
                      Login
                    </button>
                  </div>
                  <div>
                    <p className="mt-5">
                      {"Don't have an account? "}
                      <Link to="/register" className="fw-bold">
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div
          className="toast show position-fixed top-0 start-50 translate-middle-x m-4"
          role="alert"
          style={{
            backgroundColor: toastBgColor,
            color: toastTxtColor,
            width: "210px",
            textAlign: "center",
          }}>
          <div className="toast-body fw-bold">{toastMessage}</div>
        </div>
      )}
    </section>
  );
};
