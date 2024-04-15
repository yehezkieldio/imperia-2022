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

import { getRootData } from "@sapphire/pieces";
import path from "node:path";

/**
 * @constant
 * @type {string}
 */
export const PROJECT_WORKSPACE_ROOT: string = path.join(getRootData().root, "..", "src");

/**
 * @constant
 * @type {string}
 */
export const PROJECT_LOCALES_FOLDER: string = path.join(PROJECT_WORKSPACE_ROOT, "locales");

/**
 * @constant
 * @type {string[]}
 */
export const TEST_SERVERS: string[] = ["853812920919261235", "912838402460766218"];

/**
 * @constant
 * @type {string[]}
 */
export const DEVELOPERS: string[] = ["327849142774923266", "380307921952833537", "757772314707361962"];

/**
 * @constant
 * @type {string[]}
 */
export const PRESENCE_ACTIVITIES: string[] = [
    "Sapere aude.",
    "Ad astra per aspera.",
    "Acta non verba.",
    "Audentes fortuna iuvat.",
    "Creo quia absurdum est.",
    "Ubi amor, ibi dolor.",
    "Respice finem.",
    "Aere perennius",
    "Aquila non capit muscas.",
    "Finis coronat opus.",
    "Dulce periculum.",
    "Non ducor duco.",
    "Quid infantes sumus.",
    "Igne natura renovatur integra.",
    "Oderint dum metuant.",
    "Lorem ipsum dolor sit amet",
    "Qui fecit caelum et terram",
    "Soli deo gloria",
    "Veritas vos liberabit",
    "In saecula saeculorum",
    "Incurvatus in se",
];
