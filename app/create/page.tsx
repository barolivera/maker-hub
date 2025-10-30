'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Video, FileText, Clock, BookOpen, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { COURSE_CATEGORIES, CreatorCourseData, CreatorLesson } from '@/lib/creatorCourses';
import { LessonEditorModal } from '@/components/LessonEditorModal';
import { toast } from 'sonner';

export default function CreateCoursePage() {
  const router = useRouter();
  const { isWalletConnected, walletAddress, publishCourse } = useApp();
  const [courseId] = useState(() => `course-${Date.now()}`);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: 15,
    paymentModel: 'upfront' as 'free' | 'upfront' | 'deferred',
    coverImageUrl: '',
    learningOutcomes: ['', '', '', ''],
    lessons: [] as CreatorLesson[],
  });

  const [errors, setErrors] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    lessons: '',
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CreatorLesson | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected, router]);

  const validateForm = () => {
    const newErrors = {
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
      lessons: '',
    };

    if (formData.title.length < 5 || formData.title.length > 80) {
      newErrors.title = 'Title must be between 5 and 80 characters';
    }

    if (formData.shortDescription.length < 10) {
      newErrors.shortDescription = 'Short description must be at least 10 characters';
    }

    if (formData.fullDescription.length < 50) {
      newErrors.fullDescription = 'Full description must be at least 50 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.lessons.length < 1) {
      newErrors.lessons = 'Please add at least 1 lesson';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleAddLesson = () => {
    setEditingLesson(undefined);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: CreatorLesson) => {
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = (lesson: CreatorLesson) => {
    if (editingLesson) {
      setFormData({
        ...formData,
        lessons: formData.lessons.map(l => l.id === lesson.id ? lesson : l),
      });
    } else {
      setFormData({
        ...formData,
        lessons: [...formData.lessons, { ...lesson, number: formData.lessons.length + 1 }],
      });
    }
    setIsLessonModalOpen(false);
  };

  const handleDeleteLesson = (lessonId: string) => {
    setLessonToDelete(lessonId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteLesson = () => {
    if (lessonToDelete) {
      const updatedLessons = formData.lessons
        .filter(l => l.id !== lessonToDelete)
        .map((l, index) => ({ ...l, number: index + 1 }));

      setFormData({
        ...formData,
        lessons: updatedLessons,
      });
      toast.success('Lesson deleted');
    }
    setDeleteConfirmOpen(false);
    setLessonToDelete(null);
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    const newLessons = [...formData.lessons];
    [newLessons[index - 1], newLessons[index]] = [newLessons[index], newLessons[index - 1]];
    const reorderedLessons = newLessons.map((l, i) => ({ ...l, number: i + 1 }));
    setFormData({ ...formData, lessons: reorderedLessons });
  };

  const moveLessonDown = (index: number) => {
    if (index === formData.lessons.length - 1) return;
    const newLessons = [...formData.lessons];
    [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]];
    const reorderedLessons = newLessons.map((l, i) => ({ ...l, number: i + 1 }));
    setFormData({ ...formData, lessons: reorderedLessons });
  };

  const getTotalDuration = () => {
    return formData.lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'mixed':
        return (
          <div className="flex gap-1">
            <Video className="h-4 w-4" />
            <FileText className="h-4 w-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmitCourse = async () => {
    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      const courseData: CreatorCourseData = {
        id: courseId,
        ...formData,
        creator: walletAddress || 'Anonymous',
        creatorBio: 'Course Creator',
        creatorAddress: walletAddress || '',
        createdAt: new Date().toISOString(),
        published: true,
        featured: false,
        enableReviews: true,
      };

      publishCourse(courseData);

      toast.success('Course submitted successfully!');

      setTimeout(() => {
        router.push('/creator');
      }, 500);
    } catch (error) {
      toast.error('Failed to submit course. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (!isWalletConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Course</h1>
          <p className="text-gray-400">Fill in the details and add lessons to create your course</p>
        </div>

        <Card className="bg-gray-900 border-gray-800 p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Course Details</h2>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-white">
                    Course Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Advanced React Patterns"
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                    maxLength={80}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.title.length}/80 characters
                  </p>
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="shortDescription" className="text-white">
                    Short Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Brief description for course cards"
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.shortDescription && (
                    <p className="text-sm text-red-500 mt-1">{errors.shortDescription}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="fullDescription" className="text-white">
                    Full Description (Markdown) <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    placeholder="Detailed course description with markdown formatting..."
                    className="mt-2 bg-gray-800 border-gray-700 text-white min-h-[150px]"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.fullDescription.length} characters (min 50)
                  </p>
                  {errors.fullDescription && (
                    <p className="text-sm text-red-500 mt-1">{errors.fullDescription}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category" className="text-white">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="mt-2 bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {COURSE_CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category} className="text-white">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-white">
                      Difficulty Level <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={formData.difficulty}
                      onValueChange={(value: any) => setFormData({ ...formData, difficulty: value })}
                      className="mt-3 flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Beginner" id="beginner" />
                        <Label htmlFor="beginner" className="text-white cursor-pointer">
                          Beginner
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Intermediate" id="intermediate" />
                        <Label htmlFor="intermediate" className="text-white cursor-pointer">
                          Intermediate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Advanced" id="advanced" />
                        <Label htmlFor="advanced" className="text-white cursor-pointer">
                          Advanced
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div>
                  <Label className="text-white">
                    Payment Model <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.paymentModel}
                    onValueChange={(value: any) => setFormData({ ...formData, paymentModel: value })}
                    className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3"
                  >
                    <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="free" id="free" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="free" className="text-white cursor-pointer font-semibold text-sm">
                          Free Course
                        </Label>
                        <p className="text-xs text-gray-400 mt-1">
                          No payment required
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="upfront" id="upfront" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="upfront" className="text-white cursor-pointer font-semibold text-sm">
                          Upfront Payment
                        </Label>
                        <p className="text-xs text-gray-400 mt-1">
                          Pay before access
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                      <RadioGroupItem value="deferred" id="deferred" className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor="deferred" className="text-white cursor-pointer font-semibold text-sm">
                          Deferred Payment
                        </Label>
                        <p className="text-xs text-gray-400 mt-1">
                          Pay after earning
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {formData.paymentModel !== 'free' && (
                  <div>
                    <Label className="text-white">
                      Price (USDC) <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-3 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-teal-500">
                          ${formData.price} USDC
                        </span>
                      </div>
                      <Slider
                        value={[formData.price]}
                        onValueChange={([value]) => setFormData({ ...formData, price: value })}
                        min={5}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>$5</span>
                        <span>$50</span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="coverImageUrl" className="text-white">
                    Cover Image URL (Optional)
                  </Label>
                  <Input
                    id="coverImageUrl"
                    value={formData.coverImageUrl}
                    onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg or leave empty for gradient"
                    className="mt-2 bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to use a default gradient
                  </p>
                </div>

                <div>
                  <Label className="text-white">Learning Outcomes (Optional)</Label>
                  <p className="text-sm text-gray-400 mb-3">
                    What will students learn? Add up to 4 key outcomes.
                  </p>
                  {formData.learningOutcomes.map((outcome, index) => (
                    <Input
                      key={index}
                      value={outcome}
                      onChange={(e) => {
                        const newOutcomes = [...formData.learningOutcomes];
                        newOutcomes[index] = e.target.value;
                        setFormData({ ...formData, learningOutcomes: newOutcomes });
                      }}
                      placeholder={`Outcome ${index + 1}`}
                      className="mt-2 bg-gray-800 border-gray-700 text-white"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-800">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Course Lessons</h2>
                  <p className="text-gray-400 text-sm mt-1">Add at least 1 lesson to your course</p>
                </div>
                <Button
                  onClick={handleAddLesson}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>

              {errors.lessons && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-500 text-sm">{errors.lessons}</p>
                </div>
              )}

              <div className="space-y-4">
                {formData.lessons.length === 0 ? (
                  <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No lessons added yet</p>
                    <Button
                      onClick={handleAddLesson}
                      className="bg-teal-500 hover:bg-teal-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Lesson
                    </Button>
                  </div>
                ) : (
                  <>
                    {formData.lessons.map((lesson, index) => (
                      <Card
                        key={lesson.id}
                        className="bg-gray-800 border-gray-700 p-4 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-lg font-bold text-teal-500">
                                {lesson.number}.
                              </span>
                              <h3 className="text-lg font-semibold text-white">
                                {lesson.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                {getContentTypeIcon(lesson.contentType)}
                                <span className="capitalize">{lesson.contentType}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{lesson.duration} min</span>
                              </div>
                              {lesson.isFree && (
                                <span className="px-2 py-0.5 bg-teal-500/20 text-teal-500 rounded text-xs">
                                  FREE
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLesson(lesson)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLesson(lesson.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-col gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveLessonUp(index)}
                                disabled={index === 0}
                                className="h-6 p-0 w-8 text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveLessonDown(index)}
                                disabled={index === formData.lessons.length - 1}
                                className="h-6 p-0 w-8 text-gray-400 hover:text-white disabled:opacity-30"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span className="text-gray-400">Total Lessons: </span>
                          <span className="text-white font-semibold">
                            {formData.lessons.length}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Total Duration: </span>
                          <span className="text-white font-semibold">
                            {getTotalDuration()} minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-800">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="border-gray-700 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCourse}
              disabled={isSubmitting}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2">Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Course
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>

      <LessonEditorModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSave={handleSaveLesson}
        lesson={editingLesson}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent className="bg-gray-900 border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Lesson</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this lesson? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLesson}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
