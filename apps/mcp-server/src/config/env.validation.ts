import { IsString, IsOptional, IsNumber, IsUrl, validateSync } from 'class-validator';
import { plainToClass, Type } from 'class-transformer';

export class EnvironmentVariables {
  @IsUrl({ require_tld: false })
  @IsString()
  AUTH_SERVER_URL: string;

  @IsUrl({ require_tld: false })
  @IsString()
  DRIVE_SERVER_URL: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  MCP_SERVER_PORT?: number = 3002;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  
  return validatedConfig;
}