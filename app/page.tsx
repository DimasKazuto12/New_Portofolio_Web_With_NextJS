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
import Timeline from '@/components/Timeline';
import Band from '@/components/Band';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function Home() {
  const [settings, certificates, projects, paths, skillRows, timelineRows] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
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
    prisma.timelineEntry.findMany({
      orderBy: [{ startYear: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <>
      <Starfield />
      <Appshell>
        <Hero
          settings={settings}
          chips={[...skillRows].sort((a, b) => b.level - a.level).slice(0, 4).map((s) => s.name)}
        />
        <Band tone="astral"><About settings={settings} paths={paths} /></Band>
        {skillRows.length > 0 && (
          <Band tone="gold"><Skills groups={groupSkills(skillRows)} /></Band>
        )}
        <Band tone="astral"><Achivements items={certificates} /></Band>
        <Band tone="gold"><Projects projects={projects} /></Band>
        <Timeline items={timelineRows} />
        <Band tone="astral"><ContactForm settings={settings} /></Band>
      </Appshell>
      <Footer settings={settings} />
    </>
  );
}

