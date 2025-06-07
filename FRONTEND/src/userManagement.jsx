import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//User Management
const UserManagement = () => {
  const apiBase = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    userPassword: "",
    userImage: null,
  });


  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/get-users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, userImage: file }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    if (!formData.userEmail.trim()) newErrors.userEmail = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.userEmail)) newErrors.userEmail = "Please enter a valid email";
    if (!formData.userPassword.trim()) newErrors.userPassword = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendConfirmationEmail = async (email, username) => {
    try {
      const res = await fetch(`${apiBase}/send-mail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: `Welcome to Our App, ${username}!`,
          html: `
            <div>
              <h1>Welcome, ${username}!</h1>
              <p>Your account has been successfully created.</p>
              <p>Email: ${email}</p>
            </div>
          `,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Confirmation email sent!");
      } else {
        toast.error(data.message || "Failed to send email");
      }
    } catch (err) {
      toast.error("Error sending email: " + err.message);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix validation errors.");
      return;
    }

    setIsLoading(true);
    try {
      const form = new FormData();
      form.append("userName", formData.userName);
      form.append("userEmail", formData.userEmail);
      form.append("userPassword", formData.userPassword);
      if (formData.userImage) {
        form.append("userImage", formData.userImage);
      }

      const url = formData.userId
        ? `${apiBase}/update-user/${formData.userId}`
        : `${apiBase}/add-user`;
      const method = formData.userId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: form,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Saved successfully");
        if (!formData.userId) {
          await sendConfirmationEmail(formData.userEmail, formData.userName);
        }
        setFormData({ userId: "", userName: "", userEmail: "", userPassword: "", userImage: null });
        fetchUsers();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error saving user: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      userId: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      userPassword: "",
      userImage: null,
    });
    setErrors({});
  };

  const confirmDelete = (userId) => {
    setDeleteUserId(userId);
    setShowModal(true);
  };

  const handleDelete = async () => {
    setIsLoading(true);
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
      toast.error("Error deleting user: " + err.message);
    } finally {
      setShowModal(false);
      setIsLoading(false);
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
          id="userEmail"
          className={`form-control ${errors.userEmail ? "is-invalid" : ""}`}
          placeholder="Email"
          value={formData.userEmail}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">{errors.userEmail}</div>
      </div>

      <div className="mb-3">
        <input
          id="userPassword"
          type="password"
          className={`form-control ${errors.userPassword ? "is-invalid" : ""}`}
          placeholder="Password"
          value={formData.userPassword}
          onChange={handleInputChange}
        />
        <div className="invalid-feedback">{errors.userPassword}</div>
      </div>

      <div className="mb-3">
        <input type="file" accept="image/*" className="form-control" onChange={handleFileChange} />
      </div>

      <button className="btn btn-primary" onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>

      <h2 className="mt-5">All Users</h2>
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="list-group mt-3">
          {users.map((user) => {
            const imageUrl = user.userImage ? `${apiBase}/public/userImages/${user.userImage}` : null;
            console.log(`Image URL for ${user.userName}: ${imageUrl}`);
            return (
              <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{user.userName}</strong> ({user.userEmail})
                  {imageUrl ? (
                    <div>
                      <img
                        src={imageUrl}
                        alt="User"
                        style={{ width: "50px", height: "50px", objectFit: "cover", marginLeft: "10px" }}
                        onError={(e) => console.error(`Failed to load image for ${user.userName}: ${imageUrl}`,e)}
                      />
                    </div>
                  ) : (
                    <div>No image available</div>
                  )}
                </div>
                <div>
                  <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => confirmDelete(user._id)}>
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {showModal && (
        <>
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog">
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
                  <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isLoading}>
                    {isLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default UserManagement;