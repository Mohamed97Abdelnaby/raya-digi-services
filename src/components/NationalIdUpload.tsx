import { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NationalIdUploadProps {
  onFileSelect: (file: File | undefined) => void;
  currentFile?: File;
}

export const NationalIdUpload = ({ onFileSelect, currentFile }: NationalIdUploadProps) => {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    onFileSelect(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="hidden"
        aria-label={t('uploadId')}
      />
      
      {!preview ? (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleClick}
        >
          <Upload className="mr-2 h-4 w-4" />
          {t('uploadId')} ({t('optional')})
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="relative rounded-lg border border-border p-2">
            {preview.startsWith('data:image') ? (
              <img
                src={preview}
                alt="National ID Preview"
                className="w-full h-auto rounded"
              />
            ) : (
              <div className="flex items-center justify-center p-8 bg-muted rounded">
                <p className="text-sm text-muted-foreground">
                  {currentFile?.name}
                </p>
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-background/80 hover:bg-background"
              onClick={handleClear}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleClick}
          >
            {t('changeId')}
          </Button>
        </div>
      )}
    </div>
  );
};
