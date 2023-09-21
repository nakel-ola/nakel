import { defineArrayMember, defineField, defineType } from "sanity";

const about = defineType({
  name: "about",
  title: "About",
  type: "document",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "tel",
      title: "tel",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "github",
      title: "Github",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram",
      type: "url",
    }),
    defineField({
      name: "resume",
      title: "Resume",
      type: "file",
    }),
    defineField({
      name: "educations",
      title: "Educations",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "institute",
              title: "Institute",
              type: "string",
            }),
            defineField({
              name: "degree",
              title: "Degree",
              type: "string",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "startDate",
              title: "StartDate",
              type: "string",
            }),
            defineField({
              name: "endDate",
              title: "EndDate",
              type: "string",
            }),
            defineField({
              name: "credentialUrl",
              title: "Credential URL",
              type: "string",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "works",
      title: "Works",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "company",
              title: "Company",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
            }),
            defineField({
              name: "startDate",
              title: "StartDate",
              type: "string",
            }),
            defineField({
              name: "endDate",
              title: "EndDate",
              type: "string",
            }),
            defineField({
              name: "bullets",
              title: "Bullets",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
      ],
    }),
  ],
});

export default about;
