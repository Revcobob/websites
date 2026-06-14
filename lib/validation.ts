import { z } from 'zod';

// Public form payloads
export const SubscribeSchema = z.object({
  email: z.string().email().max(254),
  source: z.string().min(1).max(100).default('unknown'),
  source_label: z.string().max(200).optional(),
  consent_text: z.string().max(500).optional(),
  honeypot: z.string().optional(),
  captchaToken: z.string().optional()
});
export type SubscribePayload = z.infer<typeof SubscribeSchema>;

export const ContactSchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional().nullable(),
  topic: z.string().max(80).optional().nullable(),
  message: z.string().min(1).max(5000),
  consent: z.coerce.boolean().refine(v => v === true, 'Consent required'),
  source_page: z.string().max(120).optional(),
  honeypot: z.string().optional(),
  captchaToken: z.string().optional()
});
export type ContactPayload = z.infer<typeof ContactSchema>;

export const DonationInquirySchema = z.object({
  first_name: z.string().min(1).max(80),
  last_name: z.string().min(1).max(80),
  email: z.string().email().max(254),
  phone: z.string().max(40).optional().nullable(),
  amount_cents: z.number().int().min(0).max(100_000_000).optional().nullable(),
  frequency: z.string().max(40).optional().nullable(),
  tribute_type: z.string().max(40).optional().nullable(),
  tribute_name: z.string().max(160).optional().nullable(),
  anonymous: z.coerce.boolean().optional(),
  message: z.string().max(2000).optional().nullable(),
  source_page: z.string().max(120).optional(),
  honeypot: z.string().optional(),
  captchaToken: z.string().optional()
});
export type DonationInquiryPayload = z.infer<typeof DonationInquirySchema>;

// Admin payloads — each resource keeps its own schema close to its page.
// Reusable helpers:
export const orderUpdateSchema = z.object({
  id: z.string().uuid(),
  direction: z.enum(['up', 'down'])
});
