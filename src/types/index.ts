export interface Interval {
    startTime: string; // ISO 8601
    endTime: string;   // ISO 8601
}

export interface Worker {
    workerId: string;
    name?: string;
    skills: string[]; // Ordered by competence
    availability?: Interval; // Optional: restrict availability within the planning window
    preferences?: Record<string, number>; // Optional: Override CSV preferences (Task Name -> Score)
}

export interface Task {
    taskId: string;
    name?: string;
    minWorkers?: number;
    maxWorkers?: number;
    requiredSkills?: string[]; // Ordered by importance
    estimatedTotalLaborHours?: number;
    estimatedRemainingLaborHours?: number;
    prerequisiteTaskIds?: string[]; // Inferred from requirements
    earliestStartDate?: string; // Optional constraint
    // Optional fields to support realistic time estimation
    // Module attribute values for the specific module this task will run on
    moduleAttributes?: Array<{ attributeId: string; value: number }>;
    // Attribute ids defined on the task template that are relevant to this task
    taskTemplateAttributeIds?: string[];
    // Time study data used as a baseline for scaling
    timeStudy?: {
        attributes: Array<{ attributeId: string; value: number }>;
        totalLaborHours: number;
    };
    // manual adjustment in hours to add/subtract from the estimate
    manualLaborHoursAdjustment?: number;
}

export interface WorkerTask {
    workerId: string | null; // null = unassigned task
    taskId: string | null;   // null = idle worker
    startDate: string; // ISO String
    endDate: string;   // ISO String
}

export interface MatchRequest {
    workerTasks: WorkerTask[];
    workers: Worker[];
    tasks: Task[];
}

export interface PlanRequest {
    workers: Worker[];
    tasks: Task[];
    interval: {
        startTime: string;
        endTime: string;
    };
    useHistorical: boolean;
}
