import { createPhraseyServerRoute } from "../route";

export const schemaGetRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "GET",
        path: "/locales/get",
        handler: async () => {
            const locales = server.state.getLocales();
            return { success: true, locales: locales.json() };
        },
    });
});
