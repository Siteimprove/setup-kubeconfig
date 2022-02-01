"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupKubeconfig = exports.replace = exports.run = void 0;
const fs = require("fs");
const path = require("path");
const core = require("@actions/core");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield setupKubeconfig();
    });
}
exports.run = run;
function replace(str, key, value) {
    const regex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, "g");
    return str.replace(regex, value);
}
exports.replace = replace;
function setupKubeconfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const HOME = process.env.HOME;
        const kubeFolder = path.join(HOME, ".kube");
        const configFile = path.join(kubeFolder, "config");
        const CONFIG = process.env.CONFIG_YAML || core.getInput("CONFIG_YAML", { required: true });
        const TOKEN = process.env.DEPLOYER_TOKEN ||
            core.getInput("DEPLOYER_TOKEN", { required: true });
        const NAMESPACE = process.env.NAMESPACE || core.getInput("NAMESPACE") || "default";
        const CONTEXT = process.env.CONTEXT || core.getInput("CONTEXT") || "stage-ix-cph";
        try {
            let config = CONFIG;
            config = replace(config, "DEPLOYER_TOKEN", TOKEN);
            config = replace(config, "NAMESPACE", NAMESPACE);
            config = replace(config, "CONTEXT", CONTEXT);
            core.debug(config);
            core.setOutput("kubeconfig", config);
            console.log("folder", kubeFolder, fs.existsSync(kubeFolder));
            if (!fs.existsSync(kubeFolder)) {
                fs.mkdirSync(kubeFolder);
            }
            console.log("folder", kubeFolder, fs.existsSync(kubeFolder));
            fs.writeFileSync(configFile, config, {
                flag: "w+",
            });
        }
        catch (err) {
            core.setFailed(err);
        }
    });
}
exports.setupKubeconfig = setupKubeconfig;
run().catch(core.setFailed);
