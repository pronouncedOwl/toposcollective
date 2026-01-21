import { z } from 'zod';

const statusEnum = z.enum(['coming_soon', 'completed']);

const optionalString = z
  .preprocess((value) => (value === null ? '' : value), z.string().trim().max(500).optional())
  .transform((value) => (value === undefined || value === '' ? null : value));

const optionalLongString = z
  .preprocess((value) => (value === null ? '' : value), z.string().trim().max(5000).optional())
  .transform((value) => (value === undefined || value === '' ? null : value));

const numericField = z
  .union([z.string(), z.number(), z.null()])
  .transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const num = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(num) ? num : null;
  })
  .refine((value) => value === null || typeof value === 'number', 'Invalid numeric value')
  .transform((value) => (typeof value === 'number' ? Number(value.toFixed(2)) : null));

export const unitInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  unitCode: optionalString,
  price: numericField,
  soldPrice: numericField,
  bedrooms: numericField,
  bathrooms: numericField,
  squareFeet: z
    .union([z.string(), z.number(), z.null()])
    .transform((value) => {
      if (value === '' || value === null || value === undefined) {
        return null;
      }
      const num = typeof value === 'string' ? Number(value) : value;
      return Number.isFinite(num) ? Math.round(num) : null;
    }),
  timeOnMarketDays: z
    .union([z.string(), z.number(), z.null()])
    .transform((value) => {
      if (value === '' || value === null || value === undefined) {
        return null;
      }
      const num = typeof value === 'string' ? Number(value) : value;
      return Number.isFinite(num) ? Math.max(0, Math.trunc(num)) : null;
    }),
  description: optionalString,
  shortDescription: optionalString,
  longDescription: optionalLongString,
  floorplanUrl: optionalString,
  availabilityStatus: optionalString,
  sortOrder: z.number().int().optional(),
});

export const projectInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(140)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain lowercase letters, numbers, or dashes'),
  name: z.string().min(1).max(200),
  status: statusEnum.default('coming_soon'),
  isPublic: z.boolean().optional(),
  addressLine1: z.string().min(1).max(255),
  addressLine2: optionalString,
  city: optionalString,
  state: optionalString,
  postalCode: optionalString,
  country: optionalString,
  estimatedCompletion: optionalString,
  actualCompletion: optionalString,
  totalUnits: z.union([z.number().int(), z.string()]).optional().transform((value) => {
    if (value === '' || value === null || value === undefined) {
      return null;
    }
    const num = typeof value === 'string' ? Number(value) : value;
    return Number.isFinite(num) ? Math.max(0, Math.trunc(num)) : null;
  }),
  shortDescription: optionalString,
  longDescription: optionalLongString,
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  metadata: z.record(z.any()).optional(),
  units: z.array(unitInputSchema).optional(),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
export type UnitInput = z.infer<typeof unitInputSchema>;

const nullify = <T>(value: T | null | undefined) => (value === undefined ? null : value);

export const mapProjectInputToRow = (input: ProjectInput) => ({
  slug: input.slug,
  name: input.name,
  status: input.status,
  is_public: input.isPublic ?? false,
  address_line1: input.addressLine1,
  address_line2: nullify(input.addressLine2),
  city: nullify(input.city),
  state: nullify(input.state),
  postal_code: nullify(input.postalCode),
  country: nullify(input.country ?? 'USA'),
  estimated_completion: input.estimatedCompletion ? input.estimatedCompletion : null,
  actual_completion: input.actualCompletion ? input.actualCompletion : null,
  total_units: input.totalUnits ?? null,
  short_description: nullify(input.shortDescription),
  long_description: nullify(input.longDescription),
  featured: input.featured ?? false,
  sort_order: input.sortOrder ?? 0,
  metadata: input.metadata ?? {},
});

export const mapUnitInputToRow = (unit: UnitInput, projectId: string) => ({
  id: unit.id,
  project_id: projectId,
  name: unit.name,
  unit_code: unit.unitCode,
  price: unit.price,
  sold_price: unit.soldPrice,
  bedrooms: unit.bedrooms,
  bathrooms: unit.bathrooms,
  square_feet: unit.squareFeet,
  time_on_market_days: unit.timeOnMarketDays,
  description: unit.description,
  short_description: nullify(unit.shortDescription),
  long_description: nullify(unit.longDescription),
  floorplan_url: unit.floorplanUrl,
  availability_status: unit.availabilityStatus,
  sort_order: unit.sortOrder ?? 0,
  metadata: {},
});

