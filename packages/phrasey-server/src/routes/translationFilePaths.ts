import { PhraseyBuilder } from "phrasey";
import { createPhraseyServerRoute } from "../route";

export const translationFilePathsRoute = createPhraseyServerRoute((server) => {
    server.server.route({
        method: "GET",
        path: "/translation/file-paths",
        handler: async () => {
            const pipeline = new PhraseyBuilder(
                server.phrasey,
                server.state,
                server.options.builder,
            );
            const files = [];
            files.push(...pipeline.getInputFallbackFilePaths());
            for await (const x of pipeline.getInputFilePaths()) {
                files.push(x);
            }
            return { success: true, files };
        },
    });
});
