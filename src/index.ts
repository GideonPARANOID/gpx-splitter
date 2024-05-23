import { split } from './convert';
import { SplitMethod } from './types';

const gpx = {
  mimeType: 'application/gpx+xml',
  suffix: '.gpx',
};

addEventListener('submit', async (event): Promise<void> => {
  event.preventDefault();
  const formData = new FormData(event.target as HTMLFormElement);

  console.log('event', event, formData);

  const input = {
    file: formData.get('gpx') as File,
    parts: parseInt(formData.get('parts') as string, 10),
    method: formData.get('method') as SplitMethod,
  };

  console.log(input);

  const chunks = await split(await input.file.text(), input.parts, input.method);

  setOutputList(input.file.name.replace(gpx.suffix, ''), chunks);
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
