import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const ROOT = process.cwd();

const WIDGETS_DIR = path.join(ROOT, "src", "widgets");
const DIST_DIR = path.join(ROOT, "dist", "widgets");

// Clean output directory once
fs.rmSync(DIST_DIR, {
  recursive: true,
  force: true,
});

const manifest = {};

const widgets = fs
  .readdirSync(WIDGETS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => {
    if (name === "shared") {
      return false;
    }

    return fs.existsSync(
      path.join(WIDGETS_DIR, name, "entry.js")
    );
  });

if (!widgets.length) {
  console.log("No widgets found.");
  process.exit(0);
}

console.log(`Found ${widgets.length} widget(s).\n`);

for (const widget of widgets) {
  console.log(`Building ${widget}...`);

  const result = spawnSync(
    "npx",
    [
      "vite",
      "build",
      "--config",
      "vite.widget.config.js",
    ],
    {
      stdio: "inherit",

      shell: true,

      env: {
        ...process.env,
        WIDGET: widget,
      },
    }
  );

  if (result.status !== 0) {
    console.error(`\n❌ Failed building ${widget}`);
    process.exit(result.status);
  }

  manifest[widget] = {
    id: widget,

    name: widget
      .split("-")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" "),

    version: "1.0.0",

    js: `${widget}/widget.js`,

    css: `${widget}/widget.css`,
  };

  console.log(`✅ ${widget} built successfully.\n`);
}

// Ensure dist/widgets exists
fs.mkdirSync(DIST_DIR, {
  recursive: true,
});

// Generate manifest.json
fs.writeFileSync(
  path.join(DIST_DIR, "manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log("📄 Generated dist/widgets/manifest.json");

console.log("🎉 All widgets built successfully.");