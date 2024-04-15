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

/**
 * @fileoverview The entry point for the bot.
 * @author LichKing112
 */

process.env.NODE_ENV ??= "development";

import "dotenv/config";

import * as colorette from "colorette";
colorette.createColors({ useColor: true });

import "@sapphire/plugin-logger/register";
import "@sapphire/plugin-i18next/register";

import { CLIENT_OPTIONS } from "./config";
import { BaseClient } from "./structures";

new BaseClient(CLIENT_OPTIONS).login(process.env.DISCORD_TOKEN);
