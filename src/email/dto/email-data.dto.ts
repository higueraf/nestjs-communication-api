import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class EmailDataDto {
  @IsNotEmpty()
  @IsString()
  BLOB_STORAGE_PROJECTS: string;

  @IsNotEmpty()
  @IsString()
  TITLE_MESSAGE: string;

  @IsNotEmpty()
  @IsString()
  COMPANY_NAME: string;

  @IsNotEmpty()
  @IsString()
  MAIN_MESSAGE: string;

  @IsOptional()
  @IsString()
  SECONDARY_MESSAGE: string;

  @IsOptional()
  @IsString()
  HIDE_LINK: string;

  @IsOptional()
  @IsString()
  IMAGE_URL: string;

  @IsNotEmpty()
  @IsUrl()
  LINK_URL: string;

  @IsNotEmpty()
  @IsString()
  LINK_TEXT: string;

  @IsNotEmpty()
  @IsUrl()
  LOGO: string;

  @IsOptional()
  @IsString()
  TARGET?: string;

  @IsString()
  RECIPIENTS?: string;

  @IsString()
  YEAR?: string;
}
