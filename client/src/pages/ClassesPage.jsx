import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown } from 'lucide-react';
import { approvedTrainingImage } from '../data/constants';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from '../components/common/PageIntro';
import { PageLoading } from '../components/common/PageLoading';
import { SectionHeading } from '../components/common/SectionHeading';
import { ContactBand } from '../components/layout/ContactBand';
import { renderWithCleanDigits } from '../components/common/FormattedText';

export function ClassesPage({ state }) {
  usePageMeta(
    'Aari Embroidery Classes in Chennai | Pavi Designer Studio',
    'Join the 1-month Aari embroidery course at Pavi Designer Studio & Training Center in Padi, Chennai with practical guidance and certificate information.',
    '/classes'
  );
  const data = state.data;
  if (!data) return <PageLoading />;
  const course = data.course || {};
  const cleanTitle = (course.title || '1 Month Aari Embroidery Course').replace(/^I(\s+|-)/i, '1$1');
  const cleanDuration = (course.durationText || '1 Month').replace(/^I(\s+|-)/i, '1$1');

  return (
    <>
      <PageIntro
        eyebrow="Training center"
        title={cleanTitle}
        description={course.subtitle || 'Learn Aari embroidery with practical training and certificate.'}
        image={approvedTrainingImage}
        imageAlt="Pavi Designer Studio training and community event"
      />
      <section className="section course-overview">
        <div className="container course-grid">
          <div className="course-card-feature">
            <span className="eyebrow">The course</span>
            <h2>{renderWithCleanDigits(cleanTitle)}</h2>
            <p>{course.description}</p>
            <div className="course-facts">
              <div>
                <span>Course duration</span>
                <strong>{renderWithCleanDigits(cleanDuration)}</strong>
              </div>
              <div>
                <span>Certificate</span>
                <strong>{course.certificateText}</strong>
              </div>
            </div>
            <Link className="button button-primary" to="/contact">
              {course.ctaLabel} <ArrowRight size={17} />
            </Link>
          </div>
          <div className="course-list-block">
            <h3>What you will learn</h3>
            {(course.learningPoints || []).map(point => (
              <div className="list-row" key={point}>
                <Check size={16} />
                {point}
              </div>
            ))}
            <h3>Who can join</h3>
            {(course.audiencePoints || []).map(point => (
              <div className="list-row" key={point}>
                <Check size={16} />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section faq-section">
        <div className="container narrow">
          <SectionHeading eyebrow="Questions, answered" title="Course details" align="center" />
          <div className="faq-list">
            {(course.faqItems || []).map(item => (
              <details key={item.question}>
                <summary>
                  {item.question}
                  <ChevronDown size={18} />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
          <p className="muted-callout">Contact us for current course fee and batch details.</p>
        </div>
      </section>
      <ContactBand settings={data.settings} />
    </>
  );
}
