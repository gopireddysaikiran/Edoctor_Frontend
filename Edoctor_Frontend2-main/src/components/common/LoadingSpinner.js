// src/components/common/LoadingSpinner.js
import React from "react";
import './LoadingSpinner.css'; // Add styles for the spinner

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    );
};

export default LoadingSpinner;