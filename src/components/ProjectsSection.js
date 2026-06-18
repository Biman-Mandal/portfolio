"use client";

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectCard from './ProjectCard';

export default function ProjectsSection({ id, title, kicker, items = [] }) {
  const scrollRef = useRef(null);
  const [infiniteItems, setInfiniteItems] = useState([]);

  useEffect(() => {
    if (items.length > 0) {
      setInfiniteItems([...items, ...items, ...items]);
    }
  }, [items]);

  useEffect(() => {
    if (scrollRef.current && infiniteItems.length > 0) {
      const container = scrollRef.current;
      const handleInitialScroll = () => {
        if (container.children.length >= items.length) {
          // Calculate the exact pixel width of one complete set of items (including gaps)
          const setWidth = container.children[items.length]?.offsetLeft - container.children[0]?.offsetLeft;
          if (setWidth) {
            container.scrollLeft = setWidth;
          }
        }
      };
      setTimeout(handleInitialScroll, 100);
    }
  }, [infiniteItems, items.length]);

  if (!items.length) return null;

  const handleScrollEvent = () => {
    const container = scrollRef.current;
    if (!container || container.children.length < items.length) return;

    // Calculate exact width to avoid mathematical float issues with gap
    const setWidth = container.children[items.length]?.offsetLeft - container.children[0]?.offsetLeft;
    if (!setWidth) return;
    
    // Jump seamlessly if scrolling past the bounds
    if (container.scrollLeft <= 0) {
      container.scrollLeft = setWidth;
    } 
    else if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft = setWidth + (container.scrollLeft - setWidth * 2);
    }
  };

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
      </div>
      <div className="projects-carousel-wrapper">
        <button 
          type="button" 
          className="carousel-btn left" 
          onClick={() => handleScroll('left')} 
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="projects-scroll" ref={scrollRef} onScroll={handleScrollEvent}>
          {infiniteItems.map((item, index) => {
            const delayClass = `reveal-delay-${(index % 3) + 1}`;
            return <ProjectCard item={item} delayClass={delayClass} key={`${item.id}-${index}`} />;
          })}
        </div>

        <button 
          type="button" 
          className="carousel-btn right" 
          onClick={() => handleScroll('right')} 
          aria-label="Scroll right"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
