const positions = {
  right: ({ position, margin }) => ({
    left: position.right + margin,
    top: position.top + window.pageYOffset,
    positioned: 'right',
  }),
  left: ({ position, tourElWidth, margin }) => ({
    left: position.left - margin - tourElWidth,
    top: position.top + window.pageYOffset,
    positioned: 'left',
  }),
  top: ({ position }) => ({
    left: position.left,
    top: position.top + window.pageYOffset,
    positioned: 'top',
  }),
  topLeft: ({
    position, tourElWidth, tourElHeight, arrowSize, margin,
  }) => ({
    left: position.left + margin - tourElWidth,
    top: position.top + window.pageYOffset - tourElHeight - arrowSize,
    positioned: 'topLeft',
  }),
  bottom: ({ position, arrowSize, offsetHeight }) => ({
    left: position.left,
    top: position.top + window.pageYOffset + offsetHeight + arrowSize,
    positioned: 'bottom',
  }),
  bottomLeft: ({
    position, tourElWidth, arrowSize, offsetHeight, margin,
  }) => ({
    left: position.left + margin - tourElWidth,
    top: position.top + window.pageYOffset + offsetHeight + arrowSize,
    positioned: 'bottomLeft',
  }),
};

export default positions;