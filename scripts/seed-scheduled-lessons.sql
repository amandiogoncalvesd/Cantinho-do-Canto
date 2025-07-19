-- Inserir dados de exemplo para aulas agendadas

-- Primeiro, vamos inserir disponibilidade para os professores
INSERT INTO teacher_availability (teacher_id, day_of_week, start_time, end_time, is_available, max_lessons_per_slot) VALUES
-- Professor Carlos (Segunda a Sexta, 8h às 18h)
('550e8400-e29b-41d4-a716-446655440000', 1, '08:00', '18:00', true, 2), -- Segunda
('550e8400-e29b-41d4-a716-446655440000', 2, '08:00', '18:00', true, 2), -- Terça
('550e8400-e29b-41d4-a716-446655440000', 3, '08:00', '18:00', true, 2), -- Quarta
('550e8400-e29b-41d4-a716-446655440000', 4, '08:00', '18:00', true, 2), -- Quinta
('550e8400-e29b-41d4-a716-446655440000', 5, '08:00', '18:00', true, 2), -- Sexta
('550e8400-e29b-41d4-a716-446655440000', 6, '09:00', '15:00', true, 1); -- Sábado

-- Inserir algumas aulas agendadas
INSERT INTO scheduled_lessons (
    id,
    title,
    description,
    teacher_id,
    scheduled_date,
    scheduled_time,
    duration_minutes,
    max_students,
    current_students,
    status,
    meeting_link,
    requirements,
    materials,
    notes
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    'Acordes Básicos para Iniciantes',
    'Aprenda os acordes fundamentais do violão: Am, C, D, E, F, G. Aula prática com exercícios de transição.',
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE + INTERVAL '1 day',
    '14:00',
    60,
    4,
    2,
    'scheduled',
    'https://meet.google.com/abc-defg-hij',
    'Violão afinado, palheta, caderno para anotações',
    'Apostila de acordes básicos (será enviada por email)',
    'Aula focada em postura e técnica básica'
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Técnicas de Dedilhado',
    'Desenvolva a técnica de finger picking com exercícios progressivos e músicas populares.',
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE + INTERVAL '2 days',
    '16:00',
    90,
    3,
    1,
    'scheduled',
    'https://meet.google.com/xyz-uvwx-yz',
    'Nível intermediário, conhecimento básico de acordes',
    'Partituras de exercícios de dedilhado',
    'Trazer músicas que gostaria de aprender'
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    'Bossa Nova - Ritmo e Harmonia',
    'Explore o universo da Bossa Nova com ritmos característicos e harmonias sofisticadas.',
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00',
    75,
    2,
    1,
    'scheduled',
    'https://meet.google.com/bossa-nova-123',
    'Nível intermediário/avançado',
    'Songbook de Bossa Nova, metrônomo',
    'Foco em Tom Jobim e João Gilberto'
),
(
    '770e8400-e29b-41d4-a716-446655440004',
    'Aula de Hoje - Escalas Pentatônicas',
    'Domine as escalas pentatônicas e suas aplicações na improvisação.',
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE,
    '15:00',
    60,
    3,
    2,
    'scheduled',
    'https://meet.google.com/pentatonic-scales',
    'Conhecimento básico de teoria musical',
    'Diagrama de escalas, backing tracks',
    'Aula prática com improvisação'
),
(
    '770e8400-e29b-41d4-a716-446655440005',
    'Workshop: Violão Clássico',
    'Introdução ao repertório clássico com obras de Villa-Lobos e Tárrega.',
    '550e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE + INTERVAL '7 days',
    '09:00',
    120,
    6,
    3,
    'scheduled',
    'https://meet.google.com/classical-workshop',
    'Nível intermediário, leitura de partitura',
    'Partituras clássicas, estante de música',
    'Workshop especial de fim de semana'
);

-- Inserir inscrições de alunos
INSERT INTO lesson_enrollments (lesson_id, student_id, status, payment_status, payment_amount) VALUES
-- Aula 1: Acordes Básicos
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'enrolled', 'paid', 50.00),
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'enrolled', 'paid', 50.00),

-- Aula 2: Técnicas de Dedilhado
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'enrolled', 'paid', 75.00),

-- Aula 3: Bossa Nova
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'enrolled', 'paid', 65.00),

-- Aula 4: Aula de Hoje
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'enrolled', 'paid', 50.00),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 'enrolled', 'paid', 50.00),

-- Aula 5: Workshop
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'enrolled', 'paid', 100.00),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'enrolled', 'paid', 100.00),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'enrolled', 'paid', 100.00);

-- Inserir alguns bloqueios de horário (exemplo: feriado)
INSERT INTO schedule_blocks (title, description, start_date, end_date, block_type, affects_all_teachers) VALUES
('Feriado Nacional', 'Dia da Independência - Sem aulas', '2024-09-07', '2024-09-07', 'holiday', true),
('Manutenção do Sistema', 'Manutenção programada da plataforma', '2024-08-15', '2024-08-15', 'maintenance', true);

-- Inserir feedback de exemplo
INSERT INTO lesson_feedback (
    lesson_id, 
    student_id, 
    teacher_id, 
    rating, 
    student_comment, 
    lesson_quality_rating, 
    technical_quality_rating, 
    would_recommend
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440000',
    5,
    'Excelente aula! O professor explicou muito bem os acordes e foi muito paciente com minhas dificuldades.',
    5,
    4,
    true
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440000',
    4,
    'Boa aula de dedilhado, mas gostaria de mais exercícios práticos.',
    4,
    5,
    true
);

-- Criar algumas notificações de exemplo
INSERT INTO lesson_notifications (
    lesson_id,
    recipient_id,
    notification_type,
    title,
    message,
    status
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440001',
    'reminder_30min',
    'Sua aula começará em 30 minutos!',
    'A aula "Escalas Pentatônicas" começará às 15:00. Prepare seu violão e entre na sala virtual.',
    'pending'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'reminder_24h',
    'Lembrete: Aula amanhã',
    'Você tem uma aula agendada para amanhã: "Acordes Básicos para Iniciantes" às 14:00.',
    'pending'
);

-- Inserir dados de presença para aulas passadas (simulando histórico)
INSERT INTO lesson_attendance (
    lesson_id,
    student_id,
    joined_at,
    left_at,
    duration_minutes,
    attendance_status,
    participation_score,
    teacher_notes
) VALUES
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '1 hour',
    60,
    'present',
    9,
    'Excelente participação, demonstrou boa evolução na técnica'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    CURRENT_TIMESTAMP - INTERVAL '2 hours',
    CURRENT_TIMESTAMP - INTERVAL '1 hour 10 minutes',
    50,
    'left_early',
    7,
    'Boa participação, mas saiu um pouco antes do final'
);

-- Atualizar o status de algumas aulas para simular diferentes estados
UPDATE scheduled_lessons 
SET status = 'completed' 
WHERE scheduled_date < CURRENT_DATE;

UPDATE scheduled_lessons 
SET status = 'in_progress' 
WHERE scheduled_date = CURRENT_DATE 
AND scheduled_time <= CURRENT_TIME 
AND (scheduled_time + INTERVAL '1 minute' * duration_minutes) > CURRENT_TIME;
