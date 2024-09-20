import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastBgColor, setToastBgColor] = useState("#ffffff");
  const [toastTxtColor, setToastTxtColor] = useState("#222222");

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleCheckboxChange = (e, id) => {
    if (e.target.checked) {
      setSelectedUsers((prev) => [...prev, id]);
    } else {
      setSelectedUsers((prev) => prev.filter((userId) => userId !== id));
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    if (checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const showNotification = (
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

  const handleBlock = async () => {
    const token = localStorage.getItem("token");

    const loggedInUserObject = users.find(
      (user) => user.name === loggedInUser || user.email === loggedInUser
    );

    if (selectedUsers.includes(loggedInUserObject.id)) {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/block/${
          loggedInUserObject.id
        }`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("You are blocked, logging out...");
      setTimeout(() => handleLogout(), 1000);
      return;
    }

    for (const id of selectedUsers) {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/block/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    showNotification("Users blocked");
    await fetchUsers();
  };

  const handleUnblock = async () => {
    const token = localStorage.getItem("token");

    for (const id of selectedUsers) {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/unblock/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    showNotification("Users unblocked", "#198754", "#ffffff");
    await fetchUsers();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const loggedInUserObject = users.find(
      (user) => user.name === loggedInUser || user.email === loggedInUser
    );

    if (selectedUsers.includes(loggedInUserObject.id)) {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/users/${loggedInUserObject.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("You are deleted, logging out...", "#dc3545", "#ffffff");
      setTimeout(() => handleLogout(), 1000);
      return;
    }

    for (const id of selectedUsers) {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    showNotification("Users deleted", "#dc3545", "#ffffff");
    await fetchUsers();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <>
      <nav
        className="navbar bg-dark border-bottom border-body"
        data-bs-theme="dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Logged: {loggedInUser}</span>
          <button className="btn btn-secondary fw-bold" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="container">
        <h3 className="mt-4">User Table</h3>
        <div className="d-flex mt-3" role="group" aria-label="Basic example">
          <button
            className="btn btn-warning me-3"
            onClick={() => handleBlock()}>
            <i className="fas fa-lock me-2"></i>Block
          </button>
          <button
            className="btn btn-success me-3"
            onClick={() => handleUnblock()}>
            <i className="fas fa-unlock me-2"></i>Unblock
          </button>
          <button className="btn btn-danger" onClick={() => handleDelete()}>
            <i className="fas fa-trash-alt me-2"></i>Delete
          </button>
        </div>
        <table className="table table-bordered mt-4">
          <thead className="text-center">
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={handleSelectAll}
                />
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="text-center">
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => handleCheckboxChange(e, user.id)}
                  />
                </td>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.last_login_time)}</td>
                <td>{formatDate(user.registration_time)}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "active" ? "bg-success" : "bg-danger"
                    }`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </>
  );
};
