export const PROJECT_STATUSES = [
  { value: 'Ongoing', label: 'Ongoing', badgeClass: 'border-amber-500/20 bg-amber-500/15 text-amber-400', color: 'rgba(201,168,76,.92)' },
  { value: 'Upcoming', label: 'Upcoming', badgeClass: 'border-sky-500/20 bg-sky-500/15 text-sky-400', color: 'rgba(14,165,233,.88)' },
  { value: 'On Hold', label: 'On Hold', badgeClass: 'border-rose-500/20 bg-rose-500/15 text-rose-400', color: 'rgba(244,63,94,.86)' },
  { value: 'Planning', label: 'Planning', badgeClass: 'border-violet-500/20 bg-violet-500/15 text-violet-400', color: 'rgba(139,92,246,.88)' },
  { value: 'Ready to Start', label: 'Ready to Start', badgeClass: 'border-cyan-500/20 bg-cyan-500/15 text-cyan-400', color: 'rgba(6,182,212,.88)' },
  { value: 'Nearing Completion', label: 'Nearing Completion', badgeClass: 'border-orange-500/20 bg-orange-500/15 text-orange-400', color: 'rgba(249,115,22,.9)' },
  { value: 'Completed', label: 'Completed', badgeClass: 'border-emerald-500/20 bg-emerald-500/15 text-emerald-400', color: 'rgba(34,197,94,.88)' },
];

export const getProjectStatus = (value) => (
  PROJECT_STATUSES.find((status) => status.value === value) || PROJECT_STATUSES[0]
);
