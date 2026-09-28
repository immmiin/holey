import wordmark from '../assets/wordmark.svg?raw';

// Inline so `fill="currentColor"` follows CSS (green by default, sock accent on hover/PDP).
const markup = wordmark
  .replace(/\sviewBox="[^"]+"/, ' viewBox="48 40 2152 1520"') // trim the artboard padding
  .replace(/\swidth="\d+"\s+height="\d+"/, ' role="img" aria-hidden="true" focusable="false"');

export default function Logo({ className = '' }) {
  return <span className={`logo ${className}`} dangerouslySetInnerHTML={{ __html: markup }} />;
}
