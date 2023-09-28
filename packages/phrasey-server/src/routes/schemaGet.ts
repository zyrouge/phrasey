import { createPhraseyServerRoute } from "../route";

export const schemaGetRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "GET",
        path: "/schema/get",
        handler: async () => {
            const schema = server.state.getSchema();
            return { success: true, schema };
        },
    });
});
