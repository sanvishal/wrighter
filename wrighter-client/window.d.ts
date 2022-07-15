export {};
declare global {
  interface Window {
    cm?: CodeMirror.Editor | null;
  }
}
