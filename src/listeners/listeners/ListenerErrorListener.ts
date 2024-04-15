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
import { Events, ListenerErrorPayload } from "@sapphire/framework";
import { yellow } from "colorette";

import { BaseListener, BaseListenerOptions } from "../../structures";

@ApplyOptions<BaseListenerOptions>({
    once: false,
    enabled: process.env.NODE_ENV === "development" ? true : false, // Enable only for debugging purposes.
    event: Events.ListenerError,
})
export default class ListenerErrorListener extends BaseListener {
    async run(error: unknown, context: ListenerErrorPayload): Promise<void> {
        this.container.logger.error(
            `${yellow("ListenerError")}\n\nName: ${context.piece.name}\nEvent: ${String(
                context.piece.event
            )}\nLocation: ${context.piece.location}\n\n${error}`
        );
    }
}
