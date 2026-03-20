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

async function promptMultilineNotes() {
  const { summary } = await inquirer.prompt([
    {
      type: "input",
      name: "summary",
      message: "Título/resumo do CHANGELOG:",
      validate: (input) => (input.trim() ? true : "O resumo não pode ser vazio."),
    },
  ]);

  const bulletItems = [];

  while (true) {
    const { addBullet } = await inquirer.prompt([
      {
        type: "confirm",
        name: "addBullet",
        message:
          bulletItems.length === 0
            ? "Deseja adicionar itens em bullet no CHANGELOG?"
            : "Deseja adicionar outro bullet no CHANGELOG?",
        default: bulletItems.length === 0,
      },
    ]);

    if (!addBullet) {
      break;
    }

    const { bullet } = await inquirer.prompt([
      {
        type: "input",
        name: "bullet",
        message: "Descreva o item:",
        validate: (input) => (input.trim() ? true : "O item não pode ser vazio."),
      },
    ]);

    bulletItems.push(`- ${bullet.trim()}`);
  }

  if (bulletItems.length === 0) {
    return summary.trim();
  }

  return `${summary.trim()}\n\n${bulletItems.join("\n")}`;
}

function formatChangelogNotes(notes) {
  const trimmedNotes = notes.trim();

  if (!trimmedNotes.includes("\n")) {
    return `- ${trimmedNotes}`;
  }

  return trimmedNotes;
}

function getCommitSummary(notes) {
  const firstLine = notes
    .split("\n")
    .map(line => line.trim())
    .find(Boolean) || "chore: release";

  return firstLine.replace(/^[-*]\s*/, "").replace(/"/g, '\\"');
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
  console.log("🔍 Rodando lint...");
  let lintOutput = "";
  try {
    lintOutput = run("npm run lint", { silent: true, exitOnError: false });
  } catch (error) {
    // ESLint sai com código != 0 quando há errors
    lintOutput = (error.stdout || "") + (error.stderr || "");
    console.log(lintOutput);
    console.error("\n\x1b[31m❌ Falha no lint. Corrija os erros acima antes de continuar.\x1b[0m");
    process.exit(1);
  }

  // ESLint retorna exit code 0 para warnings, então verificamos o output manualmente
  const hasLintIssues = /\d+ problems?/i.test(lintOutput) || /warning|error/i.test(lintOutput);
  if (hasLintIssues) {
    console.log(lintOutput);
    console.error("\n\x1b[31m❌ Lint encontrou problemas (warnings ou errors). Corrija-os antes de continuar.\x1b[0m");
    process.exit(1);
  }

  console.log("✅ Lint realizado com sucesso!\n");

  // 3. Auditoria de segurança
  console.log("🔒 Rodando auditoria de segurança (npm audit)...");
  try {
    run("npm audit", { exitOnError: false });
    console.log("✅ Nenhuma vulnerabilidade encontrada!\n");
  } catch (error) {
    console.error("\n\x1b[31m❌ npm audit encontrou vulnerabilidades. Corrija-as antes de continuar.\x1b[0m");
    console.error("\x1b[33mDica: tente `npm audit fix` ou `npm audit fix --force` para resolver.\x1b[0m");
    process.exit(1);
  }

  // 4. Carregar versão atual
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const currentVersion = pkg.version;
  console.log(`\n📦 Versão atual: \x1b[32m${currentVersion}\x1b[0m`);

  // 5. Interface para o usuário
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
    }
  ]);

  const notes = await promptMultilineNotes();

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

  // 6. Atualizar package.json
  pkg.version = nextVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + "\n");
  console.log("✅ package.json atualizado.");

  // 7. Atualizar CHANGELOG.md
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const newEntry = `\n## [${nextVersion}] - ${dateStr} ${timeStr}\n${formatChangelogNotes(notes)}\n`;

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

  // 8. Git Ops
  console.log("\n🚢 Subindo para o GitHub...");
  try {
    const typeMapping = { patch: "fix", minor: "feat", major: "feat!" };
    const commitType = typeMapping[answers.releaseType] || "chore";
    const commitSummary = getCommitSummary(notes);

    run("git add .", { exitOnError: false });
    run(`git commit -m "${commitType}(v${nextVersion}): ${commitSummary}"`, { exitOnError: false });
    run(`git tag v${nextVersion}`, { exitOnError: false });
    run("git push origin HEAD", { exitOnError: false });
    run("git push origin --tags", { exitOnError: false });
    
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
