import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import tsConfig from './tsconfig.json';

const outDir = tsConfig.compilerOptions.outDir;

const build = async () => {
  //  execSync('yarn tsc --noEmit')
  execSync(`rm -rf ${outDir}`);
  execSync(`mkdir -p ${outDir}/lib`);
  execSync(`cp src/*html ${outDir}/`);
  execSync(
    'curl https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/v4.4.0/lib/fxbuilder.min.js > dist/lib/fxbuilder.min.js',
  );
  execSync(
    'curl https://raw.githubusercontent.com/NaturalIntelligence/fast-xml-parser/v4.4.0/lib/fxparser.min.js > dist/lib/fxparser.min.js',
  );

  const context = await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    outfile: `${outDir}/app.js`,
  });

  //await context.watch()

  //const { host, port } = await context.serve({ servedir: 'dist' })

  //console.log(host, port)
};

void build();
