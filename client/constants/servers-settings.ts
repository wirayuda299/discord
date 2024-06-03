export const getServerSettings = (serverName: string) =>
  [
    {
      label: serverName,
      items: [
        'overview',
        'roles',
        'emoji',
        'stickers',
        'soundboard',
        'widget',
        'server template',
        'custom invite link',
      ],
    },
    {
      label: 'apps',
      items: ['integrations', 'app directory'],
    },
    {
      label: 'moderation',
      items: ['safety setup', 'autoMod', 'audit log', 'bans'],
    },
    {
      label: 'community',
      items: ['enable community'],
    },
    {
      label: 'user management',
      items: ['members', 'invites'],
    },
  ] as const;
