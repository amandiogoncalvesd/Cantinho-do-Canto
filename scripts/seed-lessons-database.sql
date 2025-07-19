-- Inserir dados de exemplo para aulas criadas

-- Usuário exemplo (assumindo que já existe)
INSERT INTO users (id, name, email, password, role) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Professor João',
  'joao@cantinhomusical.com',
  '$2b$10$example_hash',
  'teacher'
) ON CONFLICT (email) DO NOTHING;

-- Aulas de exemplo
INSERT INTO created_lessons (
  id, title, description, level, category, duration,
  scheduled_date, scheduled_time, tags, students,
  status, learning_objectives, evaluation_criteria,
  created_by
) VALUES 
(
  '660e8400-e29b-41d4-a716-446655440001',
  'Acordes Básicos do Violão',
  'Aprenda os acordes fundamentais para tocar suas primeiras músicas no violão. Esta aula aborda os acordes maiores e menores mais utilizados.',
  'Iniciante',
  'Técnica',
  60,
  '2024-01-15',
  '19:00',
  ARRAY['acordes', 'básico', 'iniciante', 'violão'],
  ARRAY['João Silva', 'Maria Santos'],
  'published',
  'Ao final desta aula, o aluno será capaz de: 1) Formar os acordes C, G, Am, F, D, Em; 2) Fazer transições suaves entre acordes; 3) Tocar uma progressão simples',
  'Avaliação prática: execução correta dos acordes e transições. Avaliação teórica: identificação dos acordes no braço do violão.',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'Ritmos Brasileiros no Violão',
  'Explore os ritmos tradicionais brasileiros adaptados para o violão. Samba, bossa nova e MPB.',
  'Intermediário',
  'Ritmo',
  90,
  '2024-01-20',
  '20:00',
  ARRAY['ritmo', 'brasileiro', 'samba', 'bossa nova'],
  ARRAY['Pedro Costa', 'Ana Oliveira'],
  'published',
  'Dominar os padrões rítmicos do samba e bossa nova. Aplicar técnicas de dedilhado características.',
  'Execução de pelo menos 2 ritmos diferentes com precisão e musicalidade.',
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  'Teoria Musical Aplicada',
  'Fundamentos da teoria musical com aplicação prática no violão.',
  'Intermediário',
  'Teoria',
  75,
  NULL,
  NULL,
  ARRAY['teoria', 'escalas', 'harmonia'],
  ARRAY[],
  'draft',
  'Compreender escalas maiores e menores. Aplicar conceitos harmônicos básicos.',
  'Teste teórico e aplicação prática no instrumento.',
  '550e8400-e29b-41d4-a716-446655440000'
);

-- Blocos de conteúdo para a primeira aula
INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content, title) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  'text',
  0,
  '{"content": "# Bem-vindos à Aula de Acordes Básicos!\n\nNesta aula vamos aprender os **acordes fundamentais** do violão. Estes acordes são a base para tocar centenas de músicas populares.\n\n## O que vamos aprender:\n- Acorde de **C** (Dó Maior)\n- Acorde de **G** (Sol Maior)\n- Acorde de **Am** (Lá menor)\n- Acorde de **F** (Fá Maior)\n- Acorde de **D** (Ré Maior)\n- Acorde de **Em** (Mi menor)\n\n> 💡 **Dica importante:** Pratique cada acorde lentamente antes de tentar fazer as transições!"}',
  'Introdução aos Acordes Básicos'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'video',
  1,
  '{"url": "https://example.com/video-acordes-basicos.mp4", "title": "Demonstração dos Acordes Básicos", "duration": 480}',
  'Vídeo Demonstrativo'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'chord',
  2,
  '{"name": "C", "frets": [0, 1, 0, 2, 1, 0], "fingers": [0, 1, 0, 3, 2, 0], "difficulty": "Fácil"}',
  'Acorde de C (Dó Maior)'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'chord',
  3,
  '{"name": "G", "frets": [3, 2, 0, 0, 3, 3], "fingers": [3, 2, 0, 0, 4, 4], "difficulty": "Fácil"}',
  'Acorde de G (Sol Maior)'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'quiz',
  4,
  '{"questions": [{"id": "1", "type": "multiple", "question": "Qual dedo deve ser usado na 1ª casa da corda B no acorde de C?", "options": ["Indicador", "Médio", "Anelar", "Mínimo"], "correctAnswer": "Indicador", "explanation": "No acorde de C, o dedo indicador (1) vai na 1ª casa da corda B.", "points": 1}, {"id": "2", "type": "truefalse", "question": "O acorde de G utiliza todas as 6 cordas do violão.", "correctAnswer": "Verdadeiro", "explanation": "Sim, o acorde de G utiliza todas as 6 cordas, sendo uma das características que o torna um acorde com som cheio.", "points": 1}]}',
  'Quiz - Acordes C e G'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  'text',
  5,
  '{"content": "## Exercício Prático\n\nAgora vamos praticar a **transição entre acordes**:\n\n### Sequência 1: C - G - C - G\n1. Toque o acorde de C por 4 tempos\n2. Mude para G por 4 tempos\n3. Repita a sequência 10 vezes\n\n### Dicas para transições suaves:\n- **Mantenha o polegar** sempre atrás do braço\n- **Não tire todos os dedos** ao mesmo tempo\n- **Pratique devagar** primeiro\n- **Use um metrônomo** quando estiver confortável\n\n🎵 **Música sugerida:** \"Wonderwall\" - Oasis (usa C e G)"}',
  'Exercícios de Transição'
);

-- Blocos para a segunda aula
INSERT INTO lesson_blocks (lesson_id, block_type, order_index, content, title) VALUES
(
  '660e8400-e29b-41d4-a716-446655440002',
  'text',
  0,
  '{"content": "# Ritmos Brasileiros no Violão 🇧🇷\n\nO Brasil é berço de ritmos únicos que conquistaram o mundo. Hoje vamos aprender a tocar **samba** e **bossa nova** no violão.\n\n## Características dos Ritmos Brasileiros:\n- **Síncope** - deslocamento do acento rítmico\n- **Swing** brasileiro - diferente do jazz americano\n- **Levada** - o \"groove\" característico\n\n> 🎼 A música brasileira tem uma riqueza rítmica incomparável!"}',
  'Introdução aos Ritmos Brasileiros'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'video',
  1,
  '{"url": "https://example.com/video-ritmos-brasileiros.mp4", "title": "Demonstração de Ritmos", "duration": 600}',
  'Demonstração Prática'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'text',
  2,
  '{"content": "## Padrão Rítmico do Samba\n\n```\nTempo: 2/4\nBPM: 100-120\n\nPadrão básico:\n1 e 2 e\n↓   ↑ ↓\n```\n\n### Técnica:\n- **Polegar** nas cordas graves (E, A, D)\n- **Indicador** nas cordas agudas (G, B, e)\n- **Movimento** de punho relaxado\n- **Acentuar** o segundo tempo"}',
  'Técnica do Samba'
);

-- Templates de aula
INSERT INTO lesson_templates (
  name, description, category, level, template_data, blocks_template, is_public, created_by
) VALUES
(
  'Template Básico - Acordes',
  'Template padrão para aulas de acordes básicos',
  'Técnica',
  'Iniciante',
  '{"title": "Aula de Acordes - [Nome do Acorde]", "description": "Aprenda o acorde [Nome] com técnica correta", "duration": 45, "tags": ["acordes", "técnica"]}',
  '[{"type": "text", "content": {"content": "# Introdução ao Acorde [Nome]\n\n## Posicionamento dos dedos\n## Dicas importantes"}, "order": 0}, {"type": "chord", "content": {"name": "", "frets": [], "fingers": []}, "order": 1}, {"type": "quiz", "content": {"questions": []}, "order": 2}]',
  true,
  '550e8400-e29b-41d4-a716-446655440000'
),
(
  'Template Avançado - Técnica',
  'Template para aulas de técnicas avançadas',
  'Técnica',
  'Avançado',
  '{"title": "Técnica Avançada - [Nome da Técnica]", "description": "Domine a técnica [Nome] com exercícios progressivos", "duration": 60, "tags": ["técnica", "avançado"]}',
  '[{"type": "text", "content": {"content": "# Técnica [Nome]\n\n## Fundamentos\n## Aplicações práticas"}, "order": 0}, {"type": "video", "content": {"url": "", "title": "Demonstração da técnica"}, "order": 1}, {"type": "text", "content": {"content": "## Exercícios Progressivos\n\n### Nível 1\n### Nível 2\n### Nível 3"}, "order": 2}]',
  true,
  '550e8400-e29b-41d4-a716-446655440000'
);

-- Criar versões iniciais das aulas
SELECT create_lesson_version('660e8400-e29b-41d4-a716-446655440001', 'Versão inicial da aula', '550e8400-e29b-41d4-a716-446655440000');
SELECT create_lesson_version('660e8400-e29b-41d4-a716-446655440002', 'Versão inicial da aula', '550e8400-e29b-41d4-a716-446655440000');

-- Feedback de exemplo
INSERT INTO lesson_feedback (lesson_id, user_id, rating, comment, feedback_type) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  5,
  'Excelente aula! Explicação muito clara dos acordes básicos. Os vídeos ajudaram muito na compreensão.',
  'content'
),
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440000',
  4,
  'Boa aula, mas poderia ter mais exercícios práticos.',
  'general'
);
