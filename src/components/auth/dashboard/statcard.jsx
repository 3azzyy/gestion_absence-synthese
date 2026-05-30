import React from 'react';

const StatCard = ({ label, value, onClick }) => (
  <div className="stat-item" onClick={onClick}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

export default StatCard;