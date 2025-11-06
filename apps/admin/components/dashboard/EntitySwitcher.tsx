'use client';

import { useState } from 'react';
import { UserEntity } from '@/types/navigation';

interface EntitySwitcherProps {
  currentEntity: UserEntity;
  availableEntities: UserEntity[];
  onEntitySwitch: (entityId: string) => void;
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
        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-3">
          {currentEntity.logo && (
            <img
              src={currentEntity.logo}
              alt={currentEntity.entityName}
              className="w-6 h-6 rounded"
            />
          )}
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">
              {currentEntity.entityName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {currentEntity.role}
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
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
          <div className="absolute bottom-full left-0 z-20 w-full mb-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {availableEntities.map((entity) => (
                <button
                  key={entity.entityId}
                  onClick={() => handleSwitch(entity.entityId)}
                  className={`flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 ${
                    entity.entityId === currentEntity.entityId
                      ? 'bg-gray-50'
                      : ''
                  }`}
                >
                  {entity.logo && (
                    <img
                      src={entity.logo}
                      alt={entity.entityName}
                      className="w-6 h-6 rounded mr-3"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {entity.entityName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {entity.role}
                    </p>
                  </div>
                  {entity.entityId === currentEntity.entityId && (
                    <svg
                      className="w-5 h-5 ml-auto text-indigo-600"
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
