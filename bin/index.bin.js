#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const process = require("process");
const clc = require("cli-color");

const { exec } = require('child_process');

try {
  const torchwood = require.resolve(process.cwd()+"/node_modules/tochwood.io/index.js");

  // execute command to run local version of torchwood.io

} catch(e) {
  console.error(clc.red("tochwood.io not installed"));
  process.exit(e.code);
}