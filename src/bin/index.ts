#! /usr/bin/env node

import { program } from "commander";
import { PhraseyVersion } from "..";
import { BuildCommand, InitCommand, SummaryCommand } from "./commands";

program
    .name("phrasey")
    .description("Phrasey CLI")
    .version(PhraseyVersion)
    .addCommand(BuildCommand)
    .addCommand(SummaryCommand)
    .addCommand(InitCommand);

program.parseAsync();
