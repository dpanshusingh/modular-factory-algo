import { dataConnect } from "../config/dataConnectClient";

type Int = number & { __int__: void };

function toInt(n: number): Int {
  if (!Number.isInteger(n)) {
    throw new Error("Value is not an integer");
  }
  return n as Int;
}

export interface TimeStudy {
  id: string;
  moduleId: string;
  taskTemplateId: string;
  notes: string;
  date: Date;
  clockTime: Int;
  workerCount: Int;
}

export interface TimeStudyInput {
  id: string;
  moduleId?: string;
  taskTemplateId: string;
  notes: string;
  clockTime: Int;
  date: Date;
  workerCount: Int;
}

export interface TimeStudyUpdateInput {
  id: string;
  moduleId: string;
  taskTemplateId: string;
  notes: string;
  clockTime: Int;
  date: Date;
  workerCount: Int;
}

interface timeStudyModuleAttributeInput {
  timeStudyId: string;
  moduleAttributeId: string;
  value: string;
}

// Create
export const createTimeStudy = async (
  input: TimeStudyInput & { id: string }
) => {
  const query = `
    mutation CreateTimeStudy($id: String!, $moduleId: String, $taskTemplateId: String!, $notes: String!, $clockTime: Float!, $date: Timestamp!, $workerCount: Int!) {
      timeStudy_insert(data: { id: $id, moduleId: $moduleId, taskTemplateId: $taskTemplateId, notes: $notes, clockTime: $clockTime, date: $date, workerCount: $workerCount })
    }
  `;
  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const updateTimeStudy = async (
  id: string,
  input: Partial<TimeStudyUpdateInput>
) => {
  // Validate required fields for TS & runtime
  if (
    !input.taskTemplateId ||
    !input.notes ||
    !input.clockTime ||
    !input.date ||
    !input.workerCount
  ) {
    throw new Error("Missing required fields in TimeStudyUpdateInput");
  }

  const fullInput: TimeStudyUpdateInput = {
    id,
    moduleId: input.moduleId ?? "", // or keep optional if backend accepts null
    taskTemplateId: input.taskTemplateId,
    notes: input.notes,
    clockTime: input.clockTime,
    date: input.date,
    workerCount: input.workerCount,
  };

  const query = `
    mutation UpdateTimeStudy(u
      $id: String!
      $moduleId: String
      $taskTemplateId: String!
      $notes: String!
      $clockTime: Int!
      $date: Date!
      $workerCount: Int!
    ) {
      timeStudy_update(
        id: $id
        data: {
          moduleId: $moduleId
          taskTemplateId: $taskTemplateId
          notes: $notes
          clockTime: $clockTime
          date: $date
          workerCount: $workerCount
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql<
    { timeStudy_update: TimeStudyUpdateInput },
    TimeStudyUpdateInput
  >(query, {
    variables: fullInput,
  });

  return response.data;
};

export const getAllTaskTemplateNames = async () => {
  const query = `
    query GetAllTaskTemplateNames {
      taskTemplates {
        id
        name
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { taskTemplates: { id: string; name: string }[] },
    {}
  >(query);

  return response.data?.taskTemplates ?? [];
};

export const getTaskTemplateModuleAttributesByTaskTemplateId = async (
  taskTemplateId: string
) => {
  const query = `
    query GetTaskTemplateModuleAttributesByTaskTemplateId(
      $taskTemplateId: String!
    ) {
      taskTemplateModuleAttributes(
        where: { taskTemplateId: { eq: $taskTemplateId } }
      ) {
        id
        moduleAttribute {
          id
          name
          moduleAttributeType
        }
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { taskTemplateModuleAttributes: any[] },
    { taskTemplateId: string }
  >(query, {
    variables: {
      taskTemplateId: taskTemplateId, // avoid shorthand confusion
    },
  });

  return (
    response.data?.taskTemplateModuleAttributes.map((item) => ({
      moduleAttributeId: item.moduleAttribute.id,
      name: item.moduleAttribute.name,
      moduleAttributeType: item.moduleAttribute.moduleAttributeType,
    })) ?? []
  );
};

export const createTimeStudyModuleAttribute = async (
  input: timeStudyModuleAttributeInput & { id: string },
  // taskTemplateId: string
) => {
  const query = `
    mutation CreateTimeStudyModuleAttribute(
      $id: String!,
      $timeStudyId: String!,
      $moduleAttributeId: String!,
      $value: String!
    ) {
      timeStudyModuleAttribute_insert(
        data: { 
          id: $id, 
          timeStudyId: $timeStudyId,
          moduleAttributeId: $moduleAttributeId,
          value: $value
        }
      )
    }
  `;

  const response = await dataConnect.executeGraphql(query, {
    variables: input,
  });

  return response.data;
};

export const getAllTimeStudys = async () => {
  const query = `
    query GetAllTimeStudys {
      timeStudies {
        id
        moduleId
        taskTemplateId
        notes
        clockTime
        workerCount
        date
      } 
    }
  `;

  const response = await dataConnect.executeGraphql<
    { timeStudies: TimeStudy[] },
    {}
  >(query);

  const raw = response.data?.timeStudies ?? [];

  return raw.map((item) => ({
    id: item.id,
    moduleId: item.moduleId,
    taskTemplateId: item.taskTemplateId,
    notes: item.notes,
    date: item.date,
    totalLaborHours: item.clockTime * item.workerCount,
  }));
};

// Read one
export const getTimeStudyById = async (id: string) => {
  const query = `
    query GetTimeStudyById($id: String!) {
      timeStudy(id: $id) {
        id
        moduleId
        taskTemplateId
        clockTime
        notes
        date
        workerCount
      }
    }
  `;

  const response = await dataConnect.executeGraphql<
    { timeStudy: TimeStudyInput | null },
    { id: string }
  >(query, {
    variables: { id },
  });

  return response.data?.timeStudy ?? null;
};

// Delete
export const deleteTimeStudy = async (id: string) => {
  const query = `
    mutation DeleteTimeStudy($id: String!) {
      timeStudy_delete(id: $id)
    }
  `;

  await dataConnect.executeGraphql(query, {
    variables: { id },
  });
  return true;
};
