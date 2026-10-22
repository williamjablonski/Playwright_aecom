#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE_NAME="playwright-cli-skills:0.1.22"
MODE="${1:-all}"

usage() {
  cat <<'EOF'
Usage: scripts/install-playwright-skills.sh [claude|agents|global|all]

  claude  Install skills in .claude/skills for this workspace.
  agents  Install skills in .agents/skills for this workspace.
  global  Install skills in ~/.claude/skills.
  all     Run all three installations (default).
EOF
}

case "$MODE" in
  claude|agents|global|all) ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac

if ! command -v docker >/dev/null 2>&1; then
  printf '%s\n' "Docker is required but was not found in PATH." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  printf '%s\n' "Docker is not running or the current user cannot access it." >&2
  exit 1
fi

docker build \
  --file "$ROOT_DIR/Dockerfile.playwright-cli" \
  --tag "$IMAGE_NAME" \
  "$ROOT_DIR"

install_skills() {
  local target="$1"
  shift

  docker run --rm \
    --user "$(id -u):$(id -g)" \
    --env HOME=/tmp/home \
    --env PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    --volume "$ROOT_DIR:/workspace" \
    --volume "$HOME/.claude:/tmp/home/.claude" \
    --workdir /workspace \
    "$IMAGE_NAME" install "$@"

  printf 'Installed Playwright CLI skills: %s\n' "$target"
}

if [[ "$MODE" == "global" || "$MODE" == "all" ]]; then
  mkdir -p "$HOME/.claude"
fi

case "$MODE" in
  claude)
    install_skills "workspace .claude" --skills ;;
  agents)
    install_skills "workspace .agents" --skills=agents ;;
  global)
    install_skills "user ~/.claude" --skills -g ;;
  all)
    install_skills "workspace .claude" --skills
    install_skills "workspace .agents" --skills=agents
    install_skills "user ~/.claude" --skills -g ;;
esac
