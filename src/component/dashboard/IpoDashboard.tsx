import { useState, useEffect } from 'react';
import { AutomationEngine } from '../../utils/automationEngine';
import type { UserAccount } from '../../utils/storage';

interface IpoDashboardProps { accounts: UserAccount[]; addLog: (msg: string) => void; }

export default function IpoDashboard({ accounts, addLog }: IpoDashboardProps) {
    const [engine, setEngine] = useState<AutomationEngine | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const autoEngine = new AutomationEngine(accounts, addLog);
        setEngine(autoEngine);
        return () => { autoEngine.stop(); };
    }, []);

    useEffect(() => {
        if (engine) {
            engine.updateAccounts(accounts);
            engine.updateAddLog(addLog);
        }
    }, [accounts, engine, addLog]);

    const toggleAutomation = () => {
        if (!engine) return;
        if (isRunning) { engine.stop(); setIsRunning(false); }
        else { engine.start(); setIsRunning(true); }
    };

    return (
        <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '12px', backgroundColor: '#ffffff', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#111827' }}>Automation Engine Control</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: isRunning ? '#10b981' : '#ef4444', boxShadow: isRunning ? '0 0 8px #10b981' : 'none' }}></span>
                    <span style={{ fontSize: '0.9em', color: '#6b7280', fontWeight: 500 }}>{isRunning ? "Active (Hourly Checks)" : "Inactive"}</span>
                </div>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.9em', marginBottom: '15px', marginTop: 0 }}>
                The engine checks for active Ordinary Share IPOs every hour, applies for all configured accounts, and checks allotment results.
            </p>
            <button onClick={toggleAutomation} style={{ backgroundColor: isRunning ? '#ef4444' : '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                {isRunning ? "Stop Automation" : "Start Hourly Automation"}
            </button>
        </div>
    );
}