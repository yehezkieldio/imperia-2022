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

import { CommandTelemetry, Guild, PrismaClient } from "@prisma/client";
import { BaseClient, BaseCommand } from "../../../structures";

/**
 * @class
 * @classdesc Database class for handling guild database operations
 */
export class GuildHandler {
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
     * @constructor
     * @description Database handler class constructor,
     * @param {PrismaClient} prisma - Prisma client,
     * @param {BaseClient} client - Imperia client,
     */
    constructor(prisma: PrismaClient, client: BaseClient) {
        this.prisma = prisma;
        this.client = client;
    }

    /**
     * @description Create a new guild record.
     * @return {Promise<Guild>}
     */
    async createGuild(guildId: string): Promise<Guild> {
        return await this.prisma.guild.create({
            data: {
                guildId: guildId,
                configuration: {
                    create: {
                        prefix: this.client.defaultPrefix,
                        language: this.client.defaultLanguage,
                    },
                },
                telemetry: {
                    create: {
                        totalGlobalCommandsUsed: 0,
                    },
                },
            },
        });
    }

    /**
     * @description Update total global command used record.
     * @return {Promise<Guild>}
     */
    async updateTotalGlobalCommandsUsed(guildId: string): Promise<Guild> {
        return await this.prisma.guild.update({
            where: {
                guildId: guildId,
            },
            data: {
                telemetry: {
                    update: {
                        totalGlobalCommandsUsed: {
                            increment: 1,
                        },
                    },
                },
            },
        });
    }

    /**
     * @description Get guild by guild id.
     * @param {string} guildId - The guild's id
     * @returns {Promise<Guild>}
     */
    async getGuild(guildId: string): Promise<Guild> {
        return await this.prisma.guild.findFirst({
            where: {
                guildId: guildId,
            },
            include: {
                telemetry: true,
                configuration: true,
            },
        });
    }

    /**
     * @description Create a new command telemetry data record.
     * @param {string} guildId - The guild's id
     * @param {BaseCommand} command - The command to create a telemetry record for
     * @returns {Promise<CommandTelemetry>}
     */
    async createCommandTelemetry(guildId: string, command: BaseCommand): Promise<CommandTelemetry> {
        return await this.prisma.commandTelemetry.create({
            data: {
                commandId: command.name,
                commandUsed: 0,
                guild: {
                    connect: {
                        guildId: guildId,
                    },
                },
            },
        });
    }

    /**
     * @description Update command telemetry data record.
     * @param {BaseCommand} command - The command to update a telemetry record for
     * @returns {Promise<CommandTelemetry>}
     */
    async updateCommandTelemetry(command: BaseCommand): Promise<CommandTelemetry> {
        return await this.prisma.commandTelemetry.update({
            where: {
                commandId: command.name,
            },
            data: {
                commandUsed: {
                    increment: 1,
                },
                executedAt: new Date().toISOString(),
            },
        });
    }

    /**
     * @description Get command telemetry data record.
     * @param {string} guildId - The guild's id
     * @param {BaseCommand} command - The command to get a telemetry record for
     * @returns {Promise<CommandTelemetry>}
     */
    async getCommandTelemetry(guildId: string, command: BaseCommand): Promise<CommandTelemetry> {
        try {
            return await this.prisma.commandTelemetry.findFirst({
                where: {
                    commandId: command.name,
                },
            });
        } catch (error) {
            return this.createCommandTelemetry(guildId, command);
        }
    }
}
