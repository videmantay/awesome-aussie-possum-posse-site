// Unofficial Google Translate endpoint — client-side, no API key required.
// Not rate-limited for normal editorial use. Preserves simple HTML tags.
export async function translateText(text, targetLang) {
  if (!text?.trim()) return '';
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=en&tl=${targetLang}&dt=t` +
    `&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate request failed: ${res.status}`);
  const data = await res.json();
  // Response shape: [ [ ["translated chunk", "source chunk"], … ], … ]
  return data[0].map(chunk => chunk[0]).join('');
}
