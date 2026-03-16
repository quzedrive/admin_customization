
/**
 * Helper to parse package time strings into hours (e.g. "12 Hours" -> 12, "1 Day" -> 24)
 */
export const parseDurationToHours = (timeStr: string): number => {
    if (!timeStr) return 0;
    const lower = timeStr.toLowerCase();
    const num = parseInt(lower.match(/\d+/)?.[0] || '0', 10);

    if (lower.includes('day')) return num * 24;
    if (lower.includes('week')) return num * 24 * 7;
    if (lower.includes('month')) return num * 24 * 30;
    return num; // assume hours if not specified or explicit
};

/**
 * Replicates the pricing logic from the public Car Detail page (Hero.tsx)
 * Uses a greedy approach: prioritizes packages, then half-day extensions, then hourly rates.
 */
export const calculateCarPrice = (car: any, settings: any, totalHours: number) => {
    if (totalHours <= 0) return { price: 0, breakdown: '0 Hours' };

    const rawBaseHour = settings?.baseTiming || '12';
    const baseHourStr = rawBaseHour.replace(/hours?/i, '').trim();
    const baseHoursVal = parseInt(baseHourStr) || 12;

    // Construct base package from car data (equivalent to base plan)
    const basePackage = {
        _id: 'base-plan',
        package: {
            name: `${baseHoursVal} Hours`,
            time: `${baseHoursVal} Hours`
        },
        price: car.basePrice,
        discountPrice: 0,
        isBase: true,
        parsedHours: baseHoursVal
    };

    // Prepare all car packages with their parsed hour durations
    const sortedCarPackages = [...(car.packages || [])]
        .map((p: any) => ({
            ...p,
            parsedHours: parseDurationToHours(p.package?.time || p.package?.name || '')
        }))
        .filter((p: any) => p.parsedHours > 0);

    // Combine and sort by duration descending (greedy approach)
    const allPackages = [
        basePackage,
        ...sortedCarPackages
    ].sort((a: any, b: any) => b.parsedHours - a.parsedHours);

    // 1. Check for exact match (fast path)
    const exactMatch = allPackages.find(p => p.parsedHours === totalHours);
    if (exactMatch) {
        const price = (exactMatch.discountPrice && exactMatch.discountPrice > 0) 
            ? exactMatch.discountPrice 
            : exactMatch.price;
        return {
            price,
            breakdown: `Exact Match: ${exactMatch.package?.name || exactMatch.package?.time}`
        };
    }

    // 2. Greedy calculation logic
    let remainingCalcHours = totalHours;
    let currentPrice = 0;
    let breakdownParts: string[] = [];

    // Find the largest tier package that fits in the total duration
    const tierPackage = allPackages.find(p => p.parsedHours <= totalHours);

    if (tierPackage) {
        const count = Math.floor(remainingCalcHours / tierPackage.parsedHours);
        const pkgPrice = (tierPackage.discountPrice && tierPackage.discountPrice > 0) 
            ? tierPackage.discountPrice 
            : tierPackage.price;

        currentPrice += count * pkgPrice;
        remainingCalcHours -= count * tierPackage.parsedHours;
        breakdownParts.push(`${count > 1 ? count + ' x ' : ''}${tierPackage.package?.name || tierPackage.package?.time}`);

        // Extension Logic: Half Day (12h blocks) from the Tier Package
        const tierHalfDayPrice = tierPackage.halfDayPrice > 0 ? tierPackage.halfDayPrice : 0;
        if (remainingCalcHours >= 12 && tierHalfDayPrice > 0) {
            const extensionBlocks = Math.floor(remainingCalcHours / 12);
            currentPrice += extensionBlocks * tierHalfDayPrice;
            remainingCalcHours -= extensionBlocks * 12;
            breakdownParts.push(`${extensionBlocks > 1 ? extensionBlocks + ' x ' : ''}Half Day Ext`);
        }
    }

    // 3. Hourly fallback for remaining hours (<12h or if no package fit)
    if (remainingCalcHours > 0) {
        // If it's a very short trip and no packages fit, use base price for min duration
        if (currentPrice === 0 && remainingCalcHours <= baseHoursVal) {
            currentPrice = car.basePrice;
            breakdownParts.push(`${baseHoursVal} Hours (Min)`);
        } else {
            const hourlyCost = remainingCalcHours * (car.hourlyCharge || 0);
            currentPrice += hourlyCost;
            breakdownParts.push(`${remainingCalcHours} Hrs x ₹${car.hourlyCharge}`);
        }
    }

    return {
        price: currentPrice,
        breakdown: breakdownParts.join(' + ')
    };
};
