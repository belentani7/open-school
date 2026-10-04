#!/usr/bin/env bash
set +e
cd /home/ubuntu/niche-lang-app

: > delivery-validation.txt

run_check() {
  local label="$1"
  shift
  "$@" >> delivery-validation.txt 2>&1
  printf '%s_EXIT=%s\n' "$label" "$?" >> delivery-validation.txt
}

run_check TSC pnpm exec tsc --noEmit --pretty false
run_check LINT pnpm lint
run_check TEST pnpm test
run_check BUILD pnpm build
run_check EXPO_CONFIG npx expo config --type public

if command -v docker >/dev/null 2>&1; then
  POSTGRES_USER=nichelang POSTGRES_PASSWORD=local-only POSTGRES_DB=nichelang_db docker compose config >> delivery-validation.txt 2>&1
  printf 'DOCKER_COMPOSE_EXIT=%s\n' "$?" >> delivery-validation.txt
else
  printf 'DOCKER_COMPOSE_EXIT=SKIPPED_NO_DOCKER\n' >> delivery-validation.txt
fi

run_check BACKUP pnpm backup
printf '%s\n' '=== RESULT CODES ==='
grep -E '^[A-Z_]+_EXIT=' delivery-validation.txt
printf '%s\n' '=== TEST SUMMARY ==='
grep -E 'Test Files|Tests |passed|skipped' delivery-validation.txt | tail -8
printf '%s\n' '=== BACKUP ==='
ls -lh /home/ubuntu/Proyecto_NicheLang_Backup_*.zip 2>/dev/null || true
