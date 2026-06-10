import { useState, useEffect, useCallback } from 'react';
import { getAccountsFromStorage, saveAccountsToStorage, type UserAccount } from './utils/storage';
import IpoDashboard from './component/dashboard/IpoDashboard';
import AccountList from './component/account/AccountList';
import AccountForm from './component/account/AccountForm';

function App() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);

  useEffect(() => { setAccounts(getAccountsFromStorage()); }, []);

  const handleAddAccount = (newAcc: UserAccount) => {
    const freshSet = [...accounts, newAcc];
    setAccounts(freshSet); saveAccountsToStorage(freshSet);
    addLog(`✅ Configured profile for: ${newAcc.name}`);
  };

  const handleUpdateAccount = (updatedAcc: UserAccount) => {
    const freshSet = accounts.map(a => a.id === updatedAcc.id ? updatedAcc : a);
    setAccounts(freshSet); saveAccountsToStorage(freshSet);
    addLog(`🔄 Updated profile for: ${updatedAcc.name}`);
    setEditingAccount(null);
  };

  const handleRemoveAccount = (id: string) => {
    const freshSet = accounts.filter(a => a.id !== id);
    setAccounts(freshSet); saveAccountsToStorage(freshSet);
    addLog(`🗑️ Removed account profile.`);
    if (editingAccount?.id === id) setEditingAccount(null);
  };

  const addLog = useCallback((msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${msg}`, ...prev].slice(0, 100));
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh', color: '#111827' }}>
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 700, margin: 0 }}>MeroShare Auto-IPO Pipeline</h1>
        <p style={{ color: '#6b7280', marginTop: '5px' }}>Automate multiple demat operations and maximize allotment chances.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#374151' }}>
            {editingAccount ? `Editing: ${editingAccount.name}` : "Add New Profile"}
          </h4>
          <AccountForm
            onAdd={handleAddAccount}
            onUpdate={handleUpdateAccount}
            editingAccount={editingAccount}
            onCancelEdit={() => setEditingAccount(null)}
          />
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#374151' }}>Managed Profiles ({accounts.length})</h4>
          <AccountList
            accounts={accounts}
            onRemove={handleRemoveAccount}
            onEdit={setEditingAccount}
          />
        </div>
      </div>

      <IpoDashboard accounts={accounts} addLog={addLog} />

      <div style={{ backgroundColor: '#1e1e1e', color: '#d1d5db', padding: '20px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '0.9em', minHeight: '200px', maxHeight: '300px', overflowY: 'auto', border: '1px solid #374151' }}>
        <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #374151', paddingBottom: '5px' }}>
          &gt; Live Automation Process Logs_
        </div>
        {logs.length === 0 ? (
          <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Terminal standby. Start the automation engine to begin...</div>
        ) : (
          logs.map((log, index) => {
            const isInfo = log.includes("ℹ️") || log.includes("✅");
            const isError = log.includes("❌") || log.includes("⚠️");
            const isSuccess = log.includes("🎉") || log.includes("🏆");
            let color = "#e5e7eb";
            if (isError) color = "#f87171";
            else if (isSuccess) color = "#34d399";
            else if (isInfo) color = "#60a5fa";

            return (
              <div key={index} style={{ marginTop: '4px', lineHeight: '1.5', color }}>
                <span style={{ color: '#9ca3af' }}>{log.substring(0, log.indexOf(']') + 1)}</span>
                <span>{log.substring(log.indexOf(']') + 1)}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;