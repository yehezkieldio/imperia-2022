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
 * @fileoverview The Imperia listener class.
 * @author LichKing112
 */

import { Listener, ListenerOptions, PieceContext } from "@sapphire/framework";
import { MessageUtils } from "../libraries";

/**
 * @description The Imperia listener options interface.
 * @typedef {Object} BaseListenerOptions
 * @extends ListenerOptions
 */
export interface BaseListenerOptions extends ListenerOptions {}

/**
 * @class
 * @classdesc Imperia listener class.
 * @abstract
 * @extends Listener
 */
export abstract class BaseListener extends Listener {
    /**
     * @description Message utility functions
     * @type {MessageUtils}
     */
    utils: MessageUtils;

    /**
     * @constructor
     * @description Imperia listener constructor.
     * @param {PieceContext} context - The piece context.
     * @param {ListenerOptions} options - The listener options.
     */
    constructor(context: PieceContext, options?: BaseListenerOptions) {
        super(context, { ...options });

        this.utils = new MessageUtils();
    }
}
