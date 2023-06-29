#! /usr/bin/env node

import { program } from "commander";
import { PhraseyVersion } from "..";
import {
    BuildCommand,
    InitCommand,
    StatusCommand,
    SummaryCommand,
} from "./commands";

program
    .name("phrasey")
    .description("Phrasey CLI")
    .version(PhraseyVersion)
    .addCommand(BuildCommand)
    .addCommand(SummaryCommand)
    .addCommand(InitCommand)
    .addCommand(StatusCommand);

program.parseAsync();
