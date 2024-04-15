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
 * @fileoverview The imperia paginated message embed class.
 * @author LichKing112
 */

import { PaginatedMessage, PaginatedMessageOptions } from "@sapphire/discord.js-utilities";
import { MessageOptions } from "discord.js";

import { BaseMessageEmbed } from "./BaseMessageEmbed";

/**
 * Imperia paginated message/embed options.
 * @typedef {Object} BasePaginatedMessageOptions
 * @extends PaginatedMessageOptions
 */
export interface BasePaginatedMessageOptions extends PaginatedMessageOptions {
    template?: BaseMessageEmbed | MessageOptions;
}

/**
 * @class
 * @classdesc Imperia paginated message embed class.
 * @extends PaginatedMessage
 */
export class BasePaginatedMessageEmbed extends PaginatedMessage {
    /**
     * @constructor
     * @description The paginated message/embed constructor.
     * @param {BasePaginatedMessageOptions} options
     */
    constructor(options: BasePaginatedMessageOptions = {}) {
        super(options);
    }
}
