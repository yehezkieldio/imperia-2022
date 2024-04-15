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
import { Events } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { bold } from "@discordjs/builders";
import { Message } from "discord.js";

import { BaseListener, BaseListenerOptions } from "../../structures";
import { Locales } from "../../libraries";

@ApplyOptions<BaseListenerOptions>({
    once: false,
    event: Events.MentionPrefixOnly,
})
export default class MentionPrefixOnlyListener extends BaseListener {
    async run(message: Message): Promise<Message> {
        const prefix = await this.container.client.fetchPrefix(message);

        return await message.reply(
            await resolveKey(message, Locales.Listeners.Listener_MentionPrefixOnly, { prefix: bold(prefix.toString()) })
        );
    }
}
