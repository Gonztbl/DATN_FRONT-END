import { useEffect, useState } from "react";
import transactionService from "../../wallet/api/transactionService";

export default function useSpendingSummary() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchSummary = async () => {
            try {
                setLoading(true);
                const res = await transactionService.getSpendingAnalytics();
                if (isMounted) {
                    setData(res.data);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err);
                    console.error("Failed to fetch spending summary", err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchSummary();

        return () => {
            isMounted = false;
        };
    }, []);

    return { data, loading, error };
}
