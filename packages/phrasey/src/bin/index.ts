#! /usr/bin/env node
import { program } from "commander";
import { PhraseyVersion } from "..";
import {
    BuildCommand,
    InitCommand,
    InitInteractiveCommand,
    SummaryCommand,
    WatchCommand,
} from "./commands";

program
    .name("phrasey")
    .description("Phrasey CLI")
    .version(PhraseyVersion)
    .addCommand(BuildCommand)
    .addCommand(SummaryCommand)
    .addCommand(WatchCommand)
    .addCommand(InitInteractiveCommand)
    .addCommand(InitCommand);

program.parseAsync();
