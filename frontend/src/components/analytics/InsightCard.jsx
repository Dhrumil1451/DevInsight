/**
 * InsightCard — displays the AI-generated textual insights for a developer.
 */
const InsightCard = ({ insights = '' }) => {
  if (!insights) return null;

  // Split into bullet sentences for readability if the text is long
  const sentences = insights
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 6); // cap at 6 sentences

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-base flex-shrink-0">
          💡
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            AI Insights
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Generated analysis</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5 pl-11">
        {sentences.length > 1
          ? sentences.map((sentence, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {sentence.trim()}
                </p>
              </div>
            ))
          : (
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {insights}
            </p>
          )
        }
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500 italic pl-11">
        Generated from public GitHub data — not affiliated with GitHub Inc.
      </p>
    </div>
  );
};

export default InsightCard;
