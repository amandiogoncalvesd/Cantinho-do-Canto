import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, FileText, Music, HelpCircle } from "lucide-react";

interface LessonBlock {
  id: string;
  type: 'video' | 'text' | 'chord' | 'quiz' | 'image';
  content: any;
  order: number;
}

interface LessonPreviewProps {
  title: string;
  description: string;
  date: string;
  time: string;
  blocks: LessonBlock[];
}

const LessonPreview = ({ title, description, date, time, blocks }: LessonPreviewProps) => {
  const renderBlock = (block: LessonBlock) => {
    switch (block.type) {
      case 'video':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Video className="h-4 w-4" />
              {block.content.title || 'Vídeo'}
            </h4>
            {block.content.url && (
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <Video className="h-12 w-12 text-white/50" />
              </div>
            )}
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Conteúdo
            </h4>
            <div className="prose prose-sm">
              {block.content.content || 'Sem conteúdo'}
            </div>
          </div>
        );
      
      case 'chord':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Music className="h-4 w-4" />
              Acorde: {block.content.name || 'Sem nome'}
            </h4>
            <div className="text-center">
              <div className="inline-flex gap-2 p-2 bg-muted rounded">
                {block.content.frets?.map((fret: number, i: number) => (
                  <span key={i} className="font-mono text-sm">
                    {fret === 0 ? 'o' : fret}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Quiz
            </h4>
            <p>{block.content.question || 'Sem pergunta'}</p>
            {block.content.options && (
              <div className="space-y-1">
                {block.content.options.map((option: string, i: number) => (
                  <div key={i} className="text-sm text-muted-foreground">
                    {i + 1}. {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      
      default:
        return <div>Tipo de bloco não suportado</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{title || 'Título da Aula'}</CardTitle>
          {description && <p className="text-muted-foreground">{description}</p>}
          <div className="flex gap-4 mt-4">
            {date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{new Date(date).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{time}</span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Blocks */}
      {blocks.length > 0 ? (
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <Card key={block.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {block.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                    {block.type === 'text' && <FileText className="h-3 w-3 mr-1" />}
                    {block.type === 'chord' && <Music className="h-3 w-3 mr-1" />}
                    {block.type === 'quiz' && <HelpCircle className="h-3 w-3 mr-1" />}
                    Bloco {index + 1}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderBlock(block)}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aula Vazia</h3>
            <p className="text-muted-foreground">Adicione conteúdo para visualizar a aula</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LessonPreview;
