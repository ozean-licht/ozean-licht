'use client';

import { useState } from 'react';
import { UserEntity } from '@/types/navigation';

interface EntitySwitcherProps {
  currentEntity: UserEntity;
  availableEntities: UserEntity[];
  onEntitySwitch: (entityId: string) => void;
}

// Helper function to get simplified label
function getSimplifiedLabel(entity: UserEntity): string {
  // Check if entityName contains "All Entities" or entityId is 'all'
  if (entity.entityName.includes('All Entities') || entity.entityId === 'all') {
    return 'All';
  }
  // Check for Kids Ascension
  if (entity.entityName.includes('Kids Ascension') || entity.entityId === 'kids_ascension') {
    return 'KA';
  }
  // Check for Ozean Licht
  if (entity.entityName.includes('Ozean Licht') || entity.entityId === 'ozean_licht') {
    return 'OL';
  }
  // Fallback to first two letters uppercase
  return entity.entityName.substring(0, 2).toUpperCase();
}

export default function EntitySwitcher({
  currentEntity,
  availableEntities,
  onEntitySwitch,
}: EntitySwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (availableEntities.length <= 1) {
    return null; // Don't show switcher if user only has access to one entity
  }

  const handleSwitch = (entityId: string) => {
    onEntitySwitch(entityId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-white/90 bg-[#0E282E]/80 border border-primary/30 rounded-lg hover:bg-[#0E282E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2">
          {currentEntity.logo && (
            <img
              src={currentEntity.logo}
              alt={currentEntity.entityName}
              className="w-4 h-4 rounded"
            />
          )}
          <span className="font-semibold">
            {getSimplifiedLabel(currentEntity)}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-20 w-full mb-2 bg-[#0E282E] rounded-lg shadow-lg border border-primary/30">
            <div className="py-1">
              {availableEntities.map((entity) => (
                <button
                  key={entity.entityId}
                  onClick={() => handleSwitch(entity.entityId)}
                  className={`flex items-center w-full px-2 py-2 text-xs text-white/90 hover:bg-primary/20 transition-colors ${
                    entity.entityId === currentEntity.entityId
                      ? 'bg-primary/20'
                      : ''
                  }`}
                >
                  {entity.logo && (
                    <img
                      src={entity.logo}
                      alt={entity.entityName}
                      className="w-4 h-4 rounded mr-2"
                    />
                  )}
                  <span className="font-semibold">
                    {getSimplifiedLabel(entity)}
                  </span>
                  {entity.entityId === currentEntity.entityId && (
                    <svg
                      className="w-4 h-4 ml-auto text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
