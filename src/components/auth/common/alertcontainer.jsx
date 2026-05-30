import React from 'react';

const AlertContainer = ({ alerts }) => (
  <div>
    {alerts.map(alert => (
      <div key={alert.id} className={`alert alert-${alert.type}`}>
        {alert.msg}
      </div>
    ))}
  </div>
);

export default AlertContainer;