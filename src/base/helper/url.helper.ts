import * as path from 'path';
import { config } from '@/config';

export function uploadUrl(filename: string): string {
  return `${config.IP}:${config.PORT}/api/v${config.API_VERSION}/uploads/${filename}`;
}
