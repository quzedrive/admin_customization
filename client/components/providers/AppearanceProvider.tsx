'use client';

import { useEffect } from 'react';
import { useAppearanceSettingsQueries } from '@/lib/hooks/queries/useAppearanceSettingsQueries';

export default function AppearanceProvider({ children }: { children: React.ReactNode }) {
    const { useAppearanceSettings } = useAppearanceSettingsQueries();
    const { data: settings } = useAppearanceSettings();

    useEffect(() => {
        if (settings) {
            const root = document.documentElement;
            // Apply colors to CSS variables
            if (settings.primaryColor) {
                // Assuming you use Tailwind with CSS variables or just inline styles
                // Since we are using Tailwind classes like 'bg-blue-600', effectively changing them dynamically 
                // requires mapping them to CSS vars in tailwind.config.ts OR just using style objects for specific things.
                // HOWEVER, a true "branding" change usually maps a primary color variable.

                // Let's set some standard variables that might be used by a custom tailwind plugin 
                // OR we can just hope the user has set up css vars.
                // For now, let's set standard vars that we can use in our "custom" styles if needed,
                // but honestly, changing 'bg-blue-600' to something else requires Tailwind JIT or CSS vars.

                // Best approach for existing Tailwind codebase without deep refactor:
                // Just handle specific "themeable" areas or assume we are injecting a <style> tag.

                root.style.setProperty('--color-primary', settings.primaryColor);
                root.style.setProperty('--color-secondary', settings.secondaryColor);
                root.style.setProperty('--color-icon', settings.iconColor);
            }
        }
    }, [settings]);

    return <>{children}</>;
}
