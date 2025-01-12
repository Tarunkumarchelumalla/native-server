import Joi from "joi";
import { BatchSchema, ConfigSchema, ContactSchema, MailSchema, TemplateSchema } from "../schemas";

const contactForm = {
  body: Joi.object<Partial<ContactSchema>>().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().trim(),
    id: Joi.string().trim()
  }),
};

const templateForm = {
  body: Joi.object<Partial<TemplateSchema>>().keys({
    template: Joi.string().required().trim(),
    templateName: Joi.string().required().trim(),
    type:Joi.string().required().trim(),
  }),
};

const mailForm = {
  body: Joi.object<Partial<MailSchema>>().keys({
    to: Joi.array().required(),
    text: Joi.string(),
    templateID: Joi.string(),
    subject: Joi.string().required().trim(),
  })
}

const configForm = {
  body: Joi.object<Partial<ConfigSchema>>().keys({
    emailConfig: Joi.object({
      smtp: Joi.object({
        host: Joi.string().required(),
        port: Joi.number().required(),
        auth: Joi.object({
          user: Joi.string().required(),
          pass: Joi.string().required(),
        }).required(),
      }).required(),
      from: Joi.string().required(),
    }).required(),
    name: Joi.string().required().trim(),
    isActive: Joi.boolean().required(),
  })
}
const batchForm = {
  body: Joi.object<Partial<BatchSchema>>().keys({
    name: Joi.string().required().trim(),
    contacts: Joi.array().required(),
    templateID: Joi.string().required(),
    scheduleTime: Joi.date().required(),
    subject: Joi.string().required().trim(),
  })
}


export{
  contactForm,
  templateForm,
  mailForm,
  configForm,
  batchForm
}