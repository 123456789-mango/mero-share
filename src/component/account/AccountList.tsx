import type { UserAccount } from "../../utils/storage";

interface AccountListProps {
    accounts: UserAccount[];
    onRemove: (id: string) => void;
}

export default function AccountList({ accounts, onRemove }: AccountListProps) {
    if (accounts.length === 0) {
        return <p style={{ color: '#666', fontStyle: 'italic' }}>No profiles configured yet.</p>;
    }

    return (
        <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
            {accounts.map(account => (
                <div key={account.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                        <strong>{account.name}</strong> <span style={{ fontSize: '0.85em', color: '#666' }}>({account.username})</span>
                        <div style={{ fontSize: '0.8em', color: '#888' }}>DP: {account.dpId || 'N/A'} | CRN: {account.crn || 'N/A'}</div>
                    </div>
                    <button
                        onClick={() => onRemove(account.id)}
                        style={{ backgroundColor: '#ff4d4d', color: 'white', padding: '4px 8px', fontSize: '0.8em' }}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}