import { MeroShareApi, type OpenIssue } from "./meroshareApi";
import type { UserAccount } from "./storage";

export class AutomationEngine {
    private intervalId: number | null = null;
    private accounts: UserAccount[] = [];
    private addLog: (msg: string) => void;
    private appliedIpos: Set<string> = new Set();
    private isRunning: boolean = false;

    constructor(accounts: UserAccount[], addLog: (msg: string) => void) {
        this.accounts = accounts;
        this.addLog = addLog;
    }

    updateAccounts(accounts: UserAccount[]) { this.accounts = accounts; }
    updateAddLog(addLog: (msg: string) => void) { this.addLog = addLog; }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.addLog("🚀 Automation Engine Started. Checking every hour...");
        this.runCycle();
        this.intervalId = window.setInterval(() => this.runCycle(), 3600000);
    }

    stop() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.isRunning = false;
        this.addLog("🛑 Automation Engine Stopped.");
    }

    private async runCycle() {
        if (this.accounts.length === 0) {
            this.addLog("⚠️ No accounts configured. Skipping cycle.");
            return;
        }

        this.addLog("⏳ Starting hourly automation cycle...");
        const activeIpos = await this.fetchActiveIpos();

        if (activeIpos.length === 0) {
            this.addLog("ℹ️ No active ordinary share IPOs found.");
        } else {
            this.addLog(`🎯 Found ${activeIpos.length} active ordinary share IPO(s).`);
            for (const ipo of activeIpos) {
                if (!this.appliedIpos.has(ipo.companyShareId)) {
                    this.addLog(`📝 Processing IPO: ${ipo.companyName} (${ipo.scrip})`);
                    await this.applyToAllAccounts(ipo);
                    this.appliedIpos.add(ipo.companyShareId);
                } else {
                    this.addLog(`✅ Already applied for ${ipo.companyName}. Skipping.`);
                }
            }
        }

        this.addLog("🔍 Checking allotment results for applied IPOs...");
        await this.checkResults();
        this.addLog("✅ Hourly cycle completed. Next check in 1 hour.");
    }

    private async fetchActiveIpos(): Promise<OpenIssue[]> {
        try {
            const acc = this.accounts[0];
            // Use clientId (integer) for login
            const token = await MeroShareApi.login(acc.clientId, acc.username, acc.password);
            const issues = await MeroShareApi.getOpenIssues(token);
            return issues.filter(i =>
                i.shareType?.toLowerCase().includes("ordinary") ||
                !i.shareType
            );
        } catch (error: any) {
            this.addLog(`❌ Error fetching active IPOs: ${error.message}`);
            return [];
        }
    }

    private async applyToAllAccounts(ipo: OpenIssue) {
        for (const account of this.accounts) {
            try {
                this.addLog(`🔐 Logging in as ${account.name}...`);
                // Use clientId (integer) for login
                const token = await MeroShareApi.login(account.clientId, account.username, account.password);

                await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

                this.addLog(`🚀 Applying 10 Kitta for ${ipo.companyName} for ${account.name}...`);
                const success = await MeroShareApi.applyForIPO(token, account, ipo.companyShareId, 10);

                if (success) this.addLog(`🎉 Successfully applied for ${account.name}!`);
                else this.addLog(`⚠️ Application failed for ${account.name}.`);
            } catch (error: any) {
                this.addLog(`❌ Error applying for ${account.name}: ${error.message}`);
            }
        }
    }

    private async checkResults() {
        for (const account of this.accounts) {
            try {
                // Use clientId (integer) for login
                const token = await MeroShareApi.login(account.clientId, account.username, account.password);
                const results = await MeroShareApi.getAppliedIssues(token);
                for (const result of results) {
                    this.addLog(`🏆 ${account.name} - ${result.companyName}: ${result.status}`);
                }
            } catch (error: any) {
                this.addLog(`❌ Error checking results for ${account.name}: ${error.message}`);
            }
        }
    }
}