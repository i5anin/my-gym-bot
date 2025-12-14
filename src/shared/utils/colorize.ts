const RESET = '\x1b[0m';

/**
 * Цвет текста в терминале (ANSI)
 */
export const tColor = {
  /** чёрный */ k: '\x1b[30m',
  /** красный */ r: '\x1b[31m',
  /** зелёный */ g: '\x1b[32m',
  /** жёлтый */ y: '\x1b[33m',
  /** синий */ b: '\x1b[34m',
  /** пурпурный */ m: '\x1b[35m',
  /** бирюзовый */ c: '\x1b[36m',
  /** сиреневый */ p: '\x1b[95m',
} as const;

export type TColor = (typeof tColor)[keyof typeof tColor];

/**
 * Применяет цвет к тексту
 *
 * @param text текст
 * @param fg ANSI-код цвета текста (tColor.g и т.д.)
 * @returns строка с ANSI-окраской
 */
export function colorize(text: string, fg: TColor): string {
  return `${fg}${text}${RESET}`;
}

/**
 * Удобная версия через ключ
 *
 * @param text текст
 * @param colorKey ключ цвета (например 'g')
 * @returns строка с окраской
 */
