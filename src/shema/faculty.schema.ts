import { TypeOf, object, string } from "zod";

/**
 * @openapi
 * components:
 * schemas:
 * CreateFacultyInput:
 * type:object
 * required:
 * - name
 * properties:
 * name:
 * type: string
 *
 */

const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Faculty id is required",
    }),
  }),
};

export const createFacultySchema = object({
  ...payload,
});
export const updateFacultySchema = object({
  ...payload,
  ...params,
});

export const deleteFacultySchema = object({
  ...params,
});

export const getFacultySchema = object({
  ...params,
});

export type CreateFacultyInput = TypeOf<typeof createFacultySchema>;
export type UpdateFacultyInput = TypeOf<typeof updateFacultySchema>;

export type DeleteFacultyInput = TypeOf<typeof deleteFacultySchema>;

export type ReadFacultyInput = TypeOf<typeof getFacultySchema>;
