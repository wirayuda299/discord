export const settings = [
  {
    label: "user settings",
    items: ["my account", "profiles"],
  },
  {
    label: "billing settings",
    items: [
      "nitro",
      "server boost",
      "subscriptions",
      "gift inventory",
      "billing",
    ],
  },
  {
    label: "app settings",
    items: [
      "appearance",
      "accessibility",
      "voice & video",
      "chat",
      "notifications",
      "keybinds",
      "languange",
      "streamer mode",
      "advanced",
    ],
  },
] as const;

export const getServerSettings = (serverName: string) => [
  {
    label: serverName,
    items: [
      "overview",
      "roles",
      "emoji",
      "stickers",
      "soundboard",
      "widget",
      "server template",
      "custom invite link",
    ],
  },
  {
    label: "apps",
    items: ["integrations", "app directory"],
  },
  {
    label: "moderation",
    items: ["safety setup", "autoMod", "audit log", "bans"],
  },
  {
    label: "community",
    items: ["enable community"],
  },
  {
    label: "user management",
    items: ["members", "invites"],
  },
];
