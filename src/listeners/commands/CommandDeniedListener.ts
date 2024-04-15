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
    MessageCommandDeniedPayload,
    Identifiers,
    ChatInputCommandDeniedPayload,
} from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";

import { BaseListener, BaseListenerOptions, BaseMessageEmbed } from "../../structures";
import { Locales } from "../../libraries";

@ApplyOptions<BaseListenerOptions>({
    name: "MessageCommandDenied",
    once: false,
    event: Events.MessageCommandDenied,
})
export class CommandDeniedListener extends BaseListener {
    async run(error: UserError, data: MessageCommandDeniedPayload): Promise<Message> {
        let embed: BaseMessageEmbed;

        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.message, Locales.Listeners.Listener_PreconditionCooldown, {
                        time: this.container.utils.msToSeconds(Reflect.get(Object(error.context), "remaining")),
                    })
                );

                return data.message.reply({ embeds: [embed] });
            case Identifiers.PreconditionDeveloperOnly:
                embed = this.utils.errorEmbed(error.identifier, await resolveKey(data.message, error.message));

                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.message, Locales.Listeners.Listener_PreconditionClientPermissions, {
                        missing: Reflect.get(Object(error.context), "missing").join(" "),
                    })
                );
                return data.message.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.message, Locales.Listeners.Listener_PreconditionUserPermissions, {
                        missing: Reflect.get(Object(error.context), "missing").join(" "),
                    })
                );

                return data.message.reply({ embeds: [embed] });

            default:
                embed = this.utils.errorEmbed(error.identifier, error.message);

                return data.message.reply({ embeds: [embed] });
        }
    }
}

@ApplyOptions<BaseListenerOptions>({
    name: "ChatInputCommandDenied",
    once: false,
    event: Events.ChatInputCommandDenied,
})
export class ChatInputCommandDeniedListener extends BaseListener {
    async run(error: UserError, data: ChatInputCommandDeniedPayload): Promise<Message | void> {
        let embed: BaseMessageEmbed;

        switch (error.identifier) {
            case Identifiers.PreconditionCooldown:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.interaction.guild, Locales.Listeners.Listener_PreconditionCooldown, {
                        time: this.container.utils.msToSeconds(Reflect.get(Object(error.context), "remaining")),
                    })
                );

                return data.interaction.reply({ embeds: [embed] });
            case Identifiers.PreconditionDeveloperOnly:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.interaction.guild, error.message)
                );

                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionClientPermissions || Identifiers.PreconditionClientPermissionsNoPermissions:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.interaction.guild, Locales.Listeners.Listener_PreconditionClientPermissions, {
                        missing: Reflect.get(Object(error.context), "missing").join(" "),
                    })
                );
                return data.interaction.reply({ embeds: [embed] });

            case Identifiers.PreconditionUserPermissions || Identifiers.PreconditionUserPermissionsNoPermissions:
                embed = this.utils.errorEmbed(
                    error.identifier,
                    await resolveKey(data.interaction.guild, Locales.Listeners.Listener_PreconditionUserPermissions, {
                        missing: Reflect.get(Object(error.context), "missing").join(" "),
                    })
                );

                return data.interaction.reply({ embeds: [embed] });

            default:
                embed = this.utils.errorEmbed(error.identifier, error.message);

                return data.interaction.reply({ embeds: [embed] });
        }
    }
}
