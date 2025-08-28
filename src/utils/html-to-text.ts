/**
 * Configuration options for HTML to text conversion
 */
interface HtmlToTextOptions {
  /** Maximum length of the output text (0 = no limit) */
  maxLength?: number;
  /** Whether to preserve line breaks */
  preserveLineBreaks?: boolean;
  /** Whether to preserve whitespace */
  preserveWhitespace?: boolean;
  /** Custom separator for list items */
  listItemSeparator?: string;
  /** Whether to decode HTML entities */
  decodeEntities?: boolean;
  /** Custom block elements that should add line breaks */
  blockElements?: string[];
  /** Whether to trim the final result */
  trim?: boolean;
}

/**
 * Default configuration for HTML to text conversion
 */
const DEFAULT_OPTIONS: Required<HtmlToTextOptions> = {
  maxLength: 0,
  preserveLineBreaks: true,
  preserveWhitespace: false,
  listItemSeparator: "• ",
  decodeEntities: true,
  blockElements: [
    "div",
    "p",
    "br",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "li",
    "ul",
    "ol",
  ],
  trim: true,
};

/**
 * HTML entities map for decoding common entities
 */
const HTML_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&euro;": "€",
  "&pound;": "£",
  "&yen;": "¥",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
  "&hellip;": "...",
  "&mdash;": "—",
  "&ndash;": "–",
  "&laquo;": "«",
  "&raquo;": "»",
  "&times;": "×",
  "&divide;": "÷",
};

/**
 * Cache for compiled regex patterns to improve performance
 */
const REGEX_CACHE = {
  htmlTags: /<[^>]*>/g,
  htmlEntities: /&[a-zA-Z0-9#]+;/g,
  whitespace: /\s+/g,
  multipleLineBreaks: /\n{3,}/g,
  leadingTrailingSpaces: /^\s+|\s+$/g,
  blockElementsStart: null as RegExp | null,
  blockElementsEnd: null as RegExp | null,
};

/**
 * Decodes HTML entities in a string
 * @param text - The text containing HTML entities
 * @returns The text with decoded entities
 */
function decodeHtmlEntities(text: string): string {
  return text.replace(REGEX_CACHE.htmlEntities, (entity) => {
    // Check predefined entities
    if (HTML_ENTITIES[entity]) {
      return HTML_ENTITIES[entity];
    }

    // Handle numeric entities (&#123; or &#x1a;)
    if (entity.startsWith("&#")) {
      const isHex = entity.startsWith("&#x");
      const numStr = entity.slice(isHex ? 3 : 2, -1);
      const num = parseInt(numStr, isHex ? 16 : 10);

      if (!isNaN(num) && num >= 0 && num <= 0x10ffff) {
        return String.fromCharCode(num);
      }
    }

    // Return original if can't decode
    return entity;
  });
}

/**
 * Builds regex patterns for block elements
 * @param blockElements - Array of block element names
 */
function buildBlockElementsRegex(blockElements: string[]): void {
  if (!REGEX_CACHE.blockElementsStart) {
    const elements = blockElements.join("|");
    REGEX_CACHE.blockElementsStart = new RegExp(
      `<(${elements})\\b[^>]*>`,
      "gi"
    );
    REGEX_CACHE.blockElementsEnd = new RegExp(`</(${elements})>`, "gi");
  }
}

/**
 * Processes HTML content to handle block elements and line breaks
 * @param html - The HTML content
 * @param options - Conversion options
 * @returns Processed HTML with line breaks
 */
function processBlockElements(
  html: string,
  options: Required<HtmlToTextOptions>
): string {
  buildBlockElementsRegex(options.blockElements);

  let processed = html;

  // Add line breaks before and after block elements
  if (REGEX_CACHE.blockElementsStart && REGEX_CACHE.blockElementsEnd) {
    processed = processed
      .replace(REGEX_CACHE.blockElementsStart, "\n$&")
      .replace(REGEX_CACHE.blockElementsEnd, "$&\n");
  }

  // Handle specific elements
  processed = processed
    // Convert <br> to line breaks
    .replace(/<br\s*\/?>/gi, "\n")
    // Convert list items
    .replace(/<li\b[^>]*>/gi, `\n${options.listItemSeparator}`)
    .replace(/<\/li>/gi, "")
    // Add line breaks for paragraphs
    .replace(/<p\b[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n");

  return processed;
}

/**
 * Normalizes whitespace in text according to options
 * @param text - The text to normalize
 * @param options - Conversion options
 * @returns Normalized text
 */
function normalizeWhitespace(
  text: string,
  options: Required<HtmlToTextOptions>
): string {
  if (!options.preserveWhitespace) {
    // Collapse multiple spaces into single space
    text = text.replace(REGEX_CACHE.whitespace, " ");
  }

  if (!options.preserveLineBreaks) {
    // Remove all line breaks
    text = text.replace(/\n/g, " ");
  } else {
    // Limit consecutive line breaks
    text = text.replace(REGEX_CACHE.multipleLineBreaks, "\n\n");
  }

  return text;
}

/**
 * Converts HTML content to plain text
 *
 * This function efficiently removes HTML tags and optionally decodes HTML entities,
 * while providing various formatting options for the output text.
 *
 * @param html - The HTML content to convert
 * @param options - Configuration options for the conversion
 * @returns The converted plain text
 *
 * @example
 * ```typescript
 * // Basic usage
 * const text = htmlToText('<p>Hello <strong>world</strong>!</p>');
 * // Result: "Hello world!"
 *
 * // With options
 * const text = htmlToText('<ul><li>Item 1</li><li>Item 2</li></ul>', {
 *   listItemSeparator: '- ',
 *   preserveLineBreaks: true
 * });
 * // Result: "- Item 1\n- Item 2"
 *
 * // With length limit
 * const text = htmlToText('<p>This is a very long text...</p>', {
 *   maxLength: 20
 * });
 * // Result: "This is a very long..."
 * ```
 */
export function htmlToText(
  html: string,
  options: HtmlToTextOptions = {}
): string {
  // Input validation
  if (typeof html !== "string") {
    return "";
  }

  if (!html.trim()) {
    return "";
  }

  // Merge with default options
  const config: Required<HtmlToTextOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  // Process the HTML
  let result = html;

  // Handle block elements and add appropriate line breaks
  result = processBlockElements(result, config);

  // Remove all HTML tags
  result = result.replace(REGEX_CACHE.htmlTags, "");

  // Decode HTML entities if requested
  if (config.decodeEntities) {
    result = decodeHtmlEntities(result);
  }

  // Normalize whitespace
  result = normalizeWhitespace(result, config);

  // Trim if requested
  if (config.trim) {
    result = result.trim();
  }

  // Apply length limit if specified
  if (config.maxLength > 0 && result.length > config.maxLength) {
    result = result.substring(0, config.maxLength - 3) + "...";
  }

  return result;
}

/**
 * Strips HTML tags from text while preserving the content
 * A simplified version of htmlToText for basic tag removal
 *
 * @param html - The HTML content
 * @returns Text with HTML tags removed
 *
 * @example
 * ```typescript
 * const text = stripHtmlTags('<p>Hello <em>world</em>!</p>');
 * // Result: "Hello world!"
 * ```
 */
export function stripHtmlTags(html: string): string {
  if (typeof html !== "string") {
    return "";
  }

  return html.replace(REGEX_CACHE.htmlTags, "").trim();
}

/**
 * Extracts text content and limits it to a specific length
 * Useful for creating previews or summaries
 *
 * @param html - The HTML content
 * @param maxLength - Maximum length of the result
 * @param suffix - Suffix to add when text is truncated (default: '...')
 * @returns Truncated plain text
 *
 * @example
 * ```typescript
 * const preview = extractTextPreview('<p>This is a long description...</p>', 20);
 * // Result: "This is a long des..."
 *
 * const preview = extractTextPreview('<p>Short text</p>', 50);
 * // Result: "Short text"
 * ```
 */
export function extractTextPreview(
  html: string,
  maxLength: number,
  suffix: string = "..."
): string {
  const text = htmlToText(html, {
    preserveLineBreaks: false,
    preserveWhitespace: false,
    trim: true,
  });

  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength - suffix.length);

  // Try to break at word boundary
  const lastSpaceIndex = truncated.lastIndexOf(" ");
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + suffix;
  }

  return truncated + suffix;
}

/**
 * Checks if a string contains HTML tags
 *
 * @param text - The text to check
 * @returns True if the text contains HTML tags
 *
 * @example
 * ```typescript
 * ```
 */
export function hasHtmlTags(text: string): boolean {
  if (typeof text !== "string") {
    return false;
  }

  return REGEX_CACHE.htmlTags.test(text);
}

/**
 * Default export for the main conversion function
 */
export default htmlToText;
