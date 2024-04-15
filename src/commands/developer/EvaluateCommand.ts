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
import { codeBlock, isThenable } from "@sapphire/utilities";
import { bold, SlashCommandBuilder } from "@discordjs/builders";
import { Message, CommandInteraction } from "discord.js";
import { APIMessage } from "discord-api-types";
import { inspect } from "util";

import { BaseCommand, BaseCommandOptions } from "../../structures";
import { Locales, TEST_SERVERS } from "../../libraries";

@ApplyOptions<BaseCommandOptions>({
    name: "evaluate",
    aliases: ["eval", "ev"],
    description: Locales.Commands.Developer.EvaluateCommand_CommandDescription,
    extendedDescription: {
        usage: "<code>",
        examples: ["evaluate this.container.client"],
    },
    requiredClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"],
    preconditions: ["DeveloperOnly"],
})
export default class EvaluateCommand extends BaseCommand {
    async messageRun(message: Message): Promise<Message | Message[]> {
        if (this.supportsChatInputCommands()) {
            return message.reply({ content: "Use slash commands for this command." });
        }
    }

    override async chatInputRun(interaction: CommandInteraction): Promise<APIMessage | Message> {
        const code = interaction.options.getString("code", true);

        await interaction.deferReply({ ephemeral: true });

        // fuck you @Kizu#3267
        const process = /(process\.exit|process\.kill)/;
        if (process.test(code))
            return (await interaction.editReply({
                content: "Fuck you",
                files: [{ attachment: "https://c.tenor.com/ureTfAf6B3EAAAAM/no-jerry.gif" }],
            })) as APIMessage | Message;

        let content: string;

        try {
            let evaled = eval(code);
            if (isThenable(evaled)) evaled = await evaled;
            if (typeof evaled !== "string") evaled = inspect(evaled, { depth: 0 });

            content = `📦 ${bold("OUTPUT")}\n${codeBlock("js", this.__handleEvaledCode(evaled))}`;
        } catch (error) {
            content = `📦 ${bold("ERROR")}\n${codeBlock("bash", this.__handleEvaledCode(String(error)))}`;
            this.container.logger.error(error);
        }

        return (await interaction.editReply({ content: content })) as APIMessage | Message;
    }

    private __handleEvaledCode(code: string): string {
        if (typeof code !== "string") return code;

        return code
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(process.env.DISCORD_TOKEN, "[REDACTED]");
    }

    async registerApplicationCommands(registry: ApplicationCommandRegistry): Promise<void> {
        const command = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Evaluate some code.")
            .addStringOption((opt) => {
                return opt.setName("code").setDescription("Code to evaluate").setRequired(true);
            });

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: TEST_SERVERS,
        });
    }
}
