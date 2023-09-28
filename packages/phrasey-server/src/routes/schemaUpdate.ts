import fs from "fs-extra";
import { PhraseyContentFormats, PhraseyZSchema } from "phrasey";
import { z } from "zod";
import { createPhraseyServerRoute } from "../route";
import { HttpCodes } from "../utils";

const payloadSchema = z.object({
    path: z.string(),
    data: PhraseyZSchema,
});

export const schemaUpdateRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "POST",
        path: "/schema/update",
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
            const schemaPath = server.phrasey.path(config.z.schema.file);
            try {
                const formatter = PhraseyContentFormats.resolve(
                    config.z.schema.format,
                );
                const serialized = formatter.serialize(payload.data);
                await fs.writeFile(schemaPath, serialized);
                return { success: true };
            } catch (error) {
                return res
                    .response({
                        success: false,
                        error: "Failed to save schema file.",
                    })
                    .code(HttpCodes.INTERNAL_SERVER_ERROR);
            }
        },
    });
});
