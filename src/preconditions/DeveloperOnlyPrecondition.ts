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
import { Precondition, PreconditionOptions, Result, UserError, Identifiers } from "@sapphire/framework";
import { CommandInteraction, Message } from "discord.js";

import { Locales, DEVELOPERS } from "../libraries";

@ApplyOptions<PreconditionOptions>({
    name: "DeveloperOnly",
})
export class DeveloperOnlyPrecondition extends Precondition {
    public async messageRun(message: Message): Promise<Result<unknown, UserError>> {
        return DEVELOPERS.includes(message.author.id)
            ? this.ok()
            : this.error({
                  identifier: Identifiers.PreconditionDeveloperOnly,
                  message: Locales.Preconditions.Precondition_DeveloperOnly,
              });
    }
    public async chatInputRun(interaction: CommandInteraction): Promise<Result<unknown, UserError>> {
        return DEVELOPERS.includes(interaction.user.id)
            ? this.ok()
            : this.error({
                  identifier: Identifiers.PreconditionDeveloperOnly,
                  message: Locales.Preconditions.Precondition_DeveloperOnly,
              });
    }
}
