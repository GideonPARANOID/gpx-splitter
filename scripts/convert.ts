import fs from 'fs/promises';

const loadFile = async (filename = 'input.gpx') => (await fs.readFile(filename)).toString();

const writeFile = async (filename, content) => await fs.writeFile(filename, content);

const convert = async () => {
  const output = await split(await loadFile());

  for (let i = 0; i < output.length; i++) {
    await writeFile(`output-${i}.gpx`, output[i]);
  }
};

void convert();
