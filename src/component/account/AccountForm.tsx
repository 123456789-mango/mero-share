import React, { useState, useEffect } from 'react';
import type { UserAccount } from '../../utils/storage';
import { MeroShareApi, type Capital } from '../../utils/meroshareApi';

interface AccountFormProps {
    onAdd: (account: UserAccount) => void;
    onUpdate?: (account: UserAccount) => void;
    editingAccount?: UserAccount | null;
    onCancelEdit?: () => void;
}

export default function AccountForm({ onAdd, onUpdate, editingAccount, onCancelEdit }: AccountFormProps) {
    const [capitals, setCapitals] = useState<Capital[]>([]);
    const [formData, setFormData] = useState({
        name: '', clientId: 0, dpId: '', brokerName: '', username: '', password: '', boid: '', pin: '', crn: '', accountNumber: '',
    });

    // Fetch brokers on mount
    useEffect(() => {
        MeroShareApi.getCapitals()
            .then(setCapitals)
            .catch(err => console.error("Failed to load brokers", err));
    }, []);

    // Pre-fill form when editing
    useEffect(() => {
        if (editingAccount) {
            setFormData({
                name: editingAccount.name,
                clientId: editingAccount.clientId,
                dpId: editingAccount.dpId,
                brokerName: editingAccount.brokerName,
                username: editingAccount.username,
                password: editingAccount.password,
                boid: editingAccount.boid,
                pin: editingAccount.pin,
                crn: editingAccount.crn,
                accountNumber: editingAccount.accountNumber,
            });
        } else {
            setFormData({ name: '', clientId: 0, dpId: '', brokerName: '', username: '', password: '', boid: '', pin: '', crn: '', accountNumber: '' });
        }
    }, [editingAccount]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.username || !formData.password || !formData.clientId) {
            alert("Please fill in all required fields and select a broker.");
            return;
        }

        const accountData: UserAccount = {
            id: editingAccount?.id || crypto.randomUUID(),
            ...formData,
            bankId: 1, accountBranchId: 1, customerId: '1', accountTypeId: 1,
        };

        if (editingAccount && onUpdate) {
            onUpdate(accountData);
        } else {
            onAdd(accountData);
        }

        if (onCancelEdit) onCancelEdit();
        setFormData({ name: '', clientId: 0, dpId: '', brokerName: '', username: '', password: '', boid: '', pin: '', crn: '', accountNumber: '' });
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px', borderRadius: '6px', border: '1px solid #ddd',
        fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box'
    };
    const labelStyle: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#555', marginBottom: '4px', display: 'block' };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
                <label style={labelStyle}>Account Holder Name *</label>
                <input style={inputStyle} type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div>
                <label style={labelStyle}>Broker / DP Selection *</label>
                <select
                    style={inputStyle}
                    value={formData.clientId}
                    onChange={e => {
                        const selectedId = Number(e.target.value);
                        const selectedBroker = capitals.find(c => c.id === selectedId);
                        if (selectedBroker) {
                            setFormData({
                                ...formData,
                                clientId: selectedBroker.id,
                                dpId: selectedBroker.code,
                                brokerName: selectedBroker.name
                            });
                        }
                    }}
                    required
                >
                    <option value={0} disabled>Select Broker / DP</option>
                    {capitals.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                    ))}
                </select>
            </div>

            <div><label style={labelStyle}>MeroShare Username *</label><input style={inputStyle} type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required /></div>
            <div><label style={labelStyle}>MeroShare Password *</label><input style={inputStyle} type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required /></div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={labelStyle}>BOID (16 digits)</label><input style={inputStyle} type="text" value={formData.boid} onChange={e => setFormData({ ...formData, boid: e.target.value })} /></div>
                <div><label style={labelStyle}>Bank Account (ASBA)</label><input style={inputStyle} type="text" value={formData.accountNumber} onChange={e => setFormData({ ...formData, accountNumber: e.target.value })} /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={labelStyle}>Transaction PIN</label><input style={inputStyle} type="password" maxLength={4} value={formData.pin} onChange={e => setFormData({ ...formData, pin: e.target.value })} /></div>
                <div><label style={labelStyle}>CRN Number</label><input style={inputStyle} type="text" value={formData.crn} onChange={e => setFormData({ ...formData, crn: e.target.value })} /></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, backgroundColor: '#2563eb', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                    {editingAccount ? "Update Profile" : "Save Profile"}
                </button>
                {editingAccount && (
                    <button type="button" onClick={onCancelEdit} style={{ flex: 1, backgroundColor: '#f3f4f6', color: '#4b5563', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}