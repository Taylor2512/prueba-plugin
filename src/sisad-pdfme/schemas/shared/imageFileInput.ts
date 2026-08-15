import { readFile } from '@sisad-pdfme/schemas/utils';

export type ImageFileInputOptions = {
  onValue: (value: string) => void;
  onBlur?: () => void;
  onError?: (error: unknown) => void;
  tabIndex?: number;
};

/** Creates the shared JPEG/PNG file input used by image-like schemas. */
export const createImageFileInput = ({
  onValue,
  onBlur,
  onError = (error) => console.error('Error reading file:', error),
  tabIndex = 0,
}: ImageFileInputOptions): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg, image/png';
  input.tabIndex = tabIndex;
  input.addEventListener('change', () => {
    readFile(input.files)
      .then((result) => onValue(String(result)))
      .catch(onError);
  });
  if (onBlur) input.addEventListener('blur', onBlur);
  return input;
};

export const applyCenteredImageFileInputStyle = (input: HTMLInputElement): void => {
  Object.assign(input.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '180px',
    height: '30px',
    marginLeft: '-90px',
    marginTop: '-15px',
  });
};
