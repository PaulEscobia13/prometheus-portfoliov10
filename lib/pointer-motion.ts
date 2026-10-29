// Settings recovered from the public Make Them Look interaction bundle.
export function elasticOut(progress: number) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;
  return 1 + Math.pow(2, -10 * progress) * Math.sin((progress - .075) * (2 * Math.PI) / .3);
}

export function springStep(position: number, velocity: number, target: number, seconds: number, stiffness: number, damping: number, mass = 1) {
  const decay = damping / (2 * mass);
  const omegaSquared = stiffness / mass;
  const frequency = Math.sqrt(omegaSquared - decay * decay);
  const offset = position - target;
  const exponential = Math.exp(-decay * seconds);
  const sine = Math.sin(frequency * seconds);
  const cosine = Math.cos(frequency * seconds);
  return {
    position: target + exponential * (offset * cosine + (velocity + decay * offset) / frequency * sine),
    velocity: exponential * (velocity * cosine - (decay * velocity + omegaSquared * offset) / frequency * sine),
  };
}
