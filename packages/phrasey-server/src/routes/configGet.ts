import { createPhraseyServerRoute } from "../route";

export const configGetRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "GET",
        path: "/config/get",
        handler: async () => {
            const config = server.state.getConfig();
            return { success: true, config: config.json() };
        },
    });
});
