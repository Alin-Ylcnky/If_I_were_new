import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Week, Contribution } from '../lib/supabase';
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
      const { data } = await supabase
        .from('site_settings')
        .select('setting_key, setting_value')
        .in('setting_key', ['author_name_a', 'author_name_b']);

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
      const { data: weeksData, error: weeksError } = await supabase
        .from('weeks')
        .select('*')
        .order('week_number', { ascending: true });

      if (weeksError) throw weeksError;

      const { data: contributionsData, error: contributionsError } = await supabase
        .from('contributions')
        .select('*');

      if (contributionsError) throw contributionsError;

      const weeksWithContributions = weeksData.map((week) => ({
        ...week,
        contributions: contributionsData.filter((c) => c.week_id === week.id),
      }));

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
    const { error } = await supabase
      .from('contributions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', contributionId);

    if (error) {
      throw new Error('Failed to save contribution');
    }

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
      const { error } = await supabase
        .from('weeks')
        .update({ title })
        .eq('id', weekId);

      if (error) throw error;

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
        <Loader2 size={48} className="text-gray-800 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-red-600 drop-shadow-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-wide animate-fadeIn animate-float text-cyan-200 drop-shadow-2xl font-bold" style={{
            fontFamily: 'Allura, cursive',
            textShadow: '0 0 20px rgba(125, 211, 192, 0.8), 0 0 30px rgba(125, 211, 192, 0.5), 0 0 40px rgba(125, 211, 192, 0.3)'
          }}>
            Echoes of 2025
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed text-slate-200/90 drop-shadow-lg italic" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}>
            Unfolding selves
          </p>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl shadow-cyan-900/30 overflow-hidden border border-white/10">
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
