import { defineArrayMember, defineField, defineType } from "sanity";

const user = defineType({
  name: "users",
  title: "Users",
  type: "document",
  fields: [
    defineField({
      name: "uid",
      title: "Uid",
      type: "string",
      validation: (Rule) => [Rule.required()],
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => [Rule.required().email()],
    }),
    defineField({
      name: "plan",
      title: "Plan",
      type: "array",
      validation: (Rule) => [Rule.required()],
      of: [
        defineArrayMember({
          type: "document",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "paymentId",
              title: "PaymentId",
              type: "string",
            }),
          ],
          validation: (Rule) => [Rule.required()],
        }),
      ],
    }),
    defineField({
      name: "password",
      title: "Password",
      type: "string",
      validation: (Rule) => [Rule.required()],
    }),
  ],
});

export default user;
