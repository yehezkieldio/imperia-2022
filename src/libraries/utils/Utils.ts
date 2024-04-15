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

import { container, Identifiers } from "@sapphire/framework";
import { UserError } from "@sapphire/framework";
import axios from "axios";

import { IAniListQueryResult } from "../typings";

/**
 * @class
 * @classdesc The utility functions.
 */
export class Utils {
    /**
     * @description Throws a user error.
     * @param {string} identifier - The emitted error.
     * @param {string} message - The error message.
     * @param {unknown} context - The provided context
     * @returns {void}
     */
    error(identifier: string, message: string, context?: unknown): void {
        throw typeof identifier === "string"
            ? new UserError({
                  identifier: identifier,
                  message: message,
                  context: context,
              })
            : identifier;
    }

    /**
     * @description Capitalize the first letter of a string.
     * @param str - The string to be checked.
     * @returns {string}
     */
    capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * @description Randomize a array.
     * @param {string[]} array - The array to be randomize.
     * @returns
     */
    randomArray(array: string[]): string {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * @description Strip www and top level domain from a url.
     * @param {string} str - The url to be stripped.
     * @returns {string}
     */
    stripUrl(url: string): string {
        return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split("/")[0];
    }

    /**
     * @description Map urls into a markdown links.
     * @param {string[]} urls - The urls to be mapped.
     * @returns {string}
     */
    mapUrls(urls: string[]): string {
        return urls.map((url) => `[${this.stripUrl(url)}](${url})`).join(" ");
    }

    /**
     * @description Strip HTML tags from a tag.
     * @param {string} str - The string to be stripped.
     * @returns {string}
     */
    stripHtmlTags(str: string): string {
        return str.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]*>/gi, "");
    }

    /**
     * @description Trims a string to a certain length.
     * @param {string} str - The string to be checked.
     * @param {number} length - The length of the string.
     * @returns
     */
    trimString(str: string, length: number): string {
        return str.length > length ? str.substring(0, length) + "..." : str;
    }

    /**
     * @description Convert milliseconds into seconds.
     * @param {string} ms - The milliseconds to be converted.
     * @returns {number}
     */
    msToSeconds(ms: number): number {
        return ms / 1000;
    }

    /**
     * @description Convert seconds into milliseconds.
     * @param {number} seconds - The seconds to be converted.
     * @returns {number}
     */
    secondsToMs(seconds: number): number {
        return seconds * 1000;
    }

    /**
     * @description Convert minutes into milliseconds.
     * @param {number} minutes - The minutes to be converted.
     * @returns {number}
     */
    minutesToMs(minutes: number): number {
        return minutes * 60 * 1000;
    }

    /**
     * @description Format milliseconds into human readable format.
     * @param {number} ms - The milliseconds to be formatted.
     * @returns {string}
     */
    formatTime(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours} hours ${minutes % 60} minutes`;
        } else if (minutes > 0) {
            return `${minutes} minutes`;
        } else {
            return `${seconds} seconds`;
        }
    }

    /**
     * @description Pad a string with a certain length.
     * @param {string} str - The string to be padded.
     * @param {number} length - The length of the string.
     * @returns {string}
     */
    pad(num: number, size: number): string {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    /**
     * @description Format miliseconds into 00:00:00 format.
     * @param {number} ms - The milliseconds to be formatted.
     * @returns {string}
     */
    formatTimestamp(ms: number): string {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${this.pad(hours, 2)}:${this.pad(minutes % 60, 2)}:${this.pad(seconds % 60, 2)}`;
        } else if (minutes > 0) {
            return `${this.pad(minutes, 2)}:${this.pad(seconds % 60, 2)}`;
        } else {
            return `${this.pad(seconds, 2)}`;
        }
    }

    /**
     * @description Searches AniList for a specific anime or manga.
     * @param {string} query - The query to be searched.
     * @param {string} type - The type of query to be searched.
     * @returns {Promise<IAniListQueryResult>}
     */
    async aniListSearch(search: string, type: "ANIME" | "MANGA" = "ANIME"): Promise<IAniListQueryResult> {
        try {
            const variables = { search };
            const query = `query ($search: String) { Media(search: $search, type: ${type}) { id externalLinks { url } description coverImage { large } title { romaji native english } bannerImage, status, format, averageScore, episodes, duration } }`;

            const { data: response } = await axios.post("https://graphql.anilist.co/", {
                query,
                variables,
            });

            return response.data.Media;
        } catch (error) {
            container.logger.error(error);
            this.error(Identifiers.SearchResultNotFound, "No results found.");
        }
    }
}
