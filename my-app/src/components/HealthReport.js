import React, { useState, useEffect } from 'react';
import './HealthReport.css';
import heartRateData from '../assets/heart-rate.json';
import weightData from '../assets/weight-sleep.json';
import calorieData from '../assets/calories.json'; 
import exerciseData from '../assets/exercise.json';
import waterData from '../assets/water.json';
import profileData from '../assets/profile.json';
import Popup from './Popup';

import Chart from 'chart.js/auto';

const HealthReport = () => {
  const [activeTab, setActiveTab] = useState('Heart Rate');
  const [previousMonth, setPreviousMonth] = useState('');
  const [averageHeartRates, setAverageHeartRates] = useState([]);
  const [averageWeights, setAverageWeights] = useState([]);
  const [weightChange, setWeightChange] = useState([]);
  const [showHeartRateChart, setShowHeartRateChart] = useState(false);
  const [showWeightChart, setShowWeightChart] = useState(false);
  const [showWeightChangeChart, setShowWeightChangeChart] = useState(false); 
  const [caloriesData, setCaloriesData] = useState([]);
  const [showCaloriesChart, setShowCaloriesChart] = useState(false);
  const [exerciseTableData, setExerciseTableData] = useState([]);
  const [showExerciseChart, setShowExerciseChart] = useState(false);
  const [includeWeightVisuals, setIncludeWeightVisuals] = useState(true); 
  const [includeVisuals, setIncludeVisuals] = useState(true); 
  const [includeDietVisuals, setIncludeDietVisuals] = useState(true); 
  const [includeWeightChangeVisuals, setIncludeWeightChangeVisuals] = useState(true);
  const [includeExerciseVisuals, setIncludeExerciseVisuals] = useState(true);
  const [includeExercise, setIncludeExercise] = useState(true);
  const [includeInsights, setIncludeInsights] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Identify Current Report's Month: Users will have until the end of the current month to send the health data for the 
    // previous month (ex: During May, patients review data for April)

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

  // Collect Data for the respective month
  useEffect(() => {
    const aprilHeartRateData = heartRateData.filter(entry => entry.Date.startsWith('2024-04'));
    const aprilWeightData = weightData.filter(entry => entry.Date.startsWith('2024-04'));
    const aprilCaloriesData = calorieData.filter(entry => entry.Date.startsWith('2024-04'));
    const aprilExerciseData = exerciseData.filter(entry => entry.Date.startsWith('2024-04'));
  
    // Calculate total water consumed per day
    const totalWaterPerDay = {};
    waterData.forEach(entry => {
    const date = entry.Date;
    let totalWater = 0;

  
    Object.values(entry).forEach(val => {
    if (val !== '' && val !== date) { 
      totalWater += val;
    }
    });
    totalWaterPerDay[date] = totalWater;
    });

    // Calculate total calories per day

    const totalCaloriesPerDay = {};
  calorieData.forEach(entry => {
    const date = entry.Date;
    let totalCalories = 0;
    
    Object.values(entry).forEach(val => {
      if (val !== '' && val !== date) { 
        totalCalories += parseInt(val);
      }
    });
    totalCaloriesPerDay[date] = totalCalories;
  });

  // Combine calorie and water data into Diet table
  const combinedData = aprilCaloriesData.map(entry => ({
    Date: entry.Date,
    TotalCalories: totalCaloriesPerDay[entry.Date] || 0, 
    TotalWaterConsumed: totalWaterPerDay[entry.Date] || 0 
  }));

  setCaloriesData(combinedData);
  setShowCaloriesChart(true);
  
    // Calculate average heart rate for each day
    const averageHeartRates = aprilHeartRateData.map(entry => {
      const heartRates = Object.values(entry).slice(1); 
      const sum = heartRates.reduce((acc, val) => acc + val, 0);
      const avg = sum / heartRates.length;
      return { Date: entry.Date, AverageHeartRate: avg.toFixed(2) };
    });
  
    setAverageHeartRates(averageHeartRates);
    setShowHeartRateChart(true); 
  
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

        sum = 0;
        count = 0;
        weekStartDate = '';
      }
    });
  
    setAverageWeights(averageWeights);
    setShowWeightChart(true); 
    setWeightChange(weightChange);
    setShowWeightChangeChart(true); 

    // Calculate average per day km run/swam for each week
  
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
  
        sumKmWalked = 0;
        sumKmSwam = 0;
        count = 0;
      }
    });
  
    // Set exercise table data
    setExerciseTableData(averageKmData);
    setShowExerciseChart(true);
  }, []);

  // Tab change logic

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

  // Handle voluntary visualization customization

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

  // Create Visualizations for data

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

  // Insights Feature logic

  const checkHeartRateStatus = () => {
    const averageHeartRatesArray = averageHeartRates.map(entry => parseFloat(entry.AverageHeartRate));
    const above90 = averageHeartRatesArray.some(rate => rate > 90);
    const below60 = averageHeartRatesArray.some(rate => rate < 60);

    // Heart Rate feature specification: according to studies, heart rate benchmarks can depend on patient weight, age, and existing health conditions
    // dictionarr = {age, heart_rate min, heart_rate_max}
    // const max = averageHeartRatesArray.some(rate => rate > dictionary[profileData.age].max);
    // const min = averageHeartRatesArray.some(rate => rate > dictionary[profileData.age].min);

    //***A more robust machine learning algorithm could be used to use weight, calorie, and age data to determine an adequate heart rate range.
    
    return above90 || below60 ? 'red' : 'green';
  };

  const checkPhysicalActivityStatus = () => {
    const kmDataArray = exerciseTableData.map(entry => parseFloat(entry.AverageKmWalked) + parseFloat(entry.AverageKmSwam));
    const below5_6 = kmDataArray.some(sum => sum < 5.6);

    // Phlysical Activity feature specification: physical activity benchmarks can depend greatly on individual fitness goals
        // Given more time, I considered implementing a user settings feature where they can set their own fitness benchmarks based on 
        // health provider suggestions. This could be included in profile settings.
        //   const below5_6 = kmDataArray.some(sum => sum < profileData[km_min]);
  
    return below5_6 ? 'red' : 'green';
  };

  // Visuals Customization Toggles

  const handleIncludeWeightVisualsToggle = () => {
    setIncludeWeightVisuals(!includeWeightVisuals); 
  };

  const handleIncludeVisualsToggle = () => {
    setIncludeVisuals(!includeVisuals); 
  };

  const handleIncludeDietVisualsToggle = () => {
    setIncludeDietVisuals(!includeDietVisuals); 
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

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const { firstName, lastName, age, sex } = profileData;

  return (
    <div className="popup-container">
    {showPopup && (
      <div className="popup">
        {Popup}
        <h2 className="popup-heading">Health Report Approved</h2>
        <p className="popup-text">The Report for... </p>
        <ul className="popup-list">
            <li><span className="red-text">Patient: </span> {firstName.charAt(0)}{lastName.charAt(0)}</li>
            <li><span className="red-text">Age: </span> {age}</li>
            <li><span className="red-text">Sex: </span>{sex}</li>
          </ul>
          <p className="popup-text"> has been approved. Health insurer will receive this information promptly.</p>
      </div>
    )}

  
    <div className={`HealthReport ${showPopup ? 'blur-background' : ''}`}>
      <h1>{previousMonth} Health Report</h1>
      <button className="approve-button" onClick={togglePopup}>Approve Report >></button>
      <nav className="tab-nav">
        <ul>
          {/* Originally I named the insights page "Risk Analysis," but I think for the purpose of avoiding specific use of this data, I opted for Insights"*/ }
          <li className={activeTab === 'Heart Rate' ? 'active' : ''} onClick={() => handleTabChange('Heart Rate')}>Heart Rate</li>
          <li className={activeTab === 'Weight' ? 'active' : ''} onClick={() => handleTabChange('Weight')}>Weight</li>
          <li className={activeTab === 'Diet' ? 'active' : ''} onClick={() => handleTabChange('Diet')}>Diet</li>
          <li className={activeTab === 'Exercise' ? 'active' : ''} onClick={() => handleTabChange('Exercise')}>Exercise</li>
          <li className={activeTab === 'Risk Analysis' ? 'active' : ''} onClick={() => handleTabChange('Risk Analysis')}>Insights</li>
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
            <p> Heart Rate data tracks your average heart rate per day <span className="red-text">(as recorded by your fitbit)</span> and is used to identify potential risk for 
                cardiovascular disorders.
            </p>
            <p>Feel free to include a <span className="red-text">visualization</span> of this data at your discretion.</p>
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
                      <th>Week</th>
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
                    <th className={includeWeightChangeVisuals ? "" : "transparent-header"}>Week</th>
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
                <p> Weight Rate data tracks your average weight rate per week <span className="red-text">(as recorded by your fitbit)</span> and is used to identify potential harmful
                weight patterns. 
                </p>
                <p>If you are on a <span className="red-text">weight change</span> journey and would like to share your progress, please feel free to include weight change data.</p>
                <p>Feel free to include a <span className="red-text">visualization</span> of this data at your discretion.</p>
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
              <th>Water Consumed (oz)</th> 
            </tr>
          </thead>
          <tbody>
            {caloriesData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.Date}</td>
                <td>{entry.TotalCalories}</td>
                <td>{entry.TotalWaterConsumed}</td> 
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="options-section">
              <h2>Information</h2>
              <p> Water and Calorie data tracks your average consumption per day <span className="red-text">(according to your fitbit logs)</span> and is used to identify potential risk for 
                unlhealthy diet habits that might solicit at-risk care.
            </p>
            <p>Feel free to include a <span className="red-text">visualization</span> of this data at your discretion.</p>
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
                <p> Exercise data tracks your average distance run or swam per week <span className="red-text">(according to your fitbit logs)</span> and is used for participation in
                health insurance incentive programs.
            </p>
            <p>If you would like to share your <span className="red-text">physical activity</span> with health providers feel free to do so atl your discretion.</p>
            <p>Feel free to include a <span className="red-text">visualization</span> of this data at your discretion.</p>
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
    {includeExercise && (
  <div className={`risk-analysis-textbox ${checkPhysicalActivityStatus()}`}>
    {checkPhysicalActivityStatus() === 'red' ? (
      <p>The patient does not meet physical activity benchmark.</p>
    ) : (
      <p>The patient meets physical activity benchmark.</p>
    )}
  </div>
  )}
  </div>
    )}
    <div className="options-section">
                <h2>Information</h2>
                <p> By analyzing your data, insights can help determine wether or not your health metrics <span className="red-text">(as collected by your fitbit)</span> meet benchmark standards and help 
                    insurers provide you with "at-risk" care if necessary.
            </p>
            <p>If you would like to share your <span className="red-text">insights</span> with health providers feel free to do so atl your discretion.</p>
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
    </div>
  );
};

export default HealthReport;  
