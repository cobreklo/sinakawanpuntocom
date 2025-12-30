import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MusicPlayer from './MusicPlayer';

// Mock audio assets
vi.mock('@/assets/music/intro.mp3', () => ({ default: 'intro.mp3' }));
vi.mock('@/assets/music/senda-bellakona.mp3', () => ({ default: 'senda.mp3' }));
vi.mock('@/assets/music/descontrol.mp3', () => ({ default: 'descontrol.mp3' }));
vi.mock('@/assets/music/quemaropa.mp3', () => ({ default: 'quemaropa.mp3' }));
vi.mock('@/assets/album-cover.png', () => ({ default: 'cover.png' }));

// Mock Lucide icons to avoid issues if any
vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>();
  return {
    ...actual,
  };
});

describe('MusicPlayer', () => {
  beforeEach(() => {
    // Mock HTMLMediaElement methods
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
  });

  it('renders correctly', () => {
    render(<MusicPlayer />);
    expect(screen.getByText('EL NUEVO SONIDO')).toBeInTheDocument();
    // Use getAllByText because the title appears in the main player and the track list
    expect(screen.getAllByText('INTRO EL NUEVO SONIDO').length).toBeGreaterThan(0);
  });

  it('changes track without error (no crossfade)', () => {
    render(<MusicPlayer />);
    
    // Find the track in the list and click it
    // The track list renders titles in paragraph tags
    // We want to click the one in the list.
    // Let's filter by checking if it's NOT the main heading
    const trackTitles = screen.getAllByText('SENDA BELLAKONA');
    const trackInList = trackTitles.find(el => el.tagName === 'P'); // TrackList uses <p>
    
    if (trackInList) {
        fireEvent.click(trackInList);
    } else {
        // Fallback if structure changes, just click the first one that is likely clickable
        fireEvent.click(trackTitles[0]);
    }

    // Expect the main player to show the new title
    expect(screen.getByRole('heading', { name: 'SENDA BELLAKONA', level: 2 })).toBeInTheDocument();
  });

  it('handles next button click without error', () => {
    render(<MusicPlayer />);
    
    const nextButton = screen.getByLabelText('Next Track');
    fireEvent.click(nextButton);

    // Expect track to change. Initial track is 1 (Intro). Next is 2 (Senda Bellakona).
    expect(screen.getByRole('heading', { name: 'SENDA BELLAKONA', level: 2 })).toBeInTheDocument();
  });
});
