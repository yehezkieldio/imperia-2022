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
import { Argument, ArgumentContext, ArgumentOptions, Identifiers, Result, UserError } from "@sapphire/framework";

import { BaseCommand } from "../structures";

@ApplyOptions<ArgumentOptions>({
    name: "command",
})
export class CommandArgument extends Argument<BaseCommand> {
    async run(parameter: string, context: ArgumentContext): Promise<Result<BaseCommand, UserError>> {
        const command = this.container.stores.get("commands").get(parameter.toLowerCase()) as BaseCommand | undefined;

        if (command === undefined) {
            return this.error({
                parameter,
                identifier: Identifiers.InvalidCommand,
                context,
            });
        } else {
            return this.ok(command);
        }
    }
}
