import React from 'react';

const GlobalStyles = () => (
  <style>{`
    :root {
      --primary: #1e3a5f;
      --secondary: #2c5f8d;
      --accent: #3a7ca5;
      --danger: #b71c1c;
      --warning: #f57c00;
      --success: #2e7d32;
      --info: #0288d1;
      --bg: #f8f9fa;
      --card: #ffffff;
      --border: #dce1e8;
      --text-primary: #1a2332;
      --text-secondary: #5a6c7d;
      --text-muted: #8e9aaf;
      --shadow: 0 2px 8px rgba(30,58,95,0.08);
      --shadow-md: 0 4px 16px rgba(30,58,95,0.12);
      --radius: 6px;
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background: var(--bg);
      color: var(--text-primary);
      font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.6;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-wrapper { max-width: 1600px; margin: 0 auto; padding: 32px 24px; }

    .page-header {
      background: var(--card);
      border-bottom: 2px solid var(--primary);
      padding: 32px 24px;
      margin: -32px -24px 32px -24px;
      box-shadow: var(--shadow);

    }

    .header-top { display: flex;
     justify-content: space-between;
      align-items: start; 
      gap: 16px; 
      flex-wrap: wrap;
      margin-bottom: 24px;
      }

    .header-title {
      font-family: Georgia, serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--primary);
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .header-subtitle { font-size: 15px; color: var(--text-secondary); margin: 0; }
    
    .header-rule {
      display: inline-block;
      background: var(--accent);
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      margin-top: 12px;
    }

    .header-actions { display: flex; gap: 8px; flex-wrap: wrap; }

    .icon-btn {
      background: var(--card);
      border: 1.5px solid var(--border);
      color: var(--text-primary);
      width: 40px;
      height: 40px;
      border-radius: var(--radius);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .icon-btn:hover { background: var(--primary); color: white; border-color: var(--primary); }

    .alert {
      padding: 12px 16px;
      border-radius: var(--radius);
      margin: 12px 0;
      border-left: 4px solid;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alert-warning { background: #fff3cd; border-color: var(--warning); color: #856404; }
    .alert-danger { background: #f8d7da; border-color: var(--danger); color: #721c24; }
    .alert-success { background: #d4edda; border-color: var(--success); color: #155724; }
    .alert-info { background: #d1ecf1; border-color: var(--info); color: #0c5460; }

    .tabs { display: flex; gap: 4px; margin-bottom: 24px; border-bottom: 2px solid var(--border); overflow-x: auto; }

    .tab {
      padding: 12px 20px;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      border-bottom: 3px solid transparent;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .tab:hover { color: var(--primary); }
    .tab.active { color: var(--primary); border-bottom-color: var(--primary); }

    .controls-section {
      background: var(--card);
      padding: 24px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      margin-bottom: 24px;
      border: 1px solid var(--border);
    }

    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      align-items: end;
    }

    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .form-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .input, select, textarea {
      padding: 10px 14px;
      border-radius: var(--radius);
      border: 1.5px solid var(--border);
      background: var(--card);
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      color: var(--text-primary);
    }

    .input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(58,124,165,0.1);
    }

    .btn {
      background: var(--primary);
      color: #fff;
      padding: 10px 20px;
      border-radius: var(--radius);
      border: none;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      font-family: inherit;
      transition: all 0.2s ease;
      box-shadow: var(--shadow);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .btn:hover { background: var(--secondary); transform: translateY(-1px); box-shadow: var(--shadow-md); }

    .btn-secondary { background: var(--card); color: var(--primary); border: 1.5px solid var(--primary); }
    .btn-secondary:hover { background: var(--primary); color: white; }
    .btn-success { background: var(--success); }
    .btn-danger { background: var(--danger); }
    .btn-warning { background: var(--warning); }
    .btn-sm { padding: 6px 12px; font-size: 12px; }

    .card {
      background: var(--card);
      padding: 28px;
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      margin-bottom: 24px;
      border: 1px solid var(--border);
    }

    .card-header {
      font-family: Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--primary);
      margin: 0 0 20px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-item {
      background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
      padding: 20px;
      border-radius: var(--radius);
      color: white;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .stat-item:hover { transform: translateY(-2px); }

    .stat-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.9;
      margin-bottom: 8px;
      font-weight: 600;
    }

    .stat-value { font-size: 28px; font-weight: 700; font-family: Georgia, serif; }

    .table-wrapper { overflow-x: auto; border-radius: var(--radius); border: 1px solid var(--border); }
    .table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .table thead { background: var(--primary); color: white; }

    .table th {
      padding: 14px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 2px solid var(--secondary);
      cursor: pointer;
      user-select: none;
    }

    .table th:hover { background: var(--secondary); }
    .table td { padding: 14px 16px; border-bottom: 1px solid var(--border); }
    .table tbody tr { transition: background 0.15s ease; }
    .table tbody tr:hover { background: rgba(58,124,165,0.04); }
    .table tbody tr:last-child td { border-bottom: none; }
    .table tbody tr.at-risk { background: rgba(183,28,28,0.05); }

    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 20px;
      color: #fff;
      font-weight: 600;
      font-size: 12px;
      text-align: center;
      min-width: 140px;
    }

    .progress-bar { width: 100%; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--success); transition: width 0.3s ease; }

    .modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal.show { display: flex; }

    .modal-content {
      background: var(--card);
      border-radius: var(--radius);
      max-width: 900px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-md);
      padding: 32px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid var(--border);
    }

    .modal-title { font-family: Georgia, serif; font-size: 24px; color: var(--primary); margin: 0; }

    .close-modal {
      background: transparent;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--text-muted);
      padding: 0;
      width: 32px;
      height: 32px;
    }

    .close-modal:hover { color: var(--danger); }

    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      align-items: end;
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    .user-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(58,124,165,0.1);
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: 600;
      color: var(--primary);
      font-size: 14px;
    }

    @media(max-width: 768px) {
      .page-wrapper { padding: 16px; }
      .page-header { padding: 24px 16px; margin: -16px -16px 24px -16px; }
      .header-title { font-size: 24px; }
      .controls-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
      .modal-content { padding: 20px; }
    }

    .hidden { display: none !important; }

    @media print {
  @page {
    margin: 0;
    size: auto;
  }
  
  body {
    margin: 0;
    padding: 0;
  }
  
  body * {
    visibility: hidden;
  }
  
  .print-content, .print-content * {
    visibility: visible;
  }
  
  .print-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  
  .page-header,
  .header-top,
  .tabs,
  .controls-section,
  .controls-grid,
  .form-group,
  .btn,
  button,
  .card-header,
  .alert,
  .card p {
    display: none !important;
  }
} 
  `}</style>
);

export default GlobalStyles;