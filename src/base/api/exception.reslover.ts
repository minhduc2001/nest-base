import {
  BadRequestException,
  ForbiddenException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

/**
 * Generates a localized error message and throws a NotFoundException.
 * @param index - The index or key used for looking up the localized error message.
 * @param i18n - The internationalization context providing translation capabilities.
 * @return A Promise that never resolves; instead, it throws a NotFoundException.
 */
export const NotFound = async (
  index: string,
  i18n: I18nContext,
): Promise<never> => {
  const message: string = await i18n.t(`${index}.not_found`, {
    lang: i18n.lang,
  });

  throw new NotFoundException(message);
};

/**
 * Generates a localized error message with optional arguments and throws a NotAcceptableException.
 * @param key - The key or identifier used for looking up the localized error message.
 * @param i18n - The internationalization context providing translation capabilities.
 * @param args - Optional arguments to be used in the localized error message.
 * @return A Promise that never resolves; instead, it throws a NotAcceptableException.
 */
export const NotAcceptable = async (
  key: string,
  i18n: I18nContext,
  args?: Record<string, string | number>,
): Promise<never> => {
  const message: string = await i18n.t(key, { lang: i18n.lang, args });

  throw new NotAcceptableException(message);
};

/**
 * Generates a localized error message with optional arguments and throws a BadRequestException.
 * @param key - The key or identifier used for looking up the localized error message.
 * @param i18n - The internationalization context providing translation capabilities.
 * @param args - Optional arguments to be used in the localized error message.
 * @return A Promise that never resolves; instead, it throws a BadRequestException.
 */
export const BadRequest = async (
  key: string,
  i18n: I18nContext,
  args?: Record<string, string | number>,
): Promise<never> => {
  const message: string = await i18n.t(key, { lang: i18n.lang, args });

  throw new BadRequestException(message);
};

/**
 * Generates a localized error message and throws a ForbiddenException.
 * @param key - The key or identifier used for looking up the localized error message.
 * @param i18n - The internationalization context providing translation capabilities.
 * @return A Promise that never resolves; instead, it throws a ForbiddenException.
 */
export const Forbidden = async (
  key: string,
  i18n: I18nContext,
): Promise<never> => {
  const message: string = await i18n.t(key, { lang: i18n.lang });

  throw new ForbiddenException(message);
};
