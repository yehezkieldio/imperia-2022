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

import { ApplyOptions } from "@sapphire/decorators";
import {
    Events,
    UserError,
    MessageCommandErrorPayload,
    Identifiers,
    ArgumentError,
    ChatInputCommandErrorPayload,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { yellow } from "colorette";

import { BaseListener, BaseListenerOptions } from "../../structures";
import { Locales } from "../../libraries";

@ApplyOptions<BaseListenerOptions>({
    name: "MessageCommandError",
    once: false,
    event: Events.MessageCommandError,
})
export class CommandErrorListener extends BaseListener {
    async run(error: Error, data: MessageCommandErrorPayload): Promise<Message> {
        this.container.logger.error(`${yellow("CommandError")}\n\n${error.stack}`);

        if (error instanceof UserError) return this.__handleUserError(error, data);
        if (error instanceof ArgumentError) return this.__handleArgumentError(error, data);

        const embed = this.utils.errorEmbed("UNKNOWN", error.message);

        return data.message.reply({ embeds: [embed] });
    }

    private async __handleUserError(error: UserError, data: MessageCommandErrorPayload): Promise<Message> {
        if (error.identifier === Identifiers.ArgsMissing) {
            const embed = this.utils.errorEmbed(
                error.identifier,
                await resolveKey(data.message, Locales.Listeners.Listener_PreconditionCooldown, {
                    prefix: await this.container.client.fetchPrefix(data.message),
                    command: data.command.name,
                })
            );

            return data.message.reply({ embeds: [embed] });
        }

        if (error.identifier === Identifiers.SearchResultNotFound) {
            const embed = this.utils.errorEmbed(error.identifier, error.message);

            return data.message.reply({ embeds: [embed] });
        }

        const embed = this.utils.errorEmbed(
            error.identifier,
            await resolveKey(data.message, Locales.Listeners.Listener_Unknown, { type: "User" })
        );

        return data.message.reply({ embeds: [embed] });
    }

    private async __handleArgumentError(error: UserError, data: MessageCommandErrorPayload): Promise<Message> {
        const embed = this.utils.errorEmbed(
            error.identifier,
            await resolveKey(data.message, Locales.Listeners.Listener_Unknown, { type: "Argument" })
        );

        return data.message.reply({ embeds: [embed] });
    }
}

@ApplyOptions<BaseListenerOptions>({
    name: "ChatInputCommandError",
    once: false,
    event: Events.ChatInputCommandError,
})
export class ChatInputCommandErrorListener extends BaseListener {
    async run(error: Error, data: ChatInputCommandErrorPayload): Promise<Message | void> {
        this.container.logger.error(`${yellow("CommandError")}\n\n${error.stack}`);

        if (error instanceof UserError) return this.__handleUserError(error, data);
        if (error instanceof ArgumentError) return this.__handleArgumentError(error, data);

        const embed = this.utils.errorEmbed("UNKNOWN", error.message);

        return data.interaction.reply({ embeds: [embed] });
    }

    private async __handleUserError(error: UserError, data: ChatInputCommandErrorPayload): Promise<Message | void> {
        if (error.identifier === Identifiers.ArgsMissing) {
            const embed = this.utils.errorEmbed(
                error.identifier,
                await resolveKey(data.interaction.guild, Locales.Listeners.Listener_PreconditionCooldown, {
                    prefix: await this.container.client.fetchPrefix(data.interaction),
                    command: data.command.name,
                })
            );

            return data.interaction.reply({ embeds: [embed] });
        }

        if (error.identifier === Identifiers.SearchResultNotFound) {
            const embed = this.utils.errorEmbed(error.identifier, error.message);

            return data.interaction.reply({ embeds: [embed] });
        }

        const embed = this.utils.errorEmbed(
            error.identifier,
            await resolveKey(data.interaction.guild, Locales.Listeners.Listener_Unknown, { type: "User" })
        );

        return data.interaction.reply({ embeds: [embed] });
    }

    private async __handleArgumentError(error: UserError, data: ChatInputCommandErrorPayload): Promise<Message | void> {
        const embed = this.utils.errorEmbed(
            error.identifier,
            await resolveKey(data.interaction.guild, Locales.Listeners.Listener_Unknown, { type: "Argument" })
        );

        return data.interaction.reply({ embeds: [embed] });
    }
}
