import {Module} from '@nestjs/common';
import { OrganizationsController } from './organization.controller';
import { OrganizationsService } from './organizations.service';
@Module({
    controllers: [OrganizationsController],
    providers: [OrganizationsService],
    exports: [OrganizationsService],
})
export class OrganizationsModule {}