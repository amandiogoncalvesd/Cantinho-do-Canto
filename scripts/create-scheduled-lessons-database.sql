-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal de aulas agendadas
CREATE TABLE IF NOT EXISTS scheduled_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL,
    lesson_content_id UUID, -- Referência para a aula criada
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_students INTEGER DEFAULT 1,
    current_students INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    meeting_link VARCHAR(500),
    meeting_password VARCHAR(100),
    requirements TEXT,
    materials TEXT,
    homework TEXT,
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- daily, weekly, monthly
    recurrence_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices para performance
    CONSTRAINT scheduled_lessons_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de inscrições dos alunos nas aulas
CREATE TABLE IF NOT EXISTS lesson_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES scheduled_lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'enrolled', -- enrolled, attended, missed, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, refunded
    payment_amount DECIMAL(10,2),
    notes TEXT,
    
    UNIQUE(lesson_id, student_id),
    CONSTRAINT lesson_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de presença nas aulas
CREATE TABLE IF NOT EXISTS lesson_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES scheduled_lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE,
    left_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    attendance_status VARCHAR(50) DEFAULT 'absent', -- present, absent, late, left_early
    participation_score INTEGER CHECK (participation_score >= 0 AND participation_score <= 10),
    teacher_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(lesson_id, student_id),
    CONSTRAINT lesson_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de notificações automáticas
CREATE TABLE IF NOT EXISTS lesson_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES scheduled_lessons(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL,
    notification_type VARCHAR(50) NOT NULL, -- reminder_24h, reminder_30min, lesson_started, lesson_cancelled
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT lesson_notifications_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de disponibilidade dos professores
CREATE TABLE IF NOT EXISTS teacher_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    max_lessons_per_slot INTEGER DEFAULT 1,
    break_duration_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT teacher_availability_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de bloqueios de horários (feriados, férias, etc.)
CREATE TABLE IF NOT EXISTS schedule_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    block_type VARCHAR(50) DEFAULT 'unavailable', -- unavailable, holiday, vacation, maintenance
    affects_all_teachers BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT schedule_blocks_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de feedback das aulas
CREATE TABLE IF NOT EXISTS lesson_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES scheduled_lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    teacher_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    student_comment TEXT,
    teacher_comment TEXT,
    lesson_quality_rating INTEGER CHECK (lesson_quality_rating >= 1 AND lesson_quality_rating <= 5),
    technical_quality_rating INTEGER CHECK (technical_quality_rating >= 1 AND technical_quality_rating <= 5),
    would_recommend BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(lesson_id, student_id),
    CONSTRAINT lesson_feedback_student_id_fkey FOREIGN KEY (student_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT lesson_feedback_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_scheduled_lessons_teacher_date ON scheduled_lessons(teacher_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_lessons_date_time ON scheduled_lessons(scheduled_date, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_scheduled_lessons_status ON scheduled_lessons(status);
CREATE INDEX IF NOT EXISTS idx_lesson_enrollments_student ON lesson_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_enrollments_lesson ON lesson_enrollments(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_attendance_lesson_student ON lesson_attendance(lesson_id, student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notifications_recipient ON lesson_notifications(recipient_id, status);
CREATE INDEX IF NOT EXISTS idx_teacher_availability_teacher_day ON teacher_availability(teacher_id, day_of_week);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_scheduled_lessons_updated_at 
    BEFORE UPDATE ON scheduled_lessons 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teacher_availability_updated_at 
    BEFORE UPDATE ON teacher_availability 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar conflitos de horário
CREATE OR REPLACE FUNCTION check_schedule_conflict(
    p_teacher_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_exclude_lesson_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO conflict_count
    FROM scheduled_lessons
    WHERE teacher_id = p_teacher_id
    AND scheduled_date = p_date
    AND status NOT IN ('cancelled', 'completed')
    AND (p_exclude_lesson_id IS NULL OR id != p_exclude_lesson_id)
    AND (
        (scheduled_time <= p_start_time AND (scheduled_time + INTERVAL '1 minute' * duration_minutes) > p_start_time)
        OR
        (scheduled_time < p_end_time AND (scheduled_time + INTERVAL '1 minute' * duration_minutes) >= p_end_time)
        OR
        (scheduled_time >= p_start_time AND scheduled_time < p_end_time)
    );
    
    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar disponibilidade do professor
CREATE OR REPLACE FUNCTION check_teacher_availability(
    p_teacher_id UUID,
    p_date DATE,
    p_time TIME
)
RETURNS BOOLEAN AS $$
DECLARE
    day_of_week INTEGER;
    is_available BOOLEAN := FALSE;
    is_blocked BOOLEAN := FALSE;
BEGIN
    -- Obter o dia da semana (0 = Domingo)
    day_of_week := EXTRACT(DOW FROM p_date);
    
    -- Verificar se o professor está disponível neste dia/horário
    SELECT EXISTS(
        SELECT 1 FROM teacher_availability
        WHERE teacher_id = p_teacher_id
        AND day_of_week = EXTRACT(DOW FROM p_date)
        AND start_time <= p_time
        AND end_time > p_time
        AND is_available = TRUE
    ) INTO is_available;
    
    -- Verificar se há bloqueios para este período
    SELECT EXISTS(
        SELECT 1 FROM schedule_blocks
        WHERE (teacher_id = p_teacher_id OR affects_all_teachers = TRUE)
        AND start_date <= p_date
        AND end_date >= p_date
        AND (
            (start_time IS NULL AND end_time IS NULL)
            OR
            (start_time <= p_time AND end_time > p_time)
        )
    ) INTO is_blocked;
    
    RETURN is_available AND NOT is_blocked;
END;
$$ LANGUAGE plpgsql;

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION create_lesson_notifications(lesson_id UUID)
RETURNS VOID AS $$
DECLARE
    lesson_record RECORD;
    student_record RECORD;
    reminder_24h_time TIMESTAMP;
    reminder_30min_time TIMESTAMP;
BEGIN
    -- Buscar informações da aula
    SELECT * INTO lesson_record
    FROM scheduled_lessons
    WHERE id = lesson_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Calcular horários dos lembretes
    reminder_24h_time := (lesson_record.scheduled_date + lesson_record.scheduled_time) - INTERVAL '24 hours';
    reminder_30min_time := (lesson_record.scheduled_date + lesson_record.scheduled_time) - INTERVAL '30 minutes';
    
    -- Criar notificações para cada aluno inscrito
    FOR student_record IN 
        SELECT student_id FROM lesson_enrollments 
        WHERE lesson_id = lesson_record.id AND status = 'enrolled'
    LOOP
        -- Lembrete 24 horas antes
        INSERT INTO lesson_notifications (lesson_id, recipient_id, notification_type, title, message)
        VALUES (
            lesson_id,
            student_record.student_id,
            'reminder_24h',
            'Lembrete: Aula amanhã',
            'Você tem uma aula agendada para amanhã: ' || lesson_record.title || ' às ' || lesson_record.scheduled_time
        );
        
        -- Lembrete 30 minutos antes
        INSERT INTO lesson_notifications (lesson_id, recipient_id, notification_type, title, message)
        VALUES (
            lesson_id,
            student_record.student_id,
            'reminder_30min',
            'Aula começando em 30 minutos',
            'Sua aula ' || lesson_record.title || ' começará em 30 minutos. Prepare-se!'
        );
    END LOOP;
    
    -- Notificação para o professor
    INSERT INTO lesson_notifications (lesson_id, recipient_id, notification_type, title, message)
    VALUES (
        lesson_id,
        lesson_record.teacher_id,
        'reminder_30min',
        'Aula começando em 30 minutos',
        'Sua aula ' || lesson_record.title || ' começará em 30 minutos.'
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar notificações quando uma aula é agendada
CREATE OR REPLACE FUNCTION trigger_create_notifications()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_lesson_notifications(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_notifications_on_lesson_creation
    AFTER INSERT ON scheduled_lessons
    FOR EACH ROW
    EXECUTE FUNCTION trigger_create_notifications();

-- Função para atualizar contador de alunos
CREATE OR REPLACE FUNCTION update_lesson_student_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE scheduled_lessons 
        SET current_students = current_students + 1
        WHERE id = NEW.lesson_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE scheduled_lessons 
        SET current_students = current_students - 1
        WHERE id = OLD.lesson_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_student_count_on_enrollment
    AFTER INSERT OR DELETE ON lesson_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_lesson_student_count();

-- Políticas de segurança (RLS)
ALTER TABLE scheduled_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas para scheduled_lessons
CREATE POLICY "Teachers can manage their own lessons" ON scheduled_lessons
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view lessons they're enrolled in" ON scheduled_lessons
    FOR SELECT USING (
        id IN (
            SELECT lesson_id FROM lesson_enrollments 
            WHERE student_id = auth.uid()
        )
    );

-- Políticas para lesson_enrollments
CREATE POLICY "Students can manage their own enrollments" ON lesson_enrollments
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view enrollments for their lessons" ON lesson_enrollments
    FOR SELECT USING (
        lesson_id IN (
            SELECT id FROM scheduled_lessons 
            WHERE teacher_id = auth.uid()
        )
    );

-- Políticas para lesson_attendance
CREATE POLICY "Teachers can manage attendance for their lessons" ON lesson_attendance
    FOR ALL USING (
        lesson_id IN (
            SELECT id FROM scheduled_lessons 
            WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view their own attendance" ON lesson_attendance
    FOR SELECT USING (auth.uid() = student_id);

-- Políticas para lesson_notifications
CREATE POLICY "Users can manage their own notifications" ON lesson_notifications
    FOR ALL USING (auth.uid() = recipient_id);

-- Políticas para teacher_availability
CREATE POLICY "Teachers can manage their own availability" ON teacher_availability
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Everyone can view teacher availability" ON teacher_availability
    FOR SELECT USING (true);

-- Políticas para schedule_blocks
CREATE POLICY "Teachers can manage their own blocks" ON schedule_blocks
    FOR ALL USING (auth.uid() = teacher_id OR teacher_id IS NULL);

CREATE POLICY "Everyone can view schedule blocks" ON schedule_blocks
    FOR SELECT USING (true);

-- Políticas para lesson_feedback
CREATE POLICY "Students can manage their own feedback" ON lesson_feedback
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view feedback for their lessons" ON lesson_feedback
    FOR SELECT USING (auth.uid() = teacher_id);
