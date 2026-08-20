import Starfield from '@/components/Starfield';
import Appshell from '@/components/AppShell';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Achivements from '@/components/Achivements';
import Projects from '@/components/Projects';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function Home() {
  const [settings, certificates, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.certificate.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { skills: true },
    }),
    prisma.project.findMany({
      orderBy: [{sortOrder: "asc"}, {createdAt: "desc"}],
    }),
  ]);

  return (
    <>
      <Starfield />
      <Appshell>
        <Hero settings={settings} />
        <About settings={settings} />
        <Achivements items={certificates} />
        <Projects projects={projects} />
        <ContactForm settings={settings} />
      </Appshell>
      <Footer settings={settings} />
    </>
  );
}

