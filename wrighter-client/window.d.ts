import type { BytemdEditorContext } from "bytemd";
export {};
declare global {
  interface Window {
    cm?: BytemdEditorContext | null;
  }
}
