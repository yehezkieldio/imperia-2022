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
import ms from "ms";

import { BaseListener, BaseListenerOptions } from "../../structures";
import { PRESENCE_ACTIVITIES } from "../../libraries";

@ApplyOptions<BaseListenerOptions>({
    once: true,
    event: Events.ClientReady,
})
export default class ReadyListener extends BaseListener {
    async run(): Promise<void> {
        this.container.logger.info(
            `Currently running a ${
                process.env.NODE_ENV === "production" ? "production/stable" : "development/master"
            } build.`
        );

        this.container.logger.info(`Logged in as ${this.container.client.user.tag}`);

        if (process.env.CI_TEST == "true") {
            this.container.logger.debug(`Compile Test sucess! Terminating process...`);
            setTimeout(() => {
                process.exit(0);
            }, 3000);
        }

        const randomizePresence = (): void => {
            this.container.client.user.setPresence({
                activities: [
                    {
                        name:
                            this.container.utils.randomArray(PRESENCE_ACTIVITIES) +
                            " | " +
                            this.container.client.defaultPrefix +
                            "help",
                    },
                ],
                status: "dnd",
            });
        };

        void randomizePresence();
        setInterval(randomizePresence, ms("20m"));
    }
}
