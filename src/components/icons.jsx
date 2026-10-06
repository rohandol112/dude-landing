/**
 * Icons Heroicons doesn't have, drawn on its 24px outline grid (1.5 stroke, round caps and
 * joins) so they sit next to @heroicons/react/24/outline without looking borrowed.
 */
function OutlineIcon({ children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-slot="icon"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ShirtIcon(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M8.25 3.75 4.5 5.25 2.25 9.375l2.625 1.5L6.75 9.375V20.25h10.5V9.375l1.875 1.5 2.625-1.5L19.5 5.25l-3.75-1.5C15.375 4.875 13.875 6 12 6S8.625 4.875 8.25 3.75Z" />
    </OutlineIcon>
  );
}

export function StageIcon(props) {
  return (
    <OutlineIcon {...props}>
      <path d="M3 4.5h18M4.5 4.5v12m15-12v12M2.25 16.5h19.5v3H2.25v-3Z" />
      <path d="M12 4.5v2.25m0 0-3.375 6.75M12 6.75l3.375 6.75" />
    </OutlineIcon>
  );
}
