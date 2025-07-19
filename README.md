# Cantinho-do-Canto
## estrutura do projeto
(amandio㉿Jesus)-[/mnt/c/Users/Alfre/Downloads/Amândio/AMANDIO/Projects/cantinhomusicalonlinemain]
└─$ tree
.
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── login
│   │   │   │   └── route.ts
│   │   │   ├── logout
│   │   │   │   └── route.ts
│   │   │   ├── me
│   │   │   │   └── route.ts
│   │   │   └── register
│   │   │       └── route.ts
│   │   ├── chat
│   │   │   └── route.ts
│   │   ├── courses
│   │   │   ├── [id]
│   │   │   │   ├── enroll
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── created-lessons
│   │   │   ├── [id]
│   │   │   │   ├── blocks
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   ├── route.ts
│   │   │   └── templates
│   │   │       └── route.ts
│   │   ├── lessons
│   │   │   ├── [id]
│   │   │   │   └── route.ts
│   │   │   └── route.ts
│   │   ├── progress
│   │   │   └── route.ts
│   │   └── scheduled-lessons
│   │       ├── [id]
│   │       │   ├── join
│   │       │   │   └── route.ts
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── cantinho-musical-online-main
│   └── public
│       └── favicon.ico
├── components
│   ├── aulas
│   │   ├── CalendarioAulas.tsx
│   │   ├── GraficoProgresso.tsx
│   │   ├── ReprodutorVideo.tsx
│   │   └── SistemaQuiz.tsx
│   ├── Footer.tsx
│   ├── lesson-creator
│   │   ├── ChordCreator.tsx
│   │   ├── LessonPreview.tsx
│   │   ├── QuizCreator.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── VideoUploader.tsx
│   ├── LoginModal.tsx
│   ├── Navbar.tsx
│   ├── pages
│   │   └── Index.tsx
│   ├── RegistrationModal.tsx
│   ├── TestimonialsSection.tsx
│   ├── theme-provider.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toaster.tsx
│       ├── toast.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── components.json
├── eslint.config.js
├── hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── index.html
├── lib
│   ├── auth.ts
│   ├── supabase
│   │   ├── client.ts
│   │   └── server.ts
│   └── utils.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── postcss.config.mjs
├── public
│   ├── placeholder.jpg
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder.svg
│   ├── placeholder-user.jpg
│   └── robots.txt
├── scripts
│   ├── create-database.sql
│   ├── create-lessons-database.sql
│   ├── create-scheduled-lessons-database.sql
│   ├── seed-database.sql
│   ├── seed-lessons-database.sql
│   └── seed-scheduled-lessons.sql
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── components
│   │   ├── aulas
│   │   │   ├── CalendarioAulas.tsx
│   │   │   ├── GraficoProgresso.tsx
│   │   │   ├── ReprodutorVideo.tsx
│   │   │   └── SistemaQuiz.tsx
│   │   ├── Footer.tsx
│   │   ├── lesson-creator
│   │   │   ├── ChordCreator.tsx
│   │   │   ├── LessonPreview.tsx
│   │   │   ├── QuizCreator.tsx
│   │   │   ├── RichTextEditor.tsx
│   │   │   └── VideoUploader.tsx
│   │   ├── LoginModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RegistrationModal.tsx
│   │   ├── ScheduledLessonCard.tsx
│   │   ├── TestimonialsSection.tsx
│   │   ├── ui
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── aspect-ratio.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── carousel.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── context-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── hover-card.tsx
│   │   │   ├── input-otp.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── menubar.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── resizable.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   └── UserProfile.tsx
│   ├── hooks
│   │   ├── use-admin-demo.ts
│   │   ├── use-created-lessons.ts
│   │   ├── use-mobile.tsx
│   │   ├── use-scheduled-lessons.ts
│   │   └── use-toast.ts
│   ├── index.css
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── AdminDashboard.tsx
│   │   ├── Aulas.tsx
│   │   ├── CalendarioAulas.tsx
│   │   ├── Chat.tsx
│   │   ├── Contato.tsx
│   │   ├── CriarAula.tsx
│   │   ├── Cursos.tsx
│   │   ├── Index.tsx
│   │   ├── MinhasAulas.tsx
│   │   ├── NotFound.tsx
│   │   ├── PaisDashboard.tsx
│   │   ├── Sobre.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── TeacherDashboard.tsx
│   └── vite-env.d.ts
├── styles
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

43 directories, 211 files
