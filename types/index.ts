import { Certificate as PrismaCertificate, Skill, SiteSettings as PrismaSettings, Project as PrismaProject, PathSkill as PrismaPathSkill } from '@prisma/client';

export type { Skill };
export type TechSkill = {
    id: string;
    name: string;
    category: string;
    level: number; // 1-5
    sortOrder: number;
};
export type CertificateWithSkills = PrismaCertificate & { skills: Skill[] };
export type SiteSettings = PrismaSettings;
export type Project = PrismaProject;
export type PathSkill = PrismaPathSkill