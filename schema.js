const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHtml': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHtml', { value })
                return clean;
            }
        }
    }
});


const Joi = BaseJoi.extend(extension)




module.exports.campgroundSchema =
    // joi schema validations are done before mongoose is involved or data is saved.
    // schema definition

    Joi.object({
        campground: Joi.object({
            title: Joi.string().required().escapeHTML(),
            price: Joi.number().required().min(0),
            // images: Joi.string().required(),
            location: Joi.string().required().escapeHTML(),
            description: Joi.string().required().escapeHTML()
        }).required(),
        deleteImages: Joi.array()
    })

module.exports.reviewSchema =
    Joi.object({
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            body: Joi.string().required().escapeHTML()
        }).required()
    })