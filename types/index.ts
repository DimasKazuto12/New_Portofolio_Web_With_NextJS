import { Certificate as PrismaCertificate, Skill, SiteSettings as PrismaSettings, Project as PrismaProject } from '@/app/generated/prisma/client';

export type CertificateWithSkills = PrismaCertificate & { skills: Skill[] };
export type SiteSettings = PrismaSettings;
export type Project = PrismaProject;