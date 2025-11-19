import { prisma } from '../config/db';
import { CreateProjectRequest, Project } from '../types/@server';

export const createProject = async (projectData: CreateProjectRequest): Promise<Project> => {
  const { title } = projectData;
  
  try {
    const project = await prisma.project.create({
      data: {
        title,
      },
    });
    return project;
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      throw new Error('project already exists');
    }
    throw error;
  }
};

export const getAllProjects = async(): Promise<Project>=>{
  try {
    const project = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return project;
  } catch (error) {
    throw error;
  }
}

export const getProjectById = async(id: number): Promise<Project> =>{
  try {
    const project = await prisma.project.findUnique({
      where: {id}
    });
    return project
  } catch (error) {
    throw(error)
  }
}
