import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const UserManagement = () => {
  const apiBase = "http://localhost:7000";
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${apiBase}/get-users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users.",err);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.userPassword.trim()) newErrors.userPassword = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      const { userId, userName, userPassword } = formData;

      const url = userId
        ? `${apiBase}/update-user/${userId}`
        : `${apiBase}/add-user`;
      const method = userId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, userPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Saved successfully");
        setFormData({ userId: "", userName: "", userPassword: "" });
        fetchUsers();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error saving user",err);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      userId: user._id,
      userName: user.userName,
      userPassword: user.userPassword,
    });
    setErrors({});
  };

  const confirmDelete = (userId) => {
    setDeleteUserId(userId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${apiBase}/delete-user/${deleteUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Deleted successfully");
        fetchUsers();
      } else {
        toast.error(data.message || "Failed to delete");
      }
    } catch (err) {
      toast.error("Error deleting user",err);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="mb-3">Add / Update User</h2>
      <input type="hidden" id="userId" value={formData.userId} />

      <div className="mb-3">
        <input
          id="userName"
          className={`form-control ${errors.userName ? "is-invalid" : ""}`}
          placeholder="User Name"
          value={formData.userName}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">{errors.userName}</div>
      </div>

      <div className="mb-3">
        <input
          id="userPassword"
          type="number"
          className={`form-control ${errors.userPassword ? "is-invalid" : ""}`}
          placeholder="Password"
          value={formData.userPassword}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">{errors.userPassword}</div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmit}>
        Save
      </button>

      <h2 className="mt-5">All Users</h2>
      <ul className="list-group mt-3">
        {users.map((user) => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              {user.userName} (Password: {user.userPassword})
            </span>
            <div>
              <button
                className="btn btn-sm btn-info me-2"
                onClick={() => handleEdit(user)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => confirmDelete(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this user?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
