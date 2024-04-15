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

import { InternationalizationContext } from "@sapphire/plugin-i18next";
import { SapphirePrefix } from "@sapphire/framework";
import { Awaitable, CommandInteraction } from "discord.js";

import { BaseCommand } from "../../structures";
import { Database } from "../database/Database";
import { Utils } from "../utils/Utils";

export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;

            DISCORD_TOKEN: string;

            DEFAULT_PREFIX: string;
            DEFAULT_LANGUAGE: string;

            DATABASE_URL: string;
        }
    }
}

declare module "@sapphire/framework" {
    const enum Identifiers {
        InvalidCommand = "invalidCommand",
        InvalidConfiguration = "invalidConfiguration",
        InvalidType = "invalidType",
        SearchResultNotFound = "searchResultNotFound",
        SearchResultIsNSFW = "searchResultIsNSFW",
        PreconditionDeveloperOnly = "preconditionDeveloperOnly",
        ResultIsNsfw = "resultIsNsfw",
    }
    interface ArgType {
        command: BaseCommand;
    }
    interface Preconditions {
        DeveloperOnly: never;
    }
    interface SapphirePrefixHook {
        (ctx: Message | CommandInteraction): Awaitable<SapphirePrefix>;
    }
}

declare module "discord.js" {
    interface Client {
        readonly defaultPrefix: string;
        readonly defaultLanguage: string;

        fetchPrefix(ctx: Message | CommandInteraction): Promise<string>;
        fetchLanguage(message: InternationalizationContext | CommandInteraction): Promise<string>;
        generateInviteLink(): string;
    }
}

declare module "@sapphire/pieces" {
    interface Container {
        utils: Utils;
        database: Database;
    }
}
