const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

export const normalizeHexColor = (rawColor: unknown) => {
  const value = normalizeText(rawColor);
  if (!value || value[0] !== '#') return null;

  const shorthand = /^#([0-9a-fA-F]{3})$/;
  const standard = /^#([0-9a-fA-F]{6})$/;
  const alpha = /^#([0-9a-fA-F]{8})$/;

  if (shorthand.test(value)) {
    const match = value.match(shorthand);
    if (!match) return null;
    const hex = match[1];
    return `#${hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toUpperCase()}`;
  }

  if (standard.test(value)) {
    const match = value.match(standard);
    return match ? `#${match[1].toUpperCase()}` : null;
  }

  if (alpha.test(value)) {
    const match = value.match(alpha);
    return match ? `#${match[1].slice(0, 6).toUpperCase()}` : null;
  }

  return null;
};
