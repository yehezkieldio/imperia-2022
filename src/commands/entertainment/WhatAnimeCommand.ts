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
    ApplicationCommandRegistry,
    RegisterBehavior,
    Result,
    UserError,
    Resolvers,
    Identifiers,
} from "@sapphire/framework";
import { bold, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";
import { isNsfwChannel } from "@sapphire/discord.js-utilities";
import { TFunction } from "@sapphire/plugin-i18next";
import { APIMessage } from "discord-api-types";
import { TraceMoe } from "trace.moe.ts";
import { Result as ITraceMoeResult } from "trace.moe.ts/dist/structures/Result";
import { URL } from "url";

import { BaseCommand, BaseCommandOptions, BaseArgument, BaseMessageEmbed } from "../../structures";
import { IAniListQueryResult, Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "whatanime",
    aliases: ["wa", "wait"],
    description: Locales.Commands.Entertainment.WhatAnime_CommandDescription,
    extendedDescription: {
        usage: "[url]",
        examples: ["whatanime https://cdn.xndr.tech/u/W0oMv1Q.png"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class WhatAnimeCommand extends BaseCommand {
    override async messageRun(message: Message, args: BaseArgument): Promise<Message> {
        const specifiedUrl: Result<URL, UserError> = await args.pickResult("url");
        let url: URL | string = specifiedUrl.value;

        if (specifiedUrl.error) {
            if (message.attachments.size > 0) {
                url = message.attachments.first().url;
            } else {
                return message.reply({
                    embeds: [
                        this.utils.errorEmbed(
                            Identifiers.ArgsMissing,
                            args.translate(Locales.Commands.Entertainment.WhatAnime_ResponseInvalidURL)
                        ),
                    ],
                });
            }
        }

        return message.reply({
            embeds: [await this.__intialize(message, args.translate, url)],
        });
    }

    override async chatInputRun(interaction: CommandInteraction): Promise<APIMessage | Message> {
        const translate = this.container.i18n.getT(await this.container.client.fetchLanguage(interaction));

        const specifiedUrl: string = interaction.options.getString("url", true);
        const resolveUrl = Resolvers.resolveHyperlink(specifiedUrl);

        await interaction.deferReply();

        if (resolveUrl.error) {
            return (await interaction.editReply({
                embeds: [
                    this.utils.errorEmbed(
                        Identifiers.ArgsMissing,
                        translate(Locales.Commands.Entertainment.WhatAnime_ResponseInvalidURL)
                    ),
                ],
            })) as APIMessage | Message;
        }

        return (await interaction.editReply({
            embeds: [await this.__intialize(interaction, translate, resolveUrl.value.toString())],
        })) as APIMessage | Message;
    }

    private async __intialize(
        context: Message | CommandInteraction,
        translate: TFunction,
        url: URL | string
    ): Promise<BaseMessageEmbed> {
        const moe = new TraceMoe();
        const { utils } = this.container;

        const response: ITraceMoeResult = (await moe.fetchAnime(url.toString(), { anilistInfo: true })).result[0];
        const anilist: IAniListQueryResult = await this.container.utils.aniListSearch(response.anilist.title.romaji);

        if (isNsfwChannel(context.channel) && response.anilist.isAdult === true) {
            return this.utils.errorEmbed(Identifiers.ResultIsNsfw, "nsfw");
        }

        const embed = this.utils.embed();

        const title = `${
            anilist.title.english
                ? `${anilist.title.english} (${anilist.title.romaji})`
                : `${anilist.title.romaji} (${anilist.title.native})`
        }`;
        const format = bold(anilist.format);
        const score = bold(`${anilist.averageScore.toString()}%`);
        const episodes = bold(anilist.episodes.toString());
        const duration = bold(utils.formatTime(utils.minutesToMs(anilist.duration)));
        const status = bold(anilist.status);

        const whichEpisode = bold(response.episode ? `#${response.episode}` : "N/A");
        const similarity = bold(
            response.similarity.toString() === "1"
                ? "100"
                : `${response.similarity.toString().replace("0.", "").substring(0, 2)}%`
        );
        const timestamp = bold(utils.formatTimestamp(utils.secondsToMs(response.from)));

        embed.setAuthor({ name: title });
        embed.addField(
            translate(Locales.Commands.Entertainment.WhatAnime_ResponseGeneralInformation_Title),
            translate(Locales.Commands.Entertainment.WhatAnime_ResponseGeneralInformation_Content, {
                format: format,
                score: score,
                episodes: episodes,
                duration: duration,
                status: status,
            })
        );
        embed.addField(
            translate(Locales.Commands.Entertainment.WhatAnime_ResponseImageInformation_Title),
            translate(Locales.Commands.Entertainment.WhatAnime_ResponseImageInformation_Content, {
                episode: whichEpisode,
                similarity: similarity,
                timestamp: timestamp,
            })
        );

        if (response.image !== undefined) embed.setImage(response.image);
        if (response.similarity <= 0.9) embed.setFooter({ text: "Result may vary" });

        return embed;
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Entertainment.WhatAnime_CommandDescription))
            .addStringOption((option) => {
                return option
                    .setName("url")
                    .setDescription(translate(Locales.Commands.Entertainment.WhatAnime_Options_Url))
                    .setRequired(true);
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }
}
