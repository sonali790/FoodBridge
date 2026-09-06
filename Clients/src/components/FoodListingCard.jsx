import { FOOD_TYPE_ICONS, IconFoodGeneric, IconScale, IconClock, IconMapPinSmall, IconUsersSmall } from './FoodIcons';

const STATUS_COLORS = {
  Notified:   { bg: 'bg-primary-light',     text: 'text-primary-dark',   dot: 'bg-primary' },
  Claimed:    { bg: 'bg-secondary-light',    text: 'text-secondary-dark', dot: 'bg-secondary' },
  'Picked Up':{ bg: 'bg-[#E8F0E8]',          text: 'text-[#3E5F48]',      dot: 'bg-[#3E5F48]' },
  Expired:    { bg: 'bg-gray-100',           text: 'text-gray-500',       dot: 'bg-gray-400' },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.Notified;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
}

function FoodListingCard({ listing, accent = 'primary', footer, statusBadge }) {
  const Icon = FOOD_TYPE_ICONS[listing.foodType] || IconFoodGeneric;
  const isPrimary = accent === 'primary';

  const headerBg   = isPrimary ? 'from-primary-light/70 to-primary-light/30'       : 'from-secondary-light/70 to-secondary-light/30';
  const iconColor  = isPrimary ? 'text-primary-dark'                               : 'text-secondary-dark';
  const chipBg     = isPrimary ? 'bg-primary-light text-primary-dark'              : 'bg-secondary-light text-secondary-dark';
  const accentBord = isPrimary ? 'border-primary/15 hover:border-primary/35'       : 'border-secondary/15 hover:border-secondary/35';

  return (
    <article
      className={`card-hover bg-white border ${accentBord} shadow-fb-card rounded-[20px] overflow-hidden flex flex-col`}
      aria-label={`${listing.foodType} listing`}
    >
      {/* Visual header */}
      <div className={`relative h-28 bg-gradient-to-br ${headerBg} flex items-center justify-center`}>
        {/* Large food icon */}
        <div className="w-14 h-14 rounded-2xl bg-white/70 flex items-center justify-center shadow-sm">
          <Icon className={`w-7 h-7 ${iconColor}`} />
        </div>

        {/* Status badge overlay */}
        {statusBadge && (
          <div className="absolute top-2.5 right-2.5">
            <StatusBadge status={statusBadge} />
          </div>
        )}

        {/* Freshness indicator */}
        {listing.freshFor && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5">
            <IconClock className="w-3 h-3 text-secondary-dark" />
            <span className="text-[10px] font-semibold text-secondary-dark">{listing.freshFor}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title + quantity */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-ink text-base leading-tight">{listing.foodType}</h3>
          <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${chipBg}`}>
            <IconScale className="w-3 h-3" /> {listing.quantity}kg
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1">
            <IconUsersSmall className="w-3.5 h-3.5" />
            ~{listing.peopleFed} people
          </span>
          <span className="flex items-center gap-1">
            <IconClock className="w-3.5 h-3.5" />
            {listing.freshFor}
          </span>
        </div>

        {/* Restaurant info */}
        {listing.restaurant && (
          <div className="flex items-center gap-1.5 text-xs text-ink-soft">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isPrimary ? 'bg-primary-light' : 'bg-secondary-light'}`}>
              <IconMapPinSmall className={`w-3 h-3 ${iconColor}`} />
            </span>
            <span className="truncate">
              {listing.restaurant?.name} &middot; {listing.restaurant?.location}
            </span>
          </div>
        )}

        {/* Footer slot (CTA button / actions) */}
        {footer && (
          <div className="mt-auto pt-3 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    </article>
  );
}

export default FoodListingCard;
