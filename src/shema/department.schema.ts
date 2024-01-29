import { TypeOf, object, string } from "zod";

const payload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    facultyId: string({
      required_error: "Department is required",
    }),
  }),
};

const updatePayload = {
  body: object({
    name: string({
      required_error: "Name is required",
    }),
  }),
};

const params = {
  params: object({
    id: string({
      required_error: "Department id is required",
    }),
  }),
};

export const createDepartmentSchema = object({
  ...payload,
});
export const updateDepartmentSchema = object({
  ...updatePayload,
  ...params,
});

export const deleteDepartmentSchema = object({
  ...params,
});

export const getDepartmentSchema = object({
  ...params,
});

export type CreateDepartmentInput = TypeOf<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = TypeOf<typeof updateDepartmentSchema>;

export type DeleteDepartmentInput = TypeOf<typeof deleteDepartmentSchema>;

export type ReadDepartmentInput = TypeOf<typeof getDepartmentSchema>;
