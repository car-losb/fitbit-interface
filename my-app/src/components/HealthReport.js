import React, { useState, useEffect } from 'react';
import './HealthReport.css';
import heartRateData from '../assets/heart-rate.json';
import weightData from '../assets/weight-sleep.json';
import calorieData from '../assets/calories.json'; 
import Chart from 'chart.js/auto';

const HealthReport = () => {
  const [activeTab, setActiveTab] = useState('Heart Rate');
  const [previousMonth, setPreviousMonth] = useState('');
  const [averageHeartRates, setAverageHeartRates] = useState([]);
  const [averageWeights, setAverageWeights] = useState([]);
  const [weightChange, setWeightChange] = useState([]);
  const [showHeartRateChart, setShowHeartRateChart] = useState(false);
  const [showWeightChart, setShowWeightChart] = useState(false);
  const [showWeightChangeChart, setShowWeightChangeChart] = useState(false); // New state
  const [caloriesData, setCaloriesData] = useState([]);
  const [showCaloriesChart, setShowCaloriesChart] = useState(false);

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
    // Filter heart rate data for the month of April
    const aprilHeartRateData = heartRateData.filter(entry => entry.Date.startsWith('2024-04'));
    // Filter weight data for the month of April
    const aprilWeightData = weightData.filter(entry => entry.Date.startsWith('2024-04'));

    const aprilCaloriesData = calorieData.filter(entry => entry.Date.startsWith('2024-04'));

    // Calculate average heart rate for each day
    const averageHeartRates = aprilHeartRateData.map(entry => {
      const heartRates = Object.values(entry).slice(1); // Exclude the Date property
      const sum = heartRates.reduce((acc, val) => acc + val, 0);
      const avg = sum / heartRates.length;
      return { Date: entry.Date, AverageHeartRate: avg.toFixed(2) };
    });

    setAverageHeartRates(averageHeartRates);
    setShowHeartRateChart(true); // Show the heart rate chart when data is loaded

    // Calculate average weight and weight change for each week
    const averageWeights = [];
    const weightChange = [];
    let sum = 0;
    let count = 0;
    let weekStartDate = '';

    aprilWeightData.forEach((entry, index) => {
      if (count === 0) {
        weekStartDate = entry.Date;
      }

      sum += entry.Weight;
      count++;

      if (count === 7 || index === aprilWeightData.length - 1) {
        const avgWeight = sum / count;
        averageWeights.push({ Date: weekStartDate, AverageWeight: avgWeight.toFixed(2) });

        // Calculate weight change
        if (averageWeights.length >= 2) {
          const lastWeekWeight = averageWeights[averageWeights.length - 2].AverageWeight;
          const currentWeekWeight = averageWeights[averageWeights.length - 1].AverageWeight;
          const change = currentWeekWeight - lastWeekWeight;
          weightChange.push({ Date: weekStartDate, WeightChange: change.toFixed(2) });
        }

        // Reset variables for the next week
        sum = 0;
        count = 0;
        weekStartDate = '';
      }
    });

    setAverageWeights(averageWeights);
    setShowWeightChart(true); // Show the weight chart when data is loaded
    setWeightChange(weightChange);
    setShowWeightChangeChart(true); // Show the weight change chart when data is loaded

    const totalCaloriesPerDay = {};
  aprilCaloriesData.forEach(entry => {
    const date = entry.Date;
    let totalCalories = 0;
    Object.keys(entry).forEach(key => {
      if (key !== "Date" && entry[key] !== "") {
        totalCalories += parseInt(entry[key]);
      }
    });
    totalCaloriesPerDay[date] = totalCalories;
  });

  const caloriesArray = Object.keys(totalCaloriesPerDay).map(date => ({
    Date: date,
    TotalCalories: totalCaloriesPerDay[date],
  }));

  setCaloriesData(caloriesArray);
  setShowCaloriesChart(true);
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Heart Rate') {
      setShowHeartRateChart(true);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(false);
    } else if (tabName === 'Weight') {
      setShowHeartRateChart(false);
      setShowWeightChart(true);
      setShowWeightChangeChart(true);
      setShowCaloriesChart(false);
    } else if (tabName === 'Calories') {
      setShowHeartRateChart(false);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(true);
    } else {
      setShowHeartRateChart(false);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(false);
    }
  };

  useEffect(() => {
    if (showHeartRateChart) {
      updateChart('heartRateChart', averageHeartRates, 'Average Heart Rate (BPM)');
    } else if (showWeightChart) {
      updateChart('weightChart', averageWeights, 'Average Weight (lbs)');
      updateWeightChangeChart('weightChangeChart', weightChange, 'Weight Change (lbs)');
    } else if (showCaloriesChart) {
      updateCaloriesChart('caloriesChart', caloriesData, 'Total Calories Consumed');
    }
  }, [averageHeartRates, averageWeights, weightChange, caloriesData, showHeartRateChart, showWeightChart, showWeightChangeChart, showCaloriesChart]);

  const updateChart = (chartId, data, label) => {
    const labels = data.map(entry => entry.Date);
    const values = data.map(entry => entry.AverageHeartRate || entry.AverageWeight);

    const ctx = document.getElementById(chartId);
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
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
              text: label.endsWith('(BPM)') ? 'Beats per Minute' : 'Pounds' // Label for the y-axis
            }
          }
        }
      }
    });
  };

  const updateWeightChangeChart = (chartId, data, label) => {
    const labels = data.map(entry => entry.Date);
    const values = data.map(entry => entry.WeightChange);

    const ctx = document.getElementById(chartId);
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          borderColor: 'rgb(255, 99, 132)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Weight Change (lbs)'
            }
          }
        }
      }
    });
  };

  const updateCaloriesChart = (chartId, data, label) => {
    const labels = data.map(entry => entry.Date);
    const values = data.map(entry => entry.TotalCalories);

    const ctx = document.getElementById(chartId);
    const existingChart = Chart.getChart(ctx);

    if (existingChart) {
      existingChart.destroy();
    }

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: values,
          borderColor: 'rgb(255, 159, 64)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Calories Consumed'
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
          <li className={activeTab === 'Calories' ? 'active' : ''} onClick={() => handleTabChange('Calories')}>Calories</li>
          <li className={activeTab === 'Exercise' ? 'active' : ''} onClick={() => handleTabChange('Exercise')}>Exercise</li>
          <li className={activeTab === 'Risk Analysis' ? 'active' : ''} onClick={() => handleTabChange('Risk Analysis')}>Risk Analysis</li>
        </ul>
      </nav>
      <div className="tab-content">
        {activeTab === 'Heart Rate' && (
          <div className="heart-rate-wrapper">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Average Heart Rate</th>
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
            {showHeartRateChart && <canvas id="heartRateChart"></canvas>}
          </div>
        )}
        {activeTab === 'Weight' && (
          <div className="weight-wrapper">
            <div className="weight-tables-wrapper">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Average Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {averageWeights.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.Date}</td>
                        <td>{entry.AverageWeight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weightChange.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.Date}</td>
                        <td>{entry.WeightChange}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showWeightChart && <canvas id="weightChart"></canvas>}
            {showWeightChangeChart && <canvas id="weightChangeChart"></canvas>}
          </div>
        )}
        {activeTab === 'Calories' && (
          <div className="calories-wrapper">
          <div className="table-and-chart-container">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Calories Consumed</th>
                  </tr>
                </thead>
                <tbody>
                  {caloriesData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.Date}</td>
                      <td>{entry.TotalCalories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showCaloriesChart && <canvas id="caloriesChart"></canvas>}
          </div>
        </div>
        )}
        {activeTab === 'Exercise' && <div>Exercise Content</div>}
        {activeTab === 'Risk Analysis' && <div>Risk Analysis Content</div>}
      </div>
    </div>
  );
};

export default HealthReport;  
