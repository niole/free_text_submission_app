export function buildLink(path: string) {
    return `${window.location.origin}${path}`;
}

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

export async function doFetch(url: string, opts: any = undefined, isFormAction: boolean = false) {
    return fetch(url, opts)
    .then(x => {
        if (x.ok) {
            if (isFormAction) {
                return x.text();
            }
            return x.json();
        } else {
            return x.error().text().then(x => {
                throw new Error(x);
            });
        }
    });

}