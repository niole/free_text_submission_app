export function copyUrlToClipBoard(link: string) {
    navigator.clipboard.writeText(link);
}

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

export async function doFetch(url: string, opts = undefined) {
    return fetch(url, opts)
    .then(x => {
        if (x.ok) {
            return x.json();
        } else {
            return x.error().text().then(x => {
                throw new Error(x);
            });
        }
    });

}