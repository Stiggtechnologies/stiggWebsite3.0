import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';

interface Recording {
  id: string;
  session_id: string;
  page_path: string;
  events: any[];
  duration: number;
  created_at: string;
}

interface SessionReplayViewerProps {
  sessionId: string;
  onClose: () => void;
}

export const SessionReplayViewer: React.FC<SessionReplayViewerProps> = ({
  sessionId,
  onClose
}) => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Recording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecordings();
  }, [sessionId]);

  useEffect(() => {
    if (!isPlaying || !currentRecording) return;

    const events = currentRecording.events;
    if (currentEventIndex >= events.length) {
      setIsPlaying(false);
      return;
    }

    const currentEvent = events[currentEventIndex];
    const nextEvent = events[currentEventIndex + 1];

    if (!nextEvent) {
      setIsPlaying(false);
      return;
    }

    const delay = (nextEvent.timestamp - currentEvent.timestamp) / playbackSpeed;

    const timer = setTimeout(() => {
      setCurrentEventIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [isPlaying, currentEventIndex, currentRecording, playbackSpeed]);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('session_recordings')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      setRecordings(data || []);
      if (data && data.length > 0) {
        setCurrentRecording(data[0]);
      }
    } catch (error) {
      console.error('Error fetching recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipForward = () => {
    if (currentRecording) {
      setCurrentEventIndex(Math.min(currentEventIndex + 10, currentRecording.events.length - 1));
    }
  };

  const handleSkipBack = () => {
    setCurrentEventIndex(Math.max(currentEventIndex - 10, 0));
  };

  const handleRestart = () => {
    setCurrentEventIndex(0);
    setIsPlaying(false);
  };

  const getCurrentEvent = () => {
    if (!currentRecording || currentEventIndex >= currentRecording.events.length) {
      return null;
    }
    return currentRecording.events[currentEventIndex];
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session replay...</p>
        </div>
      </div>
    );
  }

  if (recordings.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <h3 className="text-xl font-semibold mb-4">No Recordings Found</h3>
          <p className="text-gray-600 mb-6">
            There are no session recordings available for this session.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentEvent = getCurrentEvent();
  const progress = currentRecording
    ? (currentEventIndex / currentRecording.events.length) * 100
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Session Replay</h3>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-100 rounded-lg p-4 mb-4 min-h-[300px]">
            <div className="text-sm text-gray-600 mb-2">
              Page: {currentRecording?.page_path}
            </div>
            {currentEvent && (
              <div className="space-y-2">
                <div className="bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-700 capitalize">
                      {currentEvent.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatTime(currentEvent.timestamp)}
                    </span>
                  </div>
                  {currentEvent.x !== undefined && (
                    <div className="text-sm text-gray-600">
                      Position: ({currentEvent.x}, {currentEvent.y})
                    </div>
                  )}
                  {currentEvent.field && (
                    <div className="text-sm text-gray-600">
                      Field: {currentEvent.field}
                    </div>
                  )}
                  {currentEvent.scrollY !== undefined && (
                    <div className="text-sm text-gray-600">
                      Scroll: {currentEvent.scrollY}px
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Event {currentEventIndex + 1} of {currentRecording?.events.length}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {currentRecording && formatTime(currentEvent?.timestamp || 0)} /{' '}
                {currentRecording && formatTime(currentRecording.duration * 1000)}
              </div>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleRestart}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Restart"
              >
                <SkipBack className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={handleSkipBack}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Skip back 10 events"
              >
                <SkipBack className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </button>
              <button
                onClick={handleSkipForward}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Skip forward 10 events"
              >
                <SkipForward className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
