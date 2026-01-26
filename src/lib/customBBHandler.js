import _ from "lodash";
const getObjectPathValue = _.get;
import { normaliseColor, escapeCharacters, stripQuotes, escapeUriScheme } from "./bbc_utils/index.ts";
const html_grabber = (ctx, stat, spec="attributes.default") => {
    const f = _.get(ctx, spec, '');
    return `<span style="${stat}: ${f}"><div class="markup_artifact">${ctx.token.value}</div>${ctx.content}<div class="markup_artifact">${ctx.token.closing.value}</div></span>`;
};
export const handlers = {
    h1: {
        conditions: [{ tag: 'h1' }],
        bbcode: '[h1]{0}[/h1]',
        html: '<h1><div class="markup_artifact">[h1]</div>{0}<div class="markup_artifact">[/h1]</div></h1>',
    },
    h2: {
        conditions: [{ tag: 'h2' }],
        bbcode: '[h2]{0}[/h2]',
        html: '<h2><div class="markup_artifact">[h2]</div>{0}<div class="markup_artifact">[/h2]</div></h2>',
    },
    h3: {
        conditions: [{ tag: 'h3' }],
        bbcode: '[h3]{0}[/h3]',
        html: '<h3><div class="markup_artifact">[h3]</div>{0}<div class="markup_artifact">[/h3]</div></h3>',
    },
    h4: {
        conditions: [{ tag: 'h4' }],
        bbcode: '[h4]{0}[/h4]',
        html: '<h4><div class="markup_artifact">[h4]</div>{0}<div class="markup_artifact">[/h4]</div></h4>',
    },
    h5: {
        conditions: [{ tag: 'h5' }],
        bbcode: '[h5]{0}[/h5]',
        html: '<h5><div class="markup_artifact">[h5]</div>{0}<div class="markup_artifact">[/h5]</div></h5>',
    },
    h6: {
        conditions: [{ tag: 'h6' }],
        bbcode: '[h6]{0}[/h6]',
        html: '<h6><div class="markup_artifact">[h5]</div>{0}<div class="markup_artifact">[/h5]</div></h6>',
    },
    // START_COMMAND: Bold
    b: {
        conditions: [
            { tag: 'b' },
            { tag: 'strong' },
            {
                attribute: {
                    style: {
                        fontWeight: ['bold', 'bolder', '401', '700', '800', '900'],
                    },
                },
            },
        ],
        bbcode: '[b]{0}[/b]',
        html: '<strong><div class="markup_artifact">[b]</div>{0}<div class="markup_artifact">[/b]</div></strong>',
    },
    // END_COMMAND

    // START_COMMAND: Italic
    i: {
        conditions: [
            { tag: 'i' },
            { tag: 'em' },
            {
                attribute: {
                    style: {
                        textDecoration: ['italic', 'oblique'],
                    },
                },
            },
        ],
        bbcode: '[i]{0}[/i]',
        html: '<em><div class="markup_artifact">[i]</div>{0}<div class="markup_artifact">[/i]</div></em>',
    },
    // END_COMMAND

    // START_COMMAND: Underline
    u: {
        conditions: [
            { tag: 'u' },
            {
                attribute: {
                    style: {
                        textDecoration: ['underline'],
                    },
                },
            },
        ],
        bbcode: '[u]{0}[/u]',
        html: '<u><div class="markup_artifact">[u]</div>{0}<div class="markup_artifact">[/u]</div></u>',
    },
    // END_COMMAND

    // START_COMMAND: Strikethrough
    s: {
        conditions: [
            { tag: 's' },
            { tag: 'strike' },
            {
                attribute: {
                    style: {
                        textDecoration: ['line-through'],
                    },
                },
            },
        ],
        bbcode: '[s]{0}[/s]',
        html: '<s><div class="markup_artifact">[s]</div>{0}<div class="markup_artifact">[/s]</div></s>',
    },
    // END_COMMAND

    // START_COMMAND: Subscript
    sub: {
        conditions: [
            { tag: 'sub' },
        ],
        bbcode: '[sub]{0}[/sub]',
        html: '<sub><div class="markup_artifact">[sub]</div>{0}<div class="markup_artifact">[/sub]</div></sub>',
    },
    // END_COMMAND

    // START_COMMAND: Superscript
    sup: {
        conditions: [
            { tag: 'sup' },
        ],
        bbcode: '[sup]{0}[/sup]',
        html: '<sup><div class="markup_artifact">[sup]</div>{0}<div class="markup_artifact">[/sup]</div></sup>',
    },
    // END_COMMAND

    // START_COMMAND: Font
    font: {
        conditions: [
            {
                attribute: {
                    style: {
                        fontFamily: null,
                    },
                },
            },
        ],
        quoteType: 'never',
        bbcode(context) {
            const font = getObjectPathValue(context.attributes, 'style.fontFamily');
            return `[font=${stripQuotes(font || '')}]${context.content}[/font]`;
        },
        html: (ctx) => html_grabber(ctx, "font-family"),
    },
    // END_COMMAND

    // START_COMMAND: Size
    size: {
        conditions: [
            {
                attribute: {
                    style: {
                        fontSize: null,
                    },
                },
            },
        ],
        bbcode(context) {
            const fontSize = getObjectPathValue(context.attributes, 'size');
            return `[size=${fontSize || ''}]${context.content}[/size]`;
        },
        html: (ctx) => html_grabber(ctx, "font-size")
    },
    // END_COMMAND

    // START_COMMAND: Color
    color: {
        conditions: [
            {
                attribute: {
                    style: {
                        color: null,
                    },
                },
            },
        ],
        quoteType: 'never',
        bbcode(context) {
            const color = getObjectPathValue(context.attributes, 'color');

            return `[color=${normaliseColor(color) || ''}]${context.content}[/color]`;
        },
        html(context) {
            return `<span style="color: ${escapeCharacters(normaliseColor(context.attributes.default), true) || ''}"><div class="markup_artifact">${context.token.value}</div>${context.content}<div class="markup_artifact">${context.token.closing.value}</div></span>`;
        },
    },
    colour: {
        conditions: [
            {
                attribute: {
                    style: {
                        color: null,
                    },
                },
            },
        ],
        quoteType: 'never',
        bbcode(context) {
            const colour = getObjectPathValue(context.attributes, 'colour');

            return `[colour=${normaliseColor(colour) || ''}]${context.content}[/colour]`;
        },
        html(context) {
            return `<span style="color: ${escapeCharacters(normaliseColor(context.attributes.default), true) || ''}"><div class="markup_artifact">${context.token.value}</div>${context.content}<div class="markup_artifact">${context.token.closing.value}</div></span>`;
        },
    },
    // END_COMMAND

    // START_COMMAND: Lists
    ul: {
        conditions: [
            { tag: 'ul' },
        ],
        breakStart: true,
        isInline: false,
        skipLastLineBreak: true,
        bbcode: '[ul]{0}[/ul]',
        html: '<ul><div class="markup_artifact">[ul]</div>{0}<div class="markup_artifact">[/ul]</div></ul>',
    },
    list: {
        breakStart: true,
        isInline: false,
        skipLastLineBreak: true,
        html: '<div class="markup_artifact">[list]</div><ul>{0}</ul><div class="markup_artifact">[/list]</div>',
    },
    ol: {
        conditions: [
            { tag: 'ol' },
        ],
        breakStart: true,
        isInline: false,
        skipLastLineBreak: true,
        bbcode: '[ol]{0}[/ol]',
        html: '<ol><div class="markup_artifact">[ol]</div>{0}<div class="markup_artifact">[/ol]</div></ol>',
    },
    li: {
        conditions: [
            { tag: 'li' },
        ],
        isInline: true,
        closedBy: ['/ul', '/ol', '/list', '*', 'li'],
        bbcode: '[li]{0}[/li]',
        html: '<li><div class="markup_artifact">[li]</div>{0}<div class="markup_artifact">[/li]</div></li>',
    },
    '*': {
        isInline: false,
        closedBy: ['/ul', '/ol', '/list', '*', 'li'],
        html: '<li>{0}</li>',
    },
    // END_COMMAND

    // START_COMMAND: Table
    table: {
        conditions: [
            { tag: 'table' },
        ],
        breakStart: false,
        breakEnd: false,
        skipLastLineBreak: true,
        isInline: true,
        bbcode: '[table]{0}[/table]',
        html: '<div class="markup_artifact">[table]</div><div class="faketable">{0}</div><div class="markup_artifact">[/table]</div>',
    },
    tr: {
        conditions: [
            { tag: 'tr' },
        ],
        breakStart: false,
        breakEnd: false,
        isInline: true,
        skipLastLineBreak: true,
        breakBefore: false,
        bbcode: '[tr]{0}[/tr]',
        html: '<div class="markup_artifact">[tr]</div><span class="fakerow"><br>{0}</span><div class="markup_artifact">[/tr]</div>',
    },
    th: {
        conditions: [
            { tag: 'th' },
        ],
        allowsEmpty: true,
        isInline: true,
        breakStart: false,
        breakEnd: false,
        breakBefore: false,
        breakAfter: true,
        bbcode: '[th]{0}[/th]',
        html: '<div class="faketd head"><div class="markup_artifact">[th]</div>{0}<div class="markup_artifact">[/th]</div></div>',
    },
    td: {
        conditions: [
            { tag: 'td' },
        ],
        allowsEmpty: true,
        isInline: true,
        breakStart:false,
        breakEnd: false,
        breakAfter: true,
        breakBefore: false,
        bbcode: '[td]{0}[/td]',
        html: '<div class="faketd"><div class="markup_artifact">[td]</div>{0}<div class="markup_artifact">[/td]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: Emoticons
    // END_COMMAND

    // START_COMMAND: Horizontal Rule
    hr: {
        conditions: [
            { tag: 'hr' },
        ],
        allowsEmpty: true,
        isSelfClosing: true,
        isInline: false,
        bbcode: '[hr]{0}',
        html: '<div class="markup_artifact">[hr]</div><hr />',
    },
    '---': {
        isInline: false,
        isSelfClosing: true,
        allowsEmpty: true,
        html: '<div class="hrwrap"><div class="markup_artifact">[---]</div><hr /></div>'
    },
    // END_COMMAND

    // START_COMMAND: Image
    img: {
        allowsEmpty: true,
        conditions: [
            { tag: 'img', attribute: { src: null } },
        ],
        allowedChildren: ['#'],
        quoteType: 'never',
        bbcode(context) {
            let attribs = '';

            const width = getObjectPathValue(context.attributes, 'width') || getObjectPathValue(context.attributes, 'style.width');
            const height = getObjectPathValue(context.attributes, 'height') || getObjectPathValue(context.attributes, 'style.height');

            // only add width and height if one is specified
            if (width && height) {
                attribs = `=${width}x${height}`;
            }

            return `[img${attribs}]${getObjectPathValue(context.attributes, 'src')}[/img]`;
        },
        html(context) {
            let width = '';
            let height = '';
            let match;
            let attribs = '';

            // handle [img width=340 height=240]url[/img]
            width = context.attributes.width;
            height = context.attributes.height;

            // handle [img=340x240]url[/img]
            if (context.attributes.default) {
                match = context.attributes.default.split(/x/i);

                // eslint-disable-next-line prefer-destructuring
                width = match[0];
                height = (match.length === 2 ? match[1] : match[0]);
            }

            if (typeof width !== 'undefined') {
                attribs += ` width="${escapeCharacters(width, true)}"`;
            }

            if (typeof height !== 'undefined') {
                attribs += ` height="${escapeCharacters(height, true)}"`;
            }

            return `<div class="markup_artifact">${context.token.value}</div><img${attribs} src="${escapeUriScheme(context.content)}" /><div class="markup_artifact">${context.token.closing.value}</div>`;
        },
    },
    // END_COMMAND

    // START_COMMAND: URL
    url: {
        allowsEmpty: true,
        conditions: [
            { tag: 'a', attribute: { href: null } },
        ],
        quoteType: 'never',
        bbcode(context) {
            const url = getObjectPathValue(context.attributes, 'href');

            // make sure this link is not an e-mail,
            // if it is return e-mail BBCode
            if (url && url.substring(0, 7) === 'mailto:') {
                return `[email=${url.substring(7)}]${context.content}[/email]`;
            }

            return `[url=${url}]${context.content}[/url]`;
        },
        html(context) {
            context.attributes.default = context.attributes.default ? escapeCharacters(context.attributes.default, true) : context.content;

            return `<div class="markup_artifact">${context.token.value}</div><a href="${escapeUriScheme(context.attributes.default)}">${context.content}</a><div class="markup_artifact">${context.token.closing.value}</div>`;
        },
    },
    // END_COMMAND

    // START_COMMAND: E-mail
    email: {
        quoteType: 'never',
        html(context) {
            return `<div class="markup_artifact">${context.token.value}</div><a href="mailto:${context.attributes.default ? escapeCharacters(context.attributes.default, true) : context.content}">${context.content}</a><div class="markup_artifact">${context.token.closing.value}</div>`;
        },
    },
    // END_COMMAND

    // START_COMMAND: Quote
    quote: {
        conditions: [
            { tag: 'blockquote' },
        ],
        isInline: false,
        quoteType: 'never',
        bbcode(context) {
            const authorAttr = 'data-author';
            let author = getObjectPathValue(context.attributes, authorAttr);
            if (!author) {
                let index = -1;

                for (let i = 0; i < context.token.children.length; i++) {
                    if (context.token.children[i].name.toLowerCase() === 'cite') {
                        index = i;
                    }
                }

                if (index > -1) {
                    const citeChild = context.token.children[index].children[0];
                    if (citeChild) {
                        author = citeChild.value.replace(/(^\s+|\s+$)/g, '');

                        context.token.children.splice(index, 1);
                        context.content = convertHTMLToBBCode({
                            tokens: context.token.children,
                            options: context.options,
                            handlers: context.handlers,
                        });
                    }
                }
            }

            return `[quote${(author ? `=${author}` : '')}]${context.content}[/quote]`;
        },
        html(context) {
            if (context.attributes.default) {
                context.content = `<cite>${escapeCharacters(context.attributes.default)}</cite>${context.content}`;
            }

            return `<div class="markup_artifact">${context.token.value}</div><blockquote>${context.content}</blockquote><div class="markup_artifact">${context.token.value}</div>`;
        },
    },
    // END_COMMAND

    // START_COMMAND: Code
    code: {
        conditions: [
            { tag: 'code' },
        ],
        isInline: false,
        allowedChildren: ['#', '#newline'],
        bbcode: '[code]{0}[/code]',
        html: '<div class="markup_artifact">[code]</div><code>{0}</code><div class="markup_artifact">[/code]</div>',
    },
    // END_COMMAND

    // START_COMMAND: Left
    left: {
        conditions: [
            {
                attribute: {
                    style: {
                        textAlign: [
                            'left',
                            '-webkit-left',
                            '-moz-left',
                            '-khtml-left',
                        ],
                    },
                },
            },
        ],
        isInline: false,
        allowsEmpty: true,
        bbcode: '[left]{0}[/left]',
        html: '<div style="text-align: left"><div class="markup_artifact">[left]</div>{0}<div class="markup_artifact">[/left]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: Centre
    center: {
        conditions: [
            {
                attribute: {
                    style: {
                        textAlign: [
                            'center',
                            '-webkit-center',
                            '-moz-center',
                            '-khtml-center',
                        ],
                    },
                },
            },
        ],
        isInline: false,
        allowsEmpty: true,
        bbcode: '[center]{0}[/center]',
        html: '<div style="text-align: center"><div class="markup_artifact">[center]</div>{0}<div class="markup_artifact">[/center]</div></div>',
    },
    centre: {
        conditions: [
            {
                attribute: {
                    style: {
                        textAlign: [
                            'center',
                            '-webkit-center',
                            '-moz-center',
                            '-khtml-center',
                        ],
                    },
                },
            },
        ],
        isInline: false,
        allowsEmpty: true,
        bbcode: '[centre]{0}[/centre]',
        html: '<div style="text-align: center"><div class="markup_artifact">[centre]</div>{0}<div class="markup_artifact">[/centre]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: Right
    right: {
        conditions: [
            {
                attribute: {
                    style: {
                        textAlign: [
                            'right',
                            '-webkit-right',
                            '-moz-right',
                            '-khtml-right',
                        ],
                    },
                },
            },
        ],
        isInline: false,
        allowsEmpty: true,
        bbcode: '[right]{0}[/right]',
        html: '<div style="text-align: right"><div class="markup_artifact">[right]</div>{0}<div class="markup_artifact">[/right]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: Justify
    justify: {
        conditions: [
            {
                attribute: {
                    style: {
                        textAlign: [
                            'justify',
                            '-webkit-justify',
                            '-moz-justify',
                            '-khtml-justify',
                        ],
                    },
                },
            },
        ],
        isInline: false,
        allowsEmpty: true,
        bbcode: '[justify]{0}[/justify]',
        html: '<div style="text-align: justify"><div class="markup_artifact">[justify]</div>{0}<div class="markup_artifact">[/justify]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: YouTube
    youtube: {
        allowsEmpty: true,
        conditions: [
            { tag: 'iframe', attribute: { 'data-youtube-id': null } },
        ],
        bbcode(context) {
            const value = getObjectPathValue(context.attributes, 'data-youtube-id');

            return value ? `[youtube]${value}[/youtube]` : '';
        },
        html: '<div class="markup_artifact">[youtube]</div><iframe width="560" height="315" ' +
            'src="https://www.youtube-nocookie.com/embed/{0}?wmode=opaque" ' +
            'data-youtube-id="{0}" allowfullscreen></iframe><div class="markup_artifact">[/youtube]</div>',
    },
    // END_COMMAND

    // START_COMMAND: Rtl
    rtl: {
        conditions: [
            {
                attribute: {
                    style: {
                        direction: ['rtl'],
                    },
                },
            },
        ],
        isInline: false,
        bbcode: '[rtl]{0}[/rtl]',
        html: '<div style="direction: rtl"><div class="markup_artifact">[rtl]</div>{0}<div class="markup_artifact">[/rtl]</div></div>',
    },
    // END_COMMAND

    // START_COMMAND: Ltr
    ltr: {
        conditions: [
            {
                attribute: {
                    style: {
                        direction: ['ltr'],
                    },
                },
            },
        ],
        isInline: false,
        bbcode: '[ltr]{0}[/ltr]',
        html: '<div style="direction: ltr"><div class="markup_artifact">[ltr]</div>{0}<div class="markup_artifact">[/ltr]</div></div>',
    },
    // END_COMMAND
}