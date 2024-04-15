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
import { ApplicationCommandRegistry, CommandStore, RegisterBehavior } from "@sapphire/framework";
import { inlineCode, SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message } from "discord.js";

import {
    BaseArgument,
    BaseCommand,
    BaseCommandOptions,
    BaseMessageEmbed,
    BasePaginatedMessageEmbed,
} from "../../structures";
import { TFunction } from "@sapphire/plugin-i18next";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "commands",
    aliases: ["cmds"],
    description: Locales.Commands.Core.CommandsList_CommandDescription,
    extendedDescription: {
        usage: "",
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
})
export default class CommandsListCommand extends BaseCommand {
    async messageRun(message: Message, args: BaseArgument): Promise<BasePaginatedMessageEmbed> {
        const paginated = await this.__intialize(args.translate);
        return paginated.run(message);
    }

    async chatInputRun(interaction: CommandInteraction): Promise<BasePaginatedMessageEmbed> {
        const locale = await this.container.client.fetchLanguage(interaction);
        const translate = this.container.i18n.getT(locale);
        const paginated = await this.__intialize(translate);
        const loadingMessage = await interaction.reply({
            fetchReply: true,
            embeds: [this.utils.embed().setDescription("...")],
        });

        return paginated.run(loadingMessage as Message, interaction.user);
    }

    private async __intialize(translate: TFunction): Promise<BasePaginatedMessageEmbed> {
        const commands: CommandStore = this.container.stores.get("commands");
        const paginated = new BasePaginatedMessageEmbed();

        const categoryFilter = (category: string) => (cmd: BaseCommand) => cmd.category === category;
        const mapCodeNames = ({ name, description }): string => {
            return [name, translate(description)].map(inlineCode).join(" - ");
        };

        const commandsToString = (category: string): string => {
            return commands.filter(categoryFilter(category)).map(mapCodeNames).join("\n");
        };

        const returnFieldOptions = (category: string) => {
            return [`—  ${category}`, commandsToString(category.toLowerCase())];
        };
        const fields: Array<any> = ["Core", "Utility", "Configuration", "Entertainment"].map(returnFieldOptions);
        const grouped = CommandsListCommand.groupArrayInto2d(fields, 2);
        for (const chunk of grouped) {
            paginated.addPageEmbed((embed: BaseMessageEmbed) => {
                for (let i = 0; i < chunk.length; i++) {
                    const field: [string, string] = chunk[i];
                    embed.addField(...field);
                }
                embed.setAuthor({
                    name: this.container.client.user.username,
                    iconURL: this.container.client.user.avatarURL(),
                });
                return embed;
            });
        }

        return paginated;
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const translate = this.container.i18n.getT(this.container.client.defaultLanguage);

        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(translate(Locales.Commands.Core.CommandsList_CommandDescription));

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: process.env.NODE_ENV === "development" ? TEST_SERVERS : [],
        });
    }

    /**
     * @description Generator that groups array
     * @param {any[]} array Big sized array you want to group
     * @param {number} size Size for each group
     * @yields { Array<any> }
     */
    static *groupArrayInto2d(array: Array<any>, size: number): Generator<Array<any>> {
        const total = array.length;
        let i = 0;
        let tempIndex = 0;
        let tempArray = [];
        while (total > i) {
            const current = array[i];
            tempArray.push(current);
            if (tempIndex === size - 1) {
                yield tempArray;
                tempArray = [];
                tempIndex = -1;
            }
            tempIndex++;
            i++;
        }
        if (tempArray.length) yield tempArray;
    }
}
