export function filterUUIDCookies(cookies: { name: string; value: string }[]) {
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return cookies.filter((cookie) => uuidPattern.test(cookie.name));
}
