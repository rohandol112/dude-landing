/**
 * Marks the part of a pre-rendered blog page that needs JavaScript: the
 * header, the stories carousel, the share buttons. Only these hydrate
 * (src/blog/main.jsx); the article itself stays plain HTML, so it costs no
 * script and reads the same with JavaScript off.
 *
 * Island components must not call useId(): ids would differ between the
 * whole-page render and the island's own root. Pass ids as props instead.
 */
export function Island({ name, props, children }) {
  return (
    <div data-island={name} data-props={props ? JSON.stringify(props) : undefined} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
