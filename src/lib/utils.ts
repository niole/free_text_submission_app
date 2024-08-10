export function getHumanReadableDate(date: string) {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}

export function debounce(f, sleepMs = 200) {
    let id;
    return (a) => {
        clearTimeout(id);
        id = setTimeout(() => f(a), sleepMs);
    }
}