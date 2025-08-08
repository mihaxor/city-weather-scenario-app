import {useEffect, useState} from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState<string>('dark');

    useEffect(() => {
        document.body.style.backgroundColor = theme === 'light' ? '#fff' : '#212529';
        document.body.setAttribute('data-bs-theme', theme);
    }, [theme]);

    const reverseTheme = (theme: string) => theme === 'dark' ? 'light' : 'dark';

    return {
        theme,
        setTheme,
        reverseTheme
    };
}