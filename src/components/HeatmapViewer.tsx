import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Flame, X } from 'lucide-react';

interface Click {
  x_position: number;
  y_position: number;
  viewport_width: number;
  viewport_height: number;
}

interface HeatmapViewerProps {
  pagePath: string;
  dateRange?: number;
}

export const HeatmapViewer: React.FC<HeatmapViewerProps> = ({
  pagePath,
  dateRange = 7
}) => {
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    if (showHeatmap) {
      fetchClickData();
    }
  }, [showHeatmap, pagePath, dateRange]);

  const fetchClickData = async () => {
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const { data } = await supabase
        .from('click_events')
        .select('x_position, y_position, viewport_width, viewport_height')
        .eq('page_path', pagePath)
        .gte('created_at', startDate.toISOString());

      setClicks(data || []);
    } catch (error) {
      console.error('Error fetching click data:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalizeClick = (click: Click) => {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    return {
      x: (click.x_position / click.viewport_width) * currentWidth,
      y: (click.y_position / click.viewport_height) * currentHeight,
    };
  };

  const getClickDensity = (x: number, y: number, radius: number = 50): number => {
    return clicks.filter(click => {
      const normalized = normalizeClick(click);
      const distance = Math.sqrt(
        Math.pow(normalized.x - x, 2) + Math.pow(normalized.y - y, 2)
      );
      return distance <= radius;
    }).length;
  };

  const getHeatColor = (density: number, maxDensity: number): string => {
    if (maxDensity === 0) return 'rgba(0, 0, 255, 0)';

    const intensity = density / maxDensity;

    if (intensity < 0.2) return `rgba(0, 0, 255, ${intensity * 0.3})`;
    if (intensity < 0.4) return `rgba(0, 255, 0, ${intensity * 0.4})`;
    if (intensity < 0.6) return `rgba(255, 255, 0, ${intensity * 0.5})`;
    if (intensity < 0.8) return `rgba(255, 165, 0, ${intensity * 0.6})`;
    return `rgba(255, 0, 0, ${intensity * 0.7})`;
  };

  if (!showHeatmap) {
    return (
      <button
        onClick={() => setShowHeatmap(true)}
        className="fixed bottom-20 right-4 bg-orange-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-orange-700 transition-colors flex items-center gap-2 z-50"
      >
        <Flame className="h-5 w-5" />
        View Heatmap
      </button>
    );
  }

  const maxDensity = Math.max(
    ...Array.from({ length: 100 }, (_, i) => {
      const x = (window.innerWidth / 100) * i;
      return getClickDensity(x, window.innerHeight / 2);
    })
  );

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {loading ? (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 pointer-events-auto">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <>
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 pointer-events-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-600" />
                <span className="font-semibold">Heatmap</span>
              </div>
              <button
                onClick={() => setShowHeatmap(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">{clicks.length} clicks recorded</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-blue-500 opacity-30 rounded"></div>
              <span>Low</span>
              <div className="w-3 h-3 bg-yellow-500 opacity-50 rounded"></div>
              <span>Medium</span>
              <div className="w-3 h-3 bg-red-500 opacity-70 rounded"></div>
              <span>High</span>
            </div>
          </div>

          <svg
            className="absolute inset-0 w-full h-full"
            style={{ pointerEvents: 'none' }}
          >
            {clicks.map((click, index) => {
              const normalized = normalizeClick(click);
              const density = getClickDensity(normalized.x, normalized.y);
              const color = getHeatColor(density, maxDensity);

              return (
                <circle
                  key={index}
                  cx={normalized.x}
                  cy={normalized.y}
                  r="30"
                  fill={color}
                  style={{ filter: 'blur(20px)' }}
                />
              );
            })}
          </svg>
        </>
      )}
    </div>
  );
};
