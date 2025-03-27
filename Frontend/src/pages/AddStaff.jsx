import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const fetchStaffData = () => {
    fetch("http://localhost:8080/signup/getall")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched staff data:", data);
        setStaffList(data);
      })
      .catch((error) => console.error("Error fetching staff:", error));
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleAddClick = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEditClick = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDeleteClick = (staffId) => {
    fetch(`http://localhost:8080/signup/delete/${staffId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchStaffData();
        } else {
          throw new Error(`Delete failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Delete error:", error);
        alert("Failed to delete staff member");
      });
  };

  const handleFormSubmit = (staffData) => {
    const url = editingStaff
      ? `http://localhost:8080/signup/update/${editingStaff.id}`
      : "http://localhost:8080/signup/post";

    const method = editingStaff ? "PUT" : "POST";

    const payload = {
      name: staffData.name,
      username: staffData.username,
      phoneNumber: staffData.phoneNumber,
      email: staffData.email,
      password: staffData.password,
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      })
      .then(() => {
        console.log("Staff data saved successfully");
        fetchStaffData();
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Save error:", error);
        alert(`Failed to save staff data: ${error.message}`);
      });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Staff Management</h1>

      <NavLink to={"/"}>
        <button 
          style={{ 
            marginBottom: "20px",
            backgroundColor: "#ff4444",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          LOG OUT
        </button>
      </NavLink>

      <button 
        onClick={handleAddClick} 
        style={{ 
          marginBottom: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Add Staff
      </button>

      {showForm && (
        <StaffForm
          staff={editingStaff}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <StaffTable
        staffList={staffList}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
    </div>
  );
};

const StaffTable = ({ staffList, onEdit, onDelete }) => {
  return (
    <table border="1" style={{ width: "100%", marginTop: "20px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Username</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Password</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staffList.map((staff) => (
          <tr key={staff.id}>
            <td>{staff.name}</td>
            <td>{staff.username}</td>
            <td>{staff.phoneNumber}</td>
            <td>{staff.email}</td>
            <td>{staff.password}</td>
            <td>
              <button
                onClick={() => onEdit(staff)}
                style={{ 
                  marginRight: "10px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(staff.id)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "8px 15px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const StaffForm = ({ staff, onSubmit, onCancel }) => {
  const [name, setName] = useState(staff ? staff.name : "");
  const [username, setUsername] = useState(staff ? staff.username : "");
  const [phoneNumber, setPhoneNumber] = useState(staff ? staff.phoneNumber : "");
  const [email, setEmail] = useState(staff ? staff.email : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    const namePattern = /^[A-Za-z\s]+$/;
    if (!name.trim()) newErrors.name = "Name is required";
    else if (!name.match(namePattern)) newErrors.name = "Name can only contain letters and spaces";

    if (!username.trim()) newErrors.username = "Username is required";

    const phonePattern = /^[0-9]{10}$/;
    if (!phoneNumber.match(phonePattern)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    const emailPattern = /^[a-zA-Z][a-zA-Z0-9._%+-]*@(gmail\.com|yahoo\.com)$/;
    if (!email.match(emailPattern)) {
      newErrors.email = "Invalid email format";
    }

    const passwordRegex = /^\d{6}$/;
    if (!password.match(passwordRegex)) {
      newErrors.password = "Password must be 6 digits";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const staffData = { name, username, phoneNumber, email, password };
      onSubmit(staffData);
    }
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit} className="popup-form">
        <div
          style={{
            display: "grid",
            gap: "15px",
            padding: "30px",
            width: "700px",
            maxWidth: "90%",
            margin: "0 auto",
          }}
        >
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}

          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {errors.phoneNumber && <p style={{ color: "red" }}>{errors.phoneNumber}</p>}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword}</p>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button 
              type="submit"
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Save
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffManagementPage;