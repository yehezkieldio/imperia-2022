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
import { ApplicationCommandRegistry, Identifiers, RegisterBehavior } from "@sapphire/framework";
import { TFunction } from "@sapphire/plugin-i18next";
import { inlineCode, codeBlock, SlashCommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, Message } from "discord.js";

import { BaseCommand, BaseCommandOptions, BaseArgument, BaseMessageEmbed } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "help",
    description: Locales.Commands.Core.Help_CommandDescription,
    extendedDescription: {
        usage: "<command>",
        examples: ["help anilist"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class HelpCommand extends BaseCommand {
    async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        const specifiedCommand = await args.pickResult("command");

        if (specifiedCommand.error) {
            if (specifiedCommand.error.identifier === Identifiers.ArgsMissing) {
                return message.reply({ embeds: [await this.__intialize(message, args.translate, this, "GENERAL")] });
            } else if (specifiedCommand.error.identifier === Identifiers.InvalidCommand) {
                return message.reply({
                    embeds: [
                        this.utils.errorEmbed(
                            Identifiers.InvalidCommand,
                            args.translate(Locales.Commands.Core.Help_ResponseInvalidCommand)
                        ),
                    ],
                });
            }
        } else {
            return message.reply({
                embeds: [await this.__intialize(message, args.translate, specifiedCommand.value, "COMMAND")],
            });
        }
    }

    async chatInputRun(interaction: CommandInteraction): Promise<APIMessage | Message> {
        const translate = this.container.i18n.getT(await this.container.client.fetchLanguage(interaction));

        const specifiedCommand = interaction.options.getString("command", false);

        await interaction.deferReply();

        if (specifiedCommand) {
            const command = await this.__resolveCommand(specifiedCommand);
            if (command) {
                return (await interaction.editReply({
                    embeds: [await this.__intialize(interaction, translate, command, "COMMAND")],
                })) as APIMessage | Message;
            } else {
                return (await interaction.editReply({
                    embeds: [
                        this.utils.errorEmbed(
                            Identifiers.InvalidCommand,
                            translate(Locales.Commands.Core.Help_ResponseInvalidCommand)
                        ),
                    ],
                })) as APIMessage | Message;
            }
        } else {
            return (await interaction.editReply({
                embeds: [await this.__intialize(interaction, translate, this, "GENERAL")],
            })) as APIMessage | Message;
        }
    }

    private async __intialize(
        context: Message | CommandInteraction,
        translate: TFunction,
        command: BaseCommand,
        type: "GENERAL" | "COMMAND"
    ): Promise<BaseMessageEmbed> {
        if (type == "GENERAL") {
            return this.__buildGeneralInformation(context, translate);
        } else {
            return this.__buildCommandInformation(context, command, translate);
        }
    }

    private async __resolveCommand(providedCommand: string): Promise<BaseCommand | undefined> {
        const command = this.container.stores.get("commands").get(providedCommand.toLowerCase()) as
            | BaseCommand
            | undefined;

        return command === undefined ? undefined : command;
    }

    private async __buildGeneralInformation(
        context: Message | CommandInteraction,
        translate: TFunction
    ): Promise<BaseMessageEmbed> {
        const embed = this.utils.embed().setAuthor({
            name: this.container.client.user.username,
            iconURL: this.container.client.user.avatarURL(),
        });

        embed.setDescription(
            translate(Locales.Commands.Core.Help_Response_GeneralInformation_Content, {
                prefix: await this.container.client.fetchPrefix(context),
            })
        );

        return embed;
    }

    private async __buildCommandInformation(
        ctx: Message | CommandInteraction,
        command: BaseCommand,
        translate: TFunction
    ): Promise<BaseMessageEmbed> {
        const prefix = await this.container.client.fetchPrefix(ctx);

        const embed = this.utils.embed().setAuthor({
            name: translate(Locales.Commands.Core.Help_Response_CommandInformation_Title, {
                command: this.container.utils.capitalize(command.name),
            }),
        });

        const aliases =
            command.aliases.length > 0
                ? command.aliases.join(", ")
                : translate(Locales.Commands.Core.Help_Response_CommandInformation_Fields_ContentNoAliases);

        const usage = `${prefix.toString()}${command.name}${
            !!command.extendedDescription.usage ? ` ${command.extendedDescription.usage}` : " "
        }`;

        const examples = command.extendedDescription.examples
            ? command.extendedDescription.examples.map((example) => `${prefix}${example}`).join("\n")
            : translate(Locales.Commands.Core.Help_Response_CommandInformation_Fields_ContentNoExample);

        embed.setDescription(translate(command.description));
        embed.addField(
            translate(Locales.Commands.Core.Help_Response_CommandInformation_Fields_AliasesTitle),
            inlineCode(aliases),
            true
        );
        embed.addField(
            translate(Locales.Commands.Core.Help_Response_CommandInformation_Fields_UsageTitle),
            inlineCode(usage),
            true
        );
        embed.addField(
            translate(Locales.Commands.Core.Help_Response_CommandInformation_Fields_ExampleTitle),
            codeBlock(examples)
        );

        embed.setFooter({ text: translate(Locales.Commands.Core.Help_Response_CommandInformation_Syntax) });
        return embed;
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Core.Help_CommandDescription))
            .addStringOption((opt) => {
                return opt
                    .setName("command")
                    .setDescription(translate(Locales.Commands.Core.Help_Options_Command))
                    .setRequired(false);
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
