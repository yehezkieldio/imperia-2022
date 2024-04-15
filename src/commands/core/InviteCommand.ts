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
import { ApplicationCommandRegistry, RegisterBehavior } from "@sapphire/framework";
import { SlashCommandBuilder } from "@discordjs/builders";
import { TFunction } from "@sapphire/plugin-i18next";
import { CommandInteraction, Message } from "discord.js";

import { BaseCommand, BaseCommandOptions, BaseArgument, BaseMessageEmbed } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "invite",
    aliases: ["inv"],
    description: Locales.Commands.Core.Invite_CommandDescription,
    extendedDescription: {
        usage: "",
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class InviteCommand extends BaseCommand {
    override async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        return message.reply({ embeds: [await this.__intialize(args.translate)] });
    }

    override async chatInputRun(interaction: CommandInteraction): Promise<void> {
        const translate = this.container.i18n.getT(await this.container.client.fetchLanguage(interaction));

        return await interaction.reply({ embeds: [await this.__intialize(translate)] });
    }

    private async __intialize(translate: TFunction): Promise<BaseMessageEmbed> {
        return this.utils.embed().setDescription(
            translate(Locales.Commands.Core.Invite_ResponseInvite, {
                invite: this.container.client.generateInviteLink(),
            })
        );
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Core.Invite_CommandDescription));

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
