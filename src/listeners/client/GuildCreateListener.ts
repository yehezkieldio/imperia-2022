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
import { Guild } from "discord.js";

import { BaseListener, BaseListenerOptions } from "../../structures";

@ApplyOptions<BaseListenerOptions>({
    once: false,
    event: Events.GuildCreate,
})
export default class GuildCreateListener extends BaseListener {
    async run(guild: Guild): Promise<void> {
        if (!guild.available) return;

        this.container.logger.info(
            `${this.container.client.user.tag} has been added to ${guild.name}! Syncing and verifying guild settings..`
        );

        this.__createGuildSettings(guild);
    }

    private async __createGuildSettings(guild: Guild): Promise<void> {
        const guildConf = await this.container.database.getGuildHandler().getGuild(guild.id);

        if (!guildConf) {
            this.container.logger.info(
                `${guild.name} is not detected on the database! Creating a new guild settings..`
            );

            await this.container.database.getGuildHandler().createGuild(guild.id);
            this.container.logger.info(`${guild.name} guild settings creation completed!`);
        }

        this.container.logger.info(`${guild.name} synced and verified!`);
    }
}
