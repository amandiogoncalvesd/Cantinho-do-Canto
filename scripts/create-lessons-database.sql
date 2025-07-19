-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal de aulas criadas
CREATE TABLE created_lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(50) CHECK (level IN ('Iniciante', 'Intermediário', 'Avançado')),
  category VARCHAR(100),
  duration INTEGER, -- em minutos
  
  -- Agendamento
  scheduled_date DATE,
  scheduled_time TIME,
  
  -- Metadados
  tags TEXT[], -- Array de tags
  students TEXT[], -- Array de nomes dos alunos
  
  -- Status e versionamento
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version INTEGER DEFAULT 1,
  
  -- Configurações avançadas
  learning_objectives TEXT,
  evaluation_criteria TEXT,
  complementary_material TEXT,
  
  -- Auditoria
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Índices para busca
  search_vector tsvector
);

-- Tabela de blocos de conteúdo das aulas
CREATE TABLE lesson_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES created_lessons(id) ON DELETE CASCADE,
  
  -- Tipo e ordem do bloco
  block_type VARCHAR(20) NOT NULL CHECK (block_type IN ('text', 'video', 'quiz', 'chord', 'image', 'audio')),
  order_index INTEGER NOT NULL DEFAULT 0,
  
  -- Conteúdo do bloco (JSON flexível)
  content JSONB NOT NULL DEFAULT '{}',
  
  -- Metadados do bloco
  title VARCHAR(255),
  description TEXT,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint para ordem única por aula
  UNIQUE(lesson_id, order_index)
);

-- Tabela de versões das aulas (histórico)
CREATE TABLE lesson_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES created_lessons(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  
  -- Snapshot completo da aula
  lesson_data JSONB NOT NULL,
  blocks_data JSONB NOT NULL,
  
  -- Metadados da versão
  version_notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(lesson_id, version_number)
);

-- Tabela de templates de aulas
CREATE TABLE lesson_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  level VARCHAR(50),
  
  -- Template data
  template_data JSONB NOT NULL,
  blocks_template JSONB NOT NULL,
  
  -- Configurações
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  
  -- Auditoria
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de estatísticas das aulas
CREATE TABLE lesson_statistics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES created_lessons(id) ON DELETE CASCADE,
  
  -- Estatísticas de uso
  views_count INTEGER DEFAULT 0,
  students_enrolled INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  
  -- Estatísticas de conteúdo
  total_blocks INTEGER DEFAULT 0,
  text_blocks INTEGER DEFAULT 0,
  video_blocks INTEGER DEFAULT 0,
  quiz_blocks INTEGER DEFAULT 0,
  chord_blocks INTEGER DEFAULT 0,
  
  -- Tempo estimado
  estimated_duration INTEGER DEFAULT 0, -- em minutos
  
  -- Última atualização
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(lesson_id)
);

-- Tabela de comentários e feedback das aulas
CREATE TABLE lesson_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES created_lessons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Feedback
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  feedback_type VARCHAR(20) DEFAULT 'general' CHECK (feedback_type IN ('general', 'content', 'difficulty', 'technical')),
  
  -- Status
  is_public BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  
  -- Auditoria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_created_lessons_status ON created_lessons(status);
CREATE INDEX idx_created_lessons_level ON created_lessons(level);
CREATE INDEX idx_created_lessons_category ON created_lessons(category);
CREATE INDEX idx_created_lessons_created_by ON created_lessons(created_by);
CREATE INDEX idx_created_lessons_scheduled_date ON created_lessons(scheduled_date);
CREATE INDEX idx_created_lessons_tags ON created_lessons USING GIN(tags);
CREATE INDEX idx_created_lessons_search ON created_lessons USING GIN(search_vector);

CREATE INDEX idx_lesson_blocks_lesson_id ON lesson_blocks(lesson_id);
CREATE INDEX idx_lesson_blocks_type ON lesson_blocks(block_type);
CREATE INDEX idx_lesson_blocks_order ON lesson_blocks(lesson_id, order_index);

CREATE INDEX idx_lesson_versions_lesson_id ON lesson_versions(lesson_id);
CREATE INDEX idx_lesson_versions_number ON lesson_versions(lesson_id, version_number);

CREATE INDEX idx_lesson_templates_category ON lesson_templates(category);
CREATE INDEX idx_lesson_templates_level ON lesson_templates(level);
CREATE INDEX idx_lesson_templates_public ON lesson_templates(is_public);

CREATE INDEX idx_lesson_feedback_lesson_id ON lesson_feedback(lesson_id);
CREATE INDEX idx_lesson_feedback_rating ON lesson_feedback(rating);

-- Função para atualizar search_vector
CREATE OR REPLACE FUNCTION update_lesson_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('portuguese', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('portuguese', array_to_string(COALESCE(NEW.tags, '{}'), ' ')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar search_vector
CREATE TRIGGER update_lesson_search_trigger
  BEFORE INSERT OR UPDATE ON created_lessons
  FOR EACH ROW EXECUTE FUNCTION update_lesson_search_vector();

-- Função para atualizar estatísticas da aula
CREATE OR REPLACE FUNCTION update_lesson_statistics()
RETURNS TRIGGER AS $$
DECLARE
  lesson_uuid UUID;
  block_counts RECORD;
BEGIN
  -- Determinar lesson_id baseado na operação
  IF TG_OP = 'DELETE' THEN
    lesson_uuid := OLD.lesson_id;
  ELSE
    lesson_uuid := NEW.lesson_id;
  END IF;
  
  -- Contar blocos por tipo
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE block_type = 'text') as text_count,
    COUNT(*) FILTER (WHERE block_type = 'video') as video_count,
    COUNT(*) FILTER (WHERE block_type = 'quiz') as quiz_count,
    COUNT(*) FILTER (WHERE block_type = 'chord') as chord_count
  INTO block_counts
  FROM lesson_blocks 
  WHERE lesson_id = lesson_uuid;
  
  -- Atualizar ou inserir estatísticas
  INSERT INTO lesson_statistics (
    lesson_id, total_blocks, text_blocks, video_blocks, quiz_blocks, chord_blocks, updated_at
  ) VALUES (
    lesson_uuid, block_counts.total, block_counts.text_count, 
    block_counts.video_count, block_counts.quiz_count, block_counts.chord_count, NOW()
  )
  ON CONFLICT (lesson_id) DO UPDATE SET
    total_blocks = block_counts.total,
    text_blocks = block_counts.text_count,
    video_blocks = block_counts.video_count,
    quiz_blocks = block_counts.quiz_count,
    chord_blocks = block_counts.chord_count,
    updated_at = NOW();
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estatísticas
CREATE TRIGGER update_lesson_statistics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON lesson_blocks
  FOR EACH ROW EXECUTE FUNCTION update_lesson_statistics();

-- Função para criar nova versão da aula
CREATE OR REPLACE FUNCTION create_lesson_version(
  p_lesson_id UUID,
  p_version_notes TEXT DEFAULT NULL,
  p_created_by UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_version_number INTEGER;
  v_lesson_data JSONB;
  v_blocks_data JSONB;
  v_version_id UUID;
BEGIN
  -- Obter próximo número de versão
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO v_version_number
  FROM lesson_versions 
  WHERE lesson_id = p_lesson_id;
  
  -- Obter dados da aula
  SELECT to_jsonb(cl.*) INTO v_lesson_data
  FROM created_lessons cl
  WHERE cl.id = p_lesson_id;
  
  -- Obter dados dos blocos
  SELECT jsonb_agg(to_jsonb(lb.*) ORDER BY lb.order_index) INTO v_blocks_data
  FROM lesson_blocks lb
  WHERE lb.lesson_id = p_lesson_id;
  
  -- Criar versão
  INSERT INTO lesson_versions (
    lesson_id, version_number, lesson_data, blocks_data, version_notes, created_by
  ) VALUES (
    p_lesson_id, v_version_number, v_lesson_data, COALESCE(v_blocks_data, '[]'::jsonb), p_version_notes, p_created_by
  ) RETURNING id INTO v_version_id;
  
  -- Atualizar número da versão na aula principal
  UPDATE created_lessons 
  SET version = v_version_number, updated_at = NOW()
  WHERE id = p_lesson_id;
  
  RETURN v_version_id;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_created_lessons_updated_at 
  BEFORE UPDATE ON created_lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_blocks_updated_at 
  BEFORE UPDATE ON lesson_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_templates_updated_at 
  BEFORE UPDATE ON lesson_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE created_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;

-- Políticas para created_lessons
CREATE POLICY "Users can view their own lessons" ON created_lessons
  FOR SELECT USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can create lessons" ON created_lessons
  FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update their own lessons" ON created_lessons
  FOR UPDATE USING (auth.uid()::text = created_by::text);

CREATE POLICY "Users can delete their own lessons" ON created_lessons
  FOR DELETE USING (auth.uid()::text = created_by::text);

-- Políticas para lesson_blocks
CREATE POLICY "Users can manage blocks of their lessons" ON lesson_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM created_lessons 
      WHERE id = lesson_blocks.lesson_id 
      AND created_by::text = auth.uid()::text
    )
  );

-- Políticas para lesson_versions
CREATE POLICY "Users can view versions of their lessons" ON lesson_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM created_lessons 
      WHERE id = lesson_versions.lesson_id 
      AND created_by::text = auth.uid()::text
    )
  );

-- Políticas para lesson_templates
CREATE POLICY "Users can view public templates" ON lesson_templates
  FOR SELECT USING (is_public = true OR created_by::text = auth.uid()::text);

CREATE POLICY "Users can create templates" ON lesson_templates
  FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update their own templates" ON lesson_templates
  FOR UPDATE USING (auth.uid()::text = created_by::text);

-- Políticas para lesson_statistics
CREATE POLICY "Users can view statistics of their lessons" ON lesson_statistics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM created_lessons 
      WHERE id = lesson_statistics.lesson_id 
      AND created_by::text = auth.uid()::text
    )
  );

-- Políticas para lesson_feedback
CREATE POLICY "Users can view public feedback" ON lesson_feedback
  FOR SELECT USING (is_public = true AND is_approved = true);

CREATE POLICY "Users can create feedback" ON lesson_feedback
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own feedback" ON lesson_feedback
  FOR UPDATE USING (auth.uid()::text = user_id::text);
