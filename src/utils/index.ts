import { toRaw } from 'vue';

const camelToSnake = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map(camelToSnake);
  }

  if (value !== null && typeof value === 'object') {
    const newObj: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(value)) {
      const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      newObj[newKey] = camelToSnake(val);
    }
    return newObj;
  }

  return value;
};

const normalize = (value: any): any => {
  const raw = toRaw(value);

  // object with numeric keys → array
  if (
    raw
    && typeof raw === 'object'
    && !Array.isArray(raw)
    && Object.keys(raw).every((k) => !Number.isNaN(Number(k)))
  ) {
    return Object.values(raw).map(normalize);
  }

  // real array
  if (Array.isArray(raw)) {
    return raw.map(normalize);
  }

  // plain object
  if (raw && typeof raw === 'object') {
    const obj: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of Object.entries(raw)) {
      obj[k] = normalize(v);
    }
    return obj;
  }

  return raw;
};

const snakeToCamel = (value: any): any => {
  const normalized = normalize(value);

  if (Array.isArray(normalized)) {
    return normalized.map(snakeToCamel);
  }

  if (normalized && typeof normalized === 'object') {
    const obj: any = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, val] of Object.entries(normalized)) {
      const newKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      obj[newKey] = snakeToCamel(val);
    }
    return obj;
  }

  return normalized;
};

export {
  camelToSnake,
  snakeToCamel,
};
