export enum FileType {
  Unknown = 'default',
  JPEG = 'jpg',
  PNG = 'png',
  Image = 'image',
  HTML = 'html',
  JS = 'js',
  DTS = 'dts',
  TS = 'ts',
  JSON = 'json',
  VUE = 'vue',
  SASS = 'sass',
  CSS = 'css',
  SVG = 'svg',
  Document = 'doc',
  PDF = 'pdf',
  Text = 'txt',
  ZIP = 'zip',
  RAR = 'rar',
  MD = 'md',
  '7z' = '7z',
  Excel = 'xls',
  EXE = 'exe',
  MSI = 'msi',
  Certificate = 'cer',
  PFX = 'pfx',
}

export const fileTypes = new Map<string, { extensions: Array<string>; regexp: RegExp }>();

fileTypes.set(FileType.JPEG, { extensions: ['jpg', 'jpeg'], regexp: /jpe?g$/ });
fileTypes.set(FileType.PNG, { extensions: ['png'], regexp: /png$/ });
fileTypes.set(FileType.Image, { extensions: ['gif', 'bmp', 'tiff'], regexp: /(gif|bmp|tiff)$/ });
fileTypes.set(FileType.HTML, { extensions: ['htm', 'html'], regexp: /html?$/ });
fileTypes.set(FileType.JS, { extensions: ['js'], regexp: /js$/ });
fileTypes.set(FileType.DTS, { extensions: ['d.ts'], regexp: /d.ts$/ });
fileTypes.set(FileType.TS, { extensions: ['png'], regexp: /ts$/ });
fileTypes.set(FileType.JSON, { extensions: ['json'], regexp: /json$/ });
fileTypes.set(FileType.VUE, { extensions: ['vue'], regexp: /vue$/ });
fileTypes.set(FileType.SASS, { extensions: ['sass', 'scss'], regexp: /(sass|scss)$/ });
fileTypes.set(FileType.CSS, { extensions: ['css'], regexp: /css$/ });
fileTypes.set(FileType.SVG, { extensions: ['svg'], regexp: /svg$/ });
fileTypes.set(FileType.Document, { extensions: ['doc', 'docx', 'rtf'], regexp: /(docx?|rtf)$/ });
fileTypes.set(FileType.PDF, { extensions: ['pdf'], regexp: /pdf$/ });
fileTypes.set(FileType.Text, { extensions: ['txt'], regexp: /txt$/ });
fileTypes.set(FileType.ZIP, { extensions: ['zip'], regexp: /zip$/ });
fileTypes.set(FileType.RAR, { extensions: ['rar'], regexp: /rar$/ });
fileTypes.set(FileType.MD, { extensions: ['md'], regexp: /md$/ });
fileTypes.set(FileType['7z'], { extensions: ['7z'], regexp: /7z$/ });
fileTypes.set(FileType.Excel, { extensions: ['xls', 'xlsx'], regexp: /xlsx?$/ });
fileTypes.set(FileType.EXE, { extensions: ['exe'], regexp: /exe?$/ });
fileTypes.set(FileType.MSI, { extensions: ['msi'], regexp: /msi$/ });
fileTypes.set(FileType.Certificate, { extensions: ['cer', 'crt'], regexp: /(cer|crt)$/ });
fileTypes.set(FileType.PFX, { extensions: ['pfx'], regexp: /pfx$/ });
