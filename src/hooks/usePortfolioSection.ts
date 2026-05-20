"use client";
import { useState, useEffect, useCallback } from 'react';

export function usePortfolioSection<T>(section: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        fetch('/api/portfolio')
            .then(r => r.json())
            .then(d => { setData(d[section] ?? d); setLoading(false); })
            .catch(() => setLoading(false));
    }, [section]);

    const save = useCallback(async (payload: any) => {
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch('/api/portfolio', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ section, data: payload }),
            });
            if (res.ok) {
                setMessage({ type: 'success', text: 'Saved successfully!' });
                setData(payload);
            } else {
                setMessage({ type: 'error', text: 'Failed to save.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error.' });
        }
        setSaving(false);
        setTimeout(() => setMessage(null), 3000);
    }, [section]);

    return { data, setData, loading, saving, save, message };
}
