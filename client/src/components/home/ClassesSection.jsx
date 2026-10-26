import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { renderWithCleanDigits } from '../common/FormattedText';

export function ClassesSection({ course, settings, image }) {
  return (
    <section className="section classes-section">
      <div className="container classes-layout">
        <div className="classes-copy">
          <SectionHeading
            eyebrow="Learn the art"
            title="A one-month course with practical guidance"
            copy={course?.description || 'Learn Aari embroidery techniques through structured training.'}
          />
          <div className="course-facts">
            <div>
              <span>Duration</span>
              <strong>{renderWithCleanDigits((course?.durationText || '1 Month').replace(/^I(\s+|-)/i, '1$1'))}</strong>
            </div>
            <div>
              <span>Certificate</span>
              <strong>{course?.certificateText || 'Certificate Provided'}</strong>
            </div>
          </div>
          <Link className="button button-light" to="/classes">
            {course?.ctaLabel || 'Join Aari Classes'} <ArrowRight size={17} />
          </Link>
        </div>
        <div className="classes-image">
          <img src={image} alt="Aari training session" />
          <div className="course-stamp">
            Aari
            <br />
            <span>learning</span>
          </div>
        </div>
      </div>
    </section>
  );
}
