export function pct(correct: number, total: number): string {
  if (total === 0) {
    return '—';
  }
  return `${Math.round((correct / total) * 100)}%`;
}

export function fmt(n: number): string {
  return n.toLocaleString();
}

export const MODE_META: Record<
  string,
  { label: string; icon: string; iconCls: string; bgCls: string; desc: string }
> = {
  'missing-word-count': {
    label: 'Missing Word Count',
    icon: 'find_replace',
    iconCls: 'text-primary',
    bgCls: 'bg-primary/10',
    desc: 'Ranked · ELO-affecting',
  },
  'locate-verse': {
    label: 'Locate Verse',
    icon: 'my_location',
    iconCls: 'text-tertiary',
    bgCls: 'bg-tertiary/10',
    desc: 'Casual · Page accuracy',
  },
  'next-verse': {
    label: 'Next Verse',
    icon: 'format_quote',
    iconCls: 'text-secondary',
    bgCls: 'bg-secondary/10',
    desc: 'Casual · Verse continuation',
  },
  'translation-quiz': {
    label: 'Translation Quiz',
    icon: 'translate',
    iconCls: 'text-green-700',
    bgCls: 'bg-green-100',
    desc: 'Casual · Translation knowledge',
  },
};
