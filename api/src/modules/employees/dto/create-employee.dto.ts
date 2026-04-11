import { IsString, IsOptional, IsDateString, MaxLength, IsNotEmpty, Matches, Length } from 'class-validator';
export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    last_name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    first_name: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    middle_name?: string;

    @IsOptional()
    @IsDateString()
    birth_date?: string;

    @IsOptional()
    @IsString()
    @Length(4, 4)
    @Matches(/^[0-9]{4}$/)
    passport_series?: string;

    @IsOptional()
    @IsString()
    @Length(6, 6)
    @Matches(/^[0-9]{6}$/)
    passport_number?: string;

    @IsOptional()
    @IsDateString()
    passport_issue_date?: string;

    @IsOptional()
    @IsString()
    @Length(6, 6)
    @Matches(/^[0-9]{6}$/)
    passport_department_code?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    passport_issued_by?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    registration_region?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    registration_locality?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    registration_street?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    registration_house?: string;

    @IsOptional()
    @IsString()
    @MaxLength(5)
    registration_building?: string;

    @IsOptional()
    @IsString()
    @MaxLength(10)
    registration_apartment?: string;
}