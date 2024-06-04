export const getServerSettings = (serverName: string) =>
  [
    {
      label: serverName,
      items: ['overview', 'roles', 'emoji', 'stickers', 'soundboard'],
    },

    {
      label: 'moderation',
      items: ['bans'],
    },
  ] as const;
