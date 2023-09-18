import { defineField, defineType } from "sanity";

const skill = defineType({
  name: "skills",
  title: "Skills",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "color",
      title: "Color",
      type: "string",
    }),
    defineField({
      name: "percentage",
      title: "Percentage",
      type: "number",
    }),
  ],
});

export default skill;