import { useState, useEffect } from 'react';
import { getAccountsFromStorage, saveAccountsToStorage, type UserAccount } from './utils/storage';
import './App.css';
import IpoDashboard from './component/dashboard/IpoDashboard';
import AccountList from './component/account/AccountList';
import AccountForm from './component/account/AccountForm';

function App() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Hydrate structural profiles on load
  useEffect(() => {
    setAccounts(getAccountsFromStorage());
  }, []);

  const handleAddAccount = (newAcc: UserAccount) => {
    const freshSet = [...accounts, newAcc];
    setAccounts(freshSet);
    saveAccountsToStorage(freshSet);
    addLog(`Configured identity payload profile for: ${newAcc.name}`);
  };

  const handleRemoveAccount = (id: string) => {
    const freshSet = accounts.filter(a => a.id !== id);
    setAccounts(freshSet);
    saveAccountsToStorage(freshSet);
    addLog("Removed account profile structure.");
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <h2>Mero Share Core Application Pipeline</h2>
        <p style={{ color: '#666' }}>Automate multiple demat operations and cleanly discard mutual funds.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div>
          <h4>Add New Profile Context</h4>
          <AccountForm onAdd={handleAddAccount} />
        </div>
        <div>
          <h4>Managed Profiles ({accounts.length})</h4>
          <AccountList accounts={accounts} onRemove={handleRemoveAccount} />
        </div>
      </div>

      <IpoDashboard accounts={accounts} addLog={addLog} />

      <div style={{ backgroundColor: '#1e1e1e', color: '#39ff14', padding: '15px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9em', minHeight: '120px', maxHeight: '200px', overflowY: 'auto' }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>Live Automation Process Logs:</span>
        {logs.length === 0 ? (
          <div style={{ color: '#555', fontStyle: 'italic', marginTop: '5px' }}>Terminal standby. Awaiting script execution instructions...</div>
        ) : (
          logs.map((log, index) => <div key={index} style={{ marginTop: '4px' }}>{log}</div>)
        )}
      </div>
    </div>
  );
}

export default App;