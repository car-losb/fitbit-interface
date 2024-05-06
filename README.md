# fitbit-interface

This README contains information regarding the main files in my interface implementation as well as how to access it.

SignUp.js:

- This file contains the basic structure of the Sign In page along with a brief specification for the industry standard O Auth 2.0 
authorization system integration based off of the existing Fitbit API. 

- To access the health reportl use the following login information:
    - email: jane.doe@gmail.com
    - password: 1234

HealthReport.js

- This file contains the main logical components for the actual Health Report censoring interface. 

- Main Features:

    - Data aggregation and health metric table creation. 
    - Data graphs/visualizations along with patient customization options to opt-in or out of data visualizations
    - Data filtering options, users can omit (weight change, exercise data)
    - Voluntary insights feature, calculates patient benchmark standards (heart rate, physical activity)
    - Information Popup, includes information about why the data is being solicited and how it will be used as well as filtering options 
        for patients.

Popup.js

- This contains the structure for the popup users receive once they approve the data on their health report. It includes the identifiable information that is included on the report. 

