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

import { Result } from "trace.moe.ts/dist/structures/Result";
import { SearchResponse } from "trace.moe.ts/dist/structures/SearchResponse";
import { IAniListQueryResult } from "./IAniList";

export interface IWhatAnimeResult extends Result {}
export interface IWhatAnimeSearchResponse extends SearchResponse {}

export interface IWhatAnimeTraceMoeResult {
    result: IWhatAnimeResult;
    aniListResult: IAniListQueryResult;
}
