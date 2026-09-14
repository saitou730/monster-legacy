# Batch 05 Generation Guard

Status: ACTIVE

The current image-generation session repeatedly returned Batch 04-like sheets even when Batch 05 was requested. These repeated outputs are NON-CANON and must not be assigned new species IDs or locks.

For the next successful visual pass:
- Generate EX-057..EX-064 only.
- Do not display EX-049..EX-056.
- Do not reuse Batch 04 creature silhouettes.
- Use `canon/MONSTER_DESIGN_BATCH_05_SPEC.yaml` as the exact target list.
- Apply the locked eye-language rule from `canon/MONSTER_DESIGN_EXPANSION_v0.1.yaml`.
- Perform art-director QA before any VISUAL_DIRECTION_LOCK.

This guard exists to prevent accidental canon duplication caused by a generation-output mismatch.
