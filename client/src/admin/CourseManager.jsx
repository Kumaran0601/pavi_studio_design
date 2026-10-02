import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Check,
  Plus,
  Trash2,
  HelpCircle,
  Award,
  Layers,
} from 'lucide-react';
import {
  Button,
  Input,
  Tag,
  Popconfirm,
} from 'antd';
import { toast } from 'sonner';
import { API } from '../data/constants';

const { TextArea } = Input;

export function CourseManager({ course, onRefresh }) {
  const [form, setForm] = useState({
    title: course?.title || '1 Month Aari Embroidery Course',
    subtitle: course?.subtitle || 'Learn Aari Embroidery with Practical Guidance and Certificate',
    durationText: course?.durationText || '1 Month',
    certificateText: course?.certificateText || 'Certificate Provided',
    ctaLabel: course?.ctaLabel || 'Enquire About the Next Batch',
    description: course?.description || '',
  });

  const [learningPoints, setLearningPoints] = useState(course?.learningPoints || []);
  const [newPoint, setNewPoint] = useState('');

  const [faqItems, setFaqItems] = useState(course?.faqItems || []);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title || '1 Month Aari Embroidery Course',
        subtitle: course.subtitle || 'Learn Aari Embroidery with Practical Guidance and Certificate',
        durationText: course.durationText || '1 Month',
        certificateText: course.certificateText || 'Certificate Provided',
        ctaLabel: course.ctaLabel || 'Enquire About the Next Batch',
        description: course.description || '',
      });
      setLearningPoints(course.learningPoints || []);
      setFaqItems(course.faqItems || []);
    }
  }, [course]);

  const addPoint = () => {
    if (!newPoint.trim()) return;
    setLearningPoints([...learningPoints, newPoint.trim()]);
    setNewPoint('');
  };

  const removePoint = index => {
    setLearningPoints(learningPoints.filter((_, i) => i !== index));
  };

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) {
      return toast.error('Please enter both a question and an answer.');
    }
    setFaqItems([...faqItems, { question: newQ.trim(), answer: newA.trim() }]);
    setNewQ('');
    setNewA('');
  };

  const removeFaq = index => {
    setFaqItems(faqItems.filter((_, i) => i !== index));
  };

  const saveCourse = async e => {
    e.preventDefault();
    if (!course?.id) return toast.error('No course record found to update.');

    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/courses/${course.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...form,
          learningPoints,
          faqItems,
        }),
      });

      if (!res.ok) throw new Error('Could not update course details.');
      toast.success('Course curriculum and details saved successfully!');
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <BookOpen className="text-rose-900 dark:text-rose-400" size={20} />
              Aari Embroidery Course & Training Center
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Curriculum, certification information, learning highlights, and student FAQ directory
            </p>
          </div>
          <Tag color="success" className="font-semibold text-xs px-3 py-1 rounded-full">
            Live on /classes
          </Tag>
        </div>

        <form onSubmit={saveCourse} className="mt-6 space-y-8">
          {/* General Course Information */}
          <div>
            <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base mb-4 flex items-center gap-2">
              <Award size={18} className="text-rose-900 dark:text-rose-400" />
              General Course Information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Subtitle <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Duration Specification <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  value={form.durationText}
                  onChange={e => setForm({ ...form, durationText: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Certification Details <span className="text-rose-600 dark:text-rose-400">*</span>
                </label>
                <Input
                  value={form.certificateText}
                  onChange={e => setForm({ ...form, certificateText: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  CTA Button Label
                </label>
                <Input
                  value={form.ctaLabel}
                  onChange={e => setForm({ ...form, ctaLabel: e.target.value })}
                  required
                  size="middle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Course Overview Description
                </label>
                <TextArea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Interactive Learning Points */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base mb-2 flex items-center gap-2">
              <Layers size={18} className="text-rose-900 dark:text-rose-400" />
              What Students Will Learn ({learningPoints.length} points)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Bullet points presented on the course landing page
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {learningPoints.map((point, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => removePoint(index)}
                  color="magenta"
                  className="px-3 py-1 text-xs rounded-full font-medium"
                >
                  <Check size={12} className="inline mr-1 text-emerald-600 dark:text-emerald-400" />
                  {point}
                </Tag>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-lg">
              <Input
                placeholder="e.g. Traditional Zari & Stone Detailing"
                value={newPoint}
                onChange={e => setNewPoint(e.target.value)}
                onPressEnter={addPoint}
                size="middle"
              />
              <Button
                type="default"
                icon={<Plus size={14} />}
                onClick={addPoint}
                size="middle"
              >
                Add Point
              </Button>
            </div>
          </div>

          {/* Interactive FAQs */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-serif font-semibold text-rose-950 dark:text-rose-300 text-base mb-2 flex items-center gap-2">
              <HelpCircle size={18} className="text-rose-900 dark:text-rose-400" />
              Course Questions & Answers (FAQs)
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Common questions answered for prospective students
            </p>

            <div className="space-y-3 mb-5">
              {faqItems.map((faq, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 rounded-xl flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <strong className="block text-sm font-serif font-bold text-slate-800 dark:text-white">
                      Q: {faq.question}
                    </strong>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      A: {faq.answer}
                    </p>
                  </div>

                  <Popconfirm
                    title="Remove this FAQ item?"
                    okText="Remove"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                    onConfirm={() => removeFaq(index)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<Trash2 size={13} />}
                      title="Remove FAQ"
                    />
                  </Popconfirm>
                </div>
              ))}
            </div>

            {/* Add New FAQ card */}
            <div className="p-4 bg-rose-50/30 dark:bg-rose-950/20 border border-dashed border-rose-200 dark:border-rose-900/50 rounded-xl space-y-3">
              <span className="block text-xs font-semibold text-rose-900 dark:text-rose-300">
                Add New FAQ Question
              </span>
              <Input
                placeholder="Question (e.g. What timings are available for classes?)"
                value={newQ}
                onChange={e => setNewQ(e.target.value)}
                size="middle"
              />
              <TextArea
                rows={2}
                placeholder="Answer (e.g. Weekday morning and weekend batches are available. Contact the studio for timings.)"
                value={newA}
                onChange={e => setNewA(e.target.value)}
              />
              <Button
                type="default"
                icon={<Plus size={14} />}
                onClick={addFaq}
                size="middle"
              >
                Add FAQ Item
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={busy}
              icon={<Check size={15} />}
              size="large"
            >
              {busy ? 'Saving...' : 'Save All Course Details'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
