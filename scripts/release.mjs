import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import inquirer from "inquirer";
import semver from "semver";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const packageJsonPath = path.join(rootDir, "package.json");
const changelogPath = path.join(rootDir, "CHANGELOG.md");

function run(command, options = {}) {
  try {
    const result = execSync(command, { 
      stdio: options.silent ? "pipe" : "inherit", 
      cwd: rootDir,
      encoding: "utf-8"
    });
    return (result || "").toString();
  } catch (error) {
    if (options.exitOnError !== false) {
      console.error(`\n\x1b[31m❌ Erro ao executar: ${command}\x1b[0m`);
      process.exit(1);
    }
    throw error;
  }
}

async function main() {
  console.log("\x1b[36m\n--- 🚀 Iniciando Processo de Release ---\n\x1b[0m");

  // 1. Verificações Prévias
  console.log("🔍 Verificando estado do repositório...");
  
  // Verifica se há alterações não commitadas
  const status = run("git status --porcelain", { silent: true });
  if (status.trim().length > 0) {
    const { confirmDirty } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmDirty",
        message: "\x1b[33m⚠️ Existem alterações não commitadas. Deseja incluí-las neste release?\x1b[0m",
        default: true,
      },
    ]);
    if (!confirmDirty) {
      console.log("❌ Release cancelado pelo usuário.");
      process.exit(0);
    }
  }

  // Verifica se está na branch main
  const currentBranch = run("git branch --show-current", { silent: true }).trim();
  if (currentBranch !== "main") {
    const { confirmBranch } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmBranch",
        message: `A branch atual é \x1b[33m${currentBranch}\x1b[0m, mas releases são geralmente feitos na \x1b[36mmain\x1b[0m. Deseja continuar?`,
        default: false,
      },
    ]);
    if (!confirmBranch) process.exit(0);
  }

  // 2. Lint & Testes
  run("./node_modules/.bin/eslint .");
  
  // 3. Carregar versão atual
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const currentVersion = pkg.version;
  console.log(`\n📦 Versão atual: \x1b[32m${currentVersion}\x1b[0m`);

  // 4. Interface para o usuário
  const answers = await inquirer.prompt([
    {
      type: "select",
      name: "releaseType",
      message: "Que tipo de alteração você está subindo?",
      choices: [
        { name: "🐞 Bug Fix (Patch: 0.0.x)", value: "patch" },
        { name: "✨ Feature (Minor: 0.x.0)", value: "minor" },
        { name: "🚀 Breaking Change (Major: x.0.0)", value: "major" },
      ],
    },
    {
      type: "input",
      name: "notes",
      message: "Descreva as alterações para o CHANGELOG:",
      validate: (input) => (input.trim() ? true : "As notas não podem ser vazias."),
    },
  ]);

  const nextVersion = semver.inc(currentVersion, answers.releaseType);
  console.log(`\n🔔 Próxima versão: \x1b[32m${nextVersion}\x1b[0m`);

  const { confirmRelease } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirmRelease",
      message: `Tudo pronto para gerar a versão ${nextVersion}. Confirmar?`,
      default: true,
    },
  ]);

  if (!confirmRelease) {
    console.log("❌ Operação cancelada pelo usuário.");
    process.exit(0);
  }

  // 5. Atualizar package.json
  pkg.version = nextVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("✅ package.json atualizado.");

  // 6. Atualizar CHANGELOG.md
  const date = new Date().toISOString().split("T")[0];
  const newEntry = `\n## [${nextVersion}] - ${date}\n- ${answers.notes}\n`;

  if (!fs.existsSync(changelogPath)) {
    fs.writeFileSync(
      changelogPath,
      `# Changelog\n\nTodas as mudanças notáveis deste projeto serão documentadas neste arquivo.\n${newEntry}`
    );
  } else {
    const currentChangelog = fs.readFileSync(changelogPath, "utf-8");
    const versionMatch = currentChangelog.match(/## \[/);
    if (versionMatch) {
      const splitIndex = versionMatch.index;
      fs.writeFileSync(
        changelogPath,
        currentChangelog.slice(0, splitIndex) + newEntry + "\n" + currentChangelog.slice(splitIndex)
      );
    } else {
      fs.appendFileSync(changelogPath, newEntry);
    }
  }
  console.log("✅ CHANGELOG.md atualizado.");

  // 7. Git Ops
  console.log("\n🚢 Subindo para o GitHub...");
  try {
    const typeMapping = { patch: "fix", minor: "feat", major: "feat!" };
    const commitType = typeMapping[answers.releaseType] || "chore";

    run("git add .");
    run(`git commit -m "${commitType}(v${nextVersion}): ${answers.notes}"`);
    run(`git tag v${nextVersion}`);
    run("git push origin HEAD");
    run("git push origin --tags");
    
    console.log(`\n\x1b[32m🎉 Release v${nextVersion} publicada com sucesso!\x1b[0m\n`);
  } catch (err) {
    console.error("\n\x1b[31m❌ Erro durante o push git. Verifique conflitos ou permissões.\x1b[0m");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});