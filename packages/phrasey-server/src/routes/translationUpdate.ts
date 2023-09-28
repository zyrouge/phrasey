import fs from "fs-extra";
import {
    PhraseyContentFormats,
    PhraseyTranslations,
    PhraseyZTranslation,
} from "phrasey";
import { z } from "zod";
import { createPhraseyServerRoute } from "../route";
import { HttpCodes } from "../utils";

const payloadSchema = z.object({
    path: z.string(),
    data: PhraseyZTranslation,
});

export const translationUpdateRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "POST",
        path: "/translation/update",
        handler: async (req, res) => {
            const payloadParsed = payloadSchema.safeParse(req.payload);
            if (!payloadParsed.success) {
                return res
                    .response({
                        success: false,
                        error: "Invalid payload.",
                    })
                    .code(HttpCodes.BAD_REQUEST);
            }
            const payload = payloadParsed.data;
            const config = server.state.getConfig();
            const translations = server.state.getTranslations();
            const translationPath = PhraseyTranslations.normalizePath(
                payload.path,
            );
            if (!translations.pathCodes.has(translationPath)) {
                return res
                    .response({
                        success: false,
                        error: `Invalid translation path: ${translationPath}`,
                    })
                    .code(HttpCodes.BAD_REQUEST);
            }
            try {
                const formatter = PhraseyContentFormats.resolve(
                    config.z.input.format,
                );
                const serialized = formatter.serialize(payload.data);
                await fs.writeFile(translationPath, serialized);
                return { success: true };
            } catch (error) {
                return res
                    .response({
                        success: false,
                        error: "Failed to save translation data.",
                    })
                    .code(HttpCodes.INTERNAL_SERVER_ERROR);
            }
        },
    });
});
