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
import { Events } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";

import { BaseListener, BaseListenerOptions, BaseCommand } from "../../structures";

@ApplyOptions<BaseListenerOptions>({
    name: "MessageCommandRun",
    once: false,
    event: Events.MessageCommandRun,
})
export default class MessageCommandRunListener extends BaseListener {
    async run(message: Message, command: BaseCommand): Promise<void> {
        const commandTelemetry = await this.container.database
            .getGuildHandler()
            .getCommandTelemetry(message.guildId, command);

        if (!commandTelemetry) {
            await this.container.database.getGuildHandler().createCommandTelemetry(message.guild.id, command);
        }

        await this.container.database.getGuildHandler().updateCommandTelemetry(command as BaseCommand);
        await this.container.database.getGuildHandler().updateTotalGlobalCommandsUsed(message.guild.id);

        const userTelemetry = await this.container.database.getUserHandler().getUser(message.author.id);

        if (!userTelemetry) {
            await this.container.database.getUserHandler().createUser(message.author.id);
        }

        await this.container.database.getUserHandler().updateUser(message.author.id, command as BaseCommand);
    }
}

@ApplyOptions<BaseListenerOptions>({
    name: "ChatInputCommandRun",
    once: false,
    event: Events.ChatInputCommandRun,
})
export class ChatInputCommandRunListener extends BaseListener {
    async run(interaction: CommandInteraction, command: BaseCommand): Promise<void> {
        const commandTelemetry = await this.container.database
            .getGuildHandler()
            .getCommandTelemetry(interaction.guild.id, command);

        if (!commandTelemetry) {
            await this.container.database
                .getGuildHandler()
                .createCommandTelemetry(interaction.guild.id, command as BaseCommand);
        }

        await this.container.database.getGuildHandler().updateCommandTelemetry(command as BaseCommand);
        await this.container.database.getGuildHandler().updateTotalGlobalCommandsUsed(interaction.guild.id);

        const userTelemetry = await this.container.database.getUserHandler().getUser(interaction.user.id);

        if (!userTelemetry) {
            await this.container.database.getUserHandler().createUser(interaction.user.id);
        }

        await this.container.database.getUserHandler().updateUser(interaction.user.id, command as BaseCommand);
    }
}
