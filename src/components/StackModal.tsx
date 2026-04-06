import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface TechEntry {
  description: string
}

const techDetails: Record<string, TechEntry> = {
  // WEB
  TypeScript: { description: "Superset tipado de JavaScript. Tipado estricto en todos los proyectos." },
  React: { description: "Librería UI para construir interfaces interactivas basadas en componentes." },
  Astro: { description: "Framework MPA para sitios rápidos con arquitectura de islands." },
  "Tailwind CSS": { description: "Framework de utilidades CSS para diseño rápido y consistente." },
  "shadcn/ui": { description: "Componentes UI accesibles y personalizables basados en Radix." },
  Bun: { description: "Runtime JavaScript ultrarrápido. Reemplazo de Node.js para desarrollo y producción." },
  // BACKEND
  PHP: { description: "Lenguaje backend para aplicaciones web y paneles de administración." },
  Laravel: { description: "Framework PHP robusto y escalable para aplicaciones web complejas." },
  MariaDB: { description: "Base de datos relacional de alto rendimiento. Fork comunitario de MySQL." },
  // INFRA
  Docker: { description: "Contenedores para servicios 24/7 — gameservers, bases de datos aisladas, aplicaciones." },
  Nginx: { description: "Servidor web y reverse proxy de alto rendimiento." },
  Linux: { description: "Sistema operativo para servidores. Administración completa de infraestructura." },
  Shell: { description: "Automatización y gestión de sistemas desde terminal. Todo se hace desde la CLI." },
  Pterodactyl: { description: "Panel de gestión de servidores de juegos. 6+ años de experiencia, administrando ~1000 usuarios y ~300 servidores simultáneos." },
}

const stack: Record<string, string[]> = {
  web: ["TypeScript", "React", "Astro", "Tailwind CSS", "shadcn/ui", "Bun"],
  backend: ["PHP", "Laravel", "MariaDB"],
  infra: ["Docker", "Nginx", "Linux", "Shell", "Pterodactyl"],
}

const categoryLabels: Record<string, string> = {
  web: "Web",
  backend: "Backend",
  infra: "Infrastructure",
}

export function StackModal() {
  const [selectedTech, setSelectedTech] = useState<string | null>(null)

  const categories = Object.keys(stack)

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">bairon@dev: ~/stack</span>
          <div className="flex items-center gap-3 text-muted-foreground/50">
            <span className="text-xs leading-none">&#x2500;</span>
            <span className="text-xs leading-none">&#x25A1;</span>
            <span className="text-xs leading-none">&#x2715;</span>
          </div>
        </div>

        {/* Terminal body */}
        <div className="flex flex-col gap-3 bg-background p-4 font-mono text-sm">
          <span className="text-muted-foreground">$ ls stack/</span>

          {categories.map((category, index) => (
            <div key={category} className="flex flex-col gap-1.5">
              <span className="text-muted-foreground">
                {index === categories.length - 1 ? "└──" : "├──"} {categoryLabels[category] ?? category}/
              </span>
              <div className="flex flex-wrap gap-1.5 pl-8">
                {stack[category].map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => setSelectedTech(tech)}
                    className="cursor-pointer rounded-md border border-border bg-card px-2 py-0.5 text-xs text-foreground/80 transition hover:border-foreground/30 hover:text-foreground active:scale-95"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={selectedTech !== null} onOpenChange={(open) => { if (!open) setSelectedTech(null) }}>
        <DialogContent className="border-border bg-card font-mono">
          <DialogHeader>
            <DialogTitle className="font-mono text-xs font-normal text-muted-foreground">
              bairon@dev: ~/stack/{selectedTech}
            </DialogTitle>
            {selectedTech && techDetails[selectedTech] && (
              <DialogDescription className="text-sm text-foreground/80 leading-relaxed">
                {techDetails[selectedTech].description}
              </DialogDescription>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
