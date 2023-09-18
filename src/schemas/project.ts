import { defineField, defineType } from "sanity";

const project = defineType({
  name: "projects",
  title: "Projects",
  type: "document",
  fields: [
    defineField({
      name: "pos",
      title: "Position",
      type: "number",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
    }),
    defineField({
      name: "tech",
      title: "tech",
      type: "array",
      of: [
        {
          type: "reference",
          to: [
            {
              type: "skills",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
    }),
    defineField({
      name: "github",
      title: "Github link",
      type: "url",
    }),
  ],
});

export default project;
