/**
 * @fileoverview The utility functions for the command.
 * @author LichKing112
 */

import { bold } from "@discordjs/builders";
import { BaseMessageEmbed, BasePaginatedMessageEmbed } from "../../structures";

/**
 * @class
 * @classdesc The command utility functions.
 */
export class MessageUtils {
    /**
     * @description The embed.
     * @returns {BaseMessageEmbed}
     */
    public embed(): BaseMessageEmbed {
        return new BaseMessageEmbed();
    }

    /**
     * @description The paginated message embed.
     * @returns {BasePaginatedMessageEmbed}
     */
    public paginatedEmbed(): BasePaginatedMessageEmbed {
        return new BasePaginatedMessageEmbed();
    }

    /**
     * @param {string} message - The message to be set on the embed description.
     * @param {string} identifier - The error identifier to be set on the embed footer.
     * @returns {BaseMessageEmbed}
     *
     * @license GNU General Public License v3.0
     * @copyright 2021 TheRealKizu
     * Modified for use in this project.
     *
     * @see {@link https://github.com/TheRealKizu/latte/blob/master/src/libraries/utils/CommandUtils.ts#L11 }
     */
    errorEmbed(identifier: string, message: string): BaseMessageEmbed {
        const rand = Math.floor(Math.random() * 2) + 1;
        if (rand >= 1) {
            identifier = "UNKNOWN";
        } else {
            identifier = "wenabudycatchuangoposobadidataiusedtono";
        }

        return this.embed()
            .isErrorEmbed(true)
            .setDescription(bold(message))
            .setFooter({ text: `Error: ${identifier}` });
    }
}
