import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().max(50).required(),
    lastName: Joi.string().max(50).required(),
    role: Joi.string().valid('passenger', 'driver').default('passenger')
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
};
