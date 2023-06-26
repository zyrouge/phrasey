#! /usr/bin/env node

import { program } from "commander";
import { PhraseyVersion } from "..";
import { BuildCommand, SummaryCommand } from "./commands";

program
    .name("phrasey")
    .description("Phrasey CLI")
    .version(PhraseyVersion)
    .addCommand(BuildCommand)
    .addCommand(SummaryCommand);

program.parseAsync();
