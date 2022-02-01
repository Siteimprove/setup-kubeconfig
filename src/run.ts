import * as fs from "fs";
import * as path from "path";
import * as core from "@actions/core";

export async function run() {
  await setupKubeconfig();
}

export function replace(str, key, value) {
  const regex = new RegExp(`\\$\\{\\s*${key}\\s*\\}`, "g");
  return str.replace(regex, value);
}

export async function setupKubeconfig() {
  const HOME = process.env.HOME;
  const kubeFolder = path.join(HOME, ".kube");
  const configFile = path.join(kubeFolder, "config");
  const CONFIG =
    process.env.CONFIG_YAML || core.getInput("CONFIG_YAML", { required: true });
  const TOKEN =
    process.env.DEPLOYER_TOKEN ||
    core.getInput("DEPLOYER_TOKEN", { required: true });
  const NAMESPACE =
    process.env.NAMESPACE || core.getInput("NAMESPACE") || "default";
  const CONTEXT =
    process.env.CONTEXT || core.getInput("CONTEXT") || "stage-ix-cph";

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
  } catch (err) {
    core.setFailed(err);
  }
}

run().catch(core.setFailed);
