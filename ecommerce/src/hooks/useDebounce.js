import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    // Değerin geciktirilmiş hali
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Belirlenen delay süresi sonunda değeri güncelle
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup fonksiyonu
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Sadece value veya delay değiştiğinde bu effect çalışır

    return debouncedValue;
}

export default useDebounce;
