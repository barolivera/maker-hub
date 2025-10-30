'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Plus, Edit, Trash2, ChevronUp, ChevronDown, Video, FileText, Clock, Eye, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { COURSE_CATEGORIES, CreatorCourseData, CreatorLesson } from '@/lib/creatorCourses';
import { LessonEditorModal } from '@/components/LessonEditorModal';
import { toast } from 'sonner';

export default function CreateCoursePage() {
  const router = useRouter();
  const { isWalletConnected, walletAddress, saveDraft, getDraft, publishCourse } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
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
  });

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<CreatorLesson | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [publishOptions, setPublishOptions] = useState({
    featured: false,
    enableReviews: true,
    termsAccepted: false,
  });

  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
      return;
    }

    const draft = getDraft(courseId);
    if (draft) {
      setFormData(draft.data);
      setCurrentStep(draft.step);
    }
  }, [isWalletConnected, router, courseId, getDraft]);

  const validateStep1 = () => {
    const newErrors = {
      title: '',
      shortDescription: '',
      fullDescription: '',
      category: '',
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

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSaveDraft = () => {
    saveDraft({
      id: courseId,
      step: currentStep,
      data: formData,
      updatedAt: new Date().toISOString(),
    });
    toast.success('Draft saved successfully');
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast.error('Please fix validation errors');
      return;
    }

    if (currentStep === 2 && formData.lessons.length < 3) {
      toast.error('Please add at least 3 lessons to proceed');
      return;
    }

    handleSaveDraft();
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    handleSaveDraft();
    setCurrentStep(currentStep - 1);
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

  const handlePublish = () => {
    if (!publishOptions.termsAccepted) {
      toast.error('Please accept the terms and creator agreement');
      return;
    }
    setPublishConfirmOpen(true);
  };

  const confirmPublish = () => {
    const courseData: CreatorCourseData = {
      id: courseId,
      ...formData,
      creatorAddress: walletAddress || '',
      createdAt: new Date().toISOString(),
      featured: publishOptions.featured,
      enableReviews: publishOptions.enableReviews,
    };

    publishCourse(courseData);
    toast.success('Course published successfully!');
    setPublishConfirmOpen(false);
    router.push('/creator');
  };

  if (!isWalletConnected) {
    return null;
  }

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-950 py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create New Course</h1>
          <p className="text-gray-400">Step {currentStep} of 3</p>
        </div>

        <Progress value={progressPercentage} className="mb-8" />

        <Card className="bg-gray-900 border-gray-800 p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Course Details</h2>
              </div>

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
                  className="mt-3"
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

              <div>
                <Label className="text-white">
                  Payment Model <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.paymentModel}
                  onValueChange={(value: any) => setFormData({ ...formData, paymentModel: value })}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <RadioGroupItem value="free" id="free" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="free" className="text-white cursor-pointer font-semibold">
                        Free Course
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        No payment required. Great for building your audience and reputation.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <RadioGroupItem value="upfront" id="upfront" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="upfront" className="text-white cursor-pointer font-semibold">
                        Upfront Payment
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        Students pay before accessing the course. Payment held in escrow until completion.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
                    <RadioGroupItem value="deferred" id="deferred" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="deferred" className="text-white cursor-pointer font-semibold">
                        Deferred Payment
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        Students can access for free, but must pay once they earn income on the platform.
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
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Build Your Curriculum</h2>
                <p className="text-gray-400">Add at least 3 lessons to your course</p>
              </div>

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

                    <Button
                      onClick={handleAddLesson}
                      variant="outline"
                      className="w-full border-gray-700 hover:bg-gray-800 hover:border-teal-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Lesson
                    </Button>
                  </>
                )}
              </div>

              {formData.lessons.length > 0 && (
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
              )}

              {formData.lessons.length > 0 && formData.lessons.length < 3 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-500 text-sm">
                    Please add at least {3 - formData.lessons.length} more lesson(s) to proceed
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Review & Publish</h2>
                <p className="text-gray-400">Preview your course before publishing</p>
              </div>

              <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-teal-500 mb-2">
                  <Eye className="h-5 w-5" />
                  <span className="font-semibold">Preview Mode</span>
                </div>
                <p className="text-sm text-gray-400">
                  This is how students will see your course
                </p>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6">
                <div className="relative h-48 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg overflow-hidden">
                  {formData.coverImageUrl ? (
                    <img
                      src={formData.coverImageUrl}
                      alt={formData.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/30" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">{formData.title}</h3>
                  <p className="text-gray-400">{formData.shortDescription}</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span>{formData.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{getTotalDuration()} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="h-4 w-4" />
                    <span className="capitalize">{formData.difficulty}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      {formData.paymentModel === 'free' ? (
                        <span className="text-2xl font-bold text-green-500">FREE</span>
                      ) : (
                        <span className="text-2xl font-bold text-teal-500">
                          ${formData.price} USDC
                        </span>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formData.paymentModel === 'upfront' && 'Pay upfront via escrow'}
                        {formData.paymentModel === 'deferred' && 'Pay after earning income'}
                        {formData.paymentModel === 'free' && 'No payment required'}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400 px-3 py-1 bg-gray-700 rounded">
                      {formData.category}
                    </span>
                  </div>
                </div>

                {formData.learningOutcomes.filter(o => o).length > 0 && (
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-semibold text-white mb-3">What you'll learn:</h4>
                    <ul className="space-y-2">
                      {formData.learningOutcomes.filter(o => o).map((outcome, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <span className="text-teal-500 mt-1">✓</span>
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-semibold text-white mb-3">Course Content:</h4>
                  <div className="space-y-2">
                    {formData.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-900 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500">{lesson.number}.</span>
                          <span className="text-gray-300">{lesson.title}</span>
                          {lesson.isFree && (
                            <span className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-500 rounded">
                              FREE
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{lesson.duration} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Edit Curriculum
                </Button>
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-800">
                <h4 className="font-semibold text-white">Publishing Options</h4>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={publishOptions.featured}
                      onChange={(e) => setPublishOptions({ ...publishOptions, featured: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="featured" className="text-white cursor-pointer flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        List as Featured
                        <span className="text-xs text-gray-400">(pay $10 boost)</span>
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        Get priority placement in course listings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="enableReviews"
                      checked={publishOptions.enableReviews}
                      onChange={(e) => setPublishOptions({ ...publishOptions, enableReviews: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="enableReviews" className="text-white cursor-pointer">
                        Enable student reviews
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        Allow students to rate and review your course
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="termsAccepted"
                      checked={publishOptions.termsAccepted}
                      onChange={(e) => setPublishOptions({ ...publishOptions, termsAccepted: e.target.checked })}
                      className="mt-1 h-4 w-4 rounded border-gray-700 bg-gray-800 text-teal-500 focus:ring-teal-500"
                    />
                    <div className="flex-1">
                      <Label htmlFor="termsAccepted" className="text-white cursor-pointer">
                        Accept terms & creator agreement
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <p className="text-xs text-gray-400 mt-1">
                        You agree to the platform terms and creator responsibilities
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                className="border-gray-700 hover:bg-gray-800"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/creator')}
                className="border-gray-700 hover:bg-gray-800"
              >
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Next: {currentStep === 1 ? 'Lessons' : 'Review'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePublish}
                  className="bg-teal-500 hover:bg-teal-600"
                  disabled={!publishOptions.termsAccepted}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Publish Course
                </Button>
              )}
            </div>
          </div>
        </Card>

        <LessonEditorModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSave={handleSaveLesson}
          lesson={editingLesson}
          lessonNumber={formData.lessons.length + 1}
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
              <AlertDialogCancel className="border-gray-700 hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteLesson}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={publishConfirmOpen} onOpenChange={setPublishConfirmOpen}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-500" />
                Ready to publish?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 space-y-2">
                <p>Your course will be live immediately and visible to all students.</p>
                <p>You can edit it later from your creator dashboard.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-700 hover:bg-gray-800">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmPublish}
                className="bg-teal-500 hover:bg-teal-600"
              >
                Confirm & Publish
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
