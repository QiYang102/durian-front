export const getHttpsImageUrl = (url: string | undefined | null): string | undefined | null => {
  if (!url) return url;
  if (typeof url !== 'string') return url;
  return url.replace(/^http:\/\//i, 'https://');
};