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
 * @fileoverview The Imperia arguments parser class.
 * @author LichKing112
 */

import { Args, MessageCommandContext } from "@sapphire/framework";
import { TFunction } from "@sapphire/plugin-i18next";
import { Args as LexureArgs } from "lexure";
import { Message } from "discord.js";

import { BaseCommand } from "../BaseCommand";

/**
 * @class
 * @classdesc Imperia arguments parser.
 * @extends Args
 */
export class BaseArgument extends Args {
    /**
     * @description The translate function.
     * @type {TFunction}
     */
    translate: TFunction;

    /**
     * @constructor
     * @description Imperia arguments parser constructor.
     * @param {Message} message The message.
     * @param {BaseCommand} command The command.
     * @param {LexureArgs} parser The parser.
     * @param {MessageCommandContext} context The command context.
     * @param {TFunction} translate The translate function.
     */
    constructor(
        message: Message,
        command: BaseCommand,
        parser: LexureArgs,
        context: MessageCommandContext,
        translate: TFunction
    ) {
        super(message, command, parser, context);
        this.translate = translate;
    }
}
