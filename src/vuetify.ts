const defaults = {
  global: {
    ripple: false,
    density: 'compact',
  },
  VToolbar: {
    height: 60,
    density: 'default',
  },
  VTooltip: {
    scrollStrategy: 'close',
    location: 'bottom',
    contentClass: ['bg-dark', 'ld-tooltip'],
    noClickAnimation: true,
    openDelay: 600,
  },
  VContainer: {
    fluid: true,
  },
  VBtn: {
    elevation: 0,
  },
  VList: {
    lines: false,
    elevation: 0,
  },
  VMenu: {
    transition: 'toggle-slide-y-transition',
    location: 'bottom',
  },
};

export { defaults };
