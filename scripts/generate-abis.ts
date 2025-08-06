import * as fs from 'fs';
import * as path from 'path';

const ARTIFACTS_DIR = path.join(__dirname, '../artifacts/contracts');
const OUTPUT_DIR = path.join(__dirname, '../src/abis');

// Contract names to extract ABIs for
const CONTRACTS = [
  'HakiToken.sol',
  'LegalBounty.sol', 
  'DocumentRegistry.sol',
  'MilestoneEscrow.sol',
  'ReputationSystem.sol',
  'ESignatureRegistry.sol'
];

async function generateABIs() {
  console.log('🔧 Generating contract ABIs...');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Create index file
  let indexContent = '// Auto-generated contract ABIs\n\n';

  for (const contract of CONTRACTS) {
    const contractName = contract.replace('.sol', '');
    const artifactPath = path.join(ARTIFACTS_DIR, contract, `${contractName}.json`);
    
    if (!fs.existsSync(artifactPath)) {
      console.warn(`⚠️  Warning: Artifact not found for ${contractName}`);
      continue;
    }

    try {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
      const abi = artifact.abi;
      
      // Save individual ABI file
      const abiPath = path.join(OUTPUT_DIR, `${contractName}.json`);
      fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
      
      // Add to index
      indexContent += `export { default as ${contractName}ABI } from './${contractName}.json';\n`;
      
      console.log(`✅ Generated ABI for ${contractName}`);
    } catch (error) {
      console.error(`❌ Error processing ${contractName}:`, error);
    }
  }

  // Write index file
  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);
  console.log('✅ All ABIs generated successfully!');
}

generateABIs().catch(console.error); 