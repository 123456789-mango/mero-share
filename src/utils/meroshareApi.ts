import type { UserAccount } from "./storage";

const API_BASE = "https://webbackend.cdsc.com.np/api/meroShare";

export interface Capital {
    code: string;
    id: number;
    name: string;
}

export interface OpenIssue {
    companyShareId: string;
    companyName: string;
    scrip: string;
    shareType: string;
    closeDate: string;
}

export interface AppliedIssue {
    companyShareId: string;
    companyName: string;
    scrip: string;
    status: string;
}

export class MeroShareApi {
    // Fetch the list of all brokers/DPs
    static async getCapitals(): Promise<Capital[]> {
        const res = await fetch(`${API_BASE}/capital/`, {
            method: "GET",
            headers: { "Accept": "application/json, text/plain, */*" }
        });
        if (!res.ok) throw new Error("Failed to fetch broker list");
        return res.json();
    }

    // Updated to fix the 500 Internal Server Error
    static async login(clientId: number, username: string, password: string): Promise<string> {
        // 1. Pad username with leading zeros to exactly 8 characters
        const formattedUsername = username.padStart(8, '0');

        const res = await fetch(`${API_BASE}/auth/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                // 2. The backend global filter crashes if this header is completely missing
                "Authorization": "null"
            },
            body: JSON.stringify({
                clientId,
                username: formattedUsername,
                password
            }),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Login failed for ${formattedUsername}. Server responded with ${res.status}: ${errorText}`);
        }

        // The token is returned in the Response Headers, not the body
        const token = res.headers.get("Authorization");
        if (!token) throw new Error("Login successful but no Authorization token was returned in headers.");

        return token;
    }

    static async getOpenIssues(token: string): Promise<OpenIssue[]> {
        const res = await fetch(`${API_BASE}/companyShare/currentIssue`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "Authorization": token
            },
            body: JSON.stringify({
                filterFieldParams: [
                    { key: "companyIssue.companyISIN.script", alias: "Scrip" },
                    { key: "companyIssue.companyISIN.company.name", alias: "Company Name" }
                ],
                page: 1, size: 200, searchRoleViewConstants: "VIEW_OPEN_SHARE",
                filterDateParams: []
            }),
        });
        const data = await res.json();
        return (data.object || []).map((item: any) => ({
            companyShareId: item.companyShareId,
            companyName: item.companyName || item.companyIssue?.companyISIN?.company?.name,
            scrip: item.scrip || item.companyIssue?.companyISIN?.script,
            shareType: item.shareType || "Ordinary Shares",
            closeDate: item.closeDate || item.issueCloseDate,
        }));
    }

    static async applyForIPO(token: string, account: UserAccount, companyShareId: string, kitta: number = 10): Promise<boolean> {
        const res = await fetch(`${API_BASE}/applicantForm/share/apply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "Authorization": token
            },
            body: JSON.stringify({
                demat: account.dpId,
                boid: account.boid || account.username.padStart(8, '0'),
                accountNumber: account.accountNumber, customerId: account.customerId || "1",
                accountBranchId: account.accountBranchId || 1, accountTypeId: account.accountTypeId || 1,
                appliedKitta: kitta.toString(), crnNumber: account.crn, transactionPIN: account.pin,
                companyShareId: companyShareId, bankId: account.bankId || 1,
            }),
        });
        return res.ok;
    }

    static async getAppliedIssues(token: string): Promise<AppliedIssue[]> {
        const res = await fetch(`${API_BASE}/applicantForm/active/search/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/plain, */*",
                "Authorization": token
            },
            body: JSON.stringify({
                filterFieldParams: [
                    { key: "companyShare.companyIssue.companyISIN.script", alias: "Scrip" },
                    { key: "companyShare.companyIssue.companyISIN.company.name", alias: "Company Name" }
                ],
                page: 1, size: 200, searchRoleViewConstants: "VIEW_APPLICANT_FORM_COMPLETE",
                filterDateParams: []
            }),
        });
        const data = await res.json();
        return (data.object || []).map((item: any) => ({
            companyShareId: item.companyShareId,
            companyName: item.companyName || item.companyIssue?.companyISIN?.company?.name,
            scrip: item.scrip || item.companyIssue?.companyISIN?.script,
            status: item.status || item.approvalStatus || "APPLIED",
        }));
    }
}