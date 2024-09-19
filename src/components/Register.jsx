import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBgColor, setToastBgColor] = useState("#ffffff");
  const [toastTxtColor, setToastTxtColor] = useState("#222222");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/auth/register", {
        name,
        email,
        password,
      });
      showToastNotification("Registration successful!", "#28a745", "#ffffff");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error registering", error);
      showToastNotification(
        "Registration failed, please try again.",
        "#CC3300",
        "#ffffff"
      );
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
    }, 2000);
  };

  return (
    <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-2-strong"
              style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">
                <div className="d-flex align-items-center mb-5">
                  <Link to="/login" className="me-2">
                    <i className="fas fa-arrow-left"></i>
                  </Link>
                  <h3 className="mt-0 m-auto">Register</h3>
                </div>

                <form onSubmit={handleRegister}>
                  <div className="mb-4 text-start">
                    <label className="form-label" htmlFor="name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="form-control form-control-lg"
                      value={name}
                      placeholder="Jane Doe"
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 text-start">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control form-control-lg"
                      value={email}
                      placeholder="jane.doe@email.com"
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
                    <button
                      className="btn btn-primary btn-lg btn-block"
                      type="submit">
                      Sign Up
                    </button>
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
            zIndex: 1050,
          }}>
          <div className="toast-body fw-bold">{toastMessage}</div>
        </div>
      )}
    </section>
  );
};
