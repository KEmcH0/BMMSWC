import { Fragment } from "react";

// A link ends at a space or at Bangla text; punctuation right after it belongs to the sentence.
const LINK = /(https?:\/\/[^\sঀ-৿]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]'"।]+$/;

// Plain text with any http(s) links made clickable.
export default function LinkedText({ text }: { text: string }) {
  return text.split(LINK).map((part, i) => {
    // Splitting on a capture group puts the links at the odd positions.
    if (i % 2 === 0) return part;
    const url = part.replace(TRAILING_PUNCTUATION, "");
    return (
      <Fragment key={i}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary dark:text-secondary underline underline-offset-4 break-all"
        >
          {url}
        </a>
        {part.slice(url.length)}
      </Fragment>
    );
  });
}
