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
 * @fileoverview The Imperia client class.
 * @author LichKing112
 */

import { GuildConfiguration, PrismaClient } from "@prisma/client";
import { container, SapphireClient } from "@sapphire/framework";
import { InternationalizationContext } from "@sapphire/plugin-i18next";
import { ClientOptions, CommandInteraction, Message } from "discord.js";

import { Database, Utils } from "../libraries";

/**
 * @class
 * @classdesc Imperia client class.
 * @extends SapphireClient
 */
export class BaseClient extends SapphireClient {
    /**
     * @description Default prefix.
     * @type {string}
     */
    readonly defaultPrefix: string = process.env.DEFAULT_PREFIX || "imp!";

    /**
     * @description Default language.
     * @type {string}
     */
    readonly defaultLanguage: string = process.env.DEFAULT_LANGUAGE || "en-US";

    /**
     * @description Prisma client.
     * @type {PrismaClient}
     */
    private prisma: PrismaClient = new PrismaClient();

    /**
     * @description Database handler.
     * @type {PrismaClient}
     */
    database: Database = new Database(this.prisma, this);

    /**
     * @description Utility functions.
     * @type {Utils}
     */
    utils: Utils = new Utils();

    /**
     * @constructor
     * @description Imperia client constructor.
     * @param options - The client options.
     */
    constructor(options: ClientOptions) {
        super(options);

        container.utils = this.utils;
        container.database = this.database;
    }

    /**
     * @description Initialize the client.
     * @param {string} token Discord bot token.
     * @returns {Promise<string>}
     */
    async login(token: string): Promise<string> {
        return super.login(token);
    }

    /**
     * @description Deinitialize the client.
     * @returns {Promise<void>}
     */
    async logout(): Promise<void> {
        return super.destroy();
    }

    /**
     * @description Fetches the current guild's prefix.
     * @override
     * @param {Message} message - The message.
     * @returns {Promise<string>}
     */
    override fetchPrefix = async (ctx: Message | CommandInteraction): Promise<string> => {
        const guildConfiguration = await this.database.prisma.guildConfiguration.findFirst({
            where: {
                guildId: ctx.guild.id,
            },
        });

        return guildConfiguration.prefix ?? this.defaultPrefix;
    };

    /**
     * @description Fetches the current guild's language.
     * @param {string} context - The context.
     * @returns {Promise<string>}
     */
    fetchLanguage = async (context: InternationalizationContext): Promise<string> => {
        if (!context.guild) return this.defaultLanguage;

        const guildConfiguration: GuildConfiguration = await this.database.prisma.guildConfiguration.findFirst({
            where: { guildId: context.guild.id },
        });

        return guildConfiguration.language ?? this.defaultLanguage;
    };

    /**
     * @description Generates a bot invite link.
     * @returns {string}
     */
    generateInviteLink = (): string => {
        return `https://discord.com/api/oauth2/authorize?client_id=${this.id}&permissions=545460846583&scope=bot%20applications.commands`;
    };
}
