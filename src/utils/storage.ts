export interface UserAccount {
    id: string;
    name: string;
    dpId: string;       // 5-digit code, e.g., "17400"
    clientId: number;   // Integer ID, e.g., 174 (Required for login payload)
    brokerName: string; // Display name for the UI
    username: string;
    password: string;
    boid: string;
    pin: string;
    crn: string;
    accountNumber: string;

    // Bank details required for ASBA application 
    bankId?: number;
    accountBranchId?: number;
    customerId?: string;
    accountTypeId?: number;
}

export const getAccountsFromStorage = (): UserAccount[] => {
    const data = localStorage.getItem('mero_share_accounts');
    return data ? JSON.parse(data) : [];
};

export const saveAccountsToStorage = (accounts: UserAccount[]): void => {
    localStorage.setItem('mero_share_accounts', JSON.stringify(accounts));
};