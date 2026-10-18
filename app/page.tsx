import Starfield from '@/components/Starfield';
import Appshell from '@/components/AppShell';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Achivements from '@/components/Achivements';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import Skills from "@/components/Skills";
import { groupSkills } from "@/lib/skills";
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function Home() {
  const [settings, certificates, projects, paths, skillRows] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: {id: 1} }),
    prisma.certificate.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { skills: true },
    }),
    prisma.project.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.pathSkill.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
    prisma.techSkill.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    }),
  ]);

  return (
    <>
      <Starfield />
      <Appshell>
        <Hero settings={settings} />
        <About settings={settings} paths={paths}/>
        <Skills groups={groupSkills(skillRows)} />
        <Achivements items={certificates} />
        <Projects projects={projects} />
        <ContactForm settings={settings} />
      </Appshell>
      <Footer settings={settings} />
    </>
  );
}

