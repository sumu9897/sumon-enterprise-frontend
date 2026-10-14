export const ADMIN_PERMISSION_GROUPS = [
  {
    label: 'Projects',
    permissions: [
      ['projects.view', 'View projects'],
      ['projects.create', 'Add projects'],
      ['projects.update', 'Edit project details'],
      ['projects.status', 'Update project status'],
      ['projects.delete', 'Delete projects'],
    ],
  },
  {
    label: 'Inquiries',
    permissions: [
      ['inquiries.view', 'View inquiries'],
      ['inquiries.update', 'Update inquiry status'],
      ['inquiries.delete', 'Delete inquiries'],
    ],
  },
  {
    label: 'Website',
    permissions: [['content.update', 'Edit website content and gallery']],
  },
  {
    label: 'Administration',
    permissions: [['users.manage', 'Add users and manage access']],
  },
];

export const ALL_ADMIN_PERMISSIONS = ADMIN_PERMISSION_GROUPS.flatMap(
  (group) => group.permissions.map(([permission]) => permission),
);
