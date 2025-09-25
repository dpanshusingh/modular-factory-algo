import { prisma } from '../config/db';
import { Timelog, CreateTimelogRequest, TimelogFilters } from '../types/@server';

export const createTimelog = async (timelogData: CreateTimelogRequest): Promise<Timelog> => {
  const { employeeId, startTime, endTime, description } = timelogData;
  
  try {
    const timelog = await prisma.timelog.create({
      data: {
        employeeId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        description,
      },
      include: {
        employee: true,
      },
    });
    return timelog;
  } catch (error) {
    throw error;
  }
};

export const getTimelogs = async (filters: TimelogFilters = {}): Promise<Timelog[]> => {
  try {
    const whereClause: any = {};
    
    if (filters.start) {
      whereClause.startTime = {
        gte: new Date(filters.start),
      };
    }
    
    if (filters.end) {
      whereClause.endTime = {
        lte: new Date(filters.end),
      };
    }
    
    if (filters.employee_id) {
      whereClause.employeeId = parseInt(filters.employee_id);
    }
    
    const timelogs = await prisma.timelog.findMany({
      where: whereClause,
      include: {
        employee: true,
      },
      orderBy: [
        { startTime: 'desc' },
      ],
    });
    
    return timelogs;
  } catch (error) {
    throw error;
  }
};

export const getTimelogById = async (id: number): Promise<Timelog | null> => {
  try {
    const timelog = await prisma.timelog.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
    return timelog;
  } catch (error) {
    throw error;
  }
};

export const getTimelogsForExport = async (filters: TimelogFilters = {}): Promise<Timelog[]> => {
  // Same as getTimelogs but optimized for export
  return getTimelogs(filters);
};

export const updateTimelog = async (id: number, timelogData: Partial<CreateTimelogRequest>): Promise<Timelog> => {
  try {
    const updateData: any = {};
    
    if (timelogData.startTime) {
      updateData.startTime = new Date(timelogData.startTime);
    }
    
    if (timelogData.endTime) {
      updateData.endTime = new Date(timelogData.endTime);
    }
    
    if (timelogData.description !== undefined) {
      updateData.description = timelogData.description;
    }
    
    const timelog = await prisma.timelog.update({
      where: { id },
      data: updateData,
      include: {
        employee: true,
      },
    });
    return timelog;
  } catch (error) {
    throw error;
  }
};

export const deleteTimelog = async (id: number): Promise<void> => {
  try {
    await prisma.timelog.delete({
      where: { id },
    });
  } catch (error) {
    throw error;
  }
};

export const getTimelogsByEmployee = async (employeeId: number): Promise<Timelog[]> => {
  try {
    const timelogs = await prisma.timelog.findMany({
      where: { employeeId },
      include: {
        employee: true,
      },
      orderBy: {
        startTime: 'desc',
      },
    });
    return timelogs;
  } catch (error) {
    throw error;
  }
};
