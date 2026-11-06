export interface IElectronAPI {
  minimize: () => void;
  close: () => void;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}
