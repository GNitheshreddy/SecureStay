import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CSS/student.css';
import Sidebar from '../components/Sidebar';

function About() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    course: '',
    dateOfBirth: '',
    admissionDate: '',
    address: '',
    gender: '',
  });

  const [showStudentDetails, setShowStudentDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/students');
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const deleteStudent = (id) => {
    fetch(`http://localhost:8080/api/students/${id}`, {  
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          setStudents(students.filter((student) => student.id !== id));
        } else {
          throw new Error('Error: ' + response.status);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const editStudent = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:8080/api/students/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        fetchStudents();
        setFormData({
          id: '',
          name: '',
          email: '',
          phone: '',
          course: '',
          dateOfBirth: '',
          admissionDate: '',
          address: '',
          gender: '',
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Sidebar>
        <div className="toggle-button">
          <button onClick={() => setShowStudentDetails(!showStudentDetails)}>
            {showStudentDetails ? 'Add Students' : 'View Students'}
          </button>
        </div>

        {showStudentDetails ? (
          <div>
            <h2 style={{ textAlign: 'center' }}>Student Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Reg No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Date of Birth</th>
                  <th>Admission Date</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.course}</td>
                    <td>{student.dateOfBirth}</td>
                    <td>{student.admissionDate}</td>
                    <td>{student.address}</td>
                    <td>{student.gender}</td>
                    <td>
                      <button className="btn" onClick={() => deleteStudent(student.id)}>Delete</button>
                      <button onClick={() => editStudent(student)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="all">
            <div className="fcontainer">
              <div className="title">ADD STUDENTS</div>
              <div className="content">
                <form onSubmit={handleSubmit}>
                  <div className="user-details">
                    {Object.keys(formData).map((key) => (
                      <div className="input-box" key={key}>
                        <span className="details">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input
                          type="text"
                          name={key}
                          placeholder={`Enter ${key}`}
                          value={formData[key]}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  <div className="button">
                    <input type="submit" value="Register" />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </Sidebar>
    </>
  );
}

export default About;
