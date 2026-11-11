# Contribuir

## Entorno

```bash
no requiere instalacion
```

## Antes de enviar cambios

```bash
python tools/verify_site.py --root .
```

## Flujo

1. Rama desde `main`: `feat/<tema>` o `fix/<tema>`.
2. Cambios minimos y verificables; un proposito por PR.
3. Tests o verificacion reproducible incluidos en el PR.
4. Pull request con la plantilla; sin auto-merge.
5. Revisar `SECURITY_AUDIT_PROTOCOL.md` (R1-R8) si el cambio toca despliegue,
   secretos, CSP, rate limiting o `.gitleaks.toml`.

## Seguridad

- Nunca commitear secretos. Ejecutar `gitleaks detect` antes del push.
- `.env.example` documenta variables sin valores reales (R6).

*Reglas: GH-04, GH-10, R1-R8.*
