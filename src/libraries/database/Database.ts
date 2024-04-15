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

import { CommandTelemetry, GuildTelemetry, PrismaClient, UserTelemetry } from "@prisma/client";
import { BaseClient } from "../../structures";
import { GuildHandler } from "./handlers/GuildHandler";
import { UserHandler } from "./handlers/UserHandler";
import { CafeHandler } from "./handlers/CafeHandler";

/**
 * @class
 * @classdesc Database class for handling database operations
 */
export class Database {
    /**
     * @description Prisma client.
     * @type {PrismaClient}
     */
    public prisma: PrismaClient;

    /**
     * @description Imperia client.
     * @type {BaseClient}
     */
    private client: BaseClient;

    /**
     * @description Guild handler.
     * @type {GuildHandler}
     */
    public guildHandler: GuildHandler;

    /**
     * @description User handler.
     * @type {UserHandler}
     */
    public userHandler: UserHandler;

    /**
     * @description User Cafe handler.
     * @type {CafeHandler}
     */
    public cafeHandler: CafeHandler;

    /**
     * @description Database class constructor,
     * @param prisma - Prisma client,
     * @param client - Imperia client,
     */
    constructor(prisma: PrismaClient, client: BaseClient) {
        this.prisma = prisma;
        this.client = client;

        this.guildHandler = new GuildHandler(this.prisma, this.client);
        this.userHandler = new UserHandler(this.prisma, this.client);
        this.cafeHandler = new CafeHandler(this.prisma, this.client);
    }

    /**
     * @description Get guild handler.
     * @returns {GuildHandler}
     */
    getGuildHandler(): GuildHandler {
        return this.guildHandler;
    }

    /**
     * @description Get user handler.
     * @returns {UserHandler}
     */
    getUserHandler(): UserHandler {
        return this.userHandler;
    }

    /**
     * @description Get cafe handler.
     * @returns {UserHandler}
     */
    getCafeHandler(): CafeHandler {
        return this.cafeHandler;
    }

    /**
     * @description Get guild telemetry.
     * @param {string} guildId - Guild's id.
     * @returns {Promise<GuildTelemetry>}
     */
    async getGuildTelemetry(guildId: string): Promise<GuildTelemetry> {
        return this.prisma.guildTelemetry.findFirst({
            where: {
                guildId: guildId,
            },
        });
    }

    /**
     * @description Get user telemetry.
     * @param {string} userId - User's id.
     * @returns {Promise<UserTelemetry>}
     */
    async getUserTelemetry(userId: string): Promise<UserTelemetry> {
        return this.prisma.userTelemetry.findFirst({
            where: {
                userId: userId,
            },
        });
    }

    /**
     * @description Get command telemetry.
     * @param commandName = Command's name.
     * @returns {Promise<CommandTelemetry>}
     */
    async getCommandTelemetry(commandName: string): Promise<CommandTelemetry> {
        return this.prisma.commandTelemetry.findFirst({
            where: {
                commandId: commandName,
            },
        });
    }
}
