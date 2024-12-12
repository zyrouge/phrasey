import fs from "fs-extra";
import { PhraseyContentFormats, PhraseyZConfig } from "phrasey";
import { z } from "zod";
import { createPhraseyServerRoute } from "../route";
import { HttpCodes } from "../utils";

const payloadSchema = z.object({
    path: z.string(),
    data: PhraseyZConfig,
});

export const configUpdateRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "POST",
        path: "/config/update",
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
            const configPath = server.phrasey.path(
                server.options.builder.config.file,
            );
            try {
                const formatter = PhraseyContentFormats.resolve(
                    server.options.builder.config.format,
                );
                const serialized = formatter.serialize(payload.data);
                await fs.writeFile(configPath, serialized);
                return { success: true };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_) {
                return res
                    .response({
                        success: false,
                        error: "Failed to save config file.",
                    })
                    .code(HttpCodes.INTERNAL_SERVER_ERROR);
            }
        },
    });
});
