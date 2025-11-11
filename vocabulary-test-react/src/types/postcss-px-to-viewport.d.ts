// src/types/postcss-px-to-viewport.d.ts
declare module 'postcss-px-to-viewport' {
  interface Options {
    unitToConvert?: string;
    viewportWidth?: number;
    unitPrecision?: number;
    propList?: string[];
    viewportUnit?: string;
    fontViewportUnit?: string;
    selectorBlackList?: (string | RegExp)[];
    minPixelValue?: number;
    mediaQuery?: boolean;
    replace?: boolean;
    exclude?: (string | RegExp)[];
    include?: (string | RegExp)[];
    landscape?: boolean;
    landscapeUnit?: string;
    landscapeWidth?: number;
  }

  const plugin: (options: Options) => any;
  export default plugin;
}