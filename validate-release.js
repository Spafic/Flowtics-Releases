#!/usr/bin/env node

/**
 * Release Validator - Validates latest.json structure and content
 * Usage: node validate-release.js [path-to-latest.json]
 */

const fs = require("fs");
const path = require("path");

const VALID_EXTENSIONS = [
  ".exe",
  ".dmg",
  ".AppImage",
  ".deb",
  ".rpm",
  ".zip",
  ".tar.gz",
];
const VALID_PLATFORM_KEYS = {
  windows: ["win-x64", "win-ia32", "win-arm64"],
  macos: ["mac-x64", "mac-arm64"],
  linux: ["linux-x64", "linux-arm64"],
};

function validateRelease(jsonPath) {
  console.log("🔍 Validating release configuration...\n");

  // Check if file exists
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ Error: File not found:", jsonPath);
    process.exit(1);
  }

  // Parse JSON
  let data;
  try {
    const content = fs.readFileSync(jsonPath, "utf8");
    data = JSON.parse(content);
  } catch (error) {
    console.error("❌ Error: Invalid JSON format");
    console.error(error.message);
    process.exit(1);
  }

  let hasErrors = false;
  let hasWarnings = false;

  // Validate required fields
  console.log("📋 Checking required fields...");
  if (!data.version) {
    console.error("❌ Missing required field: version");
    hasErrors = true;
  } else {
    console.log("✅ version:", data.version);
  }

  if (!data.releaseDate) {
    console.error("❌ Missing required field: releaseDate");
    hasErrors = true;
  } else {
    console.log("✅ releaseDate:", data.releaseDate);
  }

  if (!data.platforms || typeof data.platforms !== "object") {
    console.error("❌ Missing or invalid field: platforms");
    hasErrors = true;
  } else {
    console.log(
      "✅ platforms: object with",
      Object.keys(data.platforms).length,
      "entries\n"
    );
  }

  // Validate platforms
  if (data.platforms) {
    console.log("🔧 Validating platform entries...\n");

    const platformCounts = {
      windows: 0,
      macos: 0,
      linux: 0,
    };

    for (const [key, platform] of Object.entries(data.platforms)) {
      // Skip comment fields
      if (key.startsWith("_")) {
        continue;
      }

      console.log(`Platform: ${key}`);

      // Validate platform key format
      const validKey = Object.values(VALID_PLATFORM_KEYS).flat().includes(key);
      if (!validKey) {
        console.log(`  ⚠️  Warning: Unknown platform key "${key}"`);
        hasWarnings = true;
      }

      // Count platforms
      if (key.startsWith("win-")) platformCounts.windows++;
      else if (key.startsWith("mac-")) platformCounts.macos++;
      else if (key.startsWith("linux-")) platformCounts.linux++;

      // Validate URL
      if (!platform.url) {
        console.log("  ❌ Missing URL");
        hasErrors = true;
      } else if (platform.url === "#" || platform.url.trim() === "") {
        console.log("  ⚠️  Warning: Placeholder URL detected");
        console.log("     This platform will be hidden on the website");
        hasWarnings = true;
      } else {
        // Check file extension
        const hasValidExt = VALID_EXTENSIONS.some((ext) =>
          platform.url.endsWith(ext)
        );
        if (!hasValidExt) {
          console.log(
            "  ❌ Invalid file extension. Must end with:",
            VALID_EXTENSIONS.join(", ")
          );
          hasErrors = true;
        } else {
          console.log("  ✅ URL:", platform.url);
        }
      }

      // Validate label
      if (!platform.label) {
        console.log(
          "  ⚠️  Warning: Missing label (will use platform key as fallback)"
        );
        hasWarnings = true;
      } else {
        console.log("  ✅ Label:", platform.label);
      }

      // Check size
      if (!platform.size || platform.size === 0) {
        console.log("  ⚠️  Warning: Missing or zero file size");
        hasWarnings = true;
      } else {
        const sizeMB = (platform.size / (1024 * 1024)).toFixed(2);
        console.log("  ✅ Size:", sizeMB, "MB");
      }

      // Check checksum
      if (!platform.checksum || platform.checksum === "") {
        console.log(
          "  ⚠️  Warning: Missing checksum (recommended for security)"
        );
        hasWarnings = true;
      } else if (platform.checksum === "sha256_checksum_here") {
        console.log("  ⚠️  Warning: Placeholder checksum detected");
        hasWarnings = true;
      } else {
        console.log(
          "  ✅ Checksum:",
          platform.checksum.substring(0, 16) + "..."
        );
      }

      // Check available flag
      if (platform.available === false) {
        console.log("  ℹ️  Note: Marked as unavailable (will be hidden)");
      }

      console.log("");
    }

    // Summary
    console.log("📊 Platform Summary:");
    console.log("  Windows:", platformCounts.windows);
    console.log("  macOS:", platformCounts.macos);
    console.log("  Linux:", platformCounts.linux);
    console.log("");

    if (
      platformCounts.windows === 0 &&
      platformCounts.macos === 0 &&
      platformCounts.linux === 0
    ) {
      console.error("❌ Error: No valid platforms found!");
      hasErrors = true;
    }
  }

  // Final result
  console.log("═".repeat(50));
  if (hasErrors) {
    console.error("\n❌ Validation FAILED with errors");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("\n⚠️  Validation PASSED with warnings");
    console.log(
      "Your release config will work, but consider addressing the warnings above."
    );
    process.exit(0);
  } else {
    console.log("\n✅ Validation PASSED");
    console.log("Your release configuration looks good!");
    process.exit(0);
  }
}

// Main execution
const args = process.argv.slice(2);
const jsonPath = args[0] || path.join(__dirname, "releases", "latest.json");

console.log("Flowtics Release Validator\n");
console.log("Validating:", jsonPath);
console.log("═".repeat(50), "\n");

validateRelease(jsonPath);
