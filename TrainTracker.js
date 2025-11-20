document.addEventListener('DOMContentLoaded', () => {
            /* =================== Utils & Theme =================== */
            const $ = (s, c = document) => c.querySelector(s);
            const $$ = (s, c = document) => [...c.querySelectorAll(s)];
            const uuid = () => ((typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') ? crypto.randomUUID() :
                'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16);
                })
            );

            const HTML_ESCAPE = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };

            function escapeHtml(str = '') {
                return str.replace(/[&<>"']/g, ch => HTML_ESCAPE[ch] || ch);
            }

            const THEME_KEY = 'trainingDiary.theme';
            const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);
            const themeBtn = $('#themeToggle');
            updateThemeButton(savedTheme);
            themeBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', next);
                localStorage.setItem(THEME_KEY, next);
                updateThemeButton(next);
                // Update colors for new theme
                updateThemeColors(next);
            });
            function updateThemeButton(theme) {
                themeBtn.setAttribute('aria-pressed', theme === 'light');
                themeBtn.textContent = theme === 'light' ? '☀️ Claro' : '🌙 Oscuro';
            }

            /* =================== Color Customization System =================== */
            const COLOR_STORAGE_KEY = 'trainingDiary.colors';

            // Color definitions: [primary, primary-600, accent, accent-600]
            const COLOR_PRESETS = {
                azul: {
                    dark: { primary: '#5ea9ff', primary600: '#0080e9', accent: '#5ea9ff', accent600: '#0080e9' },
                    light: { primary: '#5ea9ff', primary600: '#0080e9', accent: '#5ea9ff', accent600: '#0080e9' }
                },
                rojo: {
                    dark: { primary: '#ff6b6b', primary600: '#ff3b30', accent: '#ff6b6b', accent600: '#ff3b30' },
                    light: { primary: '#ff6b6b', primary600: '#ff3b30', accent: '#ff6b6b', accent600: '#ff3b30' }
                },
                verde: {
                    dark: { primary: '#34c759', primary600: '#248a3d', accent: '#34c759', accent600: '#248a3d' },
                    light: { primary: '#34c759', primary600: '#248a3d', accent: '#34c759', accent600: '#248a3d' }
                },
                amarillo: {
                    dark: { primary: '#FFE100', primary600: '#FFF757', accent: '#FFE100', accent600: '#FFF757' },
                    light: { primary: '#ffcc00', primary600: '#ff9500', accent: '#ffcc00', accent600: '#ff9500' }
                },
                morado: {
                    dark: { primary: '#A24AFF', primary600: '#5800FA', accent: '#A24AFF', accent600: '#5800FA' },
                    light: { primary: '#A24AFF', primary600: '#5800FA', accent: '#A24AFF', accent600: '#5800FA' }
                },
                rosa: {
                    dark: { primary: '#f783ac', primary600: '#f06292', accent: '#f783ac', accent600: '#f06292' },
                    light: { primary: '#ff2d55', primary600: '#d81b60', accent: '#ff2d55', accent600: '#d81b60' }
                },
                naranja: {
                    dark: { primary: '#ff9500', primary600: '#ff6b00', accent: '#ff9500', accent600: '#ff6b00' },
                    light: { primary: '#ff9500', primary600: '#ff6b00', accent: '#ff9500', accent600: '#ff6b00' }
                },
                cian: {
                    dark:  { primary: '#3bc9db', primary600: '#007aff', accent: '#3bc9db', accent600: '#007aff' },
                    light: { primary: '#3bc9db', primary600: '#007aff', accent: '#3bc9db', accent600: '#007aff' }
                },
                gris: {
                    dark: { primary: '#adb5bd', primary600: '#868e96', accent: '#adb5bd', accent600: '#868e96' },
                    light: { primary: '#8e8e93', primary600: '#636366', accent: '#8e8e93', accent600: '#636366' }
                }
            };

            // Color display names
            const COLOR_NAMES = {
                azul: 'Azul',
                rojo: 'Rojo',
                verde: 'Verde',
                amarillo: 'Amarillo',
                morado: 'Morado',
                rosa: 'Rosa',
                naranja: 'Naranja',
                cian: 'Cian',
                gris: 'Gris'
            };

            // Load saved colors or use defaults
            function loadColorPreferences() {
                try {
                    const saved = localStorage.getItem(COLOR_STORAGE_KEY);
                    if (saved) {
                        return JSON.parse(saved);
                    }
                } catch (e) {
                    console.warn('Error loading color preferences:', e);
                }
                return { dark: 'azul', light: 'azul' };
            }

            // Save color preferences
            function saveColorPreferences(prefs) {
                try {
                    localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(prefs));
                } catch (e) {
                    console.warn('Error saving color preferences:', e);
                }
            }

            // Update CSS variables for current theme
            function updateThemeColors(theme) {
                const prefs = loadColorPreferences();
                const colorKey = prefs[theme] || 'azul';
                const colors = COLOR_PRESETS[colorKey][theme];

                const root = document.documentElement;
                root.style.setProperty('--primary', colors.primary);
                root.style.setProperty('--primary-600', colors.primary600);
                root.style.setProperty('--accent', colors.accent);
                root.style.setProperty('--accent-600', colors.accent600);

                // Update focus colors based on primary
                const primaryRgb = hexToRgb(colors.primary);
                if (primaryRgb) {
                    root.style.setProperty('--focus', `0 0 0 3px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`);
                    root.style.setProperty('--focus-keyboard', `0 0 0 2px ${colors.primary}, 0 0 12px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`);
                    root.style.setProperty('--primary-glow', `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`);
                }
            }

            // Convert hex to RGB
            function hexToRgb(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            }

            // Set color for a specific theme
            function setThemeColor(theme, colorKey) {
                const prefs = loadColorPreferences();
                prefs[theme] = colorKey;
                saveColorPreferences(prefs);

                // Update if this is the current theme
                const currentTheme = document.documentElement.getAttribute('data-theme');
                if (currentTheme === theme) {
                    updateThemeColors(theme);
                }

                // Update swatches
                renderColorSwatches();
            }

            // Render color swatches
            function renderColorSwatches() {
                const prefs = loadColorPreferences();
                const darkSwatches = $('#colorSwatchesDark');
                const lightSwatches = $('#colorSwatchesLight');

                if (!darkSwatches || !lightSwatches) return;

                darkSwatches.innerHTML = '';
                lightSwatches.innerHTML = '';

                Object.keys(COLOR_PRESETS).forEach(colorKey => {
                    const colors = COLOR_PRESETS[colorKey];

                    // Dark theme swatch
                    const darkSwatch = document.createElement('button');
                    darkSwatch.className = 'color-swatch';
                    darkSwatch.setAttribute('aria-label', `Color ${COLOR_NAMES[colorKey]} para modo oscuro`);
                    darkSwatch.style.setProperty('--swatch-color', colors.dark.primary);
                    darkSwatch.dataset.colorKey = colorKey;
                    darkSwatch.dataset.theme = 'dark';
                    if (prefs.dark === colorKey) {
                        darkSwatch.classList.add('active');
                    }
                    darkSwatch.addEventListener('click', () => setThemeColor('dark', colorKey));
                    darkSwatches.appendChild(darkSwatch);

                    // Light theme swatch
                    const lightSwatch = document.createElement('button');
                    lightSwatch.className = 'color-swatch';
                    lightSwatch.setAttribute('aria-label', `Color ${COLOR_NAMES[colorKey]} para modo claro`);
                    lightSwatch.style.setProperty('--swatch-color', colors.light.primary);
                    lightSwatch.dataset.colorKey = colorKey;
                    lightSwatch.dataset.theme = 'light';
                    if (prefs.light === colorKey) {
                        lightSwatch.classList.add('active');
                    }
                    lightSwatch.addEventListener('click', () => setThemeColor('light', colorKey));
                    lightSwatches.appendChild(lightSwatch);
                });
            }

            // Initialize colors on load
            const currentTheme = document.documentElement.getAttribute('data-theme');
            updateThemeColors(currentTheme);

            // Colors are now updated directly in the theme toggle handler above

            // Render swatches when profile panel is shown
            function initColorPicker() {
                const profilePanel = $('#panel-profile');
                if (profilePanel && profilePanel.getAttribute('aria-hidden') === 'false') {
                    renderColorSwatches();
                }
            }

            // Render on tab change
            const profileTab = $('#tab-profile');
            if (profileTab) {
                profileTab.addEventListener('click', () => {
                    setTimeout(renderColorSwatches, 150);
                });
            }

            // Make renderColorSwatches available globally for renderProfile
            window.renderColorSwatches = renderColorSwatches;

            /* Parallax suave */
            window.addEventListener('scroll', () => {
                document.documentElement.style.setProperty('--grad-pos', String(window.scrollY));
            }, { passive: true });

            /* =================== Estado =================== */
            const STORAGE_KEY = 'trainingDiary.v8';
            const app = {
                sessions: [],
                routines: [],
                profile: createDefaultProfile(),
                notes: [],
                weekOffset: 0,
                currentSessionId: null,
                chartState: { metric: 'volume', exercise: 'all', period: 4 },
                tmpTemplateKey: null,
                importBuffer: null,
                deleteTarget: { type: null, id: null, sessionId: null, exId: null, setId: null, routineId: null, goalId: null },
                routineEditId: null,
                statsPeriod: 'lastWeek', // Nuevo: período de comparación para estadísticas
                goals: [], // Sistema de objetivos
                recentAchievements: [], // Logros recientes para celebración
                // Manual save system
                editingSessions: {}, // { sessionId: { isEditing: bool, hasChanges: bool, originalState: {} } }
                sessionSnapshots: {} // Backup copies for cancel
            };

            const templates = {
                '5day': [
                    { name: 'Día 1 - Torso (Push)', ex: ['Press banca', 'Press inclinado mancuernas', 'Fondos en paralelas', 'Extensiones tríceps'] },
                    { name: 'Día 2 - Pierna', ex: ['Sentadilla con barra', 'Prensa de piernas', 'Zancadas', 'Curl femoral tumbado'] },
                    { name: 'Día 3 - Torso (Pull)', ex: ['Dominadas', 'Remo con barra', 'Remo en máquina', 'Curl bíceps con barra'] },
                    { name: 'Día 4 - Torso (Upper)', ex: ['Press militar', 'Press banca', 'Remo con barra', 'Elevaciones laterales'] },
                    { name: 'Día 5 - Pierna', ex: ['Peso muerto rumano', 'Sentadilla búlgara', 'Gémeos', 'Elevación de talones'] },
                ],
                '3day': [
                    { name: 'Día 1 - Full Body A', ex: ['Sentadilla con barra', 'Press banca', 'Remo con barra', 'Press militar', 'Curl bíceps'] },
                    { name: 'Día 2 - Full Body B', ex: ['Peso muerto', 'Press inclinado', 'Dominadas', 'Zancadas', 'Extensiones tríceps'] },
                    { name: 'Día 3 - Full Body C', ex: ['Prensa de piernas', 'Fondos en paralelas', 'Remo en máquina', 'Elevaciones laterales', 'Curl femoral'] },
                ],
                '4day': [
                    { name: 'Día 1 - Upper', ex: ['Press banca', 'Press inclinado', 'Remo con barra', 'Dominadas', 'Press militar'] },
                    { name: 'Día 2 - Lower', ex: ['Sentadilla con barra', 'Peso muerto rumano', 'Prensa de piernas', 'Zancadas', 'Gémeos'] },
                    { name: 'Día 3 - Upper', ex: ['Press banca', 'Fondos en paralelas', 'Remo mancuernas', 'Jalón al pecho', 'Curl bíceps'] },
                    { name: 'Día 4 - Lower', ex: ['Sentadilla frontal', 'Peso muerto', 'Curl femoral', 'Elevación de talones', 'Abducciones'] },
                ],
                'ppl': [
                    { name: 'Día 1 - Push', ex: ['Press banca', 'Press inclinado', 'Press militar', 'Fondos en paralelas', 'Extensiones tríceps'] },
                    { name: 'Día 2 - Pull', ex: ['Dominadas', 'Remo con barra', 'Jalón al pecho', 'Remo en máquina', 'Curl bíceps'] },
                    { name: 'Día 3 - Legs', ex: ['Sentadilla con barra', 'Peso muerto rumano', 'Prensa de piernas', 'Zancadas', 'Gémeos'] },
                    { name: 'Día 4 - Push', ex: ['Press banca', 'Press inclinado mancuernas', 'Press militar mancuernas', 'Aperturas', 'Elevaciones laterales'] },
                    { name: 'Día 5 - Pull', ex: ['Dominadas', 'Remo mancuernas', 'Face pulls', 'Curl martillo', 'Curl concentrado'] },
                    { name: 'Día 6 - Legs', ex: ['Sentadilla frontal', 'Peso muerto', 'Curl femoral', 'Elevación de talones', 'Abdominales'] },
                ],
            };

            const templateLabels = {
                '5day': 'Rutina 5 días',
                '3day': 'Rutina 3 días',
                '4day': 'Rutina 4 días',
                'ppl': 'Rutina PPL 6 días'
            };

            const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" rx="100" fill="%231e293b"/><text x="50%" y="55%" font-size="64" text-anchor="middle" dominant-baseline="middle">👤</text></svg>';

            // Generate DiceBear avatar URL
            function generateAvatarUrl(style, seed) {
                // Map style names to DiceBear API style names
                const styleMap = {
                    'avataaars': 'avataaars',
                    'pixel-art': 'pixel-art',
                    'adventurer': 'adventurer',
                    'big-smile': 'big-smile',
                    'bottts': 'bottts',
                    'fun-emoji': 'fun-emoji',
                    'icons': 'icons',
                    'identicon': 'identicon',
                    'lorelei': 'lorelei',
                    'micah': 'micah',
                    'miniavs': 'miniavs',
                    'notionists': 'notionists',
                    'open-peeps': 'open-peeps',
                    'personas': 'personas',
                    'rings': 'rings',
                    'shapes': 'shapes',
                    'thumbs': 'thumbs'
                };
                
                const apiStyle = styleMap[style] || 'avataaars';
                const avatarSeed = seed || Math.random().toString(36).substring(2, 15);
                return `https://api.dicebear.com/9.x/${apiStyle}/svg?seed=${encodeURIComponent(avatarSeed)}`;
            }

            // Get current avatar (photo or generated)
            function getCurrentAvatar() {
                if (app.profile.photo) {
                    return app.profile.photo;
                }
                const seed = app.profile.avatarSeed || (app.profile.firstName + ' ' + app.profile.lastName).trim() || 'default';
                const style = app.profile.avatarStyle || 'avataaars';
                return generateAvatarUrl(style, seed);
            }

            function createDefaultProfile() {
                return {
                    photo: '',
                    avatarStyle: 'avataaars',
                    avatarSeed: '',
                    firstName: '',
                    lastName: '',
                    height: '',
                    weight: '',
                    bodyFat: '',
                    weightHistory: [],
                    bodyMeasurementsHistory: [],
                };
            }

            function updateRoutineDayTitles() {
                const days = $$('#routineDays .routine-day');
                days.forEach((day, idx) => {
                    const title = day.querySelector('.routine-day__title');
                    if (title) title.textContent = `Día ${idx + 1}`;
                });
            }

            function updateRoutineSetIndexes(exEl) {
                if (!exEl) return;
                const sets = exEl.querySelectorAll('.routine-set');
                sets.forEach((set, idx) => {
                    const label = set.querySelector('.routine-set__index');
                    if (label) label.textContent = `Set ${idx + 1}`;
                });
            }

            function addRoutineDay(data = {}) {
                const container = $('#routineDays');
                if (!container) return;
                const tpl = $('#tpl-routine-day');
                if (!tpl) return;
                const node = tpl.content.firstElementChild.cloneNode(true);
                node.dataset.dayId = data.id || uuid();
                const nameInput = node.querySelector('.routine-day__name');
                if (nameInput) nameInput.value = data.name || '';
                const exercisesContainer = node.querySelector('.routine-exercises');
                (data.exercises || []).forEach(ex => addRoutineExercise(node, ex));
                container.appendChild(node);
                updateRoutineDayTitles();
            }

            function addRoutineExercise(dayEl, data = {}) {
                if (!dayEl) return;
                const tpl = $('#tpl-routine-exercise');
                if (!tpl) return;
                const node = tpl.content.firstElementChild.cloneNode(true);
                node.dataset.exId = data.id || uuid();
                const nameInput = node.querySelector('.routine-exercise__name');
                if (nameInput) nameInput.value = data.name || '';
                const setsContainer = node.querySelector('.routine-sets');
                const sets = (data.sets && data.sets.length) ? data.sets : [{ id: uuid(), planKg: '', planReps: '', planRir: '' }];
                sets.forEach(set => addRoutineSet(node, set));
                const exercisesContainer = dayEl.querySelector('.routine-exercises');
                if (exercisesContainer) exercisesContainer.appendChild(node);
            }

            function addRoutineSet(exEl, data = {}) {
                if (!exEl) return;
                const tpl = $('#tpl-routine-set');
                if (!tpl) return;
                const node = tpl.content.firstElementChild.cloneNode(true);
                node.dataset.setId = data.id || uuid();
                const kgInput = node.querySelector('.routine-set__kg');
                const repsInput = node.querySelector('.routine-set__reps');
                const rirInput = node.querySelector('.routine-set__rir');
                const planKg = data.planKg !== undefined ? data.planKg : (data.kg || '');
                const planReps = data.planReps !== undefined ? data.planReps : (data.reps || '');
                const planRir = data.planRir !== undefined ? data.planRir : (data.rir || '');
                if (kgInput) {
                    kgInput.value = planKg;
                    kgInput.placeholder = 'Opcional';
                }
                if (repsInput) {
                    repsInput.value = planReps;
                    repsInput.placeholder = 'Opcional';
                }
                if (rirInput) {
                    rirInput.value = planRir;
                    rirInput.placeholder = 'Opcional';
                }
                const setsContainer = exEl.querySelector('.routine-sets');
                if (setsContainer) setsContainer.appendChild(node);
                updateRoutineSetIndexes(exEl);
            }

            function resetRoutineBuilder() {
                const routineNameInput = $('#routineName');
                if (routineNameInput) routineNameInput.value = '';
                const container = $('#routineDays');
                if (container) container.innerHTML = '';
                app.routineEditId = null;
                updateRoutineDayTitles();
            }

            function loadRoutineIntoBuilder(routine) {
                if (!routine) return;
                resetRoutineBuilder();
                const routineNameInput = $('#routineName');
                if (routineNameInput) routineNameInput.value = routine.name || '';
                (routine.days || []).forEach(day => addRoutineDay({
                    id: day.id || uuid(),
                    name: day.name || '',
                    exercises: (day.exercises || []).map(ex => ({
                        id: ex.id || uuid(),
                        name: ex.name || '',
                        sets: (ex.sets || []).map(set => ({
                            id: set.id || uuid(),
                            kg: set.kg || '',
                            reps: set.reps || '',
                            rir: set.rir || ''
                        }))
                    }))
                }));
                app.routineEditId = routine.id || null;
            }

            function renderDefaultRoutines() {
                const list = $('#defaultRoutineList');
                if (!list) return;
                list.innerHTML = '';
                Object.entries(templates).forEach(([key, days]) => {
                    const item = document.createElement('div');
                    item.className = 'routine-default__item';

                    const head = document.createElement('div');
                    head.className = 'routine-default__head';

                    const info = document.createElement('div');
                    const title = document.createElement('strong');
                    title.textContent = templateLabels[key] || `Rutina ${key}`;
                    info.appendChild(title);
                    const meta = document.createElement('div');
                    meta.className = 'routine-default__meta';
                    const totalExercises = days.reduce((sum, day) => {
                        const count = Array.isArray(day.ex) ? day.ex.length : 0;
                        return sum + count;
                    }, 0);
                    meta.textContent = `${days.length} días · ${totalExercises} ejercicios`;
                    info.appendChild(meta);

                    head.appendChild(info);

                    const useBtn = document.createElement('button');
                    useBtn.className = 'btn btn--small btn--ghost js-use-template';
                    useBtn.dataset.template = key;
                    useBtn.textContent = 'Usar plantilla';
                    head.appendChild(useBtn);

                    item.appendChild(head);

                    const body = document.createElement('div');
                    body.className = 'routine-created__body';
                    days.forEach((day, idx) => {
                        const dayEl = document.createElement('div');
                        dayEl.className = 'routine-created__day';
                        const dayTitle = document.createElement('div');
                        dayTitle.className = 'routine-created__day-title';
                        dayTitle.textContent = `${idx + 1}. ${day.name}`;
                        dayEl.appendChild(dayTitle);
                        const exercises = document.createElement('div');
                        exercises.className = 'routine-default__meta';
                        const exerciseList = Array.isArray(day.ex) ? day.ex.join(', ') : '';
                        exercises.textContent = exerciseList;
                        dayEl.appendChild(exercises);
                        body.appendChild(dayEl);
                    });
                    item.appendChild(body);

                    list.appendChild(item);
                });
            }

            function renderCreatedRoutines() {
                const list = $('#createdRoutineList');
                const empty = $('#noCreatedRoutines');
                if (!list || !empty) return;
                list.innerHTML = '';
                if (!app.routines.length) {
                    empty.hidden = false;
                    return;
                }
                empty.hidden = true;

                app.routines.forEach(routine => {
                    const item = document.createElement('div');
                    item.className = 'routine-created__item';
                    item.dataset.routineId = routine.id;

                    const head = document.createElement('div');
                    head.className = 'routine-created__head';

                    const info = document.createElement('div');
                    const title = document.createElement('strong');
                    title.textContent = routine.name;
                    info.appendChild(title);
                    const meta = document.createElement('div');
                    meta.className = 'routine-created__meta';
                    const totalExercises = (routine.days || []).reduce((sum, day) => sum + (day.exercises ? day.exercises.length : 0), 0);
                    meta.textContent = `${(routine.days || []).length} días · ${totalExercises} ejercicios`;
                    info.appendChild(meta);
                    head.appendChild(info);

                    const actions = document.createElement('div');
                    actions.style.display = 'flex';
                    actions.style.flexWrap = 'wrap';
                    actions.style.gap = '6px';

                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'btn btn--small btn--ghost js-toggle-routine';
                    toggleBtn.textContent = 'Ver';
                    actions.appendChild(toggleBtn);

                    const editBtn = document.createElement('button');
                    editBtn.className = 'btn btn--small btn--ghost js-edit-routine';
                    editBtn.textContent = 'Editar';
                    actions.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'btn btn--small btn--ghost js-delete-routine';
                    deleteBtn.textContent = '✕';
                    actions.appendChild(deleteBtn);

                    head.appendChild(actions);
                    item.appendChild(head);

                    const body = document.createElement('div');
                    body.className = 'routine-created__body';
                    body.hidden = true;
                    (routine.days || []).forEach((day, idx) => {
                        const dayEl = document.createElement('div');
                        dayEl.className = 'routine-created__day';
                        const dayTitle = document.createElement('div');
                        dayTitle.className = 'routine-created__day-title';
                        dayTitle.textContent = `${idx + 1}. ${day.name}`;
                        dayEl.appendChild(dayTitle);
                        (day.exercises || []).forEach(ex => {
                            const exLine = document.createElement('div');
                            exLine.className = 'routine-default__meta';
                            const setsLabel = (ex.sets || []).length === 1 ? 'set' : 'sets';
                            exLine.textContent = `${ex.name} · ${(ex.sets || []).length} ${setsLabel}`;
                            dayEl.appendChild(exLine);
                        });
                        body.appendChild(dayEl);
                    });
                    item.appendChild(body);

                    list.appendChild(item);
                });
            }

            function renderImportRoutineList() {
                const list = $('#importRoutineList');
                const empty = $('#importRoutineEmpty');
                if (!list || !empty) return;
                list.innerHTML = '';
                if (!app.routines.length) {
                    empty.hidden = false;
                    return;
                }
                empty.hidden = true;

                app.routines.forEach(routine => {
                    const item = document.createElement('div');
                    item.className = 'routine-import__item';

                    const head = document.createElement('div');
                    head.className = 'routine-import__head';

                    const info = document.createElement('div');
                    const title = document.createElement('strong');
                    title.textContent = routine.name || 'Rutina sin nombre';
                    info.appendChild(title);
                    const meta = document.createElement('div');
                    meta.className = 'routine-created__meta';
                    const totalExercises = (routine.days || []).reduce((sum, day) => sum + (day.exercises ? day.exercises.length : 0), 0);
                    meta.textContent = `${(routine.days || []).length} días · ${totalExercises} ejercicios`;
                    info.appendChild(meta);
                    head.appendChild(info);

                    const importBtn = document.createElement('button');
                    importBtn.className = 'btn btn--secondary btn--small js-import-user-routine';
                    importBtn.dataset.routineId = routine.id;
                    importBtn.textContent = 'Importar en semana visible';
                    head.appendChild(importBtn);

                    item.appendChild(head);

                    const detail = document.createElement('div');
                    detail.className = 'routine-default__meta';
                    const dayNames = (routine.days || []).map((day, idx) => `${idx + 1}. ${day.name || 'Sin nombre'}`);
                    detail.textContent = dayNames.length ? dayNames.join(' · ') : 'Sin días definidos';
                    item.appendChild(detail);

                    list.appendChild(item);
                });
            }

            function renderRoutines() {
                renderDefaultRoutines();
                renderCreatedRoutines();
                renderImportRoutineList();
                updateRoutineDayTitles();
            }

            function loadTemplateIntoBuilder(key) {
                if (!key) return;
                const preset = templates[key];
                if (!preset) return;
                resetRoutineBuilder();
                const routineNameInput = $('#routineName');
                if (routineNameInput) {
                    routineNameInput.value = templateLabels[key] || `Rutina ${key}`;
                    routineNameInput.focus();
                }
                preset.forEach(day => addRoutineDay({
                    id: uuid(),
                    name: day.name,
                    exercises: (day.ex || []).map(exName => ({
                        id: uuid(),
                        name: exName,
                        sets: [{ id: uuid(), kg: '', reps: '', rir: '' }]
                    }))
                }));
                app.routineEditId = null;
                updateRoutineDayTitles();
            }

            function collectRoutineFromBuilder() {
                const nameInput = $('#routineName');
                const routineName = nameInput ? nameInput.value.trim() : '';
                if (!routineName) {
                    toast('Añade un nombre para la rutina', 'warn');
                    if (nameInput) nameInput.focus();
                    return null;
                }
                const dayElements = $$('#routineDays .routine-day');
                if (!dayElements.length) {
                    toast('Añade al menos un día a la rutina', 'warn');
                    return null;
                }
                const days = [];
                for (const dayEl of dayElements) {
                    const dayNameInput = dayEl.querySelector('.routine-day__name');
                    const dayName = dayNameInput ? dayNameInput.value.trim() : '';
                    if (!dayName) {
                        toast('Cada día necesita un nombre', 'warn');
                        if (dayNameInput) dayNameInput.focus();
                        return null;
                    }
                    const exElements = [...dayEl.querySelectorAll('.routine-exercise')];
                    if (!exElements.length) {
                        toast(`Añade ejercicios para ${dayName}`, 'warn');
                        if (dayNameInput) dayNameInput.focus();
                        return null;
                    }
                    const exercises = [];
                    for (const exEl of exElements) {
                        const exNameInput = exEl.querySelector('.routine-exercise__name');
                        const exName = exNameInput ? exNameInput.value.trim() : '';
                        if (!exName) {
                            toast('Cada ejercicio necesita un nombre', 'warn');
                            if (exNameInput) exNameInput.focus();
                            return null;
                        }
                        const setElements = [...exEl.querySelectorAll('.routine-set')];
                        // Sets are optional during routine creation - they can be filled later when logging the workout
                        const sets = [];
                        for (let i = 0; i < setElements.length; i++) {
                            const setEl = setElements[i];
                            const kgInput = setEl.querySelector('.routine-set__kg');
                            const repsInput = setEl.querySelector('.routine-set__reps');
                            const rirInput = setEl.querySelector('.routine-set__rir');
                            const kg = kgInput ? kgInput.value.trim() : '';
                            const reps = repsInput ? repsInput.value.trim() : '';
                            const rir = rirInput ? rirInput.value.trim() : '';
                            // Allow empty sets during routine creation
                            sets.push({
                                id: setEl.dataset.setId || uuid(),
                                kg: kg || '',
                                reps: reps || '',
                                rir: rir || ''
                            });
                        }
                        // If no sets exist, create one empty set as placeholder
                        if (sets.length === 0) {
                            sets.push({
                                id: uuid(),
                                kg: '',
                                reps: '',
                                rir: ''
                            });
                        }
                        exercises.push({
                            id: exEl.dataset.exId || uuid(),
                            name: exName,
                            sets
                        });
                    }
                    days.push({
                        id: dayEl.dataset.dayId || uuid(),
                        name: dayName,
                        exercises
                    });
                }
                return { name: routineName, days };
            }

            function handleSaveRoutine(ev) {
                if (ev) ev.preventDefault();
                const data = collectRoutineFromBuilder();
                if (!data) return;
                if (app.routineEditId) {
                    const target = app.routines.find(r => r.id === app.routineEditId);
                    if (target) {
                        target.name = data.name;
                        target.days = data.days;
                        toast('Rutina actualizada', 'ok');
                    }
                } else {
                    app.routines.push({
                        id: uuid(),
                        createdAt: new Date().toISOString(),
                        ...data
                    });
                    toast('Rutina creada', 'ok');
                }
                app.routineEditId = null;
                save();
                renderRoutines();
                resetRoutineBuilder();
            }

            /* =================== Persistencia =================== */
            function save() {
                const payload = {
                    sessions: app.sessions,
                    routines: app.routines,
                    profile: app.profile,
                    notes: app.notes,
                    prs: app.prs || {},
                    onerm: app.onerm || {},
                    exerciseNotes: app.exerciseNotes || {},
                    achievements: app.achievements || [],
                    streak: app.streak || { current: 0, lastDate: null },
                    weeklyGoal: app.weeklyGoal || { target: 3, current: 0 },
                    statsPeriod: app.statsPeriod || 'lastWeek', // Guardar el período de estadísticas
                    goals: app.goals || [],
                    recentAchievements: app.recentAchievements || []
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            }
            function load() {
                try {
                    const raw = localStorage.getItem(STORAGE_KEY);
                    if (!raw) {
                        app.sessions = [];
                        app.routines = [];
                        app.profile = createDefaultProfile();
                        app.notes = [];
                        app.prs = {};
                        app.onerm = {};
                        app.exerciseNotes = {};
                        app.achievements = [];
                        app.streak = { current: 0, lastDate: null };
                        app.weeklyGoal = { target: 3, current: 0 };
                        app.statsPeriod = 'lastWeek';
                        return;
                    }
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        app.sessions = parsed;
                        app.routines = [];
                        app.profile = createDefaultProfile();
                        app.notes = [];
                        app.prs = {};
                        app.onerm = {};
                        app.exerciseNotes = {};
                        app.achievements = [];
                        app.streak = { current: 0, lastDate: null };
                        app.weeklyGoal = { target: 3, current: 0 };
                        app.statsPeriod = 'lastWeek';
                    } else {
                        app.sessions = Array.isArray(parsed.sessions) ? parsed.sessions : [];
                        app.routines = Array.isArray(parsed.routines) ? parsed.routines : [];
                        const baseProfile = createDefaultProfile();
                        const storedProfile = (parsed.profile && typeof parsed.profile === 'object') ? parsed.profile : {};
                        app.profile = {
                            ...baseProfile,
                            ...storedProfile
                        };
                        // Ensure new avatar fields exist
                        if (!app.profile.avatarStyle) {
                            app.profile.avatarStyle = 'avataaars';
                        }
                        if (!app.profile.avatarSeed) {
                            app.profile.avatarSeed = '';
                        }
                        if (!Array.isArray(app.profile.weightHistory)) {
                            app.profile.weightHistory = [];
                        }
                        if (!Array.isArray(app.profile.bodyMeasurementsHistory)) {
                            app.profile.bodyMeasurementsHistory = [];
                        }
                        app.notes = Array.isArray(parsed.notes) ? parsed.notes : [];
                        app.prs = (parsed.prs && typeof parsed.prs === 'object') ? parsed.prs : {};
                        app.onerm = (parsed.onerm && typeof parsed.onerm === 'object') ? parsed.onerm : {};
                        app.exerciseNotes = (parsed.exerciseNotes && typeof parsed.exerciseNotes === 'object') ? parsed.exerciseNotes : {};
                        app.achievements = Array.isArray(parsed.achievements) ? parsed.achievements : [];
                    app.streak = (parsed.streak && typeof parsed.streak === 'object') ? parsed.streak : { current: 0, lastDate: null };
                    app.weeklyGoal = (parsed.weeklyGoal && typeof parsed.weeklyGoal === 'object') ? parsed.weeklyGoal : { target: 3, current: 0 };
                    app.statsPeriod = parsed.statsPeriod || 'lastWeek';
                    app.goals = Array.isArray(parsed.goals) ? parsed.goals : [];
                    app.recentAchievements = Array.isArray(parsed.recentAchievements) ? parsed.recentAchievements : [];
                    }
                } catch {
                    app.sessions = [];
                    app.routines = [];
                    app.profile = createDefaultProfile();
                    app.notes = [];
                    app.prs = {};
                    app.onerm = {};
                    app.exerciseNotes = {};
                    app.achievements = [];
                    app.streak = { current: 0, lastDate: null };
                    app.weeklyGoal = { target: 3, current: 0 };
                    app.statsPeriod = 'lastWeek';
                }
            }

            /* =================== Fechas =================== */
            function startOfWeek(d = new Date()) {
                // Lunes = 1
                const x = new Date(d);
                let day = x.getDay(); if (day === 0) day = 7;
                x.setHours(0, 0, 0, 0);
                x.setDate(x.getDate() - (day - 1));
                return x;
            }
            function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

            /* Devuelve YYYY-MM-DD usando calendario local (sin toISOString) */
            function toLocalISO(d) {
                const x = new Date(d);
                const y = x.getFullYear();
                const m = String(x.getMonth() + 1).padStart(2, '0');
                const dd = String(x.getDate()).padStart(2, '0');
                return `${y}-${m}-${dd}`;
            }

            /* Parsea 'YYYY-MM-DD' como fecha LOCAL (mediodía para evitar bordes TZ) */
            function parseLocalDate(s) {
                const [y, m, d] = s.split('-').map(Number);
                return new Date(y, m - 1, d, 12, 0, 0, 0);
            }

            function getVisibleWeek() {
                const ws = addDays(startOfWeek(), app.weekOffset * 7);
                const we = addDays(ws, 6);
                we.setHours(23, 59, 59, 999);
                return { ws, we };
            }

            /* =================== Tabs & Nav =================== */
            // Prevent navigation if there are unsaved changes
            window.addEventListener('beforeunload', (e) => {
                if (hasUnsavedChanges()) {
                    e.preventDefault();
                    e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?';
                    return e.returnValue;
                }
            });

            function setupTabs() {
                const tabs = $$('.tab-btn');
                const panels = $$('.panel');
                const panelToNav = {
                    'panel-diary': 'navDiary',
                    'panel-stats': 'navStats',
                    'panel-import': 'navImport',
                    'panel-routines': null,
                    'panel-profile': null,
                    'panel-goals': null
                };

                function updateNav(panelId) {
                    const activeNav = panelToNav[panelId] || null;
                    ['navDiary', 'navStats', 'navImport'].forEach(id => {
                        const btn = document.getElementById(id);
                        if (btn) {
                            btn.setAttribute('aria-current', id === activeNav ? 'page' : 'false');
                        }
                    });
                }

                function select(panelId) {
                    // Check for unsaved changes before switching tabs
                    if (hasUnsavedChanges()) {
                        const editingIds = getEditingSessionIds();
                        if (editingIds.length > 0) {
                            toast('Guarda o cancela los cambios antes de cambiar de pestaña', 'warn');
                            return;
                        }
                    }
                    
                    tabs.forEach(btn => {
                        const controls = btn.getAttribute('aria-controls');
                        btn.setAttribute('aria-selected', controls === panelId ? 'true' : 'false');
                    });
                    panels.forEach(panel => {
                        panel.setAttribute('aria-hidden', panel.id === panelId ? 'false' : 'true');
                    });
                    updateNav(panelId);
                    if (panelId === 'panel-diary') { renderSessions(); }
                    if (panelId === 'panel-stats') { buildStats(); buildChartState(); drawChart(); }
                    if (panelId === 'panel-import') { initWeekSelector(); }
                    if (panelId === 'panel-routines') { renderRoutines(); }
                    if (panelId === 'panel-profile') { renderProfile(); }
                    if (panelId === 'panel-goals') { renderGoals(); renderRecentAchievements(); }
                }

                tabs.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const target = btn.getAttribute('aria-controls');
                        if (target) select(target);
                    });
                });

                const navBindings = {
                    navDiary: 'panel-diary',
                    navStats: 'panel-stats',
                    navImport: 'panel-import'
                };
                Object.keys(navBindings).forEach(navId => {
                    const btn = document.getElementById(navId);
                    if (btn) {
                        btn.addEventListener('click', () => select(navBindings[navId]));
                    }
                });

                select('panel-diary');
            }

            /* =================== Semana UI =================== */
            function renderWeekbar() {
                const ws = addDays(startOfWeek(), app.weekOffset * 7);
                const we = addDays(ws, 6);
                const label = (app.weekOffset === 0) ? 'Semana actual'
                    : (app.weekOffset === -1 ? 'Semana pasada'
                        : (app.weekOffset === 1 ? 'Semana siguiente'
                            : `${ws.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} – ${we.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`));
                $('#weekInfo').textContent = label;
            }
            function getWeekSessions() {
                const { ws, we } = getVisibleWeek();
                const wsLocal = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate(), 0, 0, 0);
                const weLocal = new Date(we.getFullYear(), we.getMonth(), we.getDate(), 23, 59, 59);

                return app.sessions
                    .filter(s => {
                        const d = parseLocalDate(s.date);
                        return d >= wsLocal && d <= weLocal;
                    })
                    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
            }

            /**
             * Robust function to check if there are any sessions in the visible week.
             * Returns true if at least one session exists within the week range, false otherwise.
             * This function uses the EXACT same logic as getWeekSessions() for consistency.
             * This function is designed to be 100% reliable and handle edge cases.
             */
            function hasSessionsThisWeek() {
                // Ensure app.sessions exists and is an array
                if (!app.sessions || !Array.isArray(app.sessions) || app.sessions.length === 0) {
                    return false;
                }

                // Use the exact same logic as getWeekSessions() for consistency
                const { ws, we } = getVisibleWeek();
                const wsLocal = new Date(ws.getFullYear(), ws.getMonth(), ws.getDate(), 0, 0, 0);
                const weLocal = new Date(we.getFullYear(), we.getMonth(), we.getDate(), 23, 59, 59);

                // Check each session using the same filter logic as getWeekSessions()
                for (let i = 0; i < app.sessions.length; i++) {
                    const session = app.sessions[i];

                    // Skip if session has no date
                    if (!session || !session.date) {
                        continue;
                    }

                    try {
                        // Use the exact same parsing and comparison as getWeekSessions()
                        const d = parseLocalDate(session.date);
                        if (d >= wsLocal && d <= weLocal) {
                            return true; // Found at least one session in the week
                        }
                    } catch (e) {
                        // Skip invalid dates silently
                        continue;
                    }
                }

                return false; // No sessions found in the visible week
            }

            /* =================== Parseos =================== */
            const parseReps = s => (!s ? 0 : s.includes('+') ? (+(s.split('+')[0]) + +(s.split('+')[1] || 0)) : s.includes('-') ? ((+s.split('-')[0] + +s.split('-')[1]) / 2) : +s || 0);
            const parseRIR = s => (!s ? 0 : s.includes('/') ? ((+s.split('/')[0] + +s.split('/')[1]) / 2) : +s || 0);

            /* =================== Resumen =================== */
            function renderSummary() {
                const list = getWeekSessions();
                $('#kpiSessions').textContent = String(list.length);
                const counts = new Map(); 
                const exerciseProgress = new Map(); // Track progress per exercise
                let vol = 0, rirS = 0, rirC = 0;
                
                list.forEach(s => (s.exercises || []).forEach(e => {
                    counts.set(e.name, (counts.get(e.name) || 0) + 1);
                    (e.sets || []).forEach(st => {
                        const kg = parseFloat(st.kg) || 0; 
                        const reps = parseReps(st.reps); 
                        vol += kg * reps;
                        const r = parseRIR(st.rir); 
                        if (r > 0) { rirS += r; rirC++; }
                        
                        // Calculate progress: max weight * reps for this exercise
                        if (kg > 0 && reps > 0) {
                            const currentMax = exerciseProgress.get(e.name) || 0;
                            const currentValue = kg * reps; // Volume as progress indicator
                            if (currentValue > currentMax) {
                                exerciseProgress.set(e.name, currentValue);
                            }
                        }
                    });
                }));
                
                // Find exercise with most progress (highest volume achieved)
                let topExercise = '–';
                if (exerciseProgress.size > 0) {
                    const sorted = [...exerciseProgress.entries()].sort((a, b) => b[1] - a[1]);
                    topExercise = sorted[0][0]; // Only show the top one
                }
                
                $('#kpiTop').textContent = topExercise;
                $('#kpiVolume').textContent = `${vol.toLocaleString()} kg`;
                $('#kpiRIR').textContent = rirC ? (rirS / rirC).toFixed(1) : '–';

                // Update weekly goal
                updateWeeklyGoal();
            }

            /* =================== Progreso por set (texto) =================== */
            function progressText(currentSession, currentEx, currentSet) {
                const currDate = new Date(currentSession.date);
                const previous = app.sessions
                    .filter(s => new Date(s.date) < currDate)
                    .sort((a, b) => new Date(b.date) - new Date(a.date));
                for (const s of previous) {
                    const ex = (s.exercises || []).find(e => e.name === currentEx.name);
                    if (!ex) continue;
                    const prevSet = (ex.sets || []).find(st => st.setNumber === currentSet.setNumber);
                    if (prevSet && (prevSet.kg || prevSet.reps)) {
                        const [txt, cls] = compareSets(prevSet, currentSet, currentSet.setNumber);
                        return `<span class="${cls}">${txt}</span>`;
                    }
                }
                return '<span class="progress--same">Primera sesión</span>';
            }
            function compareSets(prev, curr, setNumber) {
                const pk = parseFloat(prev.kg) || 0, ck = parseFloat(curr.kg) || 0;
                const pr = parseReps(prev.reps), cr = parseReps(curr.reps);
                const pi = parseRIR(prev.rir), ci = parseRIR(curr.rir);
                if (!curr.kg && !curr.reps) return ['Sin datos', 'progress--same'];
                if (ck > pk) return [`+${(ck - pk).toFixed(1)} kg en set ${setNumber}`, 'progress--up'];
                if (ck < pk) return [`-${(pk - ck).toFixed(1)} kg en set ${setNumber}`, 'progress--down'];
                if (cr > pr) return [`Más reps: ${pr} → ${cr}`, 'progress--up'];
                if (cr < pr) return [`Menos reps: ${pr} → ${cr}`, 'progress--down'];
                if (ci < pi) return [`Menos RIR: ${pi} → ${ci}`, 'progress--up'];
                if (ci > pi) return [`Más RIR: ${pi} → ${ci}`, 'progress--down'];
                return ['Sin cambio', 'progress--same'];
            }

            /* =================== Render sesiones =================== */
            function renderSessions() {
                const container = $('#sessions');
                const emptyState = $('#emptyState');
                if (!container) return;

                // Preserve user's open/closed state of sessions across re-renders
                const prevDetails = Array.from(container.querySelectorAll('details'));
                const prevOpen = new Set();
                prevDetails.forEach(d => {
                    if (d.open) {
                        // Store both dayKey and sessionId for backward compatibility
                        if (d.dataset.dayKey) prevOpen.add(d.dataset.dayKey);
                        if (d.dataset.sessionId) prevOpen.add(d.dataset.sessionId);
                    }
                });
                const hadPrev = prevDetails.length > 0;

                container.innerHTML = '';

                // Use robust function to check if there are any sessions in the visible week
                const hasSessions = hasSessionsThisWeek();

                // Show "No hay entrenos" message ONLY when there are truly no sessions
                if (!hasSessions) {
                    if (emptyState) {
                        emptyState.hidden = false;
                        emptyState.style.display = '';
                    }
                    return;
                }

                // Hide empty state completely when there are sessions
                if (emptyState) {
                    emptyState.hidden = true;
                    emptyState.style.display = 'none';
                }

                // Get and render all sessions for the visible week
                const week = getWeekSessions();

                // Sort sessions: non-completed first, completed at the end
                // Within same completion status, sort ascending by date
                const sortedSessions = [...week].sort((a, b) => {
                    const aCompleted = !!a.completed;
                    const bCompleted = !!b.completed;
                    if (aCompleted !== bCompleted) return aCompleted ? 1 : -1;
                    return parseLocalDate(a.date) - parseLocalDate(b.date);
                });

                // Render each session as its own day (collapsible <details> element)
                sortedSessions.forEach(session => {
                    const dayKey = toLocalISO(parseLocalDate(session.date));
                    const sessionId = session.id;
                    
                    const details = document.createElement('details');
                    details.className = 'day-panel card pop';
                    // Store dayKey and sessionId so we can restore open state later
                    details.dataset.dayKey = dayKey;
                    details.dataset.sessionId = sessionId;

                    // Restore previous user state if available; otherwise open non-completed sessions by default
                    if (hadPrev) {
                        details.open = prevOpen.has(dayKey) || prevOpen.has(sessionId);
                    } else {
                        details.open = !session.completed;
                    }

                    const summary = document.createElement('summary');
                    summary.style.display = 'flex';
                    summary.style.justifyContent = 'space-between';
                    summary.style.alignItems = 'center';
                    summary.style.padding = '10px';
                    summary.style.cursor = 'pointer';

                    const left = document.createElement('div');
                    left.innerHTML = `<strong style="font-weight:800">${session.name}</strong>`;
                    const right = document.createElement('div');
                    right.style.color = 'var(--muted)';
                    const dateStr = new Date(session.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
                    right.textContent = dateStr;
                    if (session.completed) {
                        left.classList.add('completed');
                        right.textContent += ' · Completada ✓';
                    }
                    summary.appendChild(left);
                    summary.appendChild(right);
                    details.appendChild(summary);

                    const dayBody = document.createElement('div');
                    dayBody.style.display = 'grid';
                    dayBody.style.gap = '8px';
                    dayBody.style.padding = '10px';

                    // Render the session card
                    const card = $('#tpl-session').content.firstElementChild.cloneNode(true);
                    card.dataset.id = session.id;
                    card.classList.toggle('completed', !!session.completed);
                    card.querySelector('.session__title').textContent = session.name;
                    card.querySelector('.session__date').textContent = new Date(session.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    const dateEl = card.querySelector('.session__date'); 
                    if (dateEl) {
                        dateEl.textContent = '';
                        dateEl.style.display = 'none';
                    }
                    const btnComplete = card.querySelector('.js-complete');
                    btnComplete.setAttribute('aria-pressed', String(!!session.completed));
                    if (session.completed) {
                        const badge = document.createElement('span');
                        badge.className = 'badge-done';
                        badge.textContent = 'Completada ✓';
                        card.querySelector('.session__titlewrap').appendChild(badge);
                    }

                    const body = card.querySelector('.session__body');
                    (session.exercises || []).forEach(ex => body.appendChild(renderExercise(session, ex)));

                    // Move the "Añadir ejercicio" button to the end of the session body
                    const addExBtn = card.querySelector('.js-add-ex');
                    if (addExBtn && body) {
                        addExBtn.classList.remove('btn--mobile');
                        body.appendChild(addExBtn);
                    }

                    // Initialize edit UI state
                    updateSessionEditUI(session.id);

                    dayBody.appendChild(card);
                    details.appendChild(dayBody);
                    container.appendChild(details);
                });
            }
            function renderExercise(session, ex) {
                const block = $('#tpl-exercise').content.firstElementChild.cloneNode(true);
                block.dataset.exId = ex.id;
                const nameEl = block.querySelector('.exercise__name');
                nameEl.textContent = ex.name;
                
                // Make name editable on click (inline editing with save/cancel)
                let isEditing = false;
                nameEl.style.cursor = 'pointer';
                nameEl.title = 'Clic para editar';
                
                const makeEditable = (element) => {
                    element.addEventListener('click', function handleClick(e) {
                        // Prevent event bubbling if clicking on edit button
                        if (e.target.closest('.js-edit-exercise-name')) return;
                        if (isEditing) return;
                        isEditing = true;
                        const originalName = ex.name;
                        const input = document.createElement('input');
                        input.type = 'text';
                        input.className = 'input';
                        input.value = originalName;
                        input.style.width = '100%';
                        input.style.maxWidth = '300px';
                        input.style.fontSize = 'inherit';
                        input.style.fontWeight = 'inherit';
                        const parentEl = element.parentElement;
                        element.replaceWith(input);
                        input.focus();
                        input.select();
                        
                        // Create confirmation buttons container
                        const confirmContainer = document.createElement('div');
                        confirmContainer.style.display = 'flex';
                        confirmContainer.style.gap = '8px';
                        confirmContainer.style.marginTop = '8px';
                        confirmContainer.style.alignItems = 'center';
                        
                        const saveBtn = document.createElement('button');
                        saveBtn.className = 'btn btn--small';
                        saveBtn.textContent = '💾 Guardar';
                        saveBtn.style.margin = '0';
                        
                        const cancelBtn = document.createElement('button');
                        cancelBtn.className = 'btn btn--small btn--ghost';
                        cancelBtn.textContent = '✕ Cancelar';
                        cancelBtn.style.margin = '0';
                        
                        confirmContainer.appendChild(saveBtn);
                        confirmContainer.appendChild(cancelBtn);
                        
                        // Insert confirmation buttons after input
                        input.parentElement.insertBefore(confirmContainer, input.nextSibling);
                        
                        const cleanup = () => {
                            confirmContainer.remove();
                            isEditing = false;
                        };
                        
                        const saveChanges = () => {
                            const newName = input.value.trim();
                            if (newName && newName !== originalName) {
                                if (updateExerciseName(session.id, ex.id, newName, originalName)) {
                                    // Update the name element with new name
                                    const newNameEl = document.createElement('div');
                                    newNameEl.className = 'exercise__name';
                                    newNameEl.textContent = newName;
                                    newNameEl.style.cursor = 'pointer';
                                    newNameEl.title = 'Clic para editar';
                                    input.replaceWith(newNameEl);
                                    makeEditable(newNameEl);
                                    cleanup();
                                } else {
                                    // If update failed, restore original
                                    cancelChanges();
                                }
                            } else {
                                cancelChanges();
                            }
                        };
                        
                        const cancelChanges = () => {
                            const newNameEl = document.createElement('div');
                            newNameEl.className = 'exercise__name';
                            newNameEl.textContent = originalName;
                            newNameEl.style.cursor = 'pointer';
                            newNameEl.title = 'Clic para editar';
                            input.replaceWith(newNameEl);
                            makeEditable(newNameEl);
                            cleanup();
                        };
                        
                        saveBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            saveChanges();
                        });
                        
                        cancelBtn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            cancelChanges();
                        });
                        
                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                saveChanges();
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                cancelChanges();
                            }
                        });
                        
                        // Don't close on blur if clicking on buttons
                        input.addEventListener('blur', (e) => {
                            // Delay to allow button clicks to register
                            setTimeout(() => {
                                if (!confirmContainer.contains(document.activeElement) && document.activeElement !== input) {
                                    // Only cancel if focus moved outside the edit area
                                    if (!confirmContainer.contains(e.relatedTarget)) {
                                        cancelChanges();
                                    }
                                }
                            }, 200);
                        });
                    });
                };
                
                makeEditable(nameEl);

                // Add note button to exercise head
                const headEl = block.querySelector('.exercise__head');
                if (headEl) {
                    const noteBtn = document.createElement('button');
                    noteBtn.className = 'exercise-note-btn';
                    noteBtn.type = 'button';
                    const hasNote = getExerciseNote(session.id, ex.id);
                    if (hasNote) {
                        noteBtn.classList.add('has-note');
                        noteBtn.innerHTML = '📝';
                    } else {
                        noteBtn.innerHTML = '+ Nota';
                    }
                    noteBtn.setAttribute('aria-label', hasNote ? 'Editar nota del ejercicio' : 'Añadir nota del ejercicio');
                    noteBtn.dataset.sessionId = session.id;
                    noteBtn.dataset.exId = ex.id;
                    noteBtn.addEventListener('click', () => openExerciseNoteDialog(session.id, ex.id, ex.name));
                    headEl.appendChild(noteBtn);
                }

                // Render mobile cards
                const mobileContainer = block.querySelector('.sets-container');
                (ex.sets || []).forEach(set => mobileContainer.appendChild(renderSetCard(session, ex, set)));

                // Render desktop table
                const desktopTable = block.querySelector('.sets');
                (ex.sets || []).forEach(set => desktopTable.appendChild(renderSet(session, ex, set)));

                // Display exercise note if exists
                const note = getExerciseNote(session.id, ex.id);
                if (note) {
                    const noteDisplay = document.createElement('div');
                    noteDisplay.className = 'exercise-note-display';
                    // Preserve line breaks in note display
                    const noteText = escapeHtml(note).replace(/\n/g, '<br>');
                    noteDisplay.innerHTML = `
                <div class="exercise-note-text">${noteText}</div>
                <div class="exercise-note-actions">
                    <button class="exercise-note-edit" data-session-id="${session.id}" data-ex-id="${ex.id}" aria-label="Editar nota">✏️</button>
                    <button class="exercise-note-delete" data-session-id="${session.id}" data-ex-id="${ex.id}" aria-label="Eliminar nota">🗑️</button>
                </div>
            `;
                    noteDisplay.querySelector('.exercise-note-edit').addEventListener('click', () => openExerciseNoteDialog(session.id, ex.id, ex.name));
                    noteDisplay.querySelector('.exercise-note-delete').addEventListener('click', () => {
                        saveExerciseNote(session.id, ex.id, '');
                        refresh({ preserveTab: true });
                    });
                    block.appendChild(noteDisplay);
                }

                return block;
            }

            function openExerciseNoteDialog(sessionId, exId, exerciseName) {
                const currentNote = getExerciseNote(sessionId, exId);
                const dialog = $('#exerciseNoteDialog');
                const title = $('#exerciseNoteTitle');
                const textarea = $('#exerciseNoteText');
                
                if (title) title.textContent = `Nota: ${exerciseName}`;
                if (textarea) textarea.value = currentNote || '';
                
                // Store current session and exercise IDs for save handler
                dialog.dataset.sessionId = sessionId;
                dialog.dataset.exId = exId;
                
                dialog.showModal();
                if (textarea) {
                    setTimeout(() => textarea.focus(), 100);
                }
            }

            function renderSet(session, ex, set) {
                const row = $('#tpl-set').content.firstElementChild.cloneNode(true);
                row.dataset.setId = set.id;
                row.querySelector('.set-num').textContent = set.setNumber;
                const kgInput = row.querySelector('.js-kg');
                const repsInput = row.querySelector('.js-reps');
                const rirInput = row.querySelector('.js-rir');
                if (kgInput) {
                    kgInput.value = set.kg || '';
                    if (!kgInput.value && (set.planKg || set.kgTemplate)) kgInput.placeholder = set.planKg || set.kgTemplate;
                }
                if (repsInput) {
                    repsInput.value = set.reps || '';
                    if (!repsInput.value && (set.planReps || set.repsTemplate)) repsInput.placeholder = set.planReps || set.repsTemplate;
                }
                if (rirInput) {
                    rirInput.value = set.rir || '';
                    if (!rirInput.value && (set.planRir || set.rirTemplate)) rirInput.placeholder = set.planRir || set.rirTemplate;
                }

                // Add PR badge
                const progressCell = row.querySelector('.progress');
                if (progressCell) {
                    let progressHTML = progressText(session, ex, set);
                    if (set.isPR) {
                        const prLabel = set.prType === 'weight' ? 'Peso' : set.prType === 'volume' ? 'Volumen' : 'Reps';
                        progressHTML += `<span class="pr-badge">🏆 PR ${prLabel}</span>`;
                    }
                    progressCell.innerHTML = progressHTML;
                }

                // Calculate and display 1RM
                if (set.kg && set.reps) {
                    const onerm = calculate1RM(set.kg, set.reps);
                    if (onerm) {
                        const onermCell = document.createElement('td');
                        onermCell.className = 'onerm-display';
                        const currentBest = app.onerm[ex.name] || 0;
                        const isPR = onerm > currentBest;
                        onermCell.innerHTML = `<span class="${isPR ? 'onerm-pr' : 'onerm-value'}">1RM: ${onerm.toFixed(1)} kg</span>`;
                        row.appendChild(onermCell);
                    }
                }

                return row;
            }

            function renderSetCard(session, ex, set) {
                const card = $('#tpl-set-card').content.firstElementChild.cloneNode(true);
                card.dataset.setId = set.id;
                card.style.position = 'relative';
                card.querySelector('.set-number').textContent = `Set ${set.setNumber}`;
                const kgInput = card.querySelector('.js-kg');
                const repsInput = card.querySelector('.js-reps');
                const rirInput = card.querySelector('.js-rir');
                if (kgInput) {
                    kgInput.value = set.kg || '';
                    if (!kgInput.value && (set.planKg || set.kgTemplate)) kgInput.placeholder = set.planKg || set.kgTemplate;
                }
                if (repsInput) {
                    repsInput.value = set.reps || '';
                    if (!repsInput.value && (set.planReps || set.repsTemplate)) repsInput.placeholder = set.planReps || set.repsTemplate;
                }
                if (rirInput) {
                    rirInput.value = set.rir || '';
                    if (!rirInput.value && (set.planRir || set.rirTemplate)) rirInput.placeholder = set.planRir || set.rirTemplate;
                }

                // Add PR badge
                const progressEl = card.querySelector('.set-progress');
                if (progressEl) {
                    let progressHTML = progressText(session, ex, set);
                    if (set.isPR) {
                        const prLabel = set.prType === 'weight' ? 'Peso' : set.prType === 'volume' ? 'Volumen' : 'Reps';
                        progressHTML += `<span class="pr-badge pr-badge-set">🏆 PR ${prLabel}</span>`;
                    }
                    progressEl.innerHTML = progressHTML;
                }

                // Calculate and display 1RM
                if (set.kg && set.reps) {
                    const onerm = calculate1RM(set.kg, set.reps);
                    if (onerm) {
                        const onermDiv = document.createElement('div');
                        onermDiv.className = 'onerm-display';
                        const currentBest = app.onerm[ex.name] || 0;
                        const isPR = onerm > currentBest;
                        onermDiv.innerHTML = `<span class="${isPR ? 'onerm-pr' : 'onerm-value'}">1RM: ${onerm.toFixed(1)} kg</span>`;
                        card.appendChild(onermDiv);
                    }
                }

                return card;
            }

            /* =================== ADVANCED FEATURES SYSTEM =================== */

            // Initialize advanced features data
            if (!app.prs) app.prs = {};
            if (!app.onerm) app.onerm = {};
            if (!app.exerciseNotes) app.exerciseNotes = {};
            if (!app.achievements) app.achievements = [];
            if (!app.streak) app.streak = { current: 0, lastDate: null };
            if (!app.weeklyGoal) app.weeklyGoal = { target: 3, current: 0 };

            /* =================== PR Detection System =================== */
            function checkAndRecordPRs(sessionId, exId, setId, exerciseName) {
                const session = app.sessions.find(s => s.id === sessionId);
                if (!session) return;
                const exercise = session.exercises.find(e => e.id === exId);
                if (!exercise) return;
                const currentSet = exercise.sets.find(s => s.id === setId);
                if (!currentSet || !currentSet.kg || !currentSet.reps) return;

                const kg = parseFloat(currentSet.kg) || 0;
                const reps = parseReps(currentSet.reps);
                const volume = kg * reps;

                // Calculate historical max values from all sessions
                let maxKg = 0;
                let maxVolume = 0;
                const maxRepsByKg = {};

                app.sessions.forEach(s => {
                    const ex = (s.exercises || []).find(e => e.name === exerciseName);
                    if (!ex) return;
                    (ex.sets || []).forEach(st => {
                        if (st.id === setId) return; // Skip current set
                        const stKg = parseFloat(st.kg) || 0;
                        const stReps = parseReps(st.reps);
                        const stVolume = stKg * stReps;
                        if (stKg > maxKg) maxKg = stKg;
                        if (stVolume > maxVolume) maxVolume = stVolume;
                        if (stKg > 0 && (!maxRepsByKg[stKg] || stReps > maxRepsByKg[stKg])) {
                            maxRepsByKg[stKg] = stReps;
                        }
                    });
                });

                // Initialize PR data if needed
                if (!app.prs[exerciseName]) {
                    app.prs[exerciseName] = { maxKg: 0, maxVolume: 0, maxRepsByKg: {} };
                }

                const prData = app.prs[exerciseName];
                let prDetected = false;
                let prType = '';

                // Check PR weight
                if (kg > maxKg) {
                    prData.maxKg = kg;
                    prDetected = true;
                    prType = 'weight';
                    currentSet.isPR = true;
                    currentSet.prType = 'weight';
                }

                // Check PR volume
                if (volume > maxVolume) {
                    prData.maxVolume = volume;
                    prDetected = true;
                    prType = prType ? 'multiple' : 'volume';
                    if (!currentSet.isPR) {
                        currentSet.isPR = true;
                        currentSet.prType = 'volume';
                    } else {
                        currentSet.prType = 'multiple';
                    }
                }

                // Check PR reps with same weight
                if (kg > 0 && (!maxRepsByKg[kg] || reps > maxRepsByKg[kg])) {
                    if (!prData.maxRepsByKg) prData.maxRepsByKg = {};
                    prData.maxRepsByKg[kg] = reps;
                    if (!prDetected) {
                        prDetected = true;
                        prType = 'reps';
                        currentSet.isPR = true;
                        currentSet.prType = 'reps';
                    }
                }

                if (prDetected) {
                    save();
                    toast(`🏆 Nuevo PR de ${prType === 'weight' ? 'peso' : prType === 'volume' ? 'volumen' : 'repeticiones'} en ${exerciseName}!`, 'ok');
                }
            }

            /* =================== 1RM Calculation System =================== */
            function calculate1RM(kg, reps) {
                if (!kg || !reps || kg <= 0 || reps <= 0) return null;
                const kgNum = parseFloat(kg);
                const repsNum = parseReps(reps);
                if (repsNum <= 0) return null;

                // Epley: 1RM = kg × (1 + reps / 30)
                const epley = kgNum * (1 + repsNum / 30);

                // Brzycki: 1RM = kg × (36 / (37 - reps))
                const brzycki = repsNum >= 37 ? null : kgNum * (36 / (37 - repsNum));

                // Wendler: 1RM = kg × reps^0.1
                const wendler = kgNum * Math.pow(repsNum, 0.1);

                // Average of valid calculations
                const valid = [epley, brzycki, wendler].filter(v => v !== null && isFinite(v));
                return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
            }

            function update1RM(exerciseName, onermValue) {
                if (!onermValue || !isFinite(onermValue)) return;
                const currentBest = app.onerm[exerciseName] || 0;
                if (onermValue > currentBest) {
                    const wasPR = currentBest > 0;
                    app.onerm[exerciseName] = onermValue;
                    if (wasPR) {
                        toast(`🏆 Nuevo PR de 1RM en ${exerciseName}: ${onermValue.toFixed(1)} kg!`, 'ok');
                    }
                    save();
                }
            }

            /* =================== Goals System =================== */
            if (!app.goals) app.goals = [];
            if (!app.recentAchievements) app.recentAchievements = [];

            function createMilestones(goal) {
                if (!goal.autoMilestones) return [];
                const milestones = [];
                const target = parseFloat(goal.target) || 0;
                let current = parseFloat(goal.current) || 0;
                
                // If current is 0, try to get actual progress from sessions
                if (current === 0 && goal.exerciseName) {
                    current = calculateGoalProgress(goal);
                }
                
                const diff = target - current;
                
                // Determine milestone strategy based on goal type and difference
                if (goal.type === 'weight' || goal.type === 'reps') {
                    // For weight/reps: use percentage-based increments (20%, 40%, 60%, 80%, 100%)
                    // Or fixed increments if the difference is small
                    if (diff <= 20) {
                        // Small difference: use fixed 5kg/rep increments
                        const increment = Math.max(1, Math.ceil(diff / 4));
                        let milestoneValue = current;
                        while (milestoneValue < target) {
                            milestoneValue = Math.min(target, milestoneValue + increment);
                            if (milestoneValue > current && milestoneValue < target) {
                                milestones.push({
                                    id: uuid(),
                                    value: Math.round(milestoneValue * 10) / 10,
                                    completed: false,
                                    completedAt: null
                                });
                            }
                        }
                    } else {
                        // Large difference: use percentage-based milestones (25%, 50%, 75%, 100%)
                        const percentages = [0.25, 0.5, 0.75];
                        percentages.forEach(percent => {
                            const milestoneValue = current + (diff * percent);
                            if (milestoneValue > current && milestoneValue < target) {
                                milestones.push({
                                    id: uuid(),
                                    value: Math.round(milestoneValue * 10) / 10,
                                    completed: false,
                                    completedAt: null
                                });
                            }
                        });
                    }
                } else if (goal.type === 'volume') {
                    // For volume: use percentage-based (20%, 40%, 60%, 80%)
                    const percentages = [0.2, 0.4, 0.6, 0.8];
                    percentages.forEach(percent => {
                        const milestoneValue = current + (diff * percent);
                        if (milestoneValue > current && milestoneValue < target) {
                            milestones.push({
                                id: uuid(),
                                value: Math.round(milestoneValue * 10) / 10,
                                completed: false,
                                completedAt: null
                            });
                        }
                    });
                } else {
                    // For sessions, streak, exercise: use equal divisions (25%, 50%, 75%)
                    const percentages = [0.25, 0.5, 0.75];
                    percentages.forEach(percent => {
                        const milestoneValue = current + (diff * percent);
                        if (milestoneValue > current && milestoneValue < target) {
                            milestones.push({
                                id: uuid(),
                                value: Math.round(milestoneValue * 10) / 10,
                                completed: false,
                                completedAt: null
                            });
                        }
                    });
                }
                
                return milestones;
            }

            function calculateGoalProgress(goal) {
                const sessions = app.sessions.filter(s => s.completed);
                let current = 0;
                
                switch (goal.type) {
                    case 'loseWeight':
                        // Get current weight from profile
                        const currentWeight = parseFloat(app.profile?.weight) || 0;
                        if (currentWeight > 0) {
                            // For weight loss, we track how much weight has been lost
                            // If target is 70kg and current is 75kg, progress is 5kg lost (towards 70kg)
                            const initialWeight = goal.initialWeight || currentWeight;
                            current = Math.max(0, initialWeight - currentWeight);
                        }
                        break;
                    case 'gainWeight':
                        // Get current weight from profile
                        const currentWeightGain = parseFloat(app.profile?.weight) || 0;
                        if (currentWeightGain > 0) {
                            // For weight gain, we track how much weight has been gained
                            // If target is 80kg and current is 75kg, progress is 5kg gained (towards 80kg)
                            const initialWeightGain = goal.initialWeight || currentWeightGain;
                            current = Math.max(0, currentWeightGain - initialWeightGain);
                        }
                        break;
                    case 'weight':
                        if (goal.exerciseName) {
                            const exerciseSessions = sessions.flatMap(s => 
                                (s.exercises || []).filter(e => e.name === goal.exerciseName)
                            );
                            exerciseSessions.forEach(ex => {
                                (ex.sets || []).forEach(set => {
                                    const kg = parseFloat(set.kg) || 0;
                                    if (kg > current) current = kg;
                                });
                            });
                        }
                        break;
                    case 'volume':
                        sessions.forEach(s => {
                            (s.exercises || []).forEach(ex => {
                                (ex.sets || []).forEach(set => {
                                    const kg = parseFloat(set.kg) || 0;
                                    const reps = parseReps(set.reps);
                                    current += kg * reps;
                                });
                            });
                        });
                        break;
                    case 'reps':
                        if (goal.exerciseName) {
                            const exerciseSessions = sessions.flatMap(s => 
                                (s.exercises || []).filter(e => e.name === goal.exerciseName)
                            );
                            exerciseSessions.forEach(ex => {
                                (ex.sets || []).forEach(set => {
                                    const reps = parseReps(set.reps);
                                    if (reps > current) current = reps;
                                });
                            });
                        }
                        break;
                    case 'sessions':
                        current = sessions.length;
                        break;
                    case 'streak':
                        current = app.streak?.current || 0;
                        break;
                    case 'exercise':
                        if (goal.exerciseName) {
                            const exerciseSessions = sessions.flatMap(s => 
                                (s.exercises || []).filter(e => e.name === goal.exerciseName)
                            );
                            current = exerciseSessions.length;
                        }
                        break;
                }
                
                return current;
            }

            function updateGoalProgress(goal) {
                const newCurrent = calculateGoalProgress(goal);
                const wasCompleted = goal.completed;
                goal.current = newCurrent;
                
                // For weight loss/gain, the target is the amount to lose/gain, not the final weight
                if (goal.type === 'loseWeight' || goal.type === 'gainWeight') {
                    goal.progress = Math.min(100, (newCurrent / parseFloat(goal.target)) * 100);
                    goal.completed = newCurrent >= parseFloat(goal.target);
                } else {
                    goal.progress = Math.min(100, (newCurrent / parseFloat(goal.target)) * 100);
                    goal.completed = newCurrent >= parseFloat(goal.target);
                }
                
                // Check milestones
                if (goal.milestones && goal.milestones.length > 0) {
                    goal.milestones.forEach(milestone => {
                        if (!milestone.completed && newCurrent >= milestone.value) {
                            milestone.completed = true;
                            milestone.completedAt = new Date().toISOString();
                            celebrateMilestone(goal, milestone);
                        }
                    });
                }
                
                // Celebrate goal completion
                if (!wasCompleted && goal.completed) {
                    celebrateGoal(goal);
                }
                
                // Adaptive adjustment based on progress
                if (goal.adaptive && !goal.completed) {
                    adjustGoalAdaptively(goal);
                }
            }

            function adjustGoalAdaptively(goal) {
                const deadline = goal.deadline ? new Date(goal.deadline) : null;
                if (!deadline) return;
                
                const now = new Date();
                const daysRemaining = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
                const progress = goal.progress || 0;
                const expectedProgress = ((deadline.getTime() - new Date(goal.createdAt).getTime()) / (now.getTime() - new Date(goal.createdAt).getTime())) * 100;
                
                if (daysRemaining < 7 && progress < expectedProgress * 0.7) {
                    // If behind schedule, suggest adjustment
                    const suggestedTarget = goal.current + ((goal.target - goal.current) * 0.8);
                    goal.suggestedAdjustment = {
                        target: suggestedTarget,
                        reason: 'Ajuste sugerido basado en progreso actual'
                    };
                }
            }

            function celebrateGoal(goal) {
                const achievement = {
                    id: uuid(),
                    type: 'goal',
                    title: `🎯 Objetivo completado: ${goal.name}`,
                    description: `Has alcanzado tu objetivo de ${goal.name}`,
                    date: new Date().toISOString(),
                    goalId: goal.id
                };
                
                app.recentAchievements.unshift(achievement);
                if (app.recentAchievements.length > 10) {
                    app.recentAchievements = app.recentAchievements.slice(0, 10);
                }
                
                toast(`🎉 ¡Objetivo completado! ${goal.name}`, 'ok');
                save();
                renderGoals();
                renderRecentAchievements();
            }

            function celebrateMilestone(goal, milestone) {
                const achievement = {
                    id: uuid(),
                    type: 'milestone',
                    title: `🏆 Hito alcanzado: ${milestone.value}`,
                    description: `Hito del objetivo "${goal.name}"`,
                    date: new Date().toISOString(),
                    goalId: goal.id,
                    milestoneId: milestone.id
                };
                
                app.recentAchievements.unshift(achievement);
                if (app.recentAchievements.length > 10) {
                    app.recentAchievements = app.recentAchievements.slice(0, 10);
                }
                
                toast(`🎯 Hito alcanzado: ${milestone.value}`, 'ok');
                save();
                renderGoals();
                renderRecentAchievements();
            }

            function addGoal(goalData) {
                // Create temporary goal object to calculate current progress
                const tempGoal = {
                    type: goalData.type,
                    target: parseFloat(goalData.target) || 0,
                    exerciseName: goalData.exerciseName || null,
                    current: 0
                };
                
                // For weight loss/gain goals, store initial weight
                let initialWeight = null;
                if (goalData.type === 'loseWeight' || goalData.type === 'gainWeight') {
                    initialWeight = parseFloat(app.profile?.weight) || 0;
                }
                
                // Calculate actual current progress before creating milestones
                const actualCurrent = calculateGoalProgress(tempGoal);
                
                const goal = {
                    id: uuid(),
                    name: goalData.name,
                    type: goalData.type,
                    target: parseFloat(goalData.target) || 0,
                    current: actualCurrent,
                    progress: 0,
                    completed: false,
                    exerciseName: goalData.exerciseName || null,
                    deadline: goalData.deadline || null,
                    autoMilestones: goalData.autoMilestones || false,
                    adaptive: true,
                    createdAt: new Date().toISOString(),
                    initialWeight: initialWeight,
                    milestones: goalData.autoMilestones ? createMilestones({
                        type: goalData.type,
                        target: goalData.target,
                        current: actualCurrent,
                        exerciseName: goalData.exerciseName || null,
                        autoMilestones: true
                    }) : []
                };
                
                updateGoalProgress(goal);
                app.goals.push(goal);
                save();
                renderGoals();
                toast('Objetivo creado', 'ok');
            }

            function deleteGoal(goalId) {
                app.goals = app.goals.filter(g => g.id !== goalId);
                save();
                renderGoals();
            }

            function renderGoals() {
                const list = $('#goalsList');
                const empty = $('#noGoals');
                if (!list) return;
                
                // Update all goals progress
                app.goals.forEach(goal => updateGoalProgress(goal));
                
                if (!app.goals || app.goals.length === 0) {
                    if (empty) empty.hidden = false;
                    if (list) list.innerHTML = '';
                    return;
                }
                
                if (empty) empty.hidden = true;
                list.innerHTML = '';
                
                app.goals.forEach(goal => {
                    const item = document.createElement('div');
                    item.className = `goal-item ${goal.completed ? 'completed' : ''}`;
                    
                    const progressPercent = Math.min(100, goal.progress || 0);
                    
                    const createdDate = goal.createdAt ? new Date(goal.createdAt).toLocaleDateString('es-ES') : '';
                    item.innerHTML = `
                        <div class="goal-header">
                            <h4 class="goal-title">${escapeHtml(goal.name)}</h4>
                            <div class="goal-actions">
                                <button class="btn btn--small btn--ghost js-delete-goal" data-goal-id="${goal.id}" aria-label="Eliminar objetivo">✕</button>
                            </div>
                        </div>
                        <div class="goal-progress">
                            <div class="goal-stats">
                                <span>${goal.current.toFixed(1)} / ${goal.target}</span>
                                <span>${progressPercent.toFixed(0)}%</span>
                            </div>
                            <div class="goal-progress-bar">
                                <div class="goal-progress-fill ${goal.completed ? 'completed' : ''}" style="width: ${progressPercent}%"></div>
                            </div>
                            ${createdDate ? `<div class="goal-date" style="color: #000000; font-size: 0.75rem; margin-top: 6px; opacity: 0.7;">Creado: ${createdDate}</div>` : ''}
                        </div>
                        ${goal.milestones && goal.milestones.length > 0 ? `
                            <div class="goal-milestones">
                                ${goal.milestones.map(m => `
                                    <div class="milestone-item ${m.completed ? 'completed' : ''}">
                                        <div class="milestone-check">${m.completed ? '✓' : ''}</div>
                                        <span>${m.value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    `;
                    
                    const deleteBtn = item.querySelector('.js-delete-goal');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', () => {
                            app.deleteTarget = { type: 'goal', goalId: goal.id };
                            showConfirmDialog('¿Eliminar este objetivo?');
                        });
                    }
                    
                    list.appendChild(item);
                });
            }

            function renderRecentAchievements() {
                const container = $('#recentAchievements');
                if (!container) return;
                
                if (!app.recentAchievements || app.recentAchievements.length === 0) {
                    container.innerHTML = '<div class="routine-empty">Aún no hay logros recientes.</div>';
                    return;
                }
                
                container.innerHTML = '';
                app.recentAchievements.slice(0, 5).forEach(achievement => {
                    const badge = document.createElement('div');
                    badge.className = 'achievement-badge';
                    const date = new Date(achievement.date).toLocaleDateString('es-ES');
                    badge.innerHTML = `
                        <div class="achievement-icon">${achievement.type === 'goal' ? '🎯' : '🏆'}</div>
                        <div class="achievement-text">
                            <strong>${achievement.title}</strong>
                            <div class="achievement-date">${date}</div>
                        </div>
                    `;
                    container.appendChild(badge);
                });
            }

            /* =================== Exercise Notes System =================== */
            function getExerciseNoteKey(sessionId, exId) {
                return `${sessionId}_${exId}`;
            }

            function saveExerciseNote(sessionId, exId, note) {
                // Notes are always editable - no edit mode required
                const key = getExerciseNoteKey(sessionId, exId);
                if (note && note.trim()) {
                    // Preserve line breaks - don't trim newlines, only leading/trailing whitespace
                    app.exerciseNotes[key] = note.replace(/^\s+|\s+$/g, '');
                } else {
                    delete app.exerciseNotes[key];
                }
                
                // Save immediately
                save();
            }

            function getExerciseNote(sessionId, exId) {
                const key = getExerciseNoteKey(sessionId, exId);
                return app.exerciseNotes[key] || '';
            }

            /* =================== Competitive Mode System =================== */
            function updateStreak() {
                const completedSessions = app.sessions.filter(s => s.completed).sort((a, b) => new Date(b.date) - new Date(a.date));
                if (completedSessions.length === 0) {
                    app.streak = { current: 0, lastDate: null };
                    save();
                    return;
                }

                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let streak = 0;
                let checkDate = new Date(today);

                for (const session of completedSessions) {
                    const sessionDate = parseLocalDate(session.date);
                    sessionDate.setHours(0, 0, 0, 0);

                    const daysDiff = Math.floor((checkDate - sessionDate) / (1000 * 60 * 60 * 24));

                    if (daysDiff === 0) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else if (daysDiff === 1) {
                        streak++;
                        checkDate.setDate(checkDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                app.streak = { current: streak, lastDate: completedSessions[0]?.date || null };
                save();
            }

            function updateWeeklyGoal() {
                const { ws, we } = getVisibleWeek();
                const weekSessions = app.sessions.filter(s => {
                    const d = parseLocalDate(s.date);
                    return d >= ws && d <= we && s.completed;
                });
                app.weeklyGoal.current = weekSessions.length;
                save();
            }

            function checkAchievements() {
                const achievements = [];
                const completedSessions = app.sessions.filter(s => s.completed);
                const totalVolume = app.sessions.reduce((sum, s) => {
                    return sum + (s.exercises || []).reduce((exSum, ex) => {
                        return exSum + (ex.sets || []).reduce((setSum, set) => {
                            const kg = parseFloat(set.kg) || 0;
                            const reps = parseReps(set.reps);
                            return setSum + (kg * reps);
                        }, 0);
                    }, 0);
                }, 0);

                // Check existing achievements to avoid duplicates
                const existingIds = new Set((app.achievements || []).map(a => a.id));

                // 10 sessions completed
                if (completedSessions.length >= 10 && !existingIds.has('10_sessions')) {
                    achievements.push({ id: '10_sessions', icon: '🎯', title: '10 sesiones completadas', date: new Date().toISOString() });
                }

                // First week complete
                const weeks = new Set(completedSessions.map(s => {
                    const d = parseLocalDate(s.date);
                    return startOfWeek(d).toISOString();
                }));
                if (weeks.size >= 1 && !existingIds.has('first_week')) {
                    achievements.push({ id: 'first_week', icon: '🌟', title: 'Tu primera semana completa', date: new Date().toISOString() });
                }

                // First PR
                const hasPR = Object.keys(app.prs || {}).length > 0;
                if (hasPR && !existingIds.has('first_pr')) {
                    achievements.push({ id: 'first_pr', icon: '🏆', title: 'Primer PR de peso', date: new Date().toISOString() });
                }

                // 7 day streak
                if (app.streak && app.streak.current >= 7 && !existingIds.has('streak_7')) {
                    achievements.push({ id: 'streak_7', icon: '🔥', title: 'Racha de 7 días', date: new Date().toISOString() });
                }

                // 5000 kg volume
                if (totalVolume >= 5000 && !existingIds.has('volume_5k')) {
                    achievements.push({ id: 'volume_5k', icon: '💪', title: '5000 kg de volumen total', date: new Date().toISOString() });
                }

                if (achievements.length > 0) {
                    if (!app.achievements) app.achievements = [];
                    app.achievements.push(...achievements);
                    app.achievements.sort((a, b) => new Date(b.date) - new Date(a.date));
                    save();
                    achievements.forEach(ach => {
                        toast(`${ach.icon} ${ach.title}!`, 'ok');
                    });
                }
            }

            function renderCompetitiveMode() {
                updateStreak();
                updateWeeklyGoal();
                checkAchievements();

                const streakEl = $('#currentStreak');
                if (streakEl) streakEl.textContent = app.streak?.current || 0;

                const goalProgressEl = $('#weeklyGoalProgress');
                const goalBarEl = $('#weeklyGoalBar');
                if (goalProgressEl && goalBarEl) {
                    const current = app.weeklyGoal?.current || 0;
                    const target = app.weeklyGoal?.target || 3;
                    goalProgressEl.textContent = `${current} / ${target}`;
                    const percentage = Math.min((current / target) * 100, 100);
                    goalBarEl.style.width = `${percentage}%`;
                }

                const achievementsList = $('#achievementsList');
                if (achievementsList) {
                    const achievements = app.achievements || [];
                    if (achievements.length === 0) {
                        achievementsList.innerHTML = '<div class="routine-empty">Aún no hay logros. ¡Sigue entrenando!</div>';
                    } else {
                        achievementsList.innerHTML = achievements.map(ach => {
                            const date = new Date(ach.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
                            return `
                        <div class="achievement-item">
                            <div class="achievement-icon">${ach.icon}</div>
                            <div class="achievement-content">
                                <div class="achievement-title">${ach.title}</div>
                                <div class="achievement-date">${date}</div>
                            </div>
                        </div>
                    `;
                        }).join('');
                    }
                }
            }

            /* =================== Copy Last Week Workout =================== */
            function copyLastWeekWorkout() {
                const { ws } = getVisibleWeek();
                const lastWeekStart = addDays(ws, -7);
                const lastWeekEnd = addDays(lastWeekStart, 6);
                lastWeekEnd.setHours(23, 59, 59, 999);

                // Find sessions from last week
                const lastWeekSessions = app.sessions.filter(s => {
                    const d = parseLocalDate(s.date);
                    return d >= lastWeekStart && d <= lastWeekEnd;
                }).sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));

                if (lastWeekSessions.length === 0) {
                    toast('No hay entrenamientos en la semana pasada para copiar', 'warn');
                    return;
                }

                // Get today's day of week (Monday=1, Sunday=7)
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let todayDayOfWeek = today.getDay();
                if (todayDayOfWeek === 0) todayDayOfWeek = 7; // Sunday = 7
                const targetDayIndex = todayDayOfWeek - 1; // 0-6 for Monday-Sunday

                // Find session from same day last week
                const lastWeekSameDay = lastWeekSessions.find(s => {
                    const sDate = parseLocalDate(s.date);
                    let sDayOfWeek = sDate.getDay();
                    if (sDayOfWeek === 0) sDayOfWeek = 7;
                    return (sDayOfWeek - 1) === targetDayIndex;
                });

                if (!lastWeekSameDay) {
                    const dayNames = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
                    toast(`No hay entrenamiento del ${dayNames[targetDayIndex]} de la semana pasada`, 'warn');
                    return;
                }

                // Create new session with today's date
                const newDate = toLocalISO(today);
                const newSession = {
                    id: uuid(),
                    name: lastWeekSameDay.name,
                    date: newDate,
                    completed: false,
                    exercises: (lastWeekSameDay.exercises || []).map(ex => ({
                        id: uuid(),
                        name: ex.name,
                        sets: (ex.sets || []).map(set => ({
                            id: uuid(),
                            setNumber: set.setNumber || 1,
                            kg: set.kg || '',
                            reps: set.reps || '',
                            rir: set.rir || '',
                            planKg: set.planKg || '',
                            planReps: set.planReps || '',
                            planRir: set.planRir || ''
                        }))
                    }))
                };

                app.sessions.push(newSession);
                save();
                refresh();
                toast(`Entrenamiento copiado de la semana pasada: ${newSession.name}`, 'ok');
            }

            /* =================== Manual Save System =================== */
            function startEditingSession(sessionId) {
                const session = app.sessions.find(s => s.id === sessionId);
                if (!session) return;
                
                // Create deep copy for snapshot
                app.sessionSnapshots[sessionId] = JSON.parse(JSON.stringify(session));
                
                // Mark as editing
                if (!app.editingSessions[sessionId]) {
                    app.editingSessions[sessionId] = { isEditing: true, hasChanges: false };
                } else {
                    app.editingSessions[sessionId].isEditing = true;
                    app.editingSessions[sessionId].hasChanges = false;
                }
                
                updateSessionEditUI(sessionId);
            }

            function saveSessionChanges(sessionId) {
                const session = app.sessions.find(s => s.id === sessionId);
                if (!session) return;
                
                // Validate session data
                if (!session.name || !session.name.trim()) {
                    toast('El nombre de la sesión no puede estar vacío', 'warn');
                    return;
                }
                
                // Recalculate PRs and 1RM for all exercises in the session
                session.exercises.forEach(ex => {
                    ex.sets.forEach(set => {
                        if (set.kg && set.reps) {
                            checkAndRecordPRs(sessionId, ex.id, set.id, ex.name);
                            const onerm = calculate1RM(set.kg, set.reps);
                            if (onerm) {
                                update1RM(ex.name, onerm);
                            }
                        }
                    });
                });
                
                // Update goals progress if session is completed
                if (session.completed && app.goals && app.goals.length > 0) {
                    app.goals.forEach(goal => updateGoalProgress(goal));
                }
                
                // Save to persistent storage
                save();
                
                // Clear editing state
                if (app.editingSessions[sessionId]) {
                    app.editingSessions[sessionId].isEditing = false;
                    app.editingSessions[sessionId].hasChanges = false;
                }
                delete app.sessionSnapshots[sessionId];
                
                updateSessionEditUI(sessionId);
                refresh({ preserveTab: true });
                toast('Cambios guardados', 'ok');
            }

            function cancelSessionChanges(sessionId) {
                const session = app.sessions.find(s => s.id === sessionId);
                const snapshot = app.sessionSnapshots[sessionId];
                if (!session || !snapshot) return;
                
                // Restore from snapshot
                const sessionIndex = app.sessions.findIndex(s => s.id === sessionId);
                if (sessionIndex !== -1) {
                    app.sessions[sessionIndex] = JSON.parse(JSON.stringify(snapshot));
                }
                
                // Clear editing state
                if (app.editingSessions[sessionId]) {
                    app.editingSessions[sessionId].isEditing = false;
                    app.editingSessions[sessionId].hasChanges = false;
                }
                delete app.sessionSnapshots[sessionId];
                
                updateSessionEditUI(sessionId);
                refresh({ preserveTab: true });
                toast('Cambios descartados', 'ok');
            }

            function markSessionAsChanged(sessionId) {
                if (app.editingSessions[sessionId]) {
                    app.editingSessions[sessionId].hasChanges = true;
                } else {
                    app.editingSessions[sessionId] = { isEditing: false, hasChanges: true };
                }
                updateSessionEditUI(sessionId);
            }

            function updateSessionEditUI(sessionId) {
                const sessionEl = document.querySelector(`.session[data-id="${sessionId}"]`);
                if (!sessionEl) return;
                
                const editState = app.editingSessions[sessionId];
                const isEditing = editState && editState.isEditing;
                const hasChanges = editState && editState.hasChanges;
                
                // Toggle editing class
                if (isEditing) {
                    sessionEl.classList.add('editing');
                } else {
                    sessionEl.classList.remove('editing');
                }
                
                // Toggle changes indicator (only for name changes)
                if (hasChanges) {
                    sessionEl.classList.add('has-changes');
                    const indicator = sessionEl.querySelector('.session__changes-indicator');
                    if (indicator) indicator.style.display = 'flex';
                } else {
                    sessionEl.classList.remove('has-changes');
                    const indicator = sessionEl.querySelector('.session__changes-indicator');
                    if (indicator) indicator.style.display = 'none';
                }
                
                // Hide edit controls permanently (not needed anymore - edit button opens dialog directly)
                const editControls = sessionEl.querySelector('.session__edit-controls');
                if (editControls) {
                    editControls.style.display = 'none';
                }
                
                // Exercise names are always editable - no restrictions
                // Sets are always editable
                // Exercise deletion is always available - no restrictions
            }

            function hasUnsavedChanges() {
                return Object.values(app.editingSessions).some(state => state.hasChanges);
            }

            function getEditingSessionIds() {
                return Object.keys(app.editingSessions).filter(id => 
                    app.editingSessions[id] && app.editingSessions[id].isEditing
                );
            }

            /* =================== CRUD =================== */
            function addSession({ name, date }) {
                app.sessions.push({ id: uuid(), name, date, completed: false, exercises: [] }); save(); refresh();
            }
            function updateSession(id, { name, date }) {
                const session = app.sessions.find(s => s.id === id);
                if (!session) return;
                session.name = name;
                session.date = date;
                save(); refresh();
            }
            function deleteSession(id) {
                app.deleteTarget = { type: 'session', id };
                showConfirmDialog('¿Estás seguro de que quieres eliminar esta sesión? Esta acción no se puede deshacer.');
            }
            function toggleCompleted(id) {
                const s = app.sessions.find(x => x.id === id);
                if (!s) return;
                s.completed = !s.completed;
                save();
                // Update competitive mode stats
                updateStreak();
                updateWeeklyGoal();
                checkAchievements();
                // Update goals progress
                if (app.goals && app.goals.length > 0) {
                    app.goals.forEach(goal => updateGoalProgress(goal));
                    save();
                }
                refresh();
            }
            function addExercise(sessionId, name) {
                const s = app.sessions.find(x => x.id === sessionId); if (!s) return;
                
                // No edit mode required - always allow adding exercises
                
                s.exercises.push({ id: uuid(), name, sets: [{ id: uuid(), setNumber: 1, kg: '', reps: '', rir: '' }] });
                save();
                refresh({ preserveTab: true });
            }
            
            function deleteExercise(sessionId, exId) {
                const s = app.sessions.find(x => x.id === sessionId);
                if (!s) return;
                
                // No edit mode required - always allow deleting exercises (with confirmation)
                const ex = s.exercises.find(e => e.id === exId);
                if (!ex) return;
                
                // Show confirmation dialog
                app.deleteTarget = { type: 'exercise', sessionId, exId };
                showConfirmDialog(`¿Estás seguro de que quieres eliminar el ejercicio "${ex.name}"? Esta acción no se puede deshacer.`);
            }
            
            function updateExerciseName(sessionId, exId, newName, oldName = null) {
                const s = app.sessions.find(x => x.id === sessionId);
                if (!s) return false;
                const ex = s.exercises.find(e => e.id === exId);
                if (!ex) return false;
                
                // No edit mode required - always allow editing
                
                if (!newName || !newName.trim()) {
                    toast('El nombre del ejercicio no puede estar vacío', 'warn');
                    return false;
                }
                
                const trimmedNewName = newName.trim();
                const trimmedOldName = oldName ? oldName.trim() : ex.name.trim();
                
                // If name hasn't changed, do nothing
                if (trimmedNewName === trimmedOldName) {
                    return true;
                }
                
                // Remove statistics from old name (don't migrate - old name should not count for stats)
                if (trimmedOldName !== trimmedNewName) {
                    // Remove PRs for the old name (only for this specific exercise)
                    // Note: We don't migrate stats - the old name should not count for statistics
                    // The new name will have its stats recalculated from scratch below
                    
                    // Initialize PRs for new name if needed
                    if (!app.prs[trimmedNewName]) {
                        app.prs[trimmedNewName] = { maxKg: 0, maxVolume: 0, maxRepsByKg: {} };
                    }
                    
                    // Initialize 1RM for new name if needed
                    if (!app.onerm[trimmedNewName]) {
                        app.onerm[trimmedNewName] = 0;
                    }
                }
                
                // Update the current exercise name
                ex.name = trimmedNewName;
                
                // Recalculate statistics for all sets with the new name
                if (ex.sets && ex.sets.length > 0) {
                    ex.sets.forEach(set => {
                        if (set.kg && set.reps) {
                            checkAndRecordPRs(sessionId, exId, set.id, trimmedNewName);
                            const onerm = calculate1RM(set.kg, set.reps);
                            if (onerm) {
                                update1RM(trimmedNewName, onerm);
                            }
                        }
                    });
                }
                
                // Update exercise notes if they exist
                const noteKey = `${sessionId}_${exId}`;
                if (app.exerciseNotes && app.exerciseNotes[noteKey]) {
                    // Notes are tied to session and exercise ID, not name, so no migration needed
                }
                
                save();
                refresh({ preserveTab: true });
                toast(`Ejercicio renombrado: "${trimmedOldName}" → "${trimmedNewName}"`, 'ok');
                return true;
            }
            
            function addSet(sessionId, exId) {
                const s = app.sessions.find(x => x.id === sessionId); if (!s) return;
                const ex = s.exercises.find(e => e.id === exId); if (!ex) return;
                
                // Sets can always be added - no edit mode required
                ex.sets.push({ id: uuid(), setNumber: ex.sets.length + 1, kg: '', reps: '', rir: '' });
                save();
                refresh({ preserveTab: true });
            }
            function deleteSet(sessionId, exId, setId) {
                const s = app.sessions.find(x => x.id === sessionId);
                if (!s) return;
                const ex = s.exercises.find(e => e.id === exId);
                if (!ex) return;
                
                // Check if it's the last set
                if (ex.sets.length <= 1) {
                    toast('Debe haber al menos un set', 'warn');
                    return;
                }
                
                // Sets can always be deleted - no edit mode required
                ex.sets = ex.sets.filter(t => t.id !== setId);
                ex.sets.forEach((t, i) => t.setNumber = i + 1);
                save();
                refresh({ preserveTab: true });
            }
            // Debounce timer for set updates to avoid closing keyboard on mobile
            let setUpdateTimer = null;
            let focusedInput = null;

            function updateSet(sessionId, exId, setId, field, value, skipRefresh = false) {
                const s = app.sessions.find(x => x.id === sessionId); if (!s) return;
                const ex = s.exercises.find(e => e.id === exId); if (!ex) return;
                const st = ex.sets.find(t => t.id === setId); if (!st) return;
                
                // Sets are always editable - no edit mode required
                st[field] = value;

                // Check for PRs and calculate 1RM after updating
                if ((field === 'kg' || field === 'reps') && st.kg && st.reps) {
                    checkAndRecordPRs(sessionId, exId, setId, ex.name);
                    const onerm = calculate1RM(st.kg, st.reps);
                    if (onerm) {
                        update1RM(ex.name, onerm);
                    }
                }

                // Update goals progress if session is completed
                if (s.completed && app.goals && app.goals.length > 0) {
                    app.goals.forEach(goal => updateGoalProgress(goal));
                }

                // Save automatically (sets are always saved immediately)
                save();
                
                // Only refresh if not skipping (to avoid closing keyboard on mobile)
                if (!skipRefresh) {
                    clearTimeout(setUpdateTimer);
                    setUpdateTimer = setTimeout(() => {
                        refresh({ preserveTab: true });
                    }, 300);
                }
            }

            /* =================== Confirm Dialog =================== */
            function showConfirmDialog(message) {
                $('#confirmMessage').textContent = message;
                $('#confirmDialog').showModal();
            }

            /* =================== Estadísticas + Chart =================== */

            // Nueva función para obtener estadísticas de un ejercicio en un período específico
            function getExerciseStatsForPeriod(exerciseName, periodType) {
                let startDate, endDate;
                const today = new Date();
                today.setHours(23, 59, 59, 999);

                switch (periodType) {
                    case 'lastWeek':
                        // Semana pasada: 7 días antes de la semana actual
                        const currentWeekStart = startOfWeek();
                        startDate = addDays(currentWeekStart, -7);
                        endDate = addDays(startDate, 6);
                        break;

                    case '4weeks':
                        // Hace 4 semanas: de hace 28 a 21 días atrás
                        endDate = addDays(today, -21);
                        endDate.setHours(23, 59, 59, 999);
                        startDate = addDays(today, -28);
                        startDate.setHours(0, 0, 0, 0);
                        break;

                    case '8weeks':
                        // Hace 8 semanas: de hace 56 a 49 días atrás
                        endDate = addDays(today, -49);
                        endDate.setHours(23, 59, 59, 999);
                        startDate = addDays(today, -56);
                        startDate.setHours(0, 0, 0, 0);
                        break;

                    case 'beginning':
                    default:
                        // Desde el principio: todas las sesiones anteriores a la semana actual
                        const currentStart = startOfWeek();
                        startDate = new Date(2000, 0, 1); // Fecha muy temprana
                        endDate = addDays(currentStart, -1);
                        endDate.setHours(23, 59, 59, 999);
                        break;
                }

                // Filtrar sesiones en el período especificado
                const periodSessions = app.sessions.filter(s => {
                    const d = parseLocalDate(s.date);
                    return d >= startDate && d <= endDate;
                });

                let maxKg = 0;
                let totalReps = 0;
                let totalVol = 0;
                let rirSum = 0;
                let rirCount = 0;
                let sessionCount = 0;

                periodSessions.forEach(s => {
                    const ex = (s.exercises || []).find(e => e.name === exerciseName);
                    if (!ex) return;

                    sessionCount++;
                    (ex.sets || []).forEach(st => {
                        const kg = parseFloat(st.kg) || 0;
                        const reps = parseReps(st.reps);
                        const rir = parseRIR(st.rir);

                        maxKg = Math.max(maxKg, kg);
                        if (reps > 0) {
                            totalReps += reps;
                            totalVol += kg * reps;
                        }
                        if (rir > 0) {
                            rirSum += rir;
                            rirCount++;
                        }
                    });
                });

                return {
                    maxKg,
                    totalReps,
                    totalVol,
                    avgRir: rirCount ? (rirSum / rirCount) : 0,
                    sessionCount
                };
            }

            // Función para obtener estadísticas de la semana actual
            function getCurrentWeekStats(exerciseName) {
                const { ws, we } = getVisibleWeek();

                const weekSessions = app.sessions.filter(s => {
                    const d = parseLocalDate(s.date);
                    return d >= ws && d <= we;
                });

                let maxKg = 0;
                let totalReps = 0;
                let totalVol = 0;
                let rirSum = 0;
                let rirCount = 0;
                let sessionCount = 0;

                weekSessions.forEach(s => {
                    const ex = (s.exercises || []).find(e => e.name === exerciseName);
                    if (!ex) return;

                    sessionCount++;
                    (ex.sets || []).forEach(st => {
                        const kg = parseFloat(st.kg) || 0;
                        const reps = parseReps(st.reps);
                        const rir = parseRIR(st.rir);

                        maxKg = Math.max(maxKg, kg);
                        if (reps > 0) {
                            totalReps += reps;
                            totalVol += kg * reps;
                        }
                        if (rir > 0) {
                            rirSum += rir;
                            rirCount++;
                        }
                    });
                });

                return {
                    maxKg,
                    totalReps,
                    totalVol,
                    avgRir: rirCount ? (rirSum / rirCount) : 0,
                    sessionCount
                };
            }

            // Función buildStats modificada - usa los mismos filtros compartidos que drawChart
            function buildStats() {
                const body = $('#statsBody');
                const sharedMetric = $('#sharedMetric');
                const sharedExercise = $('#sharedExercise');
                const sharedPeriod = $('#sharedPeriod');

                if (!body) return;

                if (app.sessions.length === 0) {
                    body.innerHTML = '<tr><td colspan="7" style="padding:16px">No hay datos suficientes</td></tr>';
                    return;
                }

                // Use shared filters (same as chart)
                const metric = sharedMetric ? sharedMetric.value : (app.chartState.metric || 'volume');
                // For input field, check value or use 'all' if empty
                let exerciseFilter = 'all';
                if (sharedExercise) {
                    const exerciseValue = sharedExercise.value.trim();
                    exerciseFilter = exerciseValue === '' ? 'all' : exerciseValue;
                } else {
                    exerciseFilter = app.chartState.exercise || 'all';
                }
                const period = sharedPeriod ? parseInt(sharedPeriod.value) : (app.chartState.period || 4);

                // Get exercises to show (filtered by exerciseFilter)
                const allExercises = new Set();
                app.sessions.forEach(s => {
                    (s.exercises || []).forEach(e => {
                        if (exerciseFilter === 'all' || e.name === exerciseFilter) {
                            allExercises.add(e.name);
                        }
                    });
                });

                // Calculate current period stats (same logic as weeklyData)
                const base = startOfWeek();
                const currentPeriodSessions = [];
                for (let i = period - 1; i >= 0; i--) {
                    const ws = addDays(base, -i * 7), we = addDays(ws, 6);
                    const subset = app.sessions.filter(s => {
                        const d = parseLocalDate(s.date);
                        return d >= ws && d <= we;
                    });
                    currentPeriodSessions.push(...subset);
                }

                // Calculate comparison period stats (previous period of same length)
                const comparisonPeriodSessions = [];
                for (let i = period * 2 - 1; i >= period; i--) {
                    const ws = addDays(base, -i * 7), we = addDays(ws, 6);
                    const subset = app.sessions.filter(s => {
                        const d = parseLocalDate(s.date);
                        return d >= ws && d <= we;
                    });
                    comparisonPeriodSessions.push(...subset);
                }

                const rows = [...allExercises].map(exerciseName => {
                    // Calculate stats for current period
                    let currentValue = 0;
                    let currentStats = { maxKg: 0, totalReps: 0, totalVol: 0, rirSum: 0, rirCount: 0, sessionCount: 0 };
                    
                    currentPeriodSessions.forEach(s => {
                        const ex = (s.exercises || []).find(e => e.name === exerciseName);
                        if (!ex) return;
                        currentStats.sessionCount++;
                        (ex.sets || []).forEach(st => {
                            const kg = parseFloat(st.kg) || 0;
                            const reps = parseReps(st.reps);
                            const rir = parseRIR(st.rir);
                            currentStats.maxKg = Math.max(currentStats.maxKg, kg);
                            if (reps > 0) {
                                currentStats.totalReps += reps;
                                currentStats.totalVol += kg * reps;
                            }
                            if (rir > 0) {
                                currentStats.rirSum += rir;
                                currentStats.rirCount++;
                            }
                        });
                    });
                    
                    const currentAvgRir = currentStats.rirCount > 0 ? currentStats.rirSum / currentStats.rirCount : 0;

                    // Calculate stats for comparison period
                    let comparisonValue = 0;
                    let comparisonStats = { maxKg: 0, totalReps: 0, totalVol: 0, rirSum: 0, rirCount: 0, sessionCount: 0 };
                    
                    comparisonPeriodSessions.forEach(s => {
                        const ex = (s.exercises || []).find(e => e.name === exerciseName);
                        if (!ex) return;
                        comparisonStats.sessionCount++;
                        (ex.sets || []).forEach(st => {
                            const kg = parseFloat(st.kg) || 0;
                            const reps = parseReps(st.reps);
                            const rir = parseRIR(st.rir);
                            comparisonStats.maxKg = Math.max(comparisonStats.maxKg, kg);
                            if (reps > 0) {
                                comparisonStats.totalReps += reps;
                                comparisonStats.totalVol += kg * reps;
                            }
                            if (rir > 0) {
                                comparisonStats.rirSum += rir;
                                comparisonStats.rirCount++;
                            }
                        });
                    });
                    
                    const comparisonAvgRir = comparisonStats.rirCount > 0 ? comparisonStats.rirSum / comparisonStats.rirCount : 0;

                    // Calculate metric value based on selected metric
                    if (metric === 'volume') {
                        currentValue = currentStats.totalVol;
                        comparisonValue = comparisonStats.totalVol;
                    } else if (metric === 'weight') {
                        currentValue = currentStats.maxKg;
                        comparisonValue = comparisonStats.maxKg;
                    } else if (metric === 'rir') {
                        currentValue = currentAvgRir;
                        comparisonValue = comparisonAvgRir;
                    }

                    // Calculate progress - compare current period with previous period of same length
                    let progressText = 'Sin datos';
                    let progressClass = 'progress--same';
                    let baseValue = comparisonValue;
                    
                    // Check if comparison period has sufficient data
                    // Group comparison period sessions by week to verify we have enough weeks
                    const comparisonWeeks = new Set();
                    comparisonPeriodSessions.forEach(s => {
                        const d = parseLocalDate(s.date);
                        const weekStart = startOfWeek(d);
                        const weekKey = weekStart.toISOString().split('T')[0];
                        comparisonWeeks.add(weekKey);
                    });
                    
                    // Check if comparison period has sessions for this exercise
                    const hasComparisonData = comparisonPeriodSessions.some(s => {
                        const ex = (s.exercises || []).find(e => e.name === exerciseName);
                        return ex && ex.sets && ex.sets.length > 0;
                    });
                    
                    // Check if comparison period has enough weeks (should match current period length)
                    const hasEnoughWeeks = comparisonWeeks.size >= period;

                    // If no comparison period data for this exercise OR not enough weeks, compare with first week of data
                    if ((comparisonValue === 0 || !hasComparisonData || !hasEnoughWeeks) && currentValue > 0) {
                        // Find first week with this exercise
                        const allSessionsWithExercise = [...app.sessions]
                            .filter(s => {
                                const ex = (s.exercises || []).find(e => e.name === exerciseName);
                                return ex && ex.sets && ex.sets.length > 0;
                            })
                            .sort((a, b) => new Date(a.date) - new Date(b.date));
                        
                        if (allSessionsWithExercise.length > 0) {
                            // Group sessions by week
                            const sessionsByWeek = new Map();
                            allSessionsWithExercise.forEach(s => {
                                const d = parseLocalDate(s.date);
                                const weekStart = startOfWeek(d);
                                const weekKey = weekStart.toISOString().split('T')[0];
                                
                                if (!sessionsByWeek.has(weekKey)) {
                                    sessionsByWeek.set(weekKey, []);
                                }
                                sessionsByWeek.get(weekKey).push(s);
                            });
                            
                            // Get first week
                            const firstWeekKey = Array.from(sessionsByWeek.keys()).sort()[0];
                            const firstWeekSessions = sessionsByWeek.get(firstWeekKey);
                            
                            // Calculate stats for first week
                            const firstWeekStats = { maxKg: 0, totalReps: 0, totalVol: 0, rirSum: 0, rirCount: 0 };
                            firstWeekSessions.forEach(s => {
                                const ex = s.exercises.find(e => e.name === exerciseName);
                                if (ex) {
                                    ex.sets.forEach(st => {
                                        const kg = parseFloat(st.kg) || 0;
                                        const reps = parseReps(st.reps);
                                        const rir = parseRIR(st.rir);
                                        firstWeekStats.maxKg = Math.max(firstWeekStats.maxKg, kg);
                                        if (reps > 0) {
                                            firstWeekStats.totalReps += reps;
                                            firstWeekStats.totalVol += kg * reps;
                                        }
                                        if (rir > 0) {
                                            firstWeekStats.rirSum += rir;
                                            firstWeekStats.rirCount++;
                                        }
                                    });
                                }
                            });
                            
                            const firstWeekAvgRir = firstWeekStats.rirCount > 0 ? firstWeekStats.rirSum / firstWeekStats.rirCount : 0;
                            
                            // Get first week value based on metric
                            // When no comparison period exists, compare last week of current period with first week
                            // This gives a meaningful progress percentage (week-to-week comparison)
                            const lastWeekSessions = [];
                            const lastWeekStart = addDays(base, -(period - 1) * 7);
                            const lastWeekEnd = addDays(lastWeekStart, 6);
                            currentPeriodSessions.forEach(s => {
                                const d = parseLocalDate(s.date);
                                if (d >= lastWeekStart && d <= lastWeekEnd) {
                                    lastWeekSessions.push(s);
                                }
                            });
                            
                            // Calculate last week stats
                            const lastWeekStats = { maxKg: 0, totalVol: 0, rirSum: 0, rirCount: 0 };
                            lastWeekSessions.forEach(s => {
                                const ex = (s.exercises || []).find(e => e.name === exerciseName);
                                if (ex) {
                                    ex.sets.forEach(st => {
                                        const kg = parseFloat(st.kg) || 0;
                                        const reps = parseReps(st.reps);
                                        const rir = parseRIR(st.rir);
                                        lastWeekStats.maxKg = Math.max(lastWeekStats.maxKg, kg);
                                        if (reps > 0) {
                                            lastWeekStats.totalVol += kg * reps;
                                        }
                                        if (rir > 0) {
                                            lastWeekStats.rirSum += rir;
                                            lastWeekStats.rirCount++;
                                        }
                                    });
                                }
                            });
                            const lastWeekAvgRir = lastWeekStats.rirCount > 0 ? lastWeekStats.rirSum / lastWeekStats.rirCount : 0;
                            
                            // Compare last week with first week (week-to-week comparison)
                            // Always use week-to-week comparison when no comparison period exists
                            if (metric === 'volume') {
                                // Use last week volume, or if no data in last week, use the most recent week with data
                                if (lastWeekStats.totalVol > 0) {
                                    currentValue = lastWeekStats.totalVol;
                                } else {
                                    // Find most recent week with data
                                    const weeksWithData = Array.from(sessionsByWeek.keys()).sort().reverse();
                                    for (const weekKey of weeksWithData) {
                                        const weekSessions = sessionsByWeek.get(weekKey);
                                        let weekVol = 0;
                                        weekSessions.forEach(s => {
                                            const ex = s.exercises.find(e => e.name === exerciseName);
                                            if (ex) {
                                                ex.sets.forEach(st => {
                                                    const kg = parseFloat(st.kg) || 0;
                                                    const reps = parseReps(st.reps);
                                                    if (reps > 0) {
                                                        weekVol += kg * reps;
                                                    }
                                                });
                                            }
                                        });
                                        if (weekVol > 0) {
                                            currentValue = weekVol;
                                            break;
                                        }
                                    }
                                }
                                baseValue = firstWeekStats.totalVol;
                            } else if (metric === 'weight') {
                                if (lastWeekStats.maxKg > 0) {
                                    currentValue = lastWeekStats.maxKg;
                                } else {
                                    // Find most recent week with data
                                    const weeksWithData = Array.from(sessionsByWeek.keys()).sort().reverse();
                                    for (const weekKey of weeksWithData) {
                                        const weekSessions = sessionsByWeek.get(weekKey);
                                        let weekMaxKg = 0;
                                        weekSessions.forEach(s => {
                                            const ex = s.exercises.find(e => e.name === exerciseName);
                                            if (ex) {
                                                ex.sets.forEach(st => {
                                                    const kg = parseFloat(st.kg) || 0;
                                                    weekMaxKg = Math.max(weekMaxKg, kg);
                                                });
                                            }
                                        });
                                        if (weekMaxKg > 0) {
                                            currentValue = weekMaxKg;
                                            break;
                                        }
                                    }
                                }
                                baseValue = firstWeekStats.maxKg;
                            } else if (metric === 'rir') {
                                if (lastWeekAvgRir > 0) {
                                    currentValue = lastWeekAvgRir;
                                } else {
                                    // Find most recent week with data
                                    const weeksWithData = Array.from(sessionsByWeek.keys()).sort().reverse();
                                    for (const weekKey of weeksWithData) {
                                        const weekSessions = sessionsByWeek.get(weekKey);
                                        let rirSum = 0, rirCount = 0;
                                        weekSessions.forEach(s => {
                                            const ex = s.exercises.find(e => e.name === exerciseName);
                                            if (ex) {
                                                ex.sets.forEach(st => {
                                                    const rir = parseRIR(st.rir);
                                                    if (rir > 0) {
                                                        rirSum += rir;
                                                        rirCount++;
                                                    }
                                                });
                                            }
                                        });
                                        if (rirCount > 0) {
                                            currentValue = rirSum / rirCount;
                                            break;
                                        }
                                    }
                                }
                                baseValue = firstWeekAvgRir;
                            }
                        }
                    }

                    if (baseValue > 0) {
                        const diff = ((currentValue - baseValue) / baseValue * 100);
                        if (diff > 0) {
                            progressText = `+${diff.toFixed(1)}%`;
                            progressClass = 'progress--up';
                        } else if (diff < 0) {
                            progressText = `${diff.toFixed(1)}%`;
                            progressClass = 'progress--down';
                        } else {
                            progressText = '0%';
                            progressClass = 'progress--same';
                        }
                    } else if (currentValue > 0) {
                        progressText = 'Primer registro';
                        progressClass = 'progress--up';
                    }

                    return `
                <tr>
                    <td><strong>${exerciseName}</strong></td>
                    <td>${currentStats.sessionCount}</td>
                    <td>${currentStats.maxKg} kg</td>
                    <td>${currentStats.totalReps}</td>
                    <td>${currentStats.totalVol.toLocaleString()} kg</td>
                    <td>${currentAvgRir > 0 ? currentAvgRir.toFixed(1) : '–'}</td>
                    <td class="${progressClass}">${progressText}</td>
                </tr>
            `;
                }).join('');

                body.innerHTML = rows || '<tr><td colspan="7" style="padding:16px">No hay datos suficientes</td></tr>';
            }

            function buildChartState() {
                // Shared filters (used by both chart and stats)
                const sharedMetric = $('#sharedMetric');
                const sharedExercise = $('#sharedExercise');
                const sharedPeriod = $('#sharedPeriod');

                // Initialize shared filters with current state
                if (sharedMetric) {
                    sharedMetric.value = app.chartState.metric || 'volume';
                    sharedMetric.onchange = () => {
                        app.chartState.metric = sharedMetric.value;
                        drawChart();
                        buildStats();
                    };
                }

                if (sharedExercise) {
                    // Get all exercises
                    const allExercises = new Set();
                    app.sessions.forEach(s => {
                        (s.exercises || []).forEach(e => allExercises.add(e.name));
                    });
                    const exercisesList = [...allExercises].sort();
                    
                    // Set initial value
                    const currentExercise = app.chartState.exercise || 'all';
                    if (currentExercise === 'all') {
                        sharedExercise.value = '';
                        sharedExercise.placeholder = 'Todos los ejercicios';
                    } else {
                        sharedExercise.value = currentExercise;
                    }
                    
                    const suggestionsDiv = $('#exerciseSuggestions');
                    let highlightedIndex = -1;
                    
                    // Function to filter and show suggestions
                    const showSuggestions = (query) => {
                        if (!suggestionsDiv) return;
                        
                        const queryLower = query.toLowerCase().trim();
                        let filtered = [];
                        
                        if (queryLower === '') {
                            // Show "Todos los ejercicios" option
                            filtered = [{ name: 'all', display: 'Todos los ejercicios' }];
                        } else {
                            // Filter exercises that start with the query
                            filtered = exercisesList
                                .filter(ex => ex.toLowerCase().startsWith(queryLower))
                                .map(ex => ({ name: ex, display: ex }));
                        }
                        
                        if (filtered.length === 0) {
                            suggestionsDiv.style.display = 'none';
                            return;
                        }
                        
                        suggestionsDiv.innerHTML = '';
                        filtered.forEach((item, index) => {
                            const div = document.createElement('div');
                            div.className = `exercise-suggestion-item ${item.name === 'all' ? 'all-exercises' : ''}`;
                            div.textContent = item.display;
                            div.dataset.exercise = item.name;
                            div.addEventListener('click', () => {
                                selectExercise(item.name);
                            });
                            suggestionsDiv.appendChild(div);
                        });
                        
                        suggestionsDiv.style.display = 'block';
                        highlightedIndex = -1;
                    };
                    
                    // Function to select an exercise
                    const selectExercise = (exerciseName) => {
                        if (exerciseName === 'all') {
                            sharedExercise.value = '';
                            sharedExercise.placeholder = 'Todos los ejercicios';
                            app.chartState.exercise = 'all';
                        } else {
                            sharedExercise.value = exerciseName;
                            app.chartState.exercise = exerciseName;
                        }
                        suggestionsDiv.style.display = 'none';
                        drawChart();
                        buildStats();
                    };
                    
                    // Input event listener
                    sharedExercise.addEventListener('input', (e) => {
                        const query = e.target.value;
                        showSuggestions(query);
                    });
                    
                    // Focus event listener
                    sharedExercise.addEventListener('focus', () => {
                        if (sharedExercise.value.trim() === '') {
                            showSuggestions('');
                        } else {
                            showSuggestions(sharedExercise.value);
                        }
                    });
                    
                    // Keyboard navigation
                    sharedExercise.addEventListener('keydown', (e) => {
                        const items = suggestionsDiv.querySelectorAll('.exercise-suggestion-item');
                        if (items.length === 0) return;
                        
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
                            items.forEach((item, idx) => {
                                item.classList.toggle('highlighted', idx === highlightedIndex);
                            });
                            items[highlightedIndex].scrollIntoView({ block: 'nearest' });
                        } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            highlightedIndex = Math.max(highlightedIndex - 1, -1);
                            items.forEach((item, idx) => {
                                item.classList.toggle('highlighted', idx === highlightedIndex);
                            });
                            if (highlightedIndex >= 0) {
                                items[highlightedIndex].scrollIntoView({ block: 'nearest' });
                            }
                        } else if (e.key === 'Enter') {
                            e.preventDefault();
                            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                                const exerciseName = items[highlightedIndex].dataset.exercise;
                                selectExercise(exerciseName);
                            } else if (items.length > 0) {
                                // Select first item if nothing is highlighted
                                const exerciseName = items[0].dataset.exercise;
                                selectExercise(exerciseName);
                            }
                        } else if (e.key === 'Escape') {
                            suggestionsDiv.style.display = 'none';
                            sharedExercise.blur();
                        }
                    });
                    
                    // Close suggestions when clicking outside
                    document.addEventListener('click', (e) => {
                        if (!sharedExercise.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                            suggestionsDiv.style.display = 'none';
                        }
                    });
                }

                if (sharedPeriod) {
                    sharedPeriod.value = String(app.chartState.period || 4);
                    sharedPeriod.onchange = () => {
                        app.chartState.period = +sharedPeriod.value;
                        drawChart();
                        buildStats();
                    };
                }

                window.addEventListener('resize', () => { resizeCanvas(); drawChart(); }, { passive: true });
                resizeCanvas();
            }

            function resizeCanvas() {
                const canvas = $('#progressChart'); if (!canvas) return;
                const dpr = Math.max(1, window.devicePixelRatio || 1);
                const rect = canvas.getBoundingClientRect();
                canvas.width = Math.floor(rect.width * dpr);
                canvas.height = Math.floor((window.innerWidth < 420 ? 230 : 250) * dpr);
                const ctx = canvas.getContext('2d');
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            }

            function weeklyData(period = 4, filter = 'all', metric = 'volume') {
                const weeks = [], values = [];
                const base = startOfWeek();

                for (let i = period - 1; i >= 0; i--) {
                    const ws = addDays(base, -i * 7), we = addDays(ws, 6);
                    const subset = app.sessions.filter(s => {
                        const d = new Date(s.date);
                        return d >= ws && d <= we;
                    });

                    let value = 0;
                    if (metric === 'volume') {
                        subset.forEach(s => (s.exercises || []).forEach(e => {
                            if (filter === 'all' || e.name === filter) {
                                (e.sets || []).forEach(st => value += (parseFloat(st.kg) || 0) * parseReps(st.reps));
                            }
                        }));
                    } else if (metric === 'rir') {
                        let rirSum = 0, rirCount = 0;
                        subset.forEach(s => (s.exercises || []).forEach(e => {
                            if (filter === 'all' || e.name === filter) {
                                (e.sets || []).forEach(st => {
                                    const rir = parseRIR(st.rir);
                                    if (rir > 0) {
                                        rirSum += rir;
                                        rirCount++;
                                    }
                                });
                            }
                        }));
                        value = rirCount ? (rirSum / rirCount) : 0;
                    } else if (metric === 'weight') {
                        subset.forEach(s => (s.exercises || []).forEach(e => {
                            if (filter === 'all' || e.name === filter) {
                                (e.sets || []).forEach(st => {
                                    const kg = parseFloat(st.kg) || 0;
                                    if (kg > 0) value = Math.max(value, kg);
                                });
                            }
                        }));
                    }

                    weeks.push(`Sem ${period - i}`);
                    values.push(value);
                }
                return { weeks, values };
            }

            function drawChart() {
                const canvas = $('#progressChart'); if (!canvas) return;
                const ctx = canvas.getContext('2d'); if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || 'rgba(34,211,238,0.9)';
                const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'rgba(16,185,129,0.95)';
                const gridColor = getComputedStyle(document.body).getPropertyValue('--muted').trim() || '#94a3b8';
                const textColor = getComputedStyle(document.body).getPropertyValue('--heading-strong').trim() || '#fff';

                const padding = { l: 36, r: 14, t: 12, b: 30 };
                const w = canvas.clientWidth || canvas.width;
                const h = (window.innerWidth < 420 ? 230 : 250);

                // Use shared filters
                const sharedMetric = $('#sharedMetric');
                const sharedExercise = $('#sharedExercise');
                const sharedPeriod = $('#sharedPeriod');
                
                const period = sharedPeriod ? parseInt(sharedPeriod.value) : (app.chartState.period || 4);
                // For input field, check value or use 'all' if empty
                let filter = 'all';
                if (sharedExercise) {
                    const exerciseValue = sharedExercise.value.trim();
                    filter = exerciseValue === '' ? 'all' : exerciseValue;
                } else {
                    filter = app.chartState.exercise || 'all';
                }
                const metric = sharedMetric ? sharedMetric.value : (app.chartState.metric || 'volume');
                const { weeks, values } = weeklyData(period, filter, metric);

                const trend = values.map((_, i, arr) => {
                    const a = Math.max(0, i - 2), b = i; const slice = arr.slice(a, b + 1);
                    const sum = slice.reduce((s, v) => s + v, 0); return +(sum / slice.length).toFixed(1);
                });

                const vmax = Math.max(1, ...values);
                const cw = w - padding.l - padding.r;
                const ch = h - padding.t - padding.b;
                const barW = cw / weeks.length * 0.56;
                const step = cw / weeks.length;

                // Ejes
                ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(padding.l, padding.t); ctx.lineTo(padding.l, padding.t + ch); ctx.lineTo(padding.l + cw, padding.t + ch); ctx.stroke();

                // Ticks Y
                ctx.fillStyle = textColor; ctx.font = '12px Poppins, system-ui, sans-serif';
                const ticks = 4;
                for (let i = 1; i <= ticks; i++) {
                    const val = Math.round(vmax * (i / ticks));
                    const y = padding.t + ch - (val / vmax) * ch;
                    ctx.strokeStyle = gridColor; ctx.beginPath(); ctx.moveTo(padding.l, y); ctx.lineTo(padding.l + cw, y); ctx.stroke();
                    ctx.fillStyle = textColor; ctx.fillText(val.toLocaleString(), 6, y + 4);
                }

                // Barras + etiquetas
                ctx.textAlign = 'center';
                for (let i = 0; i < weeks.length; i++) {
                    const x = padding.l + i * step + (step - barW) / 2;
                    const y = padding.t + ch - (values[i] / vmax) * ch;
                    const hBar = (values[i] / vmax) * ch;
                    ctx.fillStyle = barColor;
                    ctx.fillRect(x, y, barW, Math.max(0, hBar));
                    ctx.fillStyle = textColor;
                    ctx.fillText(weeks[i], x + barW / 2, padding.t + ch + 14);
                    const valY = y - 6;
                    if (valY > padding.t + 6) {
                        let label = values[i].toLocaleString();
                        if (metric === 'rir') label = values[i].toFixed(1);
                        ctx.fillText(label, x + barW / 2, valY);
                    }
                }

                // Línea tendencia
                ctx.strokeStyle = lineColor; ctx.lineWidth = 2; ctx.beginPath();
                for (let i = 0; i < trend.length; i++) {
                    const x = padding.l + i * step + step / 2;
                    const y = padding.t + ch - (trend[i] / vmax) * ch;
                    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.stroke();
                // Puntos
                ctx.fillStyle = lineColor;
                for (let i = 0; i < trend.length; i++) {
                    const x = padding.l + i * step + step / 2;
                    const y = padding.t + ch - (trend[i] / vmax) * ch;
                    ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
                }
            }

            /* =================== Import/Export =================== */
            function safeAlert(msg) {
                const box = $('#importAlert');
                box.textContent = msg;
                box.classList.remove('hidden');
            }

            function clearAlert() {
                const box = $('#importAlert');
                box.textContent = '';
                box.classList.add('hidden');

                const errorList = $('#importErrorList');
                errorList.innerHTML = '';
                errorList.classList.add('hidden');
            }

            function handleFile(e) {
                clearAlert();
                app.importBuffer = null;
                $('#preview').classList.add('hidden');
                $('#previewList').innerHTML = '';

                const fileList = e.target.files;
                const file = fileList && fileList[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if (!Array.isArray(data)) throw new Error('Formato inválido: se esperaba un array');

                        // Validación más estricta
                        const errors = [];
                        data.forEach((s, i) => {
                            if (!s.name) errors.push(`Sesión ${i + 1}: falta el nombre`);
                            if (!s.date) errors.push(`Sesión ${i + 1}: falta la fecha`);
                            if (!s.exercises || !Array.isArray(s.exercises)) errors.push(`Sesión ${i + 1}: falta el array de ejercicios`);

                            if (s.exercises && Array.isArray(s.exercises)) {
                                s.exercises.forEach((e, j) => {
                                    if (!e.name) errors.push(`Sesión ${i + 1}, ejercicio ${j + 1}: falta el nombre`);
                                    if (!e.sets || !Array.isArray(e.sets)) errors.push(`Sesión ${i + 1}, ejercicio ${j + 1}: falta el array de sets`);

                                    if (e.sets && Array.isArray(e.sets)) {
                                        e.sets.forEach((set, k) => {
                                            if (!set.setNumber) errors.push(`Sesión ${i + 1}, ejercicio ${j + 1}, set ${k + 1}: falta el número de set`);
                                        });
                                    }
                                });
                            }
                        });

                        if (errors.length > 0) {
                            const errorList = $('#importErrorList');
                            errorList.innerHTML = '<strong>Errores de validación:</strong>';
                            errors.forEach(error => {
                                const item = document.createElement('div');
                                item.className = 'import-error-item';
                                item.textContent = error;
                                errorList.appendChild(item);
                            });
                            errorList.classList.remove('hidden');
                            return;
                        }

                        app.importBuffer = data;
                        const list = $('#previewList');
                        data.slice(0, 10).forEach(s => {
                            const li = document.createElement('li');
                            li.textContent = s.name;
                            list.appendChild(li);
                        });
                        if (data.length > 10) {
                            const li = document.createElement('li');
                            li.textContent = `… y ${data.length - 10} más`;
                            list.appendChild(li);
                        }
                        $('#preview').classList.remove('hidden');
                    } catch (err) {
                        safeAlert('El archivo no es válido. Por favor, revisa el formato.');
                        console.error(err);
                    }
                };
                reader.onerror = () => safeAlert('No se pudo leer el archivo.');
                reader.readAsText(file);
            }

            function normalizeSessionFromImport(src, dateISO) {
                return {
                    id: uuid(),
                    name: String(src.name || 'Sesión'),
                    date: dateISO,
                    completed: !!src.completed,
                    exercises: (src.exercises || []).map(e => ({
                        id: uuid(),
                        name: String(e.name || 'Ejercicio'),
                        sets: (e.sets || [{ setNumber: 1, kg: '', reps: '', rir: '' }]).map((st, i) => ({
                            id: uuid(),
                            setNumber: st.setNumber || (i + 1),
                            kg: String(st.kg || ''),
                            reps: String(st.reps || ''),
                            rir: String(st.rir || '')
                        }))
                    }))
                };
            }

            function applyImport() {
                if (!app.importBuffer) {
                    safeAlert('No hay datos que importar.');
                    return;
                }

                clearAlert();

                const offset = +$('#targetWeek').value;

                // Calcula el lunes exacto de la semana objetivo (forzando 00:00 hora local)
                const monday = startOfWeek(addDays(new Date(), offset * 7));
                monday.setHours(0, 0, 0, 0);

                // Corrige desplazamiento del primer día (Día 1 = lunes)
                const mapped = app.importBuffer.map((s, idx) => {
                    const sessionDate = new Date(monday);
                    sessionDate.setDate(monday.getDate() + idx); // día consecutivo
                    sessionDate.setHours(12, 0, 0, 0); // forzamos mediodía local para evitar redondeos tz
                    const dateISO = toLocalISO(sessionDate);
                    return normalizeSessionFromImport(s, dateISO);
                });

                // Inserta las sesiones
                app.sessions = [...app.sessions, ...mapped];
                save();

                // Always refresh to update UI (renderSessions will check if we're viewing the imported week)
                refresh();

                // Limpieza
                app.importBuffer = null;
                $('#fileInput').value = '';
                $('#preview').classList.add('hidden');
                $('#importAlert').classList.add('hidden');

                // Mensaje visual
                toast('Entrenamiento importado correctamente ✔️', 'ok');
            }

            function exportSessions() {
                const blob = new Blob([JSON.stringify(app.sessions, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href = url; a.download = `training_diary_${toLocalISO(new Date())}.json`; a.click();
                URL.revokeObjectURL(url);
            }

            /* =================== Plantillas =================== */
            function openTemplatePreview(key) {
                app.tmpTemplateKey = key;
                const list = templates[key] || [];
                const cont = $('#templatePreview'); cont.innerHTML = '';
                list.forEach((s, i) => {
                    const card = document.createElement('div'); card.className = 'card'; card.style.padding = '10px';
                    card.innerHTML = `<strong>${i + 1}. ${s.name}</strong><br><span style="color:var(--muted)">${s.ex.slice(0, 5).join(', ')}${s.ex.length > 5 ? '…' : ''}</span>`;
                    cont.appendChild(card);
                });
                $('#templateDialog').showModal();
            }

            function importTemplateIntoVisibleWeek(ev) {
                if (ev) ev.preventDefault();
                const key = app.tmpTemplateKey; if (!key) return;
                const arr = templates[key] || [];
                const { ws } = getVisibleWeek(); // SIEMPRE desde lunes de la semana visible
                const toAdd = arr.map((it, idx) => ({
                    id: uuid(),
                    name: it.name,
                    date: toLocalISO(addDays(ws, idx)),
                    completed: false,
                    exercises: it.ex.map(n => ({ id: uuid(), name: n, sets: [{ id: uuid(), setNumber: 1, kg: '', reps: '', rir: '' }] }))
                }));
                app.sessions = [...app.sessions, ...toAdd];
                save(); refresh(); $('#templateDialog').close();
                toast(`Plantilla «${key}» importada en la semana visible`, 'ok');
            }

            function importRoutineIntoWeek(routineId) {
                const routine = app.routines.find(r => r.id === routineId);
                if (!routine) {
                    toast('Rutina no encontrada', 'err');
                    return;
                }
                const { ws } = getVisibleWeek();
                const days = routine.days || [];
                if (!days.length) {
                    toast('La rutina no tiene días definidos', 'warn');
                    return;
                }
                const toAdd = days.map((day, idx) => ({
                    id: uuid(),
                    name: day.name || `Sesión ${idx + 1}`,
                    date: toLocalISO(addDays(ws, idx)),
                    completed: false,
                    exercises: (day.exercises || []).map(ex => ({
                        id: uuid(),
                        name: ex.name,
                        sets: ((ex.sets && ex.sets.length) ? ex.sets : [{ planKg: '', planReps: '', planRir: '' }]).map((set, setIdx) => ({
                            id: uuid(),
                            setNumber: setIdx + 1,
                            kg: '',
                            reps: '',
                            rir: '',
                            planKg: set.planKg !== undefined ? set.planKg : (set.kg || ''),
                            planReps: set.planReps !== undefined ? set.planReps : (set.reps || ''),
                            planRir: set.planRir !== undefined ? set.planRir : (set.rir || '')
                        }))
                    }))
                }));

                app.sessions = [...app.sessions, ...toAdd];
                save();
                refresh();
                toast(`Rutina «${routine.name}» importada en la semana visible`, 'ok');
            }

            /* =================== Selector de semana (panel Importar) =================== */
            function initWeekSelector() {
                const sel = $('#targetWeek'); if (!sel) return;
                sel.innerHTML = '';
                const base = startOfWeek(new Date());
                for (let i = -8; i <= 8; i++) {
                    const ws = addDays(base, i * 7), we = addDays(ws, 6);
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = `${ws.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })} – ${we.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`;
                    if (i === app.weekOffset) opt.selected = true;
                    sel.appendChild(opt);
                }
            }

            /* =================== Toast =================== */
            function toast(msg, type = 'ok') {
                const cont = $('#toasts');
                const t = document.createElement('div');
                t.className = `toast toast--${type}`;
                t.textContent = msg;
                cont.appendChild(t);
                setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
            }

            /* =================== Eventos =================== */
            function bindEvents() {
                setupTabs();

                // Manual de Usuario
                $('#btnManual').addEventListener('click', () => {
                    $('#manualDialog').showModal();
                });

                $$('[data-close-dialog]').forEach(btn => {
                    btn.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const targetId = btn.getAttribute('data-close-dialog');
                        if (targetId) {
                            const dialog = document.getElementById(targetId);
                            if (dialog) dialog.close();
                        } else {
                            const dialog = btn.closest('dialog');
                            if (dialog) dialog.close();
                        }
                    });
                });

                // Semana
                $('#prevWeek').addEventListener('click', () => { app.weekOffset--; refresh(); });
                $('#nextWeek').addEventListener('click', () => { app.weekOffset++; refresh(); });

                const addRoutineDayBtn = document.getElementById('addRoutineDay');
                if (addRoutineDayBtn) {
                    addRoutineDayBtn.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        addRoutineDay();
                    });
                }

                const saveRoutineBtn = document.getElementById('saveRoutine');
                if (saveRoutineBtn) {
                    saveRoutineBtn.addEventListener('click', handleSaveRoutine);
                }

                const resetRoutineBtn = document.getElementById('resetRoutine');
                if (resetRoutineBtn) {
                    resetRoutineBtn.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        resetRoutineBuilder();
                    });
                }

                const routineDaysContainer = document.getElementById('routineDays');
                if (routineDaysContainer) {
                    routineDaysContainer.addEventListener('click', (ev) => {
                        const addExerciseBtn = ev.target.closest('.js-add-routine-exercise');
                        if (addExerciseBtn) {
                            ev.preventDefault();
                            const day = addExerciseBtn.closest('.routine-day');
                            addRoutineExercise(day);
                            return;
                        }
                        const deleteDayBtn = ev.target.closest('.js-delete-routine-day');
                        if (deleteDayBtn) {
                            ev.preventDefault();
                            const day = deleteDayBtn.closest('.routine-day');
                            if (day) day.remove();
                            updateRoutineDayTitles();
                            return;
                        }
                        const addSetBtn = ev.target.closest('.js-add-routine-set');
                        if (addSetBtn) {
                            ev.preventDefault();
                            const ex = addSetBtn.closest('.routine-exercise');
                            addRoutineSet(ex);
                            return;
                        }
                        const deleteExerciseBtn = ev.target.closest('.js-delete-routine-exercise');
                        if (deleteExerciseBtn) {
                            ev.preventDefault();
                            const ex = deleteExerciseBtn.closest('.routine-exercise');
                            if (ex) ex.remove();
                            return;
                        }
                        const deleteSetBtn = ev.target.closest('.js-delete-routine-set');
                        if (deleteSetBtn) {
                            ev.preventDefault();
                            const ex = deleteSetBtn.closest('.routine-exercise');
                            const setEl = deleteSetBtn.closest('.routine-set');
                            if (setEl) setEl.remove();
                            updateRoutineSetIndexes(ex);
                        }
                    });
                }

                const defaultRoutineList = document.getElementById('defaultRoutineList');
                if (defaultRoutineList) {
                    defaultRoutineList.addEventListener('click', (ev) => {
                        const btn = ev.target.closest('.js-use-template');
                        if (!btn) return;
                        ev.preventDefault();
                        loadTemplateIntoBuilder(btn.dataset.template);
                        toast('Plantilla cargada en el creador', 'ok');
                    });
                }

                const createdRoutineList = document.getElementById('createdRoutineList');
                if (createdRoutineList) {
                    createdRoutineList.addEventListener('click', (ev) => {
                        const item = ev.target.closest('.routine-created__item');
                        if (!item) return;
                        const routineId = item.dataset.routineId;
                        if (!routineId) return;

                        if (ev.target.closest('.js-toggle-routine')) {
                            ev.preventDefault();
                            const body = item.querySelector('.routine-created__body');
                            if (!body) return;
                            body.hidden = !body.hidden;
                            const btn = ev.target.closest('.js-toggle-routine');
                            if (btn) btn.textContent = body.hidden ? 'Ver' : 'Ocultar';
                            return;
                        }

                        if (ev.target.closest('.js-edit-routine')) {
                            ev.preventDefault();
                            const routine = app.routines.find(r => r.id === routineId);
                            if (!routine) return;
                            loadRoutineIntoBuilder(routine);
                            app.routineEditId = routine.id;
                            toast('Rutina cargada para editar', 'ok');
                            return;
                        }

                        if (ev.target.closest('.js-delete-routine')) {
                            ev.preventDefault();
                            app.deleteTarget = { type: 'routine', routineId };
                            showConfirmDialog('¿Eliminar esta rutina personalizada? Esta acción no se puede deshacer.');
                        }
                    });
                }

                const importRoutineList = document.getElementById('importRoutineList');
                if (importRoutineList) {
                    importRoutineList.addEventListener('click', (ev) => {
                        const btn = ev.target.closest('.js-import-user-routine');
                        if (!btn) return;
                        ev.preventDefault();
                        importRoutineIntoWeek(btn.dataset.routineId);
                    });
                }

                // Nueva sesión: por defecto lunes de semana visible
                $('#btnNewSession').addEventListener('click', () => {
                    const { ws } = getVisibleWeek();
                    $('#sessionDate').value = toLocalISO(ws);
                    $('#sessionName').value = '';
                    $('#sessionDialog').showModal();
                });

                // Copiar entrenamiento de la semana pasada
                $('#btnCopyLastWeek').addEventListener('click', () => {
                    copyLastWeekWorkout();
                });

                // Guardar sesión
                $('#saveSession').addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const name = $('#sessionName').value.trim();
                    const date = $('#sessionDate').value;
                    if (!name || !date) {
                        toast('Completa el nombre y la fecha', 'warn');
                        return;
                    }
                    addSession({ name, date });
                    $('#sessionDialog').close();
                    toast('Sesión creada', 'ok');
                });

                // Allow closing session dialog without validation
                $('#sessionDialog').addEventListener('close', () => {
                    // Reset form when closing
                    $('#sessionName').value = '';
                });

                // Actualizar sesión
                $('#updateSession').addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const id = $('#editSessionDialog').dataset.sessionId;
                    const name = $('#editSessionName').value.trim();
                    const date = $('#editSessionDate').value;
                    if (!name || !date || !id) return;
                    updateSession(id, { name, date });
                    $('#editSessionDialog').close();
                    toast('Sesión actualizada', 'ok');
                });

                // Confirmar eliminación
                $('#confirmDelete').addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const { type, id, sessionId, exId, setId, routineId, goalId } = app.deleteTarget;

                    if (type === 'session') {
                        app.sessions = app.sessions.filter(s => s.id !== id);
                    } else if (type === 'exercise') {
                        const s = app.sessions.find(x => x.id === sessionId);
                        if (s) s.exercises = s.exercises.filter(e => e.id !== exId);
                    } else if (type === 'set') {
                        const s = app.sessions.find(x => x.id === sessionId);
                        if (s) {
                            const ex = s.exercises.find(e => e.id === exId);
                            if (ex) {
                                if (ex.sets.length <= 1) {
                                    toast('Debe haber al menos un set', 'warn');
                                    return;
                                }
                                ex.sets = ex.sets.filter(t => t.id !== setId);
                                ex.sets.forEach((t, i) => t.setNumber = i + 1);
                            }
                        }
                    } else if (type === 'routine') {
                        if (routineId) {
                            app.routines = app.routines.filter(r => r.id !== routineId);
                            if (app.routineEditId === routineId) {
                                resetRoutineBuilder();
                            }
                        }
                    } else if (type === 'goal') {
                        if (goalId) {
                            deleteGoal(goalId);
                            $('#confirmDialog').close();
                            return;
                        }
                    }

                    save();
                    refresh();
                    $('#confirmDialog').close();
                    toast('Elemento eliminado', 'ok');
                });

                // Delegación sesiones
                $('#sessions').addEventListener('click', (e) => {
                    const card = e.target.closest('.session');
                    if (!card) return;
                    const id = card.dataset.id;

                    // Edit session button - open edit dialog (name and date only)
                    if (e.target.closest('.js-edit-session')) {
                        e.preventDefault();
                        const session = app.sessions.find(s => s.id === id);
                        if (session) {
                            $('#editSessionDialog').dataset.sessionId = id;
                            $('#editSessionName').value = session.name || '';
                            $('#editSessionDate').value = session.date || '';
                            $('#editSessionDialog').showModal();
                        }
                        return;
                    }

                    // Save session changes
                    if (e.target.closest('.js-save-session')) {
                        e.preventDefault();
                        saveSessionChanges(id);
                        return;
                    }

                    // Cancel session changes
                    if (e.target.closest('.js-cancel-session')) {
                        e.preventDefault();
                        cancelSessionChanges(id);
                        return;
                    }

                    if (e.target.closest('.js-delete')) {
                        // Check if in edit mode
                        const editState = app.editingSessions[id];
                        if (editState && editState.isEditing) {
                            toast('Guarda o cancela los cambios antes de eliminar', 'warn');
                            return;
                        }
                        deleteSession(id);
                        return;
                    }

                    if (e.target.closest('.js-complete')) {
                        // Check if in edit mode
                        const editState = app.editingSessions[id];
                        if (editState && editState.isEditing) {
                            toast('Guarda o cancela los cambios antes de marcar como completada', 'warn');
                            return;
                        }
                        toggleCompleted(id);
                        return;
                    }

                    if (e.target.closest('.js-add-ex')) {
                        // Adding exercises - no edit mode required
                        app.currentSessionId = id;
                        $('#exerciseName').value = '';
                        $('#exerciseDialog').showModal();
                        return;
                    }
                });

                // Ejercicios / sets
                $('#sessions').addEventListener('click', (e) => {
                    const exEl = e.target.closest('.exercise');
                    if (!exEl) return;

                    const sessionId = e.target.closest('.session').dataset.id;
                    const exId = exEl.dataset.exId;

                    if (e.target.closest('.js-add-set')) {
                        addSet(sessionId, exId);
                        return;
                    }

                    if (e.target.closest('.js-del-ex')) {
                        deleteExercise(sessionId, exId);
                        return;
                    }

                    if (e.target.closest('.js-del-set')) {
                        const setId = e.target.closest('[data-set-id]').dataset.setId;
                        deleteSet(sessionId, exId, setId);
                        return;
                    }
                });

                // Use 'input' event for real-time updates while typing
                // This prevents keyboard from closing on mobile when moving between fields
                $('#sessions').addEventListener('input', (e) => {
                    const setElement = e.target.closest('[data-set-id]');
                    if (!setElement) return;

                    const sessionId = e.target.closest('.session').dataset.id;
                    const exId = e.target.closest('.exercise').dataset.exId;
                    const setId = setElement.dataset.setId;

                    // Update immediately without refresh to keep keyboard open
                    if (e.target.classList.contains('js-kg')) updateSet(sessionId, exId, setId, 'kg', e.target.value.trim(), true);
                    if (e.target.classList.contains('js-reps')) updateSet(sessionId, exId, setId, 'reps', e.target.value.trim(), true);
                    if (e.target.classList.contains('js-rir')) updateSet(sessionId, exId, setId, 'rir', e.target.value.trim(), true);
                });

                // Refresh after user stops interacting with inputs for 1 second
                // This ensures UI updates without closing keyboard while typing
                let refreshTimer = null;
                $('#sessions').addEventListener('blur', (e) => {
                    if (e.target.classList.contains('js-kg') || 
                        e.target.classList.contains('js-reps') || 
                        e.target.classList.contains('js-rir')) {
                        // Delay refresh to allow focus to move to next input
                        clearTimeout(refreshTimer);
                        refreshTimer = setTimeout(() => {
                            // Check if any set input still has focus
                            const activeEl = document.activeElement;
                            const hasSetInputFocus = activeEl && (
                                activeEl.classList.contains('js-kg') || 
                                activeEl.classList.contains('js-reps') || 
                                activeEl.classList.contains('js-rir')
                            );
                            
                            // Only refresh if no set input has focus
                            if (!hasSetInputFocus) {
                                refresh({ preserveTab: true });
                            }
                        }, 500);
                    }
                }, true);

                // Guardar ejercicio
                $('#saveExercise').addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const name = $('#exerciseName').value.trim();
                    if (!name) {
                        toast('Escribe el nombre del ejercicio', 'warn');
                        return;
                    }
                    addExercise(app.currentSessionId, name);
                    $('#exerciseDialog').close();
                    toast('Ejercicio añadido', 'ok');
                });

                // Allow closing exercise dialog without validation
                $('#exerciseDialog').addEventListener('close', () => {
                    // Reset form when closing
                    $('#exerciseName').value = '';
                });

                // Guardar nota de ejercicio
                $('#saveExerciseNote').addEventListener('click', (ev) => {
                    ev.preventDefault();
                    const dialog = $('#exerciseNoteDialog');
                    const textarea = $('#exerciseNoteText');
                    const sessionId = dialog.dataset.sessionId;
                    const exId = dialog.dataset.exId;
                    
                    if (!sessionId || !exId) return;
                    
                    const noteText = textarea ? textarea.value : '';
                    saveExerciseNote(sessionId, exId, noteText);
                    dialog.close();
                    refresh({ preserveTab: true });
                    if (noteText.trim()) {
                        toast('Nota guardada', 'ok');
                    } else {
                        toast('Nota eliminada', 'ok');
                    }
                });

                // Reset exercise note dialog when closing
                $('#exerciseNoteDialog').addEventListener('close', () => {
                    const textarea = $('#exerciseNoteText');
                    if (textarea) textarea.value = '';
                });

                // Archivo JSON
                $('#fileInput').addEventListener('change', handleFile);
                $('#btnImport').addEventListener('click', applyImport);
                $('#btnExport').addEventListener('click', exportSessions);

                // Plantillas
                $('#templateButtons').addEventListener('click', (e) => {
                    const btn = e.target.closest('[data-template]');
                    if (!btn) return;
                    openTemplatePreview(btn.dataset.template);
                });

                $('#confirmTemplate').addEventListener('click', importTemplateIntoVisibleWeek);

                // Selector de período de estadísticas
                const statsPeriodSelect = $('#statsPeriod');
                if (statsPeriodSelect) {
                    statsPeriodSelect.addEventListener('change', () => {
                        app.statsPeriod = statsPeriodSelect.value;
                        save(); // Guardar la preferencia
                        buildStats(); // Recalcular estadísticas
                    });
                }

                const profilePhotoInput = document.getElementById('profilePhoto');
                if (profilePhotoInput) {
                    profilePhotoInput.addEventListener('change', handleProfilePhotoChange);
                }

                const generateAvatarBtn = document.getElementById('generateAvatar');
                if (generateAvatarBtn) {
                    generateAvatarBtn.addEventListener('click', handleGenerateAvatar);
                }

                const avatarStyleSelect = document.getElementById('avatarStyle');
                if (avatarStyleSelect) {
                    avatarStyleSelect.addEventListener('change', handleAvatarStyleChange);
                }

                const removePhotoBtn = document.getElementById('removePhoto');
                if (removePhotoBtn) {
                    removePhotoBtn.addEventListener('click', handleRemovePhoto);
                }

                const saveProfileBtn = document.getElementById('saveProfile');
                if (saveProfileBtn) {
                    saveProfileBtn.addEventListener('click', handleProfileSave);
                }

                const saveBodyMeasurementsBtn = document.getElementById('saveBodyMeasurements');
                if (saveBodyMeasurementsBtn) {
                    saveBodyMeasurementsBtn.addEventListener('click', handleBodyMeasurementsSave);
                }

                const calculateBMRBtn = document.getElementById('calculateBMR');
                if (calculateBMRBtn) {
                    calculateBMRBtn.addEventListener('click', handleBMRCalculate);
                }

                const addNoteBtn = document.getElementById('addNote');
                if (addNoteBtn) {
                    addNoteBtn.addEventListener('click', handleAddNote);
                }

                const notesListEl = document.getElementById('notesList');
                if (notesListEl) {
                    notesListEl.addEventListener('click', (ev) => {
                        const btn = ev.target.closest('.js-delete-note');
                        if (!btn) return;
                        ev.preventDefault();
                        deleteNote(btn.dataset.noteId);
                    });
                }

                // Goals System
                const btnNewGoal = document.getElementById('btnNewGoal');
                if (btnNewGoal) {
                    btnNewGoal.addEventListener('click', () => {
                        $('#goalName').value = '';
                        $('#goalType').value = 'weight';
                        $('#goalTarget').value = '';
                        $('#goalExercise').value = '';
                        $('#goalDeadline').value = '';
                        $('#goalAutoMilestones').checked = true;
                        // Show exercise field for weight type by default
                        $('#goalExerciseField').style.display = 'block';
                        $('#goalTitle').textContent = 'Nuevo Objetivo';
                        $('#goalDialog').dataset.goalId = '';
                        $('#goalDialog').showModal();
                    });
                }

                const goalTypeSelect = document.getElementById('goalType');
                if (goalTypeSelect) {
                    goalTypeSelect.addEventListener('change', (e) => {
                        const exerciseField = $('#goalExerciseField');
                        if (e.target.value === 'exercise' || e.target.value === 'weight' || e.target.value === 'reps') {
                            if (exerciseField) exerciseField.style.display = 'block';
                        } else {
                            if (exerciseField) exerciseField.style.display = 'none';
                        }
                    });
                }

                const saveGoalBtn = document.getElementById('saveGoal');
                if (saveGoalBtn) {
                    saveGoalBtn.addEventListener('click', (ev) => {
                        ev.preventDefault();
                        const name = $('#goalName').value.trim();
                        const type = $('#goalType').value;
                        const target = $('#goalTarget').value;
                        const exerciseName = $('#goalExercise').value.trim();
                        const deadline = $('#goalDeadline').value;
                        const autoMilestones = $('#goalAutoMilestones').checked;

                        if (!name) {
                            toast('Escribe el nombre del objetivo', 'warn');
                            return;
                        }
                        if (!target || parseFloat(target) <= 0) {
                            toast('La meta debe ser mayor que 0', 'warn');
                            return;
                        }
                        if ((type === 'exercise' || type === 'weight' || type === 'reps') && !exerciseName) {
                            toast('Especifica el ejercicio', 'warn');
                            return;
                        }

                        addGoal({
                            name,
                            type,
                            target,
                            exerciseName: (type === 'exercise' || type === 'weight' || type === 'reps') ? exerciseName : null,
                            deadline: deadline || null,
                            autoMilestones
                        });

                        $('#goalDialog').close();
                    });
                }

            }

            /* =================== Refresh =================== */
            function render() {
                renderWeekbar();
                renderSummary();
                renderSessions();
                renderRoutines();
                renderProfile();
                renderGoals();
                renderRecentAchievements();
                initWeekSelector();
            }

            function refresh({ preserveTab } = {}) {
                render();
                const statsVisible = $('#panel-stats').getAttribute('aria-hidden') === 'false';
                if (statsVisible || !preserveTab) {
                    buildStats();
                    resizeCanvas();
                    drawChart();
                }
            }

            /* =================== Init =================== */
            (function init() {
                load();
                bindEvents();
                render();
                // Initialize competitive mode on load
                updateStreak();
                updateWeeklyGoal();
                checkAchievements();
            })();

            /* =================== Profile Handlers =================== */
            function handleProfilePhotoChange(e) {
                const file = e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    toast('Por favor selecciona un archivo de imagen', 'warn');
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    const photoData = event.target.result;
                    app.profile.photo = photoData;
                    save();

                    const avatar = $('#profileAvatar');
                    if (avatar) {
                        avatar.src = photoData;
                    }
                    
                    // Show remove photo button
                    const removeBtn = $('#removePhoto');
                    if (removeBtn) {
                        removeBtn.style.display = 'block';
                    }
                    
                    toast('Foto de perfil actualizada', 'ok');
                };
                reader.onerror = function () {
                    toast('Error al cargar la imagen', 'err');
                };
                reader.readAsDataURL(file);
            }

            function handleGenerateAvatar() {
                // Generate new random seed
                app.profile.avatarSeed = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                app.profile.photo = ''; // Clear photo when using generated avatar
                save();
                
                const avatar = $('#profileAvatar');
                if (avatar) {
                    avatar.src = getCurrentAvatar();
                }
                
                // Hide remove photo button
                const removeBtn = $('#removePhoto');
                if (removeBtn) {
                    removeBtn.style.display = 'none';
                }
            }

            function handleAvatarStyleChange() {
                const styleSelect = $('#avatarStyle');
                if (!styleSelect) return;
                
                app.profile.avatarStyle = styleSelect.value;
                app.profile.photo = ''; // Clear photo when changing style
                save();
                
                const avatar = $('#profileAvatar');
                if (avatar) {
                    avatar.src = getCurrentAvatar();
                }
                
                // Hide remove photo button
                const removeBtn = $('#removePhoto');
                if (removeBtn) {
                    removeBtn.style.display = 'none';
                }
            }

            function handleRemovePhoto() {
                app.profile.photo = '';
                save();
                
                const avatar = $('#profileAvatar');
                if (avatar) {
                    avatar.src = getCurrentAvatar();
                }
                
                const photoInput = $('#profilePhoto');
                if (photoInput) {
                    photoInput.value = '';
                }
                
                const removeBtn = $('#removePhoto');
                if (removeBtn) {
                    removeBtn.style.display = 'none';
                }
                
                toast('Foto eliminada', 'ok');
            }

            function handleProfileSave(e) {
                if (e) e.preventDefault();

                const firstName = $('#profileFirstName')?.value.trim() || '';
                const lastName = $('#profileLastName')?.value.trim() || '';
                const height = $('#profileHeight')?.value.trim() || '';
                const weight = $('#profileWeight')?.value.trim() || '';
                const bodyFat = $('#profileBodyFat')?.value.trim() || '';

                app.profile.firstName = firstName;
                app.profile.lastName = lastName;
                app.profile.height = height;
                app.profile.weight = weight;
                app.profile.bodyFat = bodyFat;

                // If no photo is set and no seed exists, generate seed from name
                if (!app.profile.photo && !app.profile.avatarSeed) {
                    const nameSeed = (firstName + ' ' + lastName).trim() || 'default';
                    app.profile.avatarSeed = nameSeed;
                }

                // Add to weight history if weight or bodyFat is provided
                if (weight || bodyFat) {
                    const today = new Date().toISOString().split('T')[0];
                    const existingEntry = app.profile.weightHistory?.find(entry => entry.date === today);

                    if (existingEntry) {
                        if (weight) existingEntry.weight = parseFloat(weight) || null;
                        if (bodyFat) existingEntry.bodyFat = parseFloat(bodyFat) || null;
                    } else {
                        if (!app.profile.weightHistory) app.profile.weightHistory = [];
                        app.profile.weightHistory.push({
                            date: today,
                            weight: weight ? parseFloat(weight) : null,
                            bodyFat: bodyFat ? parseFloat(bodyFat) : null
                        });
                    }
                }

                save();
                renderProfile();
                toast('Perfil actualizado', 'ok');
            }

            /* =================== Notes Handlers =================== */
            function handleAddNote(e) {
                if (e) e.preventDefault();

                const noteText = $('#noteText');
                if (!noteText) return;

                const text = noteText.value.trim();
                if (!text) {
                    toast('Escribe algo en la nota', 'warn');
                    return;
                }

                if (!app.notes) app.notes = [];
                app.notes.push({
                    id: uuid(),
                    text: text,
                    createdAt: new Date().toISOString()
                });

                save();
                noteText.value = '';
                renderNotes();
                toast('Nota guardada', 'ok');
            }

            function deleteNote(noteId) {
                if (!noteId) return;
                if (!app.notes) app.notes = [];
                app.notes = app.notes.filter(note => note.id !== noteId);
                save();
                renderNotes();
                toast('Nota eliminada', 'ok');
            }

            function renderNotes() {
                const notesList = $('#notesList');
                const notesEmpty = $('#notesEmpty');

                if (!notesList) return;

                if (!app.notes || app.notes.length === 0) {
                    if (notesList) notesList.innerHTML = '';
                    if (notesEmpty) notesEmpty.hidden = false;
                    return;
                }

                if (notesEmpty) notesEmpty.hidden = true;

                const sortedNotes = [...app.notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                notesList.innerHTML = sortedNotes.map(note => {
                    const date = new Date(note.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    return `
                <div class="note-item">
                    <p>${note.text}</p>
                    <div class="note-meta">
                        <span>${date}</span>
                        <button class="btn btn--small js-delete-note" data-note-id="${note.id}" aria-label="Eliminar nota">Eliminar</button>
                    </div>
                </div>
            `;
                }).join('');
            }

            function renderProfile() {
                const avatar = $('#profileAvatar');
                if (avatar) {
                    avatar.src = getCurrentAvatar();
                }
                
                const photoInput = $('#profilePhoto');
                if (photoInput) {
                    photoInput.value = '';
                }
                
                // Set avatar style selector
                const styleSelect = $('#avatarStyle');
                if (styleSelect) {
                    styleSelect.value = app.profile.avatarStyle || 'avataaars';
                }
                
                // Show/hide remove photo button
                const removeBtn = $('#removePhoto');
                if (removeBtn) {
                    removeBtn.style.display = app.profile.photo ? 'block' : 'none';
                }

                const firstNameInput = $('#profileFirstName');
                if (firstNameInput) firstNameInput.value = app.profile.firstName || '';
                const lastNameInput = $('#profileLastName');
                if (lastNameInput) lastNameInput.value = app.profile.lastName || '';
                const heightInput = $('#profileHeight');
                if (heightInput) heightInput.value = app.profile.height || '';
                const weightInput = $('#profileWeight');
                if (weightInput) weightInput.value = app.profile.weight || '';
                const bodyFatInput = $('#profileBodyFat');
                if (bodyFatInput) bodyFatInput.value = app.profile.bodyFat || '';

                const historyBody = $('#profileHistoryBody');
                if (historyBody) {
                    const entries = [...(app.profile.weightHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
                    if (!entries.length) {
                        historyBody.innerHTML = '<tr><td colspan="3" style="padding:8px">Sin registros aún</td></tr>';
                    } else {
                        historyBody.innerHTML = entries.map(entry => {
                            const date = new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
                            const hasWeight = typeof entry.weight === 'number' && Number.isFinite(entry.weight);
                            const hasFat = typeof entry.bodyFat === 'number' && Number.isFinite(entry.bodyFat);
                            const weight = hasWeight ? entry.weight.toFixed(1) : '—';
                            const fat = hasFat ? entry.bodyFat.toFixed(1) : '—';
                            return `<tr><td>${date}</td><td>${weight}</td><td>${fat}</td></tr>`;
                        }).join('');
                    }
                }

                // Render body measurements history
                const bodyMeasurementsHistoryBody = $('#bodyMeasurementsHistoryBody');
                if (bodyMeasurementsHistoryBody) {
                    const entries = [...(app.profile.bodyMeasurementsHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
                    if (!entries.length) {
                        bodyMeasurementsHistoryBody.innerHTML = '<tr><td colspan="7" style="padding:8px; color:var(--muted)">Sin registros aún</td></tr>';
                    } else {
                        bodyMeasurementsHistoryBody.innerHTML = entries.map(entry => {
                            const date = new Date(entry.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
                            const formatValue = (val) => (typeof val === 'number' && Number.isFinite(val)) ? val.toFixed(1) : '—';
                            return `<tr>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${date}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.arms)}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.chest)}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.waist)}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.hips)}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.legs)}</td>
                                <td style="padding:8px; border-bottom:1px solid var(--border)">${formatValue(entry.calves)}</td>
                            </tr>`;
                        }).join('');
                    }
                }

                // Render notes
                renderNotes();

                // Render color swatches
                if (typeof window.renderColorSwatches === 'function') {
                    window.renderColorSwatches();
                }

                // Render competitive mode
                renderCompetitiveMode();
            }

            function handleBodyMeasurementsSave(e) {
                if (e) e.preventDefault();

                const arms = $('#measurementArms')?.value.trim() || '';
                const chest = $('#measurementChest')?.value.trim() || '';
                const waist = $('#measurementWaist')?.value.trim() || '';
                const hips = $('#measurementHips')?.value.trim() || '';
                const legs = $('#measurementLegs')?.value.trim() || '';
                const calves = $('#measurementCalves')?.value.trim() || '';

                // Check if at least one measurement is provided
                if (!arms && !chest && !waist && !hips && !legs && !calves) {
                    toast('Ingresa al menos una medida', 'warn');
                    return;
                }

                const today = new Date().toISOString().split('T')[0];
                const existingEntry = app.profile.bodyMeasurementsHistory?.find(entry => entry.date === today);

                const measurements = {
                    date: today,
                    arms: arms ? parseFloat(arms) : null,
                    chest: chest ? parseFloat(chest) : null,
                    waist: waist ? parseFloat(waist) : null,
                    hips: hips ? parseFloat(hips) : null,
                    legs: legs ? parseFloat(legs) : null,
                    calves: calves ? parseFloat(calves) : null
                };

                if (existingEntry) {
                    // Update existing entry, merge with existing values
                    if (arms) existingEntry.arms = parseFloat(arms);
                    if (chest) existingEntry.chest = parseFloat(chest);
                    if (waist) existingEntry.waist = parseFloat(waist);
                    if (hips) existingEntry.hips = parseFloat(hips);
                    if (legs) existingEntry.legs = parseFloat(legs);
                    if (calves) existingEntry.calves = parseFloat(calves);
                } else {
                    if (!app.profile.bodyMeasurementsHistory) app.profile.bodyMeasurementsHistory = [];
                    app.profile.bodyMeasurementsHistory.push(measurements);
                }

                // Clear form
                $('#measurementArms').value = '';
                $('#measurementChest').value = '';
                $('#measurementWaist').value = '';
                $('#measurementHips').value = '';
                $('#measurementLegs').value = '';
                $('#measurementCalves').value = '';

                save();
                renderProfile();
                toast('Medidas guardadas', 'ok');
            }

            function handleBMRCalculate(e) {
                if (e) e.preventDefault();

                const gender = $('#bmrGender')?.value || 'male';
                const age = parseFloat($('#bmrAge')?.value) || 0;
                const activity = parseFloat($('#bmrActivity')?.value) || 1.2;
                const goal = $('#bmrGoal')?.value || 'maintain';
                const weight = parseFloat(app.profile?.weight) || 0;
                const height = parseFloat(app.profile?.height) || 0;

                if (!age || age < 1 || age > 120) {
                    toast('Ingresa una edad válida', 'warn');
                    return;
                }

                if (!weight || weight <= 0) {
                    toast('Ingresa tu peso en el perfil para calcular la TMB', 'warn');
                    return;
                }

                if (!height || height <= 0) {
                    toast('Ingresa tu altura en el perfil para calcular la TMB', 'warn');
                    return;
                }

                // Calculate BMR using Mifflin-St Jeor equation
                // BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5
                // BMR (women) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
                let bmr = (10 * weight) + (6.25 * height) - (5 * age);
                if (gender === 'male') {
                    bmr += 5;
                } else {
                    bmr -= 161;
                }

                // Calculate TDEE (Total Daily Energy Expenditure)
                const tdee = Math.round(bmr * activity);

                // Calculate recommended calories based on goal
                let recommendedCalories = tdee;
                let goalText = '';
                if (goal === 'lose') {
                    // Deficit of 500 kcal/day for ~0.5kg/week weight loss
                    recommendedCalories = Math.round(tdee - 500);
                    goalText = `Para perder grasa: ${recommendedCalories} kcal/día (déficit de 500 kcal)`;
                } else if (goal === 'gain') {
                    // Surplus of 300-500 kcal/day for muscle gain
                    recommendedCalories = Math.round(tdee + 400);
                    goalText = `Para ganar masa muscular: ${recommendedCalories} kcal/día (superávit de 400 kcal)`;
                } else {
                    goalText = `Para mantener peso: ${recommendedCalories} kcal/día`;
                }

                // Display results
                const resultsDiv = $('#bmrResults');
                const bmrValue = $('#bmrValue');
                const tdeeValue = $('#tdeeValue');
                const recommendedCaloriesDiv = $('#recommendedCalories');

                if (resultsDiv) resultsDiv.style.display = 'block';
                if (bmrValue) bmrValue.textContent = Math.round(bmr);
                if (tdeeValue) tdeeValue.textContent = tdee;
                if (recommendedCaloriesDiv) recommendedCaloriesDiv.textContent = goalText;
            }
        });
    