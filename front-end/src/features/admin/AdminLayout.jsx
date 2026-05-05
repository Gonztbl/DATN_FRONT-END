import { useEffect } from 'react';

/**
 * AdminLayout - Wrapper component for all admin pages.
 * Locks body scroll to prevent double-scrollbar issue while inside admin dashboard.
 * Restores scroll when navigating away from admin pages.
 */
export default function AdminLayout({ children }) {
    useEffect(() => {
        // Lock body scroll — admin pages manage their own scroll via overflow-y-auto on <main>
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        return () => {
            // Restore when navigating away from admin pages
            document.body.style.overflow = prevOverflow || '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    return children;
}
