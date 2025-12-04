import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_REACT_API || '';

const DoctorDashboard = () => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0
  });
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
        setFilteredTests(data);

        // Calculate statistics
        const pending = data.filter(t => t.result === 'Pending').length;
        const completed = data.filter(t => t.result !== 'Pending').length;
        setStats({
          total: data.length,
          pending,
          completed
        });
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    let filtered = tests;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.patient?.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'pending') {
        filtered = filtered.filter(test => test.result === 'Pending');
      } else if (filterStatus === 'completed') {
        filtered = filtered.filter(test => test.result !== 'Pending');
      }
    }

    setFilteredTests(filtered);
  }, [searchTerm, filterStatus, tests]);

  const handleUpdateResult = async (id, newResult) => {
    if (!newResult || newResult.trim() === '') {
      alert('Please enter a valid result');
      return;
    }

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
      alert('Result updated successfully!');
    } catch (error) {
      console.error('Error updating test:', error);
      alert('Failed to update result');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await fetch(`${API}/api/tests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTests();
      alert('Test deleted successfully!');
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test');
    }
  };

  return (
    <div className="doctor-dashboard">
      <div className="dashboard-header">
        <h2>Doctor Dashboard - <span className="specialization-badge">{specialization}</span></h2>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="controls-section">
        <input
          type="text"
          placeholder="Search patient or test..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <h3>Patient Requests</h3>
      {filteredTests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="requests-grid">
          {filteredTests.map(test => (
            <div key={test._id} className="request-card">
              <div className="request-header">
                <div>
                  <h4>{test.testName}</h4>
                  <p className="patient-name">Patient: {test.patient?.username || 'Unknown'}</p>
                  <p><strong>Disease:</strong> {test.disease}</p>
                  <p><strong>Date:</strong> {new Date(test.date).toLocaleDateString()}</p>
                </div>
                <span className={`status-badge ${test.result === 'Pending' ? 'status-pending' : 'status-completed'}`}>
                  {test.result}
                </span>
              </div>

              <div className="result-input-group">
                <input
                  type="text"
                  placeholder="Enter result"
                  defaultValue={test.result !== 'Pending' ? test.result : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUpdateResult(test._id, e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="result-input"
                />
                <button
                  onClick={(e) => {
                    const input = e.target.previousSibling;
                    handleUpdateResult(test._id, input.value);
                    input.value = '';
                  }}
                  className="update-btn"
                >
                  Update
                </button>
              </div>

              <button onClick={() => handleDelete(test._id)} className="delete-request-btn">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
