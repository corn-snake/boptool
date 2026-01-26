/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export function stripQuotes(str: string): string {
    return str ? str.replace(/\\(.)/g, '$1').replace(/^(["'])(.*?)\1$/, '$2') : str;
}

export function escapeCharacters(str: string, noQuotes?: boolean) {
    if (!str) {
        return str;
    }

    const replacements: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '  ': '&nbsp; ',
        '\r\n': '<br />',
        '\r': '<br />',
        '\n': '<br />',
    };

    if (noQuotes !== false) {
        replacements['"'] = '&#34;';
        replacements['\''] = '&#39;';
        replacements['`'] = '&#96;';
    }

    str = str.replace(/ {2}|\r\n|[&<>\r\n'"`]/g, (match) => replacements[match] || match);

    return str;
}

export function isObject(item: unknown): item is Record<string, any> {
    return (
        !!item &&
        typeof item === 'object' &&
        !Array.isArray(item)
    );
}

export function getObjectPathValue(data: Record<string, any>, key: string): any {
    const index = key.indexOf('.');
    const currentKey = index === -1 ?
        key :
        key.substring(0, index);

    if (index === -1) {
        return data[currentKey];
    }

    if (!isObject(data[currentKey])) {
        return undefined;
    }

    const nextKey = key.substring(currentKey.length + 1);
    return getObjectPathValue(data[currentKey], nextKey);
}

const VALID_SCHEME_REGEX = /^(https?|s?ftp|mailto|spotify|skype|ssh|teamspeak|tel):|(\/\/)|data:image\/(png|bmp|gif|p?jpe?g);/i;

export function escapeUriScheme(url: string) {
    let path: string[] = [];
    // If there is a : before a / then it has a scheme
    const hasScheme = /^[^/]*:/i;

    // Has no scheme or a valid scheme
    if ((!url || !hasScheme.test(url)) || VALID_SCHEME_REGEX.test(url)) {
        return url;
    }

    if (
        typeof window !== 'undefined' &&
        window.location
    ) {
        const { location } = window;

        path = location.pathname.split('/');
        path.pop();

        return `${location.protocol}//${location.host}${path.join('/')}/${url}`;
    }

    return url;
}