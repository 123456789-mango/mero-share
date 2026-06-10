export interface UserAccount {
    id: string;
    name: string;
    dpId: string;
    username: string;
    pin: string;
    crn: string;
}

export const getAccountsFromStorage = (): UserAccount[] => {
    const data = localStorage.getItem('mero_share_accounts');
    return data ? JSON.parse(data) : [];
};

export const saveAccountsToStorage = (accounts: UserAccount[]): void => {
    localStorage.setItem('mero_share_accounts', JSON.stringify(accounts));
};