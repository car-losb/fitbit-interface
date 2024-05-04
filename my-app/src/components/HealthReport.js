import React, { useState, useEffect } from 'react';
import './HealthReport.css';
import heartRateData from '../assets/heart-rate.json';
import weightData from '../assets/weight-sleep.json';
import calorieData from '../assets/calories.json'; 
import exerciseData from '../assets/exercise.json';
import waterData from '../assets/water.json';

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
  const [exerciseTableData, setExerciseTableData] = useState([]);
  const [showExerciseChart, setShowExerciseChart] = useState(false);
  const [includeWeightVisuals, setIncludeWeightVisuals] = useState(true); // State for weight chart toggle
  const [includeVisuals, setIncludeVisuals] = useState(true); 
  const [includeDietVisuals, setIncludeDietVisuals] = useState(true); 
  const [includeWeightChangeVisuals, setIncludeWeightChangeVisuals] = useState(true);
  const [includeExerciseVisuals, setIncludeExerciseVisuals] = useState(true);
  const [includeExercise, setIncludeExercise] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);

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
  
    const aprilExerciseData = exerciseData.filter(entry => entry.Date.startsWith('2024-04'));
  
    // Calculate total water consumed per day
    const totalWaterPerDay = {};
    waterData.forEach(entry => {
    const date = entry.Date;
    let totalWater = 0;
    // Sum up the values for each hour of the day
    Object.values(entry).forEach(val => {
    if (val !== '' && val !== date) { // Exclude empty values and the Date property
      totalWater += val;
    }
    });
    totalWaterPerDay[date] = totalWater;
    });

    const totalCaloriesPerDay = {};
  calorieData.forEach(entry => {
    const date = entry.Date;
    let totalCalories = 0;
    // Sum up the values for each hour of the day
    Object.values(entry).forEach(val => {
      if (val !== '' && val !== date) { // Exclude empty values and the Date property
        totalCalories += parseInt(val);
      }
    });
    totalCaloriesPerDay[date] = totalCalories;
  });

  // Combine total calories, total water consumption, and other data
  const combinedData = aprilCaloriesData.map(entry => ({
    Date: entry.Date,
    TotalCalories: totalCaloriesPerDay[entry.Date] || 0, // Add total calories consumed per day
    TotalWaterConsumed: totalWaterPerDay[entry.Date] || 0 // Add total water consumed per day
  }));

  setCaloriesData(combinedData);
  setShowCaloriesChart(true);
  
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
  
    const averageKmData = [];
    let sumKmWalked = 0;
    let sumKmSwam = 0;
    count = 0;
  
    aprilExerciseData.forEach((entry, index) => {
      sumKmWalked += entry["Km Walked"];
      sumKmSwam += entry["Km Swam"];
      count++;
  
      if (count === 7 || index === aprilExerciseData.length - 1) {
        const avgKmWalked = sumKmWalked / count;
        const avgKmSwam = sumKmSwam / count;
        const weekStartDate = entry.Date;
  
        averageKmData.push({
          Date: weekStartDate,
          AverageKmWalked: avgKmWalked.toFixed(2),
          AverageKmSwam: avgKmSwam.toFixed(2)
        });
  
        // Reset variables for the next week
        sumKmWalked = 0;
        sumKmSwam = 0;
        count = 0;
      }
    });
  
    // Set exercise table data
    setExerciseTableData(averageKmData);
    setShowExerciseChart(true);
  }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Heart Rate') {
      setShowHeartRateChart(true);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(false);
      setShowExerciseChart(false);
    } else if (tabName === 'Weight') {
      setShowHeartRateChart(false);
      setShowWeightChart(true);
      setShowWeightChangeChart(true);
      setShowCaloriesChart(false);
      setShowExerciseChart(false);
    } else if (tabName === 'Diet') {
      setShowHeartRateChart(false);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(true);
      setShowExerciseChart(false);
    } else if (tabName === 'Exercise') {
      setShowHeartRateChart(false);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(false);
      setShowExerciseChart(true);
    } else {
      setShowHeartRateChart(false);
      setShowWeightChart(false);
      setShowWeightChangeChart(false);
      setShowCaloriesChart(false);
      setShowExerciseChart(false);
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
    } else if (showExerciseChart) { // Update exercise chart if exercise tab is active
      updateExerciseChart('exerciseChart', exerciseTableData, 'Average Distance Walked and Swam');
    }
  }, [averageHeartRates, averageWeights, weightChange, caloriesData, exerciseTableData, showHeartRateChart, showWeightChart, showWeightChangeChart, showCaloriesChart, showExerciseChart]); 

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
    const caloriesValues = data.map(entry => entry.TotalCalories);
    const waterValues = data.map(entry => entry.TotalWaterConsumed);
  
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
          label: 'Total Calories Consumed',
          data: caloriesValues,
          borderColor: 'rgb(255, 159, 64)',
          yAxisID: 'calories',
          fill: false
        },
        {
          label: 'Total Water Consumed (oz)',
          data: waterValues,
          borderColor: 'rgb(75, 192, 192)',
          yAxisID: 'water',
          fill: false
        }]
      },
      options: {
        scales: {
          calories: {
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Calories Consumed',
              color: 'rgb(255, 159, 64)'
            },
            id: 'calories'}, 
            water: {
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Water Consumed (oz)',
              color: 'rgb(75, 192, 192)'
            },
            id: 'water',
            max: 200
            }
        }
      }
    });
  };

  const updateExerciseChart = (chartId, data, label) => {
    const labels = data.map(entry => entry.Date);
    const valuesWalked = data.map(entry => entry.AverageKmWalked);
    const valuesSwam = data.map(entry => entry.AverageKmSwam);

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
          label: 'Average Km Walked/Run',
          data: valuesWalked,
          borderColor: 'rgb(54, 162, 235)',
          fill: false
        },
        {
          label: 'Average Km Swam',
          data: valuesSwam,
          borderColor: 'rgb(255, 205, 86)',
          fill: false
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Kilometers'
            }
          }
        }
      }
    });
  };

  const checkHeartRateStatus = () => {
    const averageHeartRatesArray = averageHeartRates.map(entry => parseFloat(entry.AverageHeartRate));
    const above90 = averageHeartRatesArray.some(rate => rate > 90);
    const below60 = averageHeartRatesArray.some(rate => rate < 60);
    
    return above90 || below60 ? 'red' : 'green';
  };

  const checkPhysicalActivityStatus = () => {
    const kmDataArray = exerciseTableData.map(entry => parseFloat(entry.AverageKmWalked) + parseFloat(entry.AverageKmSwam));
    const below5_6 = kmDataArray.some(sum => sum < 5.6);
  
    return below5_6 ? 'red' : 'green';
  };

  const handleIncludeWeightVisualsToggle = () => {
    setIncludeWeightVisuals(!includeWeightVisuals); // Toggle the state for weight chart
  };

  const handleIncludeVisualsToggle = () => {
    setIncludeVisuals(!includeVisuals); // Toggle the state
  };

  const handleIncludeDietVisualsToggle = () => {
    setIncludeDietVisuals(!includeDietVisuals); // Toggle the state for diet chart
  };

  const handleIncludeWeightChangeVisualsToggle = () => {
    setIncludeWeightChangeVisuals(!includeWeightChangeVisuals);
  };

  const handleIncludeExerciseVisualsToggle = () => {
    setIncludeExerciseVisuals(!includeExerciseVisuals);
  };

  const handleIncludeExerciseToggle = () => {
    setIncludeExercise(!includeExercise);
  };

  const handleIncludeInsightsToggle = () => {
    setIncludeInsights(!includeInsights);
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
            <div className="options-section">
            <h2>Information</h2>
            <label>
              Include Visuals:
              <input
                type="checkbox"
                checked={includeVisuals}
                onChange={handleIncludeVisualsToggle}
              />
            </label>
          </div>
          {includeVisuals ? (
              <canvas id="heartRateChart"></canvas>
            ) : (
              <canvas id="heartRateChart" className="transparent-chart"></canvas>
            )}
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
              <div className={`table-container ${includeWeightChangeVisuals ? '' : 'transparent-border'}`}>
                <table>
                  <thead>
                    <tr>
                    <th className={includeWeightChangeVisuals ? "" : "transparent-header"}>Date</th>
                    <th className={includeWeightChangeVisuals ? "" : "transparent-header"}>Weight Change</th>
                    </tr>
                  </thead>
                  <tbody>
                  {includeWeightChangeVisuals && weightChange.map((entry, index) => (
                <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.WeightChange}</td>
                </tr>
                ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="options-section">
                <h2>Information</h2>
                <label>
                Include Visuals:
                <input
                  type="checkbox"
                  checked={includeWeightVisuals}
                  onChange={handleIncludeWeightVisualsToggle}
                />
              </label>
              <label>
                Include Weight Change:
                <input
                type="checkbox"
                checked={includeWeightChangeVisuals}
                onChange={handleIncludeWeightChangeVisualsToggle}
                />
            </label>
            </div>
            {includeWeightVisuals ? (
              <canvas id="weightChart"></canvas>
            ) : (
              <canvas id="weightChart" className="transparent-chart"></canvas>
            )}
            {/* Weight Change Chart with conditional class */}
            {includeWeightVisuals && includeWeightChangeVisuals ? (
              <canvas id="weightChangeChart"></canvas>
            ) : (
              <canvas id="weightChangeChart" className="transparent-chart"></canvas>
            )}
          </div>
        )}
         {activeTab === 'Diet' && (
  <div className="calories-wrapper">
    <div className="table-and-chart-container">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Calories Consumed</th>
              <th>Water Consumed (oz)</th> {/* Add a new column header for water consumption */}
            </tr>
          </thead>
          <tbody>
            {caloriesData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.TotalCalories}</td>
                <td>{entry.TotalWaterConsumed}</td> {/* Display total water consumed in ounces */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="options-section">
              <h2>Information</h2>
              <label>
                Include Visuals:
                <input
                  type="checkbox"
                  checked={includeDietVisuals}
                  onChange={handleIncludeDietVisualsToggle}
                />
              </label>
            </div>
            {includeDietVisuals ? (
              <canvas id="caloriesChart"></canvas>
            ) : (
              <canvas id="caloriesChart" className="transparent-chart"></canvas>
            )}
    </div>
  </div>
)}
        {activeTab === 'Exercise' && (
        <div className="exercise-wrapper">
        <div className="exercise-content">
        <div className={`table-container ${includeExercise ? '' : 'transparent-border'}`}>
            <table>
            <thead>
                <tr>
                    <th className={includeExercise ? "" : "transparent-header"}>Week</th>
                    <th className={includeExercise ? "" : "transparent-header"}>Average Km Walked</th>
                    <th className={includeExercise ? "" : "transparent-header"}>Average Km Swam</th>
                </tr>
            </thead>
            <tbody>
                {includeExercise && exerciseTableData.map((entry, index) => (
                    <tr key={index}>
                    <td>{entry.Date}</td>
                    <td>{entry.AverageKmWalked}</td>
                    <td>{entry.AverageKmSwam}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
        <div className="options-section">
                <h2>Information</h2>
                <label>
          Include Visuals:
          <input
            type="checkbox"
            checked={includeExerciseVisuals}
            onChange={handleIncludeExerciseVisualsToggle}
          />
        </label>
        <label>
          Include Exercise:
          <input
            type="checkbox"
            checked={includeExercise}
            onChange={handleIncludeExerciseToggle}
          />
        </label>
            </div>
            {includeExerciseVisuals && includeExercise ? (
              <div className="exercise-chart">
              <canvas id="exerciseChart"></canvas>
            </div>
            ) : (
                <div className="transparent-chart">
            <canvas id="exerciseChart"></canvas>
        </div>
            )}
        </div>
        )}
        {activeTab === 'Risk Analysis' && (
    <div className="risk-analysis-wrapper">
    {includeInsights && (
    <div>
    <div className={`risk-analysis-textbox ${checkHeartRateStatus()}`}>
      {checkHeartRateStatus() === 'red' ? (
        <p>The patient does not meet benchmark heart rate standards.</p>
      ) : (
        <p>The patient meets heart rate benchmark standards.</p>
      )}
    </div>
    <div className={`risk-analysis-textbox ${checkPhysicalActivityStatus()}`}>
      {checkPhysicalActivityStatus() === 'red' ? (
        <p>The patient does not meet physical activity benchmark.</p>
      ) : (
        <p>The patient meets physical activity benchmark.</p>
      )}
    </div>
    </div>
    )}
    <div className="options-section">
                <h2>Information</h2>
                <label>
        Include Insights:
        <input
          type="checkbox"
          checked={includeInsights}
          onChange={handleIncludeInsightsToggle}
        />
      </label>
            </div>
        </div>
    )}
      </div>
    </div>
  );
};

export default HealthReport;  
