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
import { ApplicationCommandRegistry, RegisterBehavior, Identifiers } from "@sapphire/framework";
import { SlashCommandBuilder, inlineCode } from "@discordjs/builders";
import { TFunction } from "@sapphire/plugin-i18next";
import { CommandInteraction, Message } from "discord.js";
import { APIMessage } from "discord-api-types/v9";

import { BaseCommand, BaseCommandOptions, BaseArgument } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "language",
    aliases: ["lang"],
    description: Locales.Commands.Configuration.Language_CommandDescription,
    extendedDescription: {
        usage: "<update|reset|list> <language-code>",
        examples: ["language update id-ID", "language reset", "language list"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    subCommands: [
        { input: "default", output: "default", default: true },
        { input: "list", output: "list" },
        { input: "update", output: "update" },
        { input: "reset", output: "reset" },
    ],
})
export default class LanguageCommand extends BaseCommand {
    private languageMap: Map<string, string> = new Map([
        ["en-US", "American English"],
        ["fil-PH", "Filipino"],
        ["id-ID", "Indonesian"],
    ]);

    async default(message: Message, args: BaseArgument): Promise<Message> {
        const language = await this.container.client.fetchLanguage(message);

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguage, {
                        language: language.toString(),
                    })
                ),
            ],
        });
    }

    async list(message: Message, args: BaseArgument): Promise<Message> {
        const languages = [...this.languageMap.values()];
        const languageCodes = [...this.container.i18n.languages.keys()];

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Language_ResponseLanguageList, {
                        languages: languages
                            .map((language, index) => inlineCode(`${language} - ${languageCodes[index]}`))
                            .join("\n"),
                    })
                ),
            ],
        });
    }

    @RequiresUserPermissions("MANAGE_GUILD")
    async update(message: Message, args: BaseArgument): Promise<Message> {
        const languageArgument = await args.pickResult("string");

        if (!languageArgument.success) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Language_ResponseInvalidLanguage)
                    ),
                ],
            });
        }

        if (!this.container.i18n.languages.has(languageArgument.value)) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Language_ResponseInvalidLanguage)
                    ),
                ],
            });
        }

        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: message.guild.id },
            data: { language: languageArgument.value },
        });

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageChanged, {
                        language: languageArgument.value,
                    })
                ),
            ],
        });
    }

    @RequiresUserPermissions("MANAGE_GUILD")
    async reset(message: Message, args: BaseArgument): Promise<Message> {
        args.translate = this.container.i18n.getT(await this.container.client.fetchLanguage(message));

        if ((await this.container.client.fetchLanguage(message)) === this.container.client.defaultLanguage) {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        args.translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageDefault)
                    ),
                ],
            });
        }

        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: message.guild.id },
            data: { language: this.container.client.defaultLanguage },
        });

        return message.reply({
            embeds: [
                this.utils.embed().setDescription(
                    args.translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageReset, {
                        guild: message.guild.name,
                        language: this.container.client.defaultLanguage,
                    })
                ),
            ],
        });
    }

    async chatInputRun(interaction: CommandInteraction): Promise<void> {
        const options = interaction.options.getSubcommand(false);

        switch (options) {
            case "reset":
                this.__reset(
                    interaction,
                    this.container.i18n.getT(await this.container.client.fetchLanguage(interaction))
                );
                break;
            case "list":
                this.__list(interaction);
                break;
            case "update":
                this.__update(
                    interaction,
                    this.container.i18n.getT(await this.container.client.fetchLanguage(interaction)),
                    interaction.options.getString("language-code")
                );
                break;
            default:
                break;
        }
    }

    async __default(interaction: CommandInteraction, translate: TFunction): Promise<APIMessage | Message> {
        await interaction.deferReply();

        const language = await this.container.client.fetchLanguage(interaction);

        return (await interaction.editReply({
            embeds: [
                this.utils.embed().setDescription(
                    translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageDefault, {
                        language: language.toString(),
                    })
                ),
            ],
        })) as APIMessage | Message;
    }

    async __update(ctx: CommandInteraction, translate: TFunction, languageCode: string): Promise<APIMessage | Message> {
        await ctx.deferReply();

        if (!ctx.memberPermissions.has("MANAGE_GUILD")) {
            return (await ctx.editReply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidConfiguration,
                        translate(Locales.Listeners.Listener_PreconditionUserPermissions, {
                            permissions: "MANAGE_GUILD",
                        })
                    ),
                ],
            })) as APIMessage | Message;
        }

        if (!languageCode) {
            return (await ctx.editReply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(translate(Locales.Commands.Configuration.Language_ResponseInvalidLanguage)),
                ],
            })) as APIMessage | Message;
        }
        if (!this.container.i18n.languages.has(languageCode)) {
            return (await ctx.editReply({
                embeds: [
                    this.utils
                        .embed()
                        .setDescription(translate(Locales.Commands.Configuration.Language_ResponseInvalidLanguage)),
                ],
            })) as APIMessage | Message;
        }
        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: ctx.guild.id },
            data: { language: languageCode },
        });
        return (await ctx.editReply({
            embeds: [
                this.utils.embed().setDescription(
                    translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageChanged, {
                        language: languageCode,
                    })
                ),
            ],
        })) as APIMessage | Message;
    }

    async __reset(interaction: CommandInteraction, translate: TFunction): Promise<APIMessage | Message> {
        await interaction.deferReply();

        if (!interaction.memberPermissions.has("MANAGE_GUILD")) {
            return (await interaction.editReply({
                content: translate(Locales.Listeners.Listener_PreconditionUserPermissions, {
                    permissions: "MANAGE_GUILD",
                }),
            })) as APIMessage | Message;
        }

        if ((await this.container.client.fetchLanguage(interaction)) === this.container.client.defaultLanguage) {
            return (await interaction.editReply({
                content: translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageDefault, {
                    guild: interaction.guild.name,
                }),
            })) as APIMessage | Message;
        }

        await this.container.database.prisma.guildConfiguration.update({
            where: { guildId: interaction.guild.id },
            data: { language: this.container.client.defaultLanguage },
        });

        return (await interaction.editReply({
            content: translate(Locales.Commands.Configuration.Language_ResponseCurrentLanguageReset, {
                guild: interaction.guild.name,
                language: this.container.client.defaultLanguage,
            }),
        })) as APIMessage | Message;
    }

    async __list(interaction: CommandInteraction): Promise<void> {
        const translate = this.container.i18n.getT(await this.container.client.fetchLanguage(interaction));

        const languages = [...this.languageMap.values()];
        const languageCodes = [...this.container.i18n.languages.keys()];

        return interaction.reply({
            embeds: [
                this.utils.embed().setDescription(
                    translate(Locales.Commands.Configuration.Language_ResponseLanguageList, {
                        languages: languages
                            .map((language, index) => inlineCode(`${language} - ${languageCodes[index]}`))
                            .join("\n"),
                    })
                ),
            ],
        });
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);
        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Configuration.Language_CommandDescription))
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("reset")
                    .setDescription(translate(Locales.Commands.Configuration.Language_Subcommands_Reset))
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("list")
                    .setDescription(translate(Locales.Commands.Configuration.Language_Subcommands_Update))
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("update")
                    .setDescription(translate(Locales.Commands.Configuration.Language_Subcommands_Update))
                    .addStringOption((opt) => {
                        return opt
                            .setName("language-code")
                            .setDescription(translate(Locales.Commands.Configuration.Langauge_Options_LanguageCode))
                            .setRequired(true)
                            .addChoices([
                                ["en-US", "en-US"],
                                ["id-ID", "id-ID"],
                                ["fil-PH", "fil-PH"],
                            ]);
                    })
            );

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
