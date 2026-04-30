import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import type { Week, Contribution } from '../lib/types';
import { Accordion } from '../components/Accordion';
import { WeekContribution } from '../components/WeekContribution';

type WeekWithContributions = Week & {
  contributions: Contribution[];
};

interface AuthorNames {
  author_name_a: string;
  author_name_b: string;
}

export function Year2025() {
  const { isAuthorized, loading: authLoading } = useAuth();
  const [weeks, setWeeks] = useState<WeekWithContributions[]>([]);
  const [, setAuthorNames] = useState<AuthorNames>({ author_name_a: 'Alin', author_name_b: 'Kelsey' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWeeks();
    loadAuthorNames();
  }, []);

  const loadAuthorNames = async () => {
    try {
      const { settings: data } = await api.get<{ settings: Array<{ setting_key: string; setting_value: string }> }>('/api/public/settings');

      if (data) {
        const names: AuthorNames = { author_name_a: 'Alin', author_name_b: 'Kelsey' };
        data.forEach((item) => {
          if (item.setting_key === 'author_name_a' && item.setting_value) {
            names.author_name_a = item.setting_value;
          } else if (item.setting_key === 'author_name_b' && item.setting_value) {
            names.author_name_b = item.setting_value;
          }
        });
        setAuthorNames(names);
      }
    } catch {
      setAuthorNames({ author_name_a: 'Alin', author_name_b: 'Kelsey' });
    }
  };

  const loadWeeks = async () => {
    try {
      const { weeks: weeksWithContributions } = await api.get<{ weeks: WeekWithContributions[] }>('/api/weeks-with-contributions');
      setWeeks(weeksWithContributions);
    } catch {
      setError('Failed to load weeks');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveContribution = async (
    contributionId: string,
    updates: Partial<Contribution>
  ) => {
    await api.put(`/api/contributions/${contributionId}`, updates, { auth: true });

    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => ({
        ...week,
        contributions: week.contributions.map((c) =>
          c.id === contributionId
            ? { ...c, ...updates, updated_at: new Date().toISOString() }
            : c
        ),
      }))
    );
  };

  const handleUpdateWeekTitle = async (weekId: string, title: string) => {
    try {
      await api.put(`/api/weeks/${weekId}/title`, { title }, { auth: true });

      setWeeks((prevWeeks) =>
        prevWeeks.map((week) =>
          week.id === weekId ? { ...week, title } : week
        )
      );
    } catch {
      setError('Failed to update week title');
    }
  };


  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={48} className="animate-spin" style={{ color: '#A3A3A3' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="drop-shadow-md" style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          {/* TITLE: Matches Home Page (Cormorant, Italic, Light, Fuchsia) */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl mb-6 tracking-wide animate-fadeIn animate-float drop-shadow-2xl" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: 'italic',
            color: '#E879F9'
          }}>
            Echoes of 2025
          </h1>
          
          {/* SUBTITLE: Matches Home Page (Manrope, Italic, Extra Light) */}
          <p className="text-sm sm:text-base max-w-2xl mx-auto leading-relaxed drop-shadow-lg" style={{ 
            fontFamily: "'Manrope', sans-serif", 
            fontStyle: 'italic', 
            fontWeight: 200, 
            color: '#E5E5E5',
            letterSpacing: '0.05em'
          }}>
            Unfolding selves
          </p>
        </div>

        <div className="card-glow backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10" style={{ background: 'rgba(30, 30, 30, 0.6)' }}>
          {weeks.map((week) => {
            const contributionA = week.contributions.find((c) => c.contributor_type === 'A');
            const contributionB = week.contributions.find((c) => c.contributor_type === 'B');

            return (
              <Accordion
                key={week.id}
                title={week.title}
                weekNumber={week.week_number}
                isEditMode={isAuthorized}
                onTitleChange={(newTitle) => handleUpdateWeekTitle(week.id, newTitle)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {contributionA && (
                    <WeekContribution
                      contribution={contributionA}
                      contributorLabel="Echoes of Alin"
                      isEditMode={isAuthorized}
                      onSave={handleSaveContribution}
                    />
                  )}

                  {contributionB && (
                    <WeekContribution
                      contribution={contributionB}
                      contributorLabel="Echoes of Kelsey"
                      isEditMode={isAuthorized}
                      onSave={handleSaveContribution}
                    />
                  )}
                </div>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
}
