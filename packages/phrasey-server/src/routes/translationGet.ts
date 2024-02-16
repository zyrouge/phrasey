import { z } from "zod";
import { createPhraseyServerRoute } from "../route";
import { HttpCodes } from "../utils";

const payloadSchema = z.object({
    locale: z.string(),
});

export const schemaGetRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "GET",
        path: "/translation/get",
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
            const translations = server.state.getTranslations();
            const translation = translations.translations.get(payload.locale);
            return { success: true, translation: translation?.json() };
        },
    });
});
