import React, { useState, useEffect } from 'react';
import './HealthReport.css';
import heartRateData from '../assets/heart-rate.json';
import Chart from 'chart.js/auto';

const HealthReport = () => {
  const [activeTab, setActiveTab] = useState('Heart Rate');
  const [previousMonth, setPreviousMonth] = useState('');
  const [averageHeartRates, setAverageHeartRates] = useState([]);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const getPreviousMonth = () => {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    };

    setPreviousMonth(getPreviousMonth());
  }, []);

  useEffect(() => {
    // Filter data for the month of April
    const aprilData = heartRateData.filter(entry => entry.Date.startsWith('2024-04'));

    // Calculate average heart rate for each day
    const averageRates = aprilData.map(entry => {
      const heartRates = Object.values(entry).slice(1); // Exclude the Date property
      const sum = heartRates.reduce((acc, val) => acc + val, 0);
      const avg = sum / heartRates.length;
      return { Date: entry.Date, AverageHeartRate: avg.toFixed(2) };
    });

    setAverageHeartRates(averageRates);
    setShowChart(true); // Show the chart when data is loaded
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Heart Rate') {
      setShowChart(true);
    } else {
      setShowChart(false);
    }
  };

  useEffect(() => {
    if (showChart) {
      updateChart(averageHeartRates);
    }
  }, [averageHeartRates, showChart]);

  const updateChart = (data) => {
    const labels = data.map(entry => entry.Date);
    const heartRates = data.map(entry => entry.AverageHeartRate);

    const ctx = document.getElementById('heartRateChart');
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Average Heart Rate',
          data: heartRates,
          borderColor: 'rgb(75, 192, 192)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Beats per Minute' // Label for the y-axis
              }
          }
        }
      }
    });
  };

  return (
    <div className="HealthReport">
      <h1>{previousMonth} Health Report</h1>
      <nav className="tab-nav">
        <ul>
          <li className={activeTab === 'Heart Rate' ? 'active' : ''} onClick={() => handleTabChange('Heart Rate')}>Heart Rate</li>
          <li className={activeTab === 'Weight' ? 'active' : ''} onClick={() => handleTabChange('Weight')}>Weight</li>
          <li className={activeTab === 'Diet' ? 'active' : ''} onClick={() => handleTabChange('Diet')}>Diet</li>
          <li className={activeTab === 'Exercise' ? 'active' : ''} onClick={() => handleTabChange('Exercise')}>Exercise</li>
          <li className={activeTab === 'Risk Analysis' ? 'active' : ''} onClick={() => handleTabChange('Risk Analysis')}>Risk Analysis</li>
        </ul>
      </nav>
      <div className="tab-content">
        {activeTab === 'Heart Rate' && (
          <>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Average Heart Rate (BPM)</th>
                  </tr>
                </thead>
                <tbody>
                  {averageHeartRates.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.Date}</td>
                      <td>{entry.AverageHeartRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showChart && <canvas id="heartRateChart"></canvas>}
          </>
        )}
        {activeTab === 'Weight' && <div>Weight Content</div>}
        {activeTab === 'Diet' && <div>Diet Content</div>}
        {activeTab === 'Exercise' && <div>Exercise Content</div>}
        {activeTab === 'Risk Analysis' && <div>Risk Analysis Content</div>}
      </div>
    </div>
  );
};

export default HealthReport;