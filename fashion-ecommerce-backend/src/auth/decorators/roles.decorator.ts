import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// Specific role decorators for better UX
export const AdminOnly = () => Roles('admin', 'super_admin');
export const BrandOnly = () => Roles('brand');
export const AdminOrBrand = () => Roles('admin', 'super_admin', 'brand');
export const CustomerOnly = () => Roles('customer');
