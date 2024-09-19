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
  const [toastMessage, setToastMessage] = useState(""); // For toast message
  const [showToast, setShowToast] = useState(false); // To control toast visibility

  // Extract fetchUsers outside of useEffect to make it reusable
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user"); // Assume the username or email is stored
    if (!token) {
      navigate("/login");
      return;
    }
    setLoggedInUser(user); // No need to convert to number if it's a string (like username)

    const response = await axios.get("http://localhost:3000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleBlock = async () => {
    const token = localStorage.getItem("token");

    // Check if the logged-in user is being blocked by comparing the username or email
    const loggedInUserObject = users.find(
      (user) => user.name === loggedInUser || user.email === loggedInUser
    );

    // Ensure that the logged-in user gets blocked before logging out
    if (selectedUsers.includes(loggedInUserObject.id)) {
      // Block the logged-in user first
      await axios.post(
        `http://localhost:3000/users/block/${loggedInUserObject.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show notification and log out after blocking
      showNotification("You are blocked, logging out...");
      setTimeout(() => handleLogout(), 1000); // Log out after showing the toast for 1 second
      return; // No need to proceed with the rest
    }

    // Block other selected users
    for (const id of selectedUsers) {
      await axios.post(
        `http://localhost:3000/users/block/${id}`,
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
        `http://localhost:3000/users/unblock/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    showNotification("Users unblocked");
    await fetchUsers();
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    // Check if the logged-in user is being deleted
    const loggedInUserObject = users.find(
      (user) => user.name === loggedInUser || user.email === loggedInUser
    );

    if (selectedUsers.includes(loggedInUserObject.id)) {
      // Delete the logged-in user first
      await axios.delete(
        `http://localhost:3000/users/${loggedInUserObject.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Show notification and log out after deletion
      showNotification("You are deleted, logging out...");
      setTimeout(() => handleLogout(), 1000); // Log out after showing the toast for 1 second
      return; // No need to proceed with the rest
    }

    // Delete other selected users
    for (const id of selectedUsers) {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    showNotification("Users deleted");
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
        <div className="btn-group" role="group" aria-label="Basic example">
          <button
            className="btn btn-warning mt-3"
            onClick={() => handleBlock()}>
            Block
          </button>
          <button
            className="btn btn-success mt-3"
            onClick={() => handleUnblock()}>
            Unblock
          </button>
          <button
            className="btn btn-danger mt-3"
            onClick={() => handleDelete()}>
            Delete
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
          className="toast show position-fixed bottom-0 end-0 m-4"
          role="alert"
          style={{ width: "210px", textAlign: "center" }}>
          <div className="toast-body fw-bold">{toastMessage}</div>
        </div>
      )}
    </>
  );
};
