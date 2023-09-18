import { defineField, defineType } from "sanity";

const service = defineType({
  name: "services",
  title: "Services",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
  ],
});

export default service;