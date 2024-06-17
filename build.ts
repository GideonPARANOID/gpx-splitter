import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import tsConfigJson from './tsconfig.json';
import packageJson from './package.json';

const outDir = tsConfigJson.compilerOptions.outDir;

const build = async () => {
  try {
    // cdns for fast-xml-parser don't seem to include the required builder component
    const fastXmlParserVersion = packageJson.dependencies['fast-xml-parser'];
    const commands = [
      'yarn tsc --noEmit',
      `rm -rf ${outDir}`,
      `mkdir -p ${outDir}/lib ${outDir}/static`,
      `cp src/*.html src/*.css ${outDir}/`,
      `cp src/static/* ${outDir}/static`,

      `curl https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/v${fastXmlParserVersion}/lib/fxbuilder.min.js > ${outDir}/lib/fxbuilder.min.js`,
      ,
      `curl https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/v${fastXmlParserVersion}/lib/fxparser.min.js > ${outDir}/lib/fxparser.min.js`,
    ];

    commands.forEach((command) => execSync(command));
  } catch (error) {
    console.error(error.stdout.toString(), error.stderr.toString());
    process.exit(error.status);
  }

  const context = await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outfile: `${outDir}/app.js`,
  });
};

void build();
