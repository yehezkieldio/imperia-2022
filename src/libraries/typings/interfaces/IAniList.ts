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

export interface IAniListCoverImage {
    large: string;
}

export interface IAniListTitle {
    romaji: string;
    native: string;
    english: string;
}

export interface IAniListExternalLinks {
    url: string;
}

export interface IAniListQueryResult {
    id: number;
    description: string;
    coverImage: IAniListCoverImage;
    title: IAniListTitle;
    externalLinks: IAniListExternalLinks[];
    bannerImage?: string;
    format?: string;
    averageScore?: number;
    episodes?: number;
    status?: string;
    duration?: number;
}
