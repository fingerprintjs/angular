#!/bin/bash

export CI=true
export NG_CLI_ANALYTICS=false
export PNPM_STORE_DIR="$(pwd)/.pnpm-store"

VERSIONS=("15" "16" "17" "18" "19" "20" "21")
LIB_NAME="fingerprintjs-pro-angular"

SOURCE_PROJECT_DIR="$(pwd)/projects/$LIB_NAME"
SOURCE_LIB_DIR="$SOURCE_PROJECT_DIR/src/lib"
SOURCE_PUBLIC_API="$SOURCE_PROJECT_DIR/src/public-api.ts"
SOURCE_TEST_TS="$(pwd)/test.ts"
SOURCE_JEST_CONFIG="$(pwd)/jest.config.js"
SOURCE_ROOT_TSCONFIG="$(pwd)/tsconfig.json"
SOURCE_ROOT_TSCONFIG_SPEC="$(pwd)/tsconfig.spec.json"

LOG_DIR="$(pwd)/test-logs"
mkdir -p "$LOG_DIR"
rm -f "$LOG_DIR"/*

echo "Starting tests for Angular versions: ${VERSIONS[*]}"
echo "Using pnpm store at: $PNPM_STORE_DIR"
echo "Logs: $LOG_DIR"
echo "------------------------------------------------------------"

if ! command -v pnpm &> /dev/null; then
  npm install -g pnpm
fi

pnpm config set store-dir "$PNPM_STORE_DIR"

# Cross-platform sed -i
sedi() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i "" "$@"
  else
    sed -i "$@"
  fi
}

test_version() {
  local VERSION=$1
  local LOG_FILE="$LOG_DIR/angular-$VERSION.log"

  if [ "$VERSION" -ge "20" ]; then
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'.' -f1)
    NODE_MINOR=$(echo "$NODE_VERSION" | cut -d'.' -f2)
    if [ "$NODE_MAJOR" -lt 20 ] || ([ "$NODE_MAJOR" -eq 20 ] && [ "$NODE_MINOR" -lt 19 ]); then
      echo "Angular $VERSION: Skipped (Node.js $NODE_VERSION < v20.19)"
      return 0
    fi
  fi

  (
    set -e
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"

    npx -y @angular/cli@$VERSION new test-workspace --create-application=false --skip-git --skip-install --defaults --package-manager=pnpm
    cd test-workspace

    pnpm install --config.fund=false
    pnpm exec ng generate library "$LIB_NAME" --skip-install
    pnpm install --config.fund=false --config.strict-peer-dependencies=false --no-frozen-lockfile
    pnpm add @fingerprint/agent --config.fund=false --config.strict-peer-dependencies=false
    pnpm add @angular/platform-browser-dynamic@$VERSION zone.js --config.fund=false --config.strict-peer-dependencies=false
    pnpm add -D jest jest-preset-angular jest-environment-jsdom @types/jest @types/node --config.fund=false --config.strict-peer-dependencies=false

    rm -rf projects/"$LIB_NAME"/src/lib/*
    cp -r "$SOURCE_LIB_DIR/"* projects/"$LIB_NAME"/src/lib/
    cp "$SOURCE_PUBLIC_API" projects/"$LIB_NAME"/src/public-api.ts

    [ -f "$SOURCE_TEST_TS" ] && cp "$SOURCE_TEST_TS" test.ts
    [ -f "$SOURCE_JEST_CONFIG" ] && cp "$SOURCE_JEST_CONFIG" jest.config.js
    [ -f "$SOURCE_ROOT_TSCONFIG" ] && cp "$SOURCE_ROOT_TSCONFIG" tsconfig.json
    [ -f "$SOURCE_ROOT_TSCONFIG_SPEC" ] && cp "$SOURCE_ROOT_TSCONFIG_SPEC" tsconfig.spec.json

    if [ ! -f "tsconfig.spec.json" ]; then
      echo '{"extends": "./tsconfig.json", "compilerOptions": {"types": ["jest", "node"]}}' > tsconfig.spec.json
    fi

    cp "$SOURCE_PROJECT_DIR/ng-package.json" projects/"$LIB_NAME"/
    cp "$SOURCE_PROJECT_DIR/package.json" projects/"$LIB_NAME"/
    cp "$SOURCE_PROJECT_DIR/tsconfig.lib.json" projects/"$LIB_NAME"/
    cp "$SOURCE_PROJECT_DIR/tsconfig.lib.prod.json" projects/"$LIB_NAME"/
    cp "$SOURCE_PROJECT_DIR/tsconfig.spec.json" projects/"$LIB_NAME"/

    for FILE in "tsconfig.json" "tsconfig.base.json" "projects/$LIB_NAME/tsconfig.spec.json"; do
      if [ -f "$FILE" ]; then
        sedi '/"types":/d' "$FILE"
        sedi '/"esModuleInterop":/d' "$FILE"
        sedi '/"allowSyntheticDefaultImports":/d' "$FILE"
        sedi '/"skipLibCheck":/d' "$FILE"
        sedi 's/"compilerOptions":\s*{/"compilerOptions": { "types": ["node", "jest"], "esModuleInterop": true, "allowSyntheticDefaultImports": true, "skipLibCheck": true,/g' "$FILE"
      fi
    done

    find . -name "tsconfig.spec.json" -exec bash -c 'sedi() { if [[ "$OSTYPE" == "darwin"* ]]; then sed -i "" "$@"; else sed -i "$@"; fi; }; sedi "s/\"types\":\s*\[/\"types\": [\"node\", \"jest\", /g" "$1"' _ {} \;
    find . -name "tsconfig.spec.json" -exec bash -c 'sedi() { if [[ "$OSTYPE" == "darwin"* ]]; then sed -i "" "$@"; else sed -i "$@"; fi; }; sedi "s/\"compilerOptions\":\s*{/\"compilerOptions\": { \"types\": [\"node\", \"jest\"], \"esModuleInterop\": true, \"allowSyntheticDefaultImports\": true, \"skipLibCheck\": true,/g" "$1"' _ {} \;

    if [ -f "projects/$LIB_NAME/tsconfig.spec.json" ]; then
      if [ ! -f "../../tsconfig.json" ] && [ -f "../../tsconfig.base.json" ]; then
        sedi 's/"extends": "..\/..\/tsconfig.json"/"extends": "..\/..\/tsconfig.base.json"/g' projects/"$LIB_NAME"/tsconfig.spec.json
      fi
    fi

    find projects/"$LIB_NAME" -name "*.spec.ts" -exec bash -c 'sedi() { if [[ "$OSTYPE" == "darwin"* ]]; then sed -i "" "$@"; else sed -i "$@"; fi; }; sedi "1s|^|/// <reference types=\"node\" />\n|" "$1"' _ {} \;

    if [ "$VERSION" -ge "21" ]; then
      sedi 's/"moduleResolution": "node"/"moduleResolution": "bundler"/g' tsconfig.json
      [ -f "tsconfig.base.json" ] && sedi 's/"moduleResolution": "node"/"moduleResolution": "bundler"/g' tsconfig.base.json
      [ -f "projects/$LIB_NAME/tsconfig.lib.json" ] && sedi 's/"moduleResolution": "node"/"moduleResolution": "bundler"/g' projects/"$LIB_NAME"/tsconfig.lib.json
    fi

    pnpm exec ng build "$LIB_NAME"
    pnpm exec jest
    rm -rf "$TEMP_DIR"
  ) > "$LOG_FILE" 2>&1

  local STATUS=$?
  if [ $STATUS -eq 0 ]; then
    echo "Angular $VERSION: PASSED"
  else
    echo "Angular $VERSION: FAILED"
    echo "Log: $LOG_FILE"
    tail -n 15 "$LOG_FILE"
  fi

  return $STATUS
}

PIDS=()
for VERSION in "${VERSIONS[@]}"; do
  test_version "$VERSION" &
  PIDS+=($!)
done

OVERALL_EXIT_CODE=0
for PID in "${PIDS[@]}"; do
  wait "$PID" || OVERALL_EXIT_CODE=$?
done

echo "------------------------------------------------------------"
if [ $OVERALL_EXIT_CODE -ne 0 ]; then
  echo "CI Pipeline Failed"
  exit $OVERALL_EXIT_CODE
else
  echo "Success: All Angular versions passed"
  exit 0
fi
