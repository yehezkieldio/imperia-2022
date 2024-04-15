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
import { ApplicationCommandRegistry, RegisterBehavior, Identifiers, Result, UserError } from "@sapphire/framework";
import { SlashCommandBuilder } from "@discordjs/builders";
import { APIMessage } from "discord-api-types";
import { CommandInteraction, Message } from "discord.js";

import { BaseCommand, BaseCommandOptions, BaseArgument, BaseMessageEmbed } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "anilist",
    aliases: ["ani"],
    description: Locales.Commands.Entertainment.AniList_CommandDescription,
    extendedDescription: {
        usage: "[type] [title]",
        examples: ["anilist anime 86", "anilist manga 86"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class AniListCommand extends BaseCommand {
    override async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        const specifiedType: Result<string, UserError> = await args.pickResult("string");
        const specifiedTitle: Result<string, UserError> = await args.restResult("string");
        const title: string = specifiedTitle.value;

        if (specifiedType.error)
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.ArgsMissing,
                        args.translate(Locales.Commands.Entertainment.AniList_ResponseInvalidTitle)
                    ),
                ],
            });

        if (["ANIME", "MANGA"].indexOf(specifiedType.value.toUpperCase()) >= 0) {
            if (specifiedTitle.error) {
                return message.reply({
                    embeds: [
                        this.utils.errorEmbed(
                            Identifiers.ArgsMissing,
                            args.translate(Locales.Commands.Entertainment.AniList_ResponseInvalidTitle)
                        ),
                    ],
                });
            }
            return message.reply({ embeds: [await this.__intialize(specifiedType.value.toUpperCase(), title)] });
        } else {
            return message.reply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.InvalidType,
                        args.translate(Locales.Commands.Entertainment.AniList_ResponseInvalidType)
                    ),
                ],
            });
        }
    }

    override async chatInputRun(interaction: CommandInteraction): Promise<APIMessage | Message> {
        const specifiedType: string = interaction.options.getString("type", true);
        const specifiedTitle: string = interaction.options.getString("title", true);

        await interaction.deferReply();

        return (await interaction.editReply({
            embeds: [await this.__intialize(specifiedType, specifiedTitle)],
        })) as APIMessage | Message;
    }

    private async __intialize(type: string, title: string): Promise<BaseMessageEmbed> {
        const { utils } = this.container;
        const response = await utils.aniListSearch(title, type as "ANIME" | "MANGA");

        const embed = this.utils.embed();

        const trimDescription = utils.trimString(response.description, 3096);
        const description = utils.stripHtmlTags(trimDescription);

        embed.setAuthor({ name: `${response.title.romaji} (${response.title.native})` });
        embed.setDescription(description);
        embed.setThumbnail(response.coverImage.large);

        if (response.bannerImage) embed.setImage(response.bannerImage);

        return embed;
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Entertainment.AniList_CommandDescription))
            .addStringOption((opt) => {
                return opt
                    .setName("type")
                    .setDescription(translate(Locales.Commands.Entertainment.AniList_Options_Type))
                    .setRequired(true)
                    .addChoices([
                        ["Anime", "ANIME"],
                        ["Manga", "MANGA"],
                    ]);
            })
            .addStringOption((opt) => {
                return opt
                    .setName("title")
                    .setDescription(translate(Locales.Commands.Entertainment.AniList_Options_Title))
                    .setRequired(true);
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
