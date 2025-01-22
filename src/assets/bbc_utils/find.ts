/*
 * Copyright (c) 2022.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

/**
 * begin nested ../../utils
 */

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isObject(item: unknown): item is Record<string, any> {
    return (
        !!item &&
        typeof item === 'object' &&
        !Array.isArray(item)
    );
}

/**
 * end nested ../../utils
 */

/**
 *
 * @param one
 * @param two
 */
function isMatch(one: unknown, two: unknown) {
    if (!one) {
        return true;
    }

    if (Array.isArray(one)) {
        if (
            typeof two !== 'string' &&
            typeof two !== 'number'
        ) {
            return false;
        }

        return one.some((item) => typeof item === 'string' && item.trim() === `${two}`.trim());
    }

    if (!isObject(one) || !isObject(two)) {
        return false;
    }

    const keys = Object.keys(one);
    for (let i = 0; i < keys.length; i++) {
        if (!hasOwnProperty(one, keys[i]) || !hasOwnProperty(two, keys[i])) {
            return false;
        }

        if (!one[keys[i]]) {
            // eslint-disable-next-line no-continue
            continue;
        }

        if (!isMatch(one[keys[i]], two[keys[i]])) {
            return false;
        }
    }

    return true;
}

function isHTMLConditionMatch(condition, token): boolean {
    if (
        !condition.tag &&
        !condition.attribute
    ) {
        return false;
    }

    if (
        condition.tag
    ) {
        if (condition.tag !== token.name.toLowerCase()) {
            return false;
        }
    }

    if (
        condition.attribute
    ) {
        const keys = Object.keys(condition.attribute);
        for (let i = 0; i < keys.length; i++) {
            if (!isMatch(condition.attribute, token.attrs)) {
                return false;
            }
        }
    }

    return true;
}

function isHandlerMatch(handler, token): boolean {
    if (typeof handler.conditions === 'undefined') {
        return false;
    }

    for (let i = 0; i < handler.conditions.length; i++) {
        if (isHTMLConditionMatch(handler.conditions[i], token)) {
            return true;
        }
    }

    return false;
}

export function findHandlerForHTMLToken(handlers, token?) {
    if (typeof token === 'undefined') {
        return undefined;
    }
    const items = handlers.get();
    const keys = Object.keys(items);

    for (let i = 0; i < keys.length; i++) {
        if (isHandlerMatch(items[keys[i]], token)) {
            return items[keys[i]];
        }
    }

    return undefined;
}