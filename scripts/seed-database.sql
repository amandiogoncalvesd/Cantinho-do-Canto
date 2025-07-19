-- Inserir dados de exemplo

-- Usuários de exemplo
INSERT INTO users (id, name, email, password, role, phone, bio) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Administrador',
  'admin@cantinhodocanto.co.ao',
  '$2a$12$LQv3c1yqBwEHxE5W8s8I/OXgHaHxl0.LjMQoMyIVMBVvdEjW8u5BK', -- admin123
  'admin',
  '930557454',
  'Administrador do sistema Cantinho do Canto'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Esmael Nelson Macedo',
  'esmael@cantinhodocanto.co.ao',
  '$2a$12$LQv3c1yqBwEHxE5W8s8I/OXgHaHxl0.LjMQoMyIVMBVvdEjW8u5BK', -- professor123
  'teacher',
  '930557455',
  'Professor especialista em violão clássico e popular com mais de 10 anos de experiência no ensino musical.'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'João Silva',
  'joao@email.com',
  '$2a$12$LQv3c1yqBwEHxE5W8s8I/OXgHaHxl0.LjMQoMyIVMBVvdEjW8u5BK', -- aluno123
  'student',
  '923456789',
  'Aluno iniciante interessado em aprender violão popular'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Maria Santos',
  'maria@email.com',
  '$2a$12$LQv3c1yqBwEHxE5W8s8I/OXgHaHxl0.LjMQoMyIVMBVvdEjW8u5BK', -- aluno123
  'student',
  '924567890',
  'Aluna intermediária focada em violão clássico'
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Pedro Costa',
  'pedro@email.com',
  '$2a$12$LQv3c1yqBwEHxE5W8s8I/OXgHaHxl0.LjMQoMyIVMBVvdEjW8u5BK', -- aluno123
  'student',
  '925678901',
  'Aluno avançado interessado em composição'
);

-- Cursos de exemplo
INSERT INTO courses (id, title, description, level, duration, price, teacher_id) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  'Violão para Iniciantes',
  'Curso completo de violão para quem está começando. Aprenda desde os primeiros acordes até tocar suas primeiras músicas.',
  'Iniciante',
  '3 meses',
  6000.00,
  '550e8400-e29b-41d4-a716-446655440002'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  'Violão Intermediário',
  'Desenvolva sua técnica com acordes mais complexos, pestanas e ritmos variados.',
  'Intermediário',
  '4 meses',
  6000.00,
  '550e8400-e29b-41d4-a716-446655440002'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  'Violão Clássico Avançado',
  'Técnicas avançadas de violão clássico, interpretação e repertório erudito.',
  'Avançado',
  '6 meses',
  6000.00,
  '550e8400-e29b-41d4-a716-446655440002'
);

-- Aulas de exemplo
INSERT INTO lessons (id, title, description, content, course_id, duration, order_index, is_free) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  'Introdução ao Violão',
  'Primeira aula: conhecendo o instrumento e postura correta',
  '{"blocks": [{"type": "text", "content": "Bem-vindos ao mundo do violão! Nesta primeira aula, vamos conhecer as partes do instrumento e aprender a postura correta para tocar."}, {"type": "video", "url": "/videos/intro-violao.mp4"}, {"type": "quiz", "questions": [{"question": "Quantas cordas tem um violão?", "options": ["4", "5", "6", "7"], "correct": 2}]}]}',
  '660e8400-e29b-41d4-a716-446655440001',
  1800,
  1,
  true
),
(
  '770e8400-e29b-41d4-a716-446655440002',
  'Primeiros Acordes',
  'Aprendendo os acordes básicos: Dó, Ré, Mi',
  '{"blocks": [{"type": "text", "content": "Hoje vamos aprender nossos primeiros acordes. Começaremos com Dó Maior, Ré Maior e Mi Maior."}, {"type": "chord", "name": "C", "frets": [0, 3, 2, 0, 1, 0]}, {"type": "chord", "name": "D", "frets": [0, 0, 0, 2, 3, 2]}, {"type": "chord", "name": "E", "frets": [0, 2, 2, 1, 0, 0]}]}',
  '660e8400-e29b-41d4-a716-446655440001',
  2400,
  2,
  false
),
(
  '770e8400-e29b-41d4-a716-446655440003',
  'Ritmo Básico',
  'Aprendendo o primeiro ritmo para acompanhar músicas',
  '{"blocks": [{"type": "text", "content": "Agora que já sabemos alguns acordes, vamos aprender nosso primeiro ritmo de acompanhamento."}, {"type": "video", "url": "/videos/ritmo-basico.mp4"}]}',
  '660e8400-e29b-41d4-a716-446655440001',
  2100,
  3,
  false
);

-- Inscrições de exemplo
INSERT INTO enrollments (user_id, course_id, status) VALUES
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'active'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'active'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003', 'active');

-- Progresso de exemplo
INSERT INTO progress (user_id, lesson_id, course_id, progress_percentage, completed, time_spent) VALUES
('550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 100, true, 1800),
('550e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 75, false, 1200),
('550e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 100, true, 1650);

-- Mensagens de exemplo
INSERT INTO chat_messages (sender_id, recipient_id, course_id, message) VALUES
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Professor, tenho dúvidas sobre o acorde de Fá. Poderia me ajudar?'),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Claro! O acorde de Fá é um dos mais desafiadores para iniciantes. Vamos praticar juntos na próxima aula.'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Obrigada pela aula de hoje! Já estou conseguindo fazer a pestana.');

-- Quizzes de exemplo
INSERT INTO quizzes (lesson_id, title, questions) VALUES
(
  '770e8400-e29b-41d4-a716-446655440001',
  'Quiz: Conhecendo o Violão',
  '[
    {
      "question": "Quantas cordas tem um violão tradicional?",
      "type": "multiple",
      "options": ["4", "5", "6", "7"],
      "correct": 2,
      "explanation": "O violão tradicional possui 6 cordas, afinadas em Mi, Lá, Ré, Sol, Si, Mi (da mais grave para a mais aguda)."
    },
    {
      "question": "Qual é a postura correta para tocar violão sentado?",
      "type": "multiple",
      "options": [
        "Violão apoiado na perna direita",
        "Violão apoiado na perna esquerda",
        "Violão no colo",
        "Tanto faz a perna"
      ],
      "correct": 1,
      "explanation": "A postura clássica recomenda apoiar o violão na perna esquerda, elevada por um apoio para os pés."
    }
  ]'
);

-- Tentativas de quiz de exemplo
INSERT INTO quiz_attempts (user_id, quiz_id, answers, score, max_score) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM quizzes WHERE lesson_id = '770e8400-e29b-41d4-a716-446655440001'),
  '[{"question": 0, "answer": 2}, {"question": 1, "answer": 1}]',
  2,
  2
);
