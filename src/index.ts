import { PhraseyConfig, PhraseyConfigKeys } from "./config";
import { Phrasey } from "./phrasey";

export * from "./config";
export * from "./error";
export * from "./phrasey";
export * from "./utils";

export const phrasey = async <Keys extends PhraseyConfigKeys>(
    config: PhraseyConfig<Keys>
) => {
    const client = new Phrasey({ config });
    await client.build();
};
