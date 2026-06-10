import { useState } from 'react';
import type { UserAccount } from '../../utils/storage';

interface IpoDashboardProps {
    accounts: UserAccount[];
    addLog: (msg: string) => void;
}

// Simulated structural typing for CDSC responses
interface AppIssue {
    companyName: string;
    shareType: 'Ordinary Shares' | 'Mutual Fund' | 'Right Shares';
    kittaRatio: number;
}

export default function IpoDashboard({ accounts, addLog }: IpoDashboardProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleBulkApply = async () => {
        if (accounts.length === 0) {
            alert("Please configure at least one account profile first.");
            return;
        }

        setIsProcessing(true);
        addLog("Pulling current open listings from Mero Share webbackend...");

        // Mocking an active API payload return from CDSC
        const openIssues: AppIssue[] = [
            { companyName: "NIBL Stable Fund", shareType: "Mutual Fund", kittaRatio: 10 },
            { companyName: "Upper Arun Hydropower Ltd.", shareType: "Ordinary Shares", kittaRatio: 10 },
            { companyName: "Siddhartha Investment Growth Scheme", shareType: "Mutual Fund", kittaRatio: 10 }
        ];

        // Core validation requirement requested: Filter out non-IPO targets
        const validIpos = openIssues.filter(issue => issue.shareType === "Ordinary Shares");
        addLog(`Identified ${validIpos.length} eligible Ordinary Share listings. (Skipped ${openIssues.length - validIpos.length} Mutual Funds).`);

        if (validIpos.length === 0) {
            addLog("No valid ordinary IPOs currently open for application.");
            setIsProcessing(false);
            return;
        }

        // Step-by-step automated queue pipeline loop
        for (const target of validIpos) {
            addLog(`Targeting Security: ${target.companyName}`);

            for (const account of accounts) {
                addLog(`[Queue] Initializing handshake for user: ${account.name}`);

                // Anti-bot safeguard padding delay simulation
                await new Promise(resolve => setTimeout(resolve, 1200));

                addLog(`[Success] Applied 10 Kitta via CRN ${account.crn || 'Stored'} for ${account.name}.`);
            }
        }

        addLog("Bulk execution run completely cleared.");
        setIsProcessing(false);
    };

    const handleCheckResults = () => {
        addLog("Querying CDSC mass allotment portal data...");
        accounts.forEach(acc => {
            const statuses = ["ALLOTTED (10 Kitta) 🎉", "NOT ALLOTTED 😢"];
            const decision = statuses[Math.floor(Math.random() * statuses.length)];
            addLog(`Result for ${acc.name}: ${decision}`);
        });
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', margin: '20px 0', backgroundColor: '#fafafa' }}>
            <h3>Automation Engine Control</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleBulkApply} disabled={isProcessing} style={{ backgroundColor: '#0066cc', color: 'white' }}>
                    {isProcessing ? "Executing Pipeline..." : "Auto-Apply to Open IPOs"}
                </button>
                <button onClick={handleCheckResults} disabled={isProcessing}>
                    Bulk Check Results
                </button>
            </div>
        </div>
    );
}