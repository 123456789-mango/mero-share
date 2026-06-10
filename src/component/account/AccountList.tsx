import type { UserAccount } from "../../utils/storage";

interface AccountListProps {
    accounts: UserAccount[];
    onRemove: (id: string) => void;
    onEdit: (account: UserAccount) => void;
}

export default function AccountList({ accounts, onRemove, onEdit }: AccountListProps) {
    if (accounts.length === 0) return <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>No profiles configured yet.</p>;

    return (
        <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {accounts.map(account => (
                <div key={account.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                    <div>
                        <div style={{ fontWeight: 600, color: '#111827' }}>{account.name}</div>
                        <div style={{ fontSize: '0.85em', color: '#6b7280', marginTop: '2px' }}>
                            {account.brokerName} | @{account.username}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => onEdit(account)}
                            style={{ backgroundColor: '#dbeafe', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', fontSize: '0.8em', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onRemove(account.id)}
                            style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', padding: '6px 12px', fontSize: '0.8em', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}