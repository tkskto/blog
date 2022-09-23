/**
 * https://github.com/markedjs/marked/blob/master/src/Renderer.js
 * @type {{paragraph(*), blockquote(string): string, code(*, *, *): string, heading(*, *): string, hr(), list(*, *, *), listitem(*)}}
 */
export const renderer = {
    /***
     * コードブロックで囲った場合
     * @param code
     * @param infostring
     * @param escaped
     * @returns {string}
     */
    code(code, infostring, escaped) {
        const lang = (infostring || '').match(/\S*/)[0];

        if (this.options.highlight) {
            const out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }

        code = code.replace(/\n$/, '') + '\n';

        if (!lang) {
            return `<pre class="my-2 mx-0 whitespace-normal">
                <code class="text-lg bg-neutral-700 text-neutral-100 shadow-inner whitespace-pre block overflow-auto p-3 rounded">
                ${code}
            </code></pre>`;
        }

        return '<pre class="my-2 mx-0 whitespace-normal">' +
            '<code class="text-lg bg-neutral-700 text-neutral-100 shadow-inner whitespace-pre block overflow-auto p-3 rounded'
            + this.options.langPrefix
            + lang
            + '">'
            + code
            + '</code></pre>\n';
    },

    /**
     * 見出し
     * @param text
     * @param level
     * @returns {string}
     */
    heading(text, level) {
        const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

        if (level === 2) {
            return `
            <h2 id="${escapedText}" class="text-4xl md:text-3xl font-bold mt-10 mb-12">
              ${text}
            </h2>`;
        }

        if (level === 3) {
            return `
            <h3 id="${escapedText}" class="text-3xl md:text-2xl font-bold mt-6 mb-8">
              ${text}
            </h3>`;
        }

        if (level === 4) {
            return `
            <h4 id="${escapedText}" class="text-2xl font-bold mt-4 mb-4">
              ${text}
            </h4>`;
        }

        return `
            <h${level} id="${escapedText}" class="text-xl font-bold mt-2 mb-2">
              ${text}
            </h${level}>`;
    },

    /**
     * @param {string} quote
     */
    blockquote(quote) {
        return `<blockquote class="mx-0 my-3 p-2">
            <div class="p-4 mb-0 border-l-4 border-neutral-200 text-neutral-600">
            ${quote.replace(' mb-8', '')}
        </div></blockquote>`;
    },

    /**
     * 罫線
     */
    hr() {
        return '<hr class="mb-4">';
    },

    list(body, ordered) {
        const type = ordered ? 'ol' : 'ul';

        return `<${type} class="mt-0 mr-0 mb-2 ml-5 text-2xl font-normal list-disc list-outside">
                ${body}
            </${type}>`;
    },

    listitem(text) {
        return `<li class="leading-loose">${text}</li>`;
    },

    paragraph(text) {
        return `<p class="font-normal mb-8 text-2xl leading-loose">${text}</p>\n`;
    },

    /**
     * span level renderer8
     * @param {string} text
     */
    strong(text) {
        return `<strong>${text}</strong>`;
    },

    /**
     * @param {string} text
     */
    em(text) {
        return `<em>${text}</em>`;
    },

    /**
     * @param {string} text
     */
    codespan(text) {
        return `<code class="bg-neutral-100 text-neutral-500 p-1">${text}</code>`;
    },

    /**
     * @param {string} text
     */
    del(text) {
        return `<del>${text}</del>`;
    },

    /**
     * @param {string} href
     * @param {string} title
     * @param {string} text
     */
    link(href, title, text) {
        if (href === null) {
            return text;
        }
        let out = '<a class="text-blue-700 underline" href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    },
};
