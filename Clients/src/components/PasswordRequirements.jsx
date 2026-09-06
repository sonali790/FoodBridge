import { getPasswordChecklist } from '../utils/passwordValidation';

function CheckIcon({ satisfied }) {
  return satisfied ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 flex-shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

// visible: whether the box should render at all (e.g. input is focused or has content)
function PasswordRequirements({ password, visible }) {
  if (!visible) return null;
  const checklist = getPasswordChecklist(password);

  return (
    <div className="border border-[#e5e7eb] bg-[#f9fafb] rounded-md px-3 py-2.5 -mt-2 animate-[fadeIn_0.15s_ease-out]">
      <ul className="flex flex-col gap-1">
        {checklist.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-2 text-xs transition-colors duration-150 ${
              item.satisfied ? 'text-green-700' : 'text-gray-500'
            }`}
          >
            <CheckIcon satisfied={item.satisfied} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PasswordRequirements;
