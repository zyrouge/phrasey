export const jsonGet = async <T extends object>(url: string) => {
    const resp = await fetch(url);
    const data = await resp.json();
    return data as T;
};

export const jsonPost = async <U extends object, V extends object>(
    url: string,
    body: U,
) => {
    const resp = await fetch(url, { body: JSON.stringify(body) });
    const data = await resp.json();
    return data as V;
};
