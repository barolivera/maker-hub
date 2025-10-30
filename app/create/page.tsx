'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { COURSE_CATEGORIES, CreatorCourseData, CreatorLesson } from '@/lib/creatorCourses';
import { toast } from 'sonner';

export default function CreateCoursePage() {
  const router = useRouter();
  const { isWalletConnected, walletAddress, saveDraft, getDraft } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseId] = useState(() => `course-${Date.now()}`);

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    price: 15,
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

    handleSaveDraft();
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    handleSaveDraft();
    setCurrentStep(currentStep - 1);
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
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Curriculum Builder Coming Next
              </h2>
              <p className="text-gray-400">
                This step will allow you to add and organize lessons
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Review & Publish Coming Next
              </h2>
              <p className="text-gray-400">
                Preview your course before publishing
              </p>
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
              {currentStep < 3 && (
                <Button
                  onClick={handleNextStep}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Next: {currentStep === 1 ? 'Lessons' : 'Review'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
