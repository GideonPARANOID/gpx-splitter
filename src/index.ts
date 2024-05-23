import { split } from './convert';

const gpx = {
  mimeType: 'application/gpx+xml',
  suffix: '.gpx',
};

addEventListener('submit', async (event): Promise<void> => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);

  console.log('event', event, formData);

  const inputFile = formData.get('gpx') as File;
  const inputParts = parseInt(formData.get('parts') as string, 10);

  console.log(inputFile, inputParts);

  const chunks = await split(await inputFile.text(), inputParts);

  setOutputList(inputFile.name.replace(gpx.suffix, ''), chunks);
});

const setOutputList = (inputFileName: string, chunks: string[]): void => {
  const outputList = document.getElementById('output');
  outputList.innerHTML = '';

  chunks.forEach((content, index) => {
    const file = new File([content], `${inputFileName}-${index}${gpx.suffix}`, {
      type: gpx.mimeType,
    });

    outputList.appendChild(createListLink(file));
  });
};

const createListLink = (file: File): HTMLElement => {
  const link = document.createElement('a');
  link.innerText = file.name;
  link.href = URL.createObjectURL(file);
  link.download = file.name;

  const listItem = document.createElement('li');
  listItem.appendChild(link);
  return listItem;
};
