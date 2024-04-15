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
 * @fileoverview The Imperia command class.
 * @author LichKing112
 */

import { PieceContext, MessageCommandContext } from "@sapphire/framework";
import { fetchT } from "@sapphire/plugin-i18next";
import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from "@sapphire/plugin-subcommands";
import { Message } from "discord.js";
import * as Lexure from "lexure";

import { MessageUtils } from "../../libraries";
import { BaseArgument } from "./parsers/BaseArgument";

export interface BaseCommandExtendedDescription {
    usage: string;
    examples?: string[];
}

/**
 * @description The Imperia command options interface.
 * @typedef {Object} BaseCommandOptions
 * @extends SubCommandPluginCommandOptions
 */
export interface BaseCommandOptions extends SubCommandPluginCommandOptions {
    description: string;
    extendedDescription?: BaseCommandExtendedDescription;
}

/**
 * @class
 * @classdesc Imperia command class.
 * @abstract
 * @extends SubCommandPluginCommand
 */
export abstract class BaseCommand extends SubCommandPluginCommand<BaseArgument, BaseCommand> {
    /**
     * @description The extended description.
     * @type {BaseCommandExtendedDescription}
     */
    extendedDescription: BaseCommandExtendedDescription;

    /**
     * @description Message utility functions
     * @type {MessageUtils}
     */
    utils: MessageUtils;

    /**
     * @constructor
     * @description Imperia command constructor.
     *
     * @param {PieceContext} context - The piece context.
     * @param {BaseCommandOptions} options - The command options.
     */
    constructor(context: PieceContext, options: BaseCommandOptions) {
        super(context, { ...options });

        this.extendedDescription = options.extendedDescription;
        this.utils = new MessageUtils();
    }

    /**
     * @description The pre-parse method. This method can be overridden by plugins to define their own argument parser.
     * @param {Message} message The message that triggered the command.
     * @param {string} parameters The raw parameters as a single string.
     * @param {CommandContext} context The command-context used in this execution.
     * @returns {Promise<BaseArgument>}
     */
    async messagePreParse(message: Message, parameters: string, context: MessageCommandContext): Promise<BaseArgument> {
        const parser = new Lexure.Parser(this.lexer.setInput(parameters).lex()).setUnorderedStrategy(this.strategy);
        const args = new Lexure.Args(parser.parse());

        return new BaseArgument(message, this, args, context, await fetchT(message));
    }
}
