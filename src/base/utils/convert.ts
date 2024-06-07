export function isJson(obj) {
  try {
    if (typeof obj === 'object' && !Array.isArray(obj)) {
      return true;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const json = JSON.parse(obj);
    return typeof json === 'object';
  } catch (e) {
    return false;
  }
}

export function enumToObj(
  enumVariable: Record<string, any>,
): Record<string, any> {
  const enumValues = Object.values(enumVariable);
  const hLen = enumValues.length / 2;
  const object = {};
  for (let i = 0; i < hLen; i++) {
    object[enumValues[i]] = enumValues[hLen + i];
  }
  return object;
}
