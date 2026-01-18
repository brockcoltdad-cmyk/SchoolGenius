'use client';

import { useState, useEffect } from 'react';
import LiveGigi from './LiveGigi';

interface LiveGigiFloatingProps {
  pageContext?: string;
  gradeBand?: string;
  childName?: string;
  childId?: string;
  onReadContent?: () => void;
  onNeedHelp?: (topic: string) => void;
}

export default function LiveGigiFloating({
  pageContext = 'default',
  gradeBand,
  childName,
  childId,
  onReadContent,
  onNeedHelp,
}: LiveGigiFloatingProps) {
  const [detectedGrade, setDetectedGrade] = useState(gradeBand);

  // Auto-detect grade band from child data if not provided
  useEffect(() => {
    async function fetchGradeInfo() {
      if (!gradeBand && childId) {
        try {
          const response = await fetch(`/api/kid/${childId}/profile`);
          if (response.ok) {
            const data = await response.json();
            // Map grade to band
            const grade = data.grade || 3;
            if (grade <= 2) setDetectedGrade('K-2');
            else if (grade <= 5) setDetectedGrade('3-5');
            else if (grade <= 8) setDetectedGrade('6-8');
            else setDetectedGrade('9-12');
          }
        } catch (error) {
          console.error('Error fetching grade info:', error);
        }
      }
    }
    fetchGradeInfo();
  }, [childId, gradeBand]);

  const handleAction = (action: string, data?: any) => {
    console.log('LiveGigi action:', action, data);

    switch (action) {
      case 'read':
        if (onReadContent) {
          onReadContent();
        }
        break;
      case 'help':
      case 'hint':
      case 'explain':
        if (onNeedHelp) {
          onNeedHelp(data?.label || action);
        }
        break;
    }
  };

  return (
    <LiveGigi
      pageContext={pageContext}
      gradeBand={detectedGrade || '3-5'}
      childName={childName}
      onAction={handleAction}
      autoGreet={true}
      size="md"
      position="corner"
    />
  );
}
