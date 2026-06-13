import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './CustomSelect.module.css';

export interface CustomSelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: CustomSelectOption[];
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '-- Select --',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setIsOpen(true);
        const currentIdx = options.findIndex((opt) => opt.value === value);
        setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1 < options.length ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0) {
      const menu = containerRef.current?.querySelector(`.${styles.dropdownMenu}`);
      const focusedItem = menu?.children[focusedIndex] as HTMLElement;
      if (menu && focusedItem) {
        const menuRect = menu.getBoundingClientRect();
        const itemRect = focusedItem.getBoundingClientRect();

        if (itemRect.bottom > menuRect.bottom) {
          menu.scrollTop += itemRect.bottom - menuRect.bottom;
        } else if (itemRect.top < menuRect.top) {
          menu.scrollTop -= menuRect.top - itemRect.top;
        }
      }
    }
  }, [focusedIndex, isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div 
      className={styles.selectContainer} 
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className={`${styles.selectTrigger} ${isOpen ? styles.selectTriggerFocus : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            const currentIdx = options.findIndex((opt) => opt.value === value);
            setFocusedIndex(currentIdx >= 0 ? currentIdx : 0);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`${styles.triggerText} ${!selectedOption ? styles.placeholderText : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
          <ChevronDown size={15} />
        </span>
      </button>

      {isOpen && (
        <ul className={styles.dropdownMenu} role="listbox">
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isFocused = idx === focusedIndex;
            return (
              <li
                key={opt.value}
                className={`${styles.option} ${isSelected ? styles.optionActive : ''} ${isFocused ? styles.optionFocused : ''}`}
                onClick={() => handleSelect(opt.value)}
                role="option"
                aria-selected={isSelected}
              >
                <span className={styles.optionLabel}>{opt.label}</span>
                {opt.subLabel && <span className={styles.optionSubLabel}>{opt.subLabel}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
