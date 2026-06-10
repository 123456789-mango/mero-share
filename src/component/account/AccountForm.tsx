import React, { useState } from 'react';
import type { UserAccount } from '../../utils/storage';

interface AccountFormProps {
    onAdd: (account: UserAccount) => void;
}

export default function AccountForm({ onAdd }: AccountFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        dpId: '',
        username: '',
        password: '',
        pin: '',
        crn: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.username) return;

        onAdd({
            id: crypto.randomUUID(),
            name: formData.name,
            dpId: formData.dpId,
            username: formData.username,
            pin: formData.pin,
            crn: formData.crn,
        });

        // Reset Form
        setFormData({ name: '', dpId: '', username: '', password: '', pin: '', crn: '' });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Account Holder Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="DP ID (e.g., 13000)"
                value={formData.dpId}
                onChange={e => setFormData({ ...formData, dpId: e.target.value })}
            />
            <input
                type="text"
                placeholder="MeroShare Username"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                required
            />
            <input
                type="password"
                placeholder="Transaction PIN"
                value={formData.pin}
                maxLength={4}
                onChange={e => setFormData({ ...formData, pin: e.target.value })}
            />
            <input
                type="text"
                placeholder="CRN Number"
                value={formData.crn}
                onChange={e => setFormData({ ...formData, crn: e.target.value })}
            />
            <button type="submit" style={{ backgroundColor: '#242424', color: 'white' }}>Save Profile</button>
        </form>
    );
}