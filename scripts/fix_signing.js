const fs = require("fs");
const path = require("path");

const gradlePath = process.argv[2];
if (!gradlePath) {
  console.error("Usage: node fix_signing.js <path-to-build.gradle>");
  process.exit(1);
}

let content = fs.readFileSync(gradlePath, "utf8");

console.log("Original build.gradle loaded, size:", content.length);

// Add signingConfigs block before buildTypes
const signingBlock = `    signingConfigs {
        release {
            storeFile file("release-key.jks")
            storePassword "fasthub123"
            keyAlias "fasthub-key"
            keyPassword "fasthub123"
        }
    }`;

if (content.includes("signingConfigs {")) {
  console.log("signingConfigs already exists, skipping insertion");
} else {
  content = content.replace("buildTypes {", signingBlock + "\n    buildTypes {");
  console.log("Inserted signingConfigs block");
}

// Replace ALL occurrences of signingConfigs.debug with signingConfigs.release
let count = 0;
while (content.includes("signingConfigs.debug")) {
  content = content.replace("signingConfigs.debug", "signingConfigs.release");
  count++;
}
console.log("Replaced", count, "occurrences of signingConfigs.debug -> signingConfigs.release");

fs.writeFileSync(gradlePath, content);
console.log("build.gradle saved");

// Verify
const verify = fs.readFileSync(gradlePath, "utf8");
if (verify.includes("signingConfigs.debug")) {
  console.error("FAIL: signingConfigs.debug still present!");
  process.exit(1);
}
if (!verify.includes("signingConfigs.release")) {
  console.error("FAIL: signingConfigs.release not found!");
  process.exit(1);
}
console.log("VERIFIED: build.gradle is properly configured for release signing");
