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
 * @fileoverview The Imperia message embed class.
 * @author LichKing112
 */

import { MessageEmbed } from "discord.js";

/**
 * @class
 * @classdesc Imperia message embed.
 * @extends MessageEmbed
 */
export class BaseMessageEmbed extends MessageEmbed {
    /**
     * @constructor
     * @description Imperia message embed constructor.
     */
    constructor() {
        super();

        this.setColor("#f1a66b");
    }

    /**
     * @description Sets the color to red.
     * @param {boolean} value
     * @returns {this}
     */
    isErrorEmbed(value: boolean): this {
        if (value) {
            this.setColor("#e04545");
            return this;
        }
    }
}
