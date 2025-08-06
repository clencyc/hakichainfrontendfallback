# Contract Build Guide

## Problem Solved

The `artifacts/` folder was causing import errors because:
1. It was commented out in `.gitignore` but not being tracked by Git
2. When someone cloned the repository, the `artifacts/` folder didn't exist
3. This caused import errors in `src/config/contracts.ts` and `src/lib/contracts.ts`

## Solution

We've implemented a proper build process that:

1. **Ignores artifacts**: The `artifacts/` folder is now properly ignored by Git
2. **Generates ABIs**: A script extracts contract ABIs and saves them in `src/abis/`
3. **Build integration**: The build process automatically compiles contracts and generates ABIs

## Build Commands

```bash
# Compile contracts only
npm run compile

# Generate ABIs only (requires compiled contracts)
npm run generate-abis

# Build contracts and generate ABIs
npm run build:contracts

# Full build (contracts + frontend)
npm run build
```

## Development Workflow

1. **First time setup**:
   ```bash
   npm install
   npm run build:contracts
   ```

2. **After contract changes**:
   ```bash
   npm run build:contracts
   ```

3. **For production build**:
   ```bash
   npm run build
   ```

## File Structure

```
src/
├── abis/                    # Generated contract ABIs (gitignored)
│   ├── HakiToken.json
│   ├── LegalBounty.json
│   ├── DocumentRegistry.json
│   ├── MilestoneEscrow.json
│   ├── ReputationSystem.json
│   ├── ESignatureRegistry.json
│   └── index.ts
├── config/
│   └── contracts.ts         # Updated to import from abis/
└── lib/
    └── contracts.ts         # Updated to import from abis/
```

## Benefits

- ✅ No more import errors when cloning the repository
- ✅ Proper separation of source code and generated files
- ✅ Automated build process
- ✅ Smaller repository size (artifacts not tracked)
- ✅ Reproducible builds

## Troubleshooting

If you get import errors for ABI files:

1. Make sure contracts are compiled: `npm run compile`
2. Generate ABIs: `npm run generate-abis`
3. Check that `src/abis/` directory exists and contains JSON files

If the `artifacts/` folder is missing:

1. Run `npm run compile` to regenerate artifacts
2. Run `npm run generate-abis` to extract ABIs
3. The artifacts folder will be ignored by Git (as intended) 