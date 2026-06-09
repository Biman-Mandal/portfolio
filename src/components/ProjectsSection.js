"use client";

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsSection({ id, title, kicker, items = [] }) {
  const scrollRef = useRef(null);

  if (!items.length) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const cardWidth = 380; // Matches desktop flex-basis
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id={id} className="section projects">
      <div className="section-header reveal">
        <div>
          <h2>{title}</h2>
          <p>{kicker}</p>
        </div>
        <div className="scroll-controls">
          <button 
            type="button" 
            className="scroll-btn" 
            onClick={() => handleScroll('left')} 
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button" 
            className="scroll-btn" 
            onClick={() => handleScroll('right')} 
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div className="projects-scroll" ref={scrollRef}>
        {items.map((item, index) => {
          const delayClass = `reveal-delay-${(index % 3) + 1}`;
          return <ProjectCard item={item} delayClass={delayClass} key={item.id} />;
        })}
      </div>
    </section>
  );
}
