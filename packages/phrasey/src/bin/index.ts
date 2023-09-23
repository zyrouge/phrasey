#! /usr/bin/env node

import { program } from "commander";
import { PhraseyVersion } from "..";
import {
    BuildCommand,
    InitCommand,
    SummaryCommand,
    WatchCommand,
} from "./commands";

program
    .name("phrasey")
    .description("Phrasey CLI")
    .version(PhraseyVersion)
    .addCommand(BuildCommand)
    .addCommand(SummaryCommand)
    .addCommand(InitCommand)
    .addCommand(WatchCommand);

program.parseAsync();
