# Always-on rules

- Apply the `token-compression` skill (`.claude/skills/token-compression/SKILL.md`) to every reply, every query. Chat replies only; file contents (code, README, docs) keep their normal style.
- Every feature addition, behaviour change or bug fix in `comfyurn-site/` follows the five-phase `comfyurn-feature` skill (unit, integration, TDD gate, pentest, load). Phase 4 and 5 findings are listed and discussed with the owner before anything is fixed.
