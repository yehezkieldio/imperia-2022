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
import { CommandInteraction, Message, User } from "discord.js";

import { BaseCommand, BaseCommandOptions, BaseArgument, BaseMessageEmbed } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "avatar",
    aliases: ["av"],
    description: Locales.Commands.Utility.Avatar_CommandDescription,
    extendedDescription: {
        usage: "<username | id | mention>",
        examples: ["avatar @lizz#4253", "avatar 327849142774923266", "avatar Liz"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class AvatarCommand extends BaseCommand {
    override async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        const member: User = await args.pick("user").catch(() => message.author);

        return message.reply({ embeds: [await this.__intialize(member)] });
    }

    override async chatInputRun(interaction: CommandInteraction): Promise<void> {
        const specifiedMember: User = interaction.options.getUser("member", false);
        const member: User = specifiedMember ? specifiedMember : interaction.user;

        return interaction.reply({ embeds: [await this.__intialize(member)] });
    }

    private async __intialize(member: User): Promise<BaseMessageEmbed> {
        return this.utils
            .embed()
            .setAuthor({ name: `— ${member.tag}`, iconURL: member.avatarURL() })
            .setImage(member.displayAvatarURL({ dynamic: true, size: 1024 }));
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Utility.Avatar_CommandDescription))
            .addUserOption((option) => {
                return option
                    .setName("member")
                    .setDescription(translate(Locales.Commands.Utility.Avatar_Options_Member))
                    .setRequired(false);
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
