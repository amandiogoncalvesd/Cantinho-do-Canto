import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  content: { url: string; title: string };
  onChange: (content: { url: string; title: string }) => void;
}

const VideoUploader = ({ content, onChange }: VideoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione um arquivo de vídeo.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O vídeo deve ter no máximo 50MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // For demo purposes, create a local URL
      const videoUrl = URL.createObjectURL(file);
      onChange({
        ...content,
        url: videoUrl,
        title: content.title || file.name.replace(/\.[^/.]+$/, "")
      });

      toast({
        title: "Vídeo carregado",
        description: "O vídeo foi carregado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar o vídeo.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    onChange({ ...content, url });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...content, title });
  };

  const removeVideo = () => {
    onChange({ url: '', title: '' });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="video-title">Título do Vídeo</Label>
        <Input
          id="video-title"
          placeholder="Nome da lição em vídeo"
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
      </div>

      {!content.url ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Upload de Arquivo</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
              <div className="text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste um vídeo ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Formatos: MP4, AVI, MOV (máx. 50MB)
                </p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={isUploading}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('video-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Carregando...' : 'Selecionar Arquivo'}
                </Button>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video-url">URL do Vídeo</Label>
            <Input
              id="video-url"
              placeholder="https://exemplo.com/video.mp4"
              value={content.url}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Insira a URL de um vídeo hospedado online
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-muted rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{content.title || 'Vídeo sem título'}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {content.url}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeVideo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Video Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              src={content.url}
              controls
              className="w-full h-full object-contain"
              preload="metadata"
            >
              <p className="text-white text-center p-4">
                Seu navegador não suporta a reprodução deste vídeo.
              </p>
            </video>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
