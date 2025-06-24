const SideBarMenu = require('../models/SideBarMenu');

exports.getSidebarMenus = async () => {
  // Fetch all items
  const items = await SideBarMenu.find({}).lean();

  // Sort menu‑titles by module_priority
  const titles = items
    .filter(i => i.type === 'menu-title')
    .sort((a, b) => (a.module_priority || 0) - (b.module_priority || 0));

  // For each title, collect its children sorted by module_menu_priority
  const result = titles.map(title => {
    const children = items
      .filter(
        i =>
          i.type !== 'menu-title' &&
          i.parent_module_id === title.module_id
      )
      .sort(
        (a, b) =>
          (a.module_menu_priority || 0) - (b.module_menu_priority || 0)
      );
    return { ...title, children };
  });

  // Flatten so frontend can iterate in one array
  return result.flatMap(group => [group, ...group.children]);
};
