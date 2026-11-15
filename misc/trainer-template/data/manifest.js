/* Content files loaded by index.html and selftest.html, in this order.
 *
 * Each entry is either a file name or a descriptor with the id prefixes that
 * the file owns (used by selftest.html to check the id convention):
 *
 *   window.TRAINER_DATA_FILES = [
 *     { file: 'unit-1.js',  prefixes: ['u1-'] },
 *     { file: 'unit-2.js',  prefixes: ['u2-'] },
 *     { file: 'exams.js',   prefixes: ['ex-'] },
 *     { file: 'exercises.js', prefixes: ['es-'] }
 *   ];
 *
 * For every listed file X.js the loader also tries X-b.js, X-c.js, ... so
 * continuation files do not need to be listed. data/_sample.js is loaded only
 * when no real content was found, or when the URL contains ?sample=1.
 *
 * The empty list below is the demo template: it loads data/_sample.js only.
 */
window.TRAINER_DATA_FILES = [];
