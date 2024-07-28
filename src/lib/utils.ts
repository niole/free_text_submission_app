export function getHumanReadableDate(date: string) {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
}
