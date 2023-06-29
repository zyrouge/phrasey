import { Phrasey } from "../../phrasey";
import { PhraseyTreeLike } from "../../utils";
import { log } from "../utils";
import { parsePhraseyOptions } from "./parsePhraseyOptions";

export const createPhrasey = async (
    source: string,
    options: any
): Promise<Phrasey> => {
    const phraseyOptions = parsePhraseyOptions(source, options);
    const pharseyResult = await Phrasey.create(phraseyOptions);
    if (!pharseyResult.success) {
        log.error(`Could not create phrasey client.`);
        log.grayed(PhraseyTreeLike.build([pharseyResult.error.toString()]));
        log.ln();
        process.exit(1);
    }
    return pharseyResult.data;
};
