(() => {
  const featured = ['quit-must', 'support-assistant', 'transaction-review'];
  const spotlightProjects = [
    { id: 'visual-inspection', style: 'inspection', image: 'assets/parcel-study.webp', label: 'Visual Inspection' },
    { id: 'quit-must', style: 'phone', image: 'https://play-lh.googleusercontent.com/tKOaq-XE76ozQPpB2eU3GChJCXBVQeTa9KE5VT6sEgC5EwyUJOPziXbk0JfEVLeNI25ixxugxeSacR6h1blP=w600-h1000', label: 'Quit Must' },
    { id: 'sukuk-capital', style: 'phone', image: 'https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b5/19/2a/b5192a5b-1ff7-803c-78a1-59efe08a2b94/66038ebf-d1dd-4f2e-b28a-d00ae812d82f_5_5_3.png/392x696bb.png', label: 'Sukuk Capital' },
    { id: 'dispatch-ops', style: 'dispatch', label: 'Dispatch Desk' },
  ];
  const categories = ['All', 'AI & Data', 'Mobile', 'Web', 'Backend', 'Design'];
  const stories = window.PORTFOLIO_STORIES || {};
  const projects = (window.PORTFOLIO_PROJECTS || []).map(project => ({
    ...project,
    story: stories[project.id] || { layout: 'gallery', color: '#b6d2ff', heading: 'Project overview', points: [] },
  })).sort((a, b) => priority(a) - priority(b));
  const byId = new Map(projects.map(project => [project.id, project]));
  const pageSize = 9;
  const categoriesWithPortraits = new Set(['sukuk-capital', 'entertainment', 'quit-must', 'bespokely']);
  const shapes = {
    Mobile: '<rect x="10" y="3" width="12" height="26" rx="3"/><path d="M13 7h6m-5 18h4"/>',
    Web: '<rect x="3" y="6" width="26" height="20" rx="2"/><path d="M3 12h26m-18 4h5m-5 4h10"/>',
    Backend: '<rect x="5" y="4" width="22" height="8" rx="2"/><rect x="5" y="20" width="22" height="8" rx="2"/><path d="M16 12v8M9 8h2m-2 16h2m4 0h8M15 8h8"/>',
    'AI & Data': '<path d="M5 5v22h22M9 21l6-7 5 4 7-9"/><circle cx="15" cy="14" r="1.5"/><circle cx="20" cy="18" r="1.5"/><circle cx="27" cy="9" r="1.5"/>',
    Design: '<rect x="4" y="4" width="24" height="24" rx="3"/><path d="M4 12h24M13 12v16"/>'
  };

  const grid = document.querySelector('#project-grid');
  const search = document.querySelector('#project-search');
  const filters = document.querySelector('#project-filters');
  const count = document.querySelector('#project-count');
  const more = document.querySelector('#show-more');
  const empty = document.querySelector('#project-empty');
  const dialog = document.querySelector('#project-dialog');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let category = 'All';
  let limit = pageSize;
  let lastTrigger = null;

  function hasCategory(project, name) {
    return project.category === name || (project.relatedCategories || []).includes(name);
  }

  function priority(project) {
    const position = featured.indexOf(project.id);
    if (position !== -1) return position;
    return featured.length + Number(!hasCategory(project, 'AI & Data'));
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function setTheme(node, project) {
    node.dataset.layout = project.story.layout;
    node.style.setProperty('--project-color', project.story.color);
  }

  function artwork(src, alt, eager = false) {
    const image = element('img');
    image.alt = alt;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.src = src;
    return image;
  }

  function makeMedia(project, expanded = false) {
    const tone = project.category === 'AI & Data' ? 'data' : project.category;
    const box = element('div', `media media--${tone}`);
    const fallback = () => {
      box.classList.remove('media--phone');
      box.setAttribute('aria-hidden', 'true');
      const illustration = element('div', 'project-illustration');
      illustration.innerHTML = `<svg class="media-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3">${shapes[project.category] || shapes.Design}</svg>`;
      const stages = element('div', 'illustration-stages');
      stages.append(...project.story.points.map(([label]) => element('span', '', label)));
      illustration.append(stages);
      box.replaceChildren(illustration);
    };
    if (!project.image) {
      fallback();
      return box;
    }
    if (categoriesWithPortraits.has(project.id)) box.classList.add('media--phone');
    if (expanded) box.classList.add('is-expanded');
    const img = artwork(project.image, project.alt, expanded);
    img.addEventListener('error', fallback, { once: true });
    box.append(img);
    return box;
  }

  function projectAction(project) {
    return {
      'Published app': 'View app',
      'Runnable demo': 'Explore demo',
      'Design prototype': 'View prototype',
      'Proposed concept': 'View concept',
      'Production case study': 'Read case study',
    }[project.status] || 'View project';
  }

  function externalLink(label, url, emphasis) {
    const link = element('a', `button ${emphasis ? 'button-primary' : 'button-quiet'}`, label);
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    return link;
  }

  function makeCard(project) {
    const card = element('article', 'card');
    setTheme(card, project);
    const content = element('div', 'card-content');
    const metadata = element('p', 'card-meta', `${project.category} · ${project.status}`);
    const heading = element('h3');
    const button = element('button', 'card-trigger', project.title);
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => openProject(project, button));
    heading.append(button);
    const prompt = element('span', 'card-action', projectAction(project));
    prompt.setAttribute('aria-hidden', 'true');
    content.append(metadata, heading, element('p', '', project.description), prompt);
    card.append(makeMedia(project), content);
    return card;
  }

  function makeSpotlightVisual(project, item) {
    const visual = element('div', 'spotlight-visual');
    if (item.image) {
      const offscreen = artwork(item.image, '', true);
      offscreen.className = item.style === 'inspection' ? 'spotlight-photo' : 'spotlight-secondary';
      offscreen.addEventListener('error', () => offscreen.remove(), { once: true });
      visual.append(offscreen);
    }
    const main = artwork(project.image, project.alt, true);
    main.className = 'spotlight-screen';
    main.addEventListener('error', () => main.replaceWith(makeMedia(project)), { once: true });
    visual.append(main);
    return visual;
  }

  function showSpotlight() {
    const section = document.querySelector('#project-spotlight');
    const options = document.querySelector('#spotlight-options');
    const panel = document.querySelector('#spotlight-panel');
    const items = spotlightProjects.filter(item => byId.has(item.id));
    if (!items.length) return;

    function select(item, button) {
      for (const option of options.children) option.setAttribute('aria-pressed', String(option === button));
      const project = byId.get(item.id);
      setTheme(panel, project);
      panel.dataset.visual = item.style;
      const copy = element('div', 'spotlight-copy');
      const meta = element('p', 'card-meta', project.status);
      const title = element('h3', '', project.title);
      const open = element('button', 'button button-primary', projectAction(project));
      open.type = 'button';
      open.setAttribute('aria-haspopup', 'dialog');
      open.addEventListener('click', () => openProject(project, open));
      const actions = element('div', 'spotlight-actions');
      const source = project.links.find(link => link.label === 'Source & setup');
      actions.append(open);
      if (source) actions.append(externalLink('View source', source.url, false));
      copy.append(meta, title, element('p', 'spotlight-description', project.description), actions);
      panel.replaceChildren(copy, makeSpotlightVisual(project, item));
    }

    items.forEach(item => {
      const button = element('button', 'spotlight-option', item.label);
      button.type = 'button';
      button.setAttribute('aria-controls', panel.id);
      button.addEventListener('click', () => select(item, button));
      options.append(button);
    });
    select(items[0], options.firstElementChild);
    section.hidden = false;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => section.classList.toggle('in-view', entry.isIntersecting)).observe(panel);
    }
  }

  function renderProjects(expand = false) {
    const query = search.value.trim().toLowerCase();
    const matching = projects.filter(project => {
      const text = [project.title, project.category, ...(project.relatedCategories || []), project.status, project.description, ...project.stack].join(' ').toLowerCase();
      return (category === 'All' || hasCategory(project, category)) && text.includes(query);
    });
    const previous = expand ? grid.children.length : 0;
    const visible = matching.slice(0, limit);
    const cards = visible.slice(previous).map((project, index) => {
      const card = makeCard(project);
      card.classList.add('catalog-enter');
      card.style.setProperty('--entry-delay', `${Math.min(index, 5) * 42}ms`);
      return card;
    });
    if (expand) grid.append(...cards);
    else grid.replaceChildren(...cards);
    const total = matching.length;
    count.textContent = total === 1 ? '1 project' : `${total} projects`;
    empty.hidden = total > 0;
    const remaining = total - visible.length;
    more.hidden = remaining === 0;
    if (remaining > 0) more.textContent = `Show ${Math.min(pageSize, remaining)} more projects`;
    if (expand) cards[0]?.querySelector('button').focus({ preventScroll: true });
  }

  function selectCategory(next, button) {
    category = next;
    limit = pageSize;
    for (const item of filters.children) item.setAttribute('aria-pressed', String(item === button));
    renderProjects();
  }

  function setProjectUrl(id) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set('project', id);
    else url.searchParams.delete('project');
    history.replaceState(null, '', url);
  }

  function openProject(project, trigger = null) {
    lastTrigger = trigger;
    setTheme(dialog, project);
    dialog.dataset.hasImage = String(Boolean(project.image));
    dialog.querySelector('#dialog-category').textContent = `${project.category} · ${project.status}`;
    dialog.querySelector('#dialog-title').textContent = project.title;
    dialog.querySelector('#dialog-description').textContent = project.description;
    dialog.querySelector('#dialog-detail').textContent = project.detail;
    dialog.querySelector('#dialog-media').replaceChildren(makeMedia(project, true));
    dialog.querySelector('#dialog-story-title').textContent = project.story.heading;
    const points = project.story.points.map(([label, detail]) => {
      const point = element('div', 'story-point');
      point.append(element('dt', '', label), element('dd', '', detail));
      return point;
    });
    dialog.querySelector('#dialog-points').replaceChildren(...points);
    dialog.querySelector('.dialog-story').hidden = !points.length;
    dialog.querySelector('#dialog-stack').replaceChildren(...project.stack.map(item => element('li', '', item)));
    const links = project.links.map(({ label, url }, index) => externalLink(label, url, index === 0));
    dialog.querySelector('#dialog-links').replaceChildren(...links);
    setProjectUrl(project.id);
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('dialog-open');
  }

  dialog.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const onBackdrop = event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom;
    if (onBackdrop) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    setProjectUrl(null);
    lastTrigger?.focus({ preventScroll: true });
    lastTrigger = null;
  });

  if (projects.length) {
    showSpotlight();
    for (const name of categories) {
      const button = element('button', 'filter', name);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(name === category));
      button.addEventListener('click', () => selectCategory(name, button));
      filters.append(button);
    }
    search.addEventListener('input', () => {
      limit = pageSize;
      renderProjects();
    });
    more.addEventListener('click', () => {
      limit += pageSize;
      renderProjects(true);
    });
    renderProjects();
    const linkedProject = byId.get(new URL(window.location.href).searchParams.get('project'));
    if (linkedProject) openProject(linkedProject);
  }

  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('pending');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12 });
    for (const target of document.querySelectorAll('.reveal')) {
      target.classList.add('pending');
      observer.observe(target);
    }
  }
})();
