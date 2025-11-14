"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRegister = (req, res, next) => {
    const schema = joi_1.default.object({
        phone: joi_1.default.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
        password: joi_1.default.string().min(6).required(),
        firstName: joi_1.default.string().max(50).required(),
        lastName: joi_1.default.string().max(50).required(),
        role: joi_1.default.string().valid('passenger', 'driver').default('passenger')
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validation.js.map