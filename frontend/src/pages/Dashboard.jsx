import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diseases } from '../data/diseases';

const API = import.meta.env.VITE_REACT_API || '';

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const role = localStorage.getItem('role');
  const specialization = localStorage.getItem('specialization');
  const navigate = useNavigate();

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API}/api/tests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTests(data);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleRequestService = async (diseaseName) => {
    const token = localStorage.getItem('token');
    const newTest = {
      testName: `${diseaseName} Test`,
      disease: diseaseName
    };

    try {
      const response = await fetch(`${API}/api/tests`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newTest),
      });
      if (response.ok) {
        alert('Service requested successfully!');
        fetchTests();
      }
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/tests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTests();
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleUpdateResult = async (id, newResult) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/tests/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ result: newResult }),
      });
      fetchTests();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard - {role === 'doctor' ? `Dr. (${specialization})` : 'Patient'}</h2>
      
      {role === 'patient' && (
        <div className="services-section">
          <h3>Available Services</h3>
          <p>Select a service to request a test.</p>
          <div className="services-grid-small">
            {diseases.map(d => (
              <div key={d.name} className="service-card-small">
                <h4>{d.name}</h4>
                <button onClick={() => handleRequestService(d.name)}>Request</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="tests-list">
        <h3>{role === 'doctor' ? 'Patient Requests' : 'Your Requested Services'}</h3>
        {tests.length === 0 ? <p>No records found.</p> : (
          tests.map(test => (
            <div key={test._id} className="test-card">
              <div className="test-header">
                <h4>{test.testName}</h4>
                <span className={`status ${test.result === 'Pending' ? 'pending' : 'done'}`}>
                  {test.result}
                </span>
              </div>
              <p><strong>Disease:</strong> {test.disease}</p>
              <p><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</p>
              {role === 'doctor' && (
                <div className="doctor-actions">
                  <p><strong>Patient:</strong> {test.patient?.username || 'Unknown'}</p>
                  <div className="update-result">
                    <input 
                      type="text" 
                      placeholder="Enter Result & Press Enter" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleUpdateResult(test._id, e.target.value);
                      }}
                    />
                  </div>
                </div>
              )}
              <button onClick={() => handleDelete(test._id)} className="delete-btn">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
