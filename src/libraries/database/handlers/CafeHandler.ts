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

import { PrismaClient, UserCafe } from "@prisma/client";
import { BaseClient } from "../../../structures";

/**
 * @class
 * @classdesc Database class for handling cafe economy database operations
 */
export class CafeHandler {
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
     * @description Create a new user cafe record.
     * @param {string} userId - User's id.
     * @param {string} userId - User's cafe name.
     * @returns {Promise<User>}
     */
    async createCafe(userId: string, cafeName: string): Promise<UserCafe> {
        return await this.prisma.userCafe.create({
            data: {
                cafeId: userId,
                cafeName: cafeName,
                userId: userId,
            },
        });
    }

    /**
     * @description Get user cafe by user id.
     * @param {string} userId - User's id.
     * @returns {Promise<User>}
     */
    async getCafe(userId: string): Promise<UserCafe> {
        return await this.prisma.userCafe.findFirst({
            where: {
                cafeId: userId,
            },
            include: {
                user: true,
            },
        });
    }
}
