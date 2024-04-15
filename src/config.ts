/**
 * Imperia - All-purpose Discord bot, powered using the Sapphire framework.
 * Copyright (C) 2021-2022 Exility Development
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * @fileoverview The configuration file for the bot.
 * @author LichKing112
 * @author janleigh
 */

import { container, LogLevel } from "@sapphire/framework";
import { ClientOptions, IntentsString, MessageMentionOptions, PartialTypes, ShardingManagerOptions } from "discord.js";

import { PROJECT_LOCALES_FOLDER } from "./libraries";

/**
 * @type {Array<PartialTypes>}
 */
const Partials: Array<PartialTypes> = ["MESSAGE", "CHANNEL", "REACTION"];

/**
 * @type {Array<IntentsString>}
 */
const Intents: Array<IntentsString> = [
    "GUILDS",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_BANS",
    "GUILD_EMOJIS_AND_STICKERS",
    "DIRECT_MESSAGES",
];

/**
 * @type {MessageMentionOptions}
 */
const AllowedMentions: MessageMentionOptions = {
    parse: ["users", "roles"],
    repliedUser: true,
};

/**
 * @description The amount of shards to spawn.
 * @type {number | string}
 */
const ShardCount: number | "auto" = "auto";

/**
 * @description The type of sharding to use.
 * @type {string}
 */
const ShardingMode: "process" | "worker" = "worker";

/**
 * @description The configuration for the bot.
 * @type {ClientOptions}
 */
export const CLIENT_OPTIONS: ClientOptions = {
    allowedMentions: AllowedMentions,
    caseInsensitiveCommands: true,
    caseInsensitivePrefixes: true,
    defaultCooldown: {
        delay: 3000,
    },
    defaultPrefix: process.env.DEFAULT_PREFIX,
    enableLoaderTraceLoggings: process.env.NODE_ENV === "development" ? true : false,
    i18n: {
        defaultLanguageDirectory: PROJECT_LOCALES_FOLDER,
        fetchLanguage: async ({ guild }) => {
            if (!guild) return container.client.defaultLanguage;

            const guildSettings = await container.database.prisma.guildConfiguration.findFirst({
                where: { guildId: guild.id },
            });

            return guildSettings.language;
        },
    },
    intents: Intents,
    loadDefaultErrorListeners: false,
    loadMessageCommandListeners: true,
    logger: {
        level: process.env.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Debug,
    },
    partials: Partials,
    typing: true,
};

/**
 * @description The sharding configuration for the bot.
 * @type {ShardingManagerOptions}
 */
export const SHARDING_OPTIONS: ShardingManagerOptions = {
    mode: ShardingMode,
    totalShards: ShardCount,
};
