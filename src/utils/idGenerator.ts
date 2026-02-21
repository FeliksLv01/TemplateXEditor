import { v4 as uuidv4 } from 'uuid';

export function generateId(type: string): string {
  return `${type}_${uuidv4()}`;
}

export function generateIdWithoutType(): string {
  return uuidv4();
}
