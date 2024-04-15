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

import { ApplyOptions, RequiresUserPermissions } from "@sapphire/decorators";
import { SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandRegistry, RegisterBehavior, Identifiers } from "@sapphire/framework";
import { Message, CommandInteraction } from "discord.js";

import { BaseCommand, BaseCommandOptions, BaseArgument } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "prefix",
    description: Locales.Commands.Configuration.Prefix_CommandDescription,
    extendedDescription: {
        usage: "<update|reset> <prefix>",
        examples: ["prefix update !", "prefix reset"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    subCommands: [
        { input: "default", output: "default", default: true },
        { input: "update", output: "update" },
        { input: "reset", output: "reset" },
    ],
})
export default class PrefixCommand extends BaseCommand {
    async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        const prefix = await this.container.client.fetchPrefix(message);

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Prefix_ResponseCurrentPrefix, {
                        prefix: prefix.toString(),
                    })
                ),
            ],
        });
    }

    @RequiresUserPermissions("MANAGE_GUILD")
    async update(message: Message, args: BaseArgument): Promise<Message> {
        const prefixArgument = await args.pickResult("string");

        if (!prefixArgument.success) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Prefix_ResponseInvalidPrefix)
                    ),
                ],
            });
        }

        if (prefixArgument.value.length > 4) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Prefix_ResponseInvalidPrefixLength)
                    ),
                ],
            });
        }

        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: message.guild.id },
            data: { prefix: prefixArgument.value },
        });

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Prefix_ResponseCurrentPrefixChanged, {
                        guild: message.guild.name,
                        prefix: prefixArgument.value,
                    })
                ),
            ],
        });
    }

    @RequiresUserPermissions("MANAGE_GUILD")
    async reset(message: Message, args: BaseArgument): Promise<Message> {
        if ((await this.container.client.fetchPrefix(message)) === this.container.client.defaultPrefix) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Prefix_ResponseCurrentPrefixDefault)
                    ),
                ],
            });
        }

        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: message.guild.id },
            data: { prefix: this.container.client.defaultPrefix },
        });

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Prefix_ResponseCurrentPrefixReset, {
                        prefix: this.container.client.defaultPrefix,
                    })
                ),
            ],
        });
    }

    async chatInputRun(interaction: CommandInteraction): Promise<void> {
        const guildPrefix = await this.container.client.fetchPrefix(interaction);

        return await interaction.reply({
            embeds: [
                this.utils.embed().setDescription(
                    this.container.i18n.getT(await this.container.client.fetchLanguage(interaction))(
                        Locales.Commands.Configuration.Prefix_ResponseCurrentPrefix,
                        {
                            prefix: `${guildPrefix}`,
                        }
                    )
                ),
            ],
        });
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Configuration.Prefix_CommandDescription));

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
