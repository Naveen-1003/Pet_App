const { z } = require('zod');

const initiateBookingSchema = z.object({
  user_id: z.number().positive(),
  offering_id: z.number().positive(),
  discount_code: z.string().max(20).optional()
});

const verifySubscriptionSchema = z.object({
  user_id: z.number().positive(),
  payment_link_id: z.string({ required_error: "payment_link_id is required" }).min(1)
});

module.exports = {
  initiateBookingSchema,
  verifySubscriptionSchema
};
