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

import { PrismaClient, User } from "@prisma/client";
import { BaseClient, BaseCommand } from "../../../structures";

/**
 * @class
 * @classdesc Database class for handling user database operations
 */
export class UserHandler {
    /**
     * @description Imperia client.
     * @type {BaseClient}
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
     * @description Create a new user record.
     * @param {string} userId - User's id.
     * @returns {Promise<User>}
     */
    async createUser(userId: string): Promise<User> {
        return await this.prisma.user.create({
            data: {
                userId: userId,
                telemetry: {
                    create: {
                        lastCommandUsed: "NONE",
                        totalCommandsUsed: 0,
                    },
                },
            },
        });
    }

    /**
     * @description Update a user's last command used and total commands used.
     * @param {string} userId - User's id.
     * @param {string} command - Command used.
     * @returns {Promise<User>}
     */
    async updateUser(userId: string, command: BaseCommand): Promise<User> {
        return await this.prisma.user.update({
            where: {
                userId: userId,
            },
            data: {
                telemetry: {
                    update: {
                        lastCommandUsed: command.name,
                        totalCommandsUsed: {
                            increment: 1,
                        },
                    },
                },
            },
        });
    }

    /**
     * @description Get user by user id.
     * @param {string} userId - User's id.
     * @returns {Promise<User>}
     */
    async getUser(userId: string): Promise<User> {
        return await this.prisma.user.findFirst({
            where: {
                userId: userId,
            },
            include: {
                telemetry: true,
            },
        });
    }
}
