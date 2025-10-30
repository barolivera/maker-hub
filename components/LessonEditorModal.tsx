'use client';

import { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreatorLesson, CODE_LANGUAGES } from '@/lib/creatorCourses';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface LessonEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: CreatorLesson) => void;
  lesson?: CreatorLesson;
  lessonNumber: number;
}

export function LessonEditorModal({
  isOpen,
  onClose,
  onSave,
  lesson,
  lessonNumber,
}: LessonEditorModalProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Partial<CreatorLesson>>({
    id: '',
    number: lessonNumber,
    title: '',
    contentType: 'video',
    videoUrl: '',
    textContent: '',
    codeSnippet: '',
    codeLanguage: 'javascript',
    duration: 10,
    isFree: false,
  });

  const [errors, setErrors] = useState({
    title: '',
    videoUrl: '',
    textContent: '',
    duration: '',
  });

  useEffect(() => {
    if (lesson) {
      setFormData(lesson);
    } else {
      setFormData({
        id: `lesson-${Date.now()}`,
        number: lessonNumber,
        title: '',
        contentType: 'video',
        videoUrl: '',
        textContent: '',
        codeSnippet: '',
        codeLanguage: 'javascript',
        duration: 10,
        isFree: false,
      });
    }
  }, [lesson, lessonNumber]);

  const validateForm = () => {
    const newErrors = {
      title: '',
      videoUrl: '',
      textContent: '',
      duration: '',
    };

    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (formData.contentType === 'video' || formData.contentType === 'mixed') {
      if (!formData.videoUrl) {
        newErrors.videoUrl = 'Video URL is required';
      }
    }

    if (formData.contentType === 'text' || formData.contentType === 'mixed') {
      if (!formData.textContent || formData.textContent.length < 20) {
        newErrors.textContent = 'Text content must be at least 20 characters';
      }
    }

    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    onSave(formData as CreatorLesson);
    toast.success(lesson ? 'Lesson updated' : 'Lesson added');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {lesson ? 'Edit Lesson' : 'Add New Lesson'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="lessonTitle" className="text-white">
              Lesson Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lessonTitle"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to React Hooks"
              className="mt-2 bg-gray-800 border-gray-700 text-white"
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label className="text-white">
              Content Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.contentType}
              onValueChange={(value: any) => setFormData({ ...formData, contentType: value })}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="video" />
                <Label htmlFor="video" className="text-white cursor-pointer">
                  Video
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="text" />
                <Label htmlFor="text" className="text-white cursor-pointer">
                  Text
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="text-white cursor-pointer">
                  Mixed (Video + Text)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {(formData.contentType === 'video' || formData.contentType === 'mixed') && (
            <div>
              <Label htmlFor="videoUrl" className="text-white">
                Video URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="mt-2 bg-gray-800 border-gray-700 text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                YouTube, Vimeo, or direct video link
              </p>
              {errors.videoUrl && (
                <p className="text-sm text-red-500 mt-1">{errors.videoUrl}</p>
              )}
            </div>
          )}

          {(formData.contentType === 'text' || formData.contentType === 'mixed') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="textContent" className="text-white">
                  Text Content (Markdown) <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-teal-500 hover:text-teal-400"
                >
                  {showPreview ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Hide Preview
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Show Preview
                    </>
                  )}
                </Button>
              </div>

              {!showPreview ? (
                <Textarea
                  id="textContent"
                  value={formData.textContent}
                  onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
                  placeholder="Write your lesson content using Markdown..."
                  className="mt-2 bg-gray-800 border-gray-700 text-white min-h-[200px]"
                />
              ) : (
                <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[200px] prose prose-invert max-w-none">
                  <ReactMarkdown>{formData.textContent || '_No content yet_'}</ReactMarkdown>
                </div>
              )}
              {errors.textContent && (
                <p className="text-sm text-red-500 mt-1">{errors.textContent}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="codeSnippet" className="text-white">
              Code Snippet (Optional)
            </Label>
            <Textarea
              id="codeSnippet"
              value={formData.codeSnippet}
              onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
              placeholder="// Add code example here..."
              className="mt-2 bg-gray-800 border-gray-700 text-white font-mono text-sm min-h-[120px]"
            />
          </div>

          {formData.codeSnippet && (
            <div>
              <Label htmlFor="codeLanguage" className="text-white">
                Code Language
              </Label>
              <Select
                value={formData.codeLanguage}
                onValueChange={(value) => setFormData({ ...formData, codeLanguage: value })}
              >
                <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {CODE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-white capitalize">
                      {lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="duration" className="text-white">
              Duration (minutes) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              min={1}
              className="mt-2 bg-gray-800 border-gray-700 text-white"
            />
            {errors.duration && (
              <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFree"
              checked={formData.isFree}
              onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
              className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-teal-500 focus:ring-teal-500"
            />
            <Label htmlFor="isFree" className="text-white cursor-pointer">
              Make this lesson free (preview)
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-teal-500 hover:bg-teal-600"
          >
            {lesson ? 'Update Lesson' : 'Save Lesson'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
