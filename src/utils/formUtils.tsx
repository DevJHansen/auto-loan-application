/**
 * @description Adds a new line character to the text area.
 * @param {React.FormEvent<HTMLTextAreaElement>} e - The event object
 * @returns {string} The new value of the text area
 */
export const insertNewLineInTextArea = (
  e: React.FormEvent<HTMLTextAreaElement>
): string => {
  const start = e.currentTarget.selectionStart;
  const end = e.currentTarget.selectionEnd;
  const target = e.target as HTMLTextAreaElement;
  const { value } = target;

  target.value =
    value.substring(0, start) + '\n' + value.substring(end, value.length);

  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;

  return target.value;
};
